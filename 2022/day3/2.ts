import path from "path";
import fs from "fs";
import { chunk, intersection } from "lodash";

function main(path: string) {
    const content = fs.readFileSync(path, "utf-8");
    const lines = content.split("\n");

    const groups = chunk(lines, 3);

    let score = 0;
    groups.forEach((group) => {
        let commonChar = intersection(
            group[0].split(""),
            group[1].split(""),
            group[2].split("")
        )[0];

        if (!commonChar) {
            throw new Error("Could not find commonChar");
        }

        console.log(commonChar);

        score += getPrio(commonChar);
    });

    console.log(score);
}

function getPrio(str: string) {
    if (str === str.toUpperCase()) {
        return str.charCodeAt(0) - "A".charCodeAt(0) + 27;
    }

    return str.charCodeAt(0) - "a".charCodeAt(0) + 1;
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
