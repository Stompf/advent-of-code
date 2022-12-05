import path from "path";
import fs from "fs";

type Range = ReturnType<typeof toRange>;

function main(path: string) {
    const content = fs.readFileSync(path, "utf-8");
    const lines = content.split("\n");

    let overlaps = 0;
    lines.forEach((line) => {
        const [first, second] = line.split(",");

        const range1 = toRange(first);
        const range2 = toRange(second);

        const o = isNotOverlapping(range1, range2) || isNotOverlapping(range2, range1);

        if (!o) {
            overlaps++;
        }
    });

    console.log(overlaps);
}

function toRange(str: string) {
    const [min, max] = str.split("-").map(Number);
    return { min, max };
}

function isNotOverlapping(r1: Range, r2: Range) {
    return r1.max < r2.min || r1.min > r2.max;
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
