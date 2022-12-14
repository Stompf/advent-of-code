import path from "path";
import fs from "fs";

function main(path: string) {
    const lines = fs
        .readFileSync(path, "utf-8")
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l));

    lines.push(JSON.parse("[[2]]"), JSON.parse("[[6]]"));

    lines.sort((a, b) => {
        const res = compare(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)));
        return res ? -1 : 1;
    });

    const index1 = lines.findIndex((x) => JSON.stringify(x) === "[[2]]") + 1;
    const index2 = lines.findIndex((x) => JSON.stringify(x) === "[[6]]") + 1;

    console.log(index1 * index2);
}

function isNumber(x: number) {
    return !Array.isArray(x) && !isNaN(x);
}

function compare(left: number[], right: number[]): boolean | undefined {
    while (left.length && right.length) {
        const l = left.shift()!;
        const r = right.shift()!;

        if (isNumber(l) && isNumber(r)) {
            if (l < r) {
                return true;
            } else if (l > r) {
                return false;
            }
        } else if (Array.isArray(l) && Array.isArray(r)) {
            const res = compare(l, r);
            if (res !== undefined) {
                return res;
            }
        } else if (isNumber(l) && Array.isArray(r)) {
            const res = compare([l], r);
            if (res !== undefined) {
                return res;
            }
        } else if (Array.isArray(l) && isNumber(r)) {
            const res = compare(l, [r]);
            if (res !== undefined) {
                return res;
            }
        }
    }

    if (left.length) {
        return false;
    }
    if (right.length) {
        return true;
    }
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
