import path from "path";
import fs from "fs";

function main(path: string) {
    const content = fs.readFileSync(path, "utf-8");
    const lines = content.split("\n");

    let score = 0;

    lines.forEach((line) => {
        const comp1 = line.substring(0, line.length / 2).split("");
        const comp2 = line.substring(line.length / 2).split("");

        let commonChar = comp1.find((value) => {
            return comp2.includes(value);
        });

        if (!commonChar) {
            throw new Error("Could not find commonChar");
        }

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
