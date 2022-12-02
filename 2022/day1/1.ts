import path from "path";
import fs from "fs";

function main(path: string) {
    const content = fs.readFileSync(path, "utf-8");
    const lines = content.split("\n");

    const elfsWeight: number[] = [];
    let index = 0;

    lines.forEach((line) => {
        if (line !== "") {
            if (!elfsWeight[index]) {
                elfsWeight[index] = 0;
            }

            elfsWeight[index] += Number(line);
        } else {
            index++;
        }
    });

    elfsWeight.sort((a, b) => b - a);

    console.log(elfsWeight[0]);
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
