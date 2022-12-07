import path from "path";
import fs from "fs";

function main(path: string) {
    const content = fs.readFileSync(path, "utf-8").split("");

    let curr = [] as string[];

    for (let index = 0; index < content.length; index++) {
        const element = content[index];
        curr.push(element);

        if (curr.length < 4) {
            continue;
        }

        if (curr.length > 4) {
            curr.shift();
        }

        const set = new Set(curr);
        if (set.size === curr.length) {
            console.log(`Done: ${curr} : ${index + 1}`);
            break;
        }
    }
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
