import path from "path";
import fs from "fs";
import { chunk } from "lodash";

function main(path: string) {
    const lines = fs.readFileSync(path, "utf-8").split("\n").filter(Boolean);

    const pairs = chunk(lines, 2);

    const correctPairs = [] as number[];

    pairs.forEach((pair, pairIndex) => {
        const left = JSON.parse(pair[0]) as number[];
        const right = JSON.parse(pair[1]) as number[];

        let correct = compare(left, right);

        if (correct !== false) {
            correctPairs.push(pairIndex + 1);
        }
    });

    console.log(correctPairs);

    console.log(correctPairs.reduce((a, b) => a + b, 0));
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
