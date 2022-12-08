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

    let topScore = 0;

    treeMap.forEach((treeLine, treeIndex) => {
        treeLine.forEach((line, lineIndex) => {
            const left = checkLeft(lineIndex - 1, line, treeLine);
            const right = checkRight(lineIndex + 1, line, treeLine);
            const top = checkTop(lineIndex, treeIndex - 1, line, treeMap);
            const down = checkDown(lineIndex, treeIndex + 1, line, treeMap);

            topScore = Math.max(left * right * top * down, topScore);
        });
    });

    console.log(topScore);
}

function checkLeft(x: number, value: number, treeLine: number[]) {
    let score = 0;

    for (let xIndex = x; xIndex >= 0; xIndex--) {
        score++;
        if (treeLine[xIndex] >= value) {
            break;
        }
    }
    return score;
}

function checkRight(x: number, value: number, treeLine: number[]) {
    let score = 0;
    for (let xIndex = x; xIndex < treeLine.length; xIndex++) {
        score++;

        if (treeLine[xIndex] >= value) {
            break;
        }
    }
    return score;
}

function checkTop(x: number, y: number, value: number, treeMap: number[][]) {
    let score = 0;

    for (let yIndex = y; yIndex >= 0; yIndex--) {
        score++;

        if (treeMap[yIndex][x] >= value) {
            break;
        }
    }
    return score;
}

function checkDown(x: number, y: number, value: number, treeMap: number[][]) {
    let score = 0;

    for (let yIndex = y; yIndex < treeMap.length; yIndex++) {
        score++;
        if (treeMap[yIndex][x] >= value) {
            break;
        }
    }
    return score;
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
