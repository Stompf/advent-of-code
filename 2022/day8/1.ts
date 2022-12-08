import path from "path";
import fs from "fs";

function main(path: string) {
    const lines = fs.readFileSync(path, "utf-8").split("\n");

    const treeMap = [] as number[][];

    lines.forEach((line, index) => {
        const chars = line.split("").map(Number);
        chars.forEach((c, i) => {
            if (!treeMap[index]) {
                treeMap[index] = [];
            }

            treeMap[index][i] = c;
        });
    });

    let visible = 0;

    treeMap.forEach((treeLine, treeIndex) => {
        treeLine.forEach((line, lineIndex) => {
            if (
                treeIndex === 0 ||
                treeIndex === treeLine.length - 1 ||
                lineIndex === 0 ||
                lineIndex === treeLine.length - 1
            ) {
                visible++;
                return;
            }

            if (checkLeft(lineIndex - 1, line, treeLine)) {
                visible++;
                return;
            }

            if (checkRight(lineIndex + 1, line, treeLine)) {
                visible++;
                return;
            }

            if (checkTop(lineIndex, treeIndex - 1, line, treeMap)) {
                visible++;
                return;
            }

            if (checkDown(lineIndex, treeIndex + 1, line, treeMap)) {
                visible++;
                return;
            }
        });
    });

    console.log(visible);
}

function checkLeft(x: number, value: number, treeLine: number[]) {
    for (let xIndex = x; xIndex >= 0; xIndex--) {
        if (treeLine[xIndex] >= value) {
            return false;
        }
    }
    return true;
}

function checkRight(x: number, value: number, treeLine: number[]) {
    for (let xIndex = x; xIndex < treeLine.length; xIndex++) {
        if (treeLine[xIndex] >= value) {
            return false;
        }
    }
    return true;
}

function checkTop(x: number, y: number, value: number, treeMap: number[][]) {
    for (let yIndex = y; yIndex >= 0; yIndex--) {
        if (treeMap[yIndex][x] >= value) {
            return false;
        }
    }
    return true;
}

function checkDown(x: number, y: number, value: number, treeMap: number[][]) {
    for (let yIndex = y; yIndex < treeMap.length; yIndex++) {
        if (treeMap[yIndex][x] >= value) {
            return false;
        }
    }
    return true;
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
