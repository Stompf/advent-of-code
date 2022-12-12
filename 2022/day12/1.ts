import path from "path";
import fs from "fs";

interface Position {
    x: number;
    y: number;
    value: number;
    steps: number;
}

function main(path: string) {
    const lines = fs.readFileSync(path, "utf-8").split("\n");

    const nodes = [] as Position[][];

    let start = {} as Position;
    let end = {} as Position;

    lines.forEach((line, yIndex) => {
        nodes[yIndex] = [];
        line.split("").forEach((value, xIndex) => {
            if (value === "S") {
                start = { x: xIndex, y: yIndex, value: "a".charCodeAt(0), steps: 0 };
                nodes[yIndex][xIndex] = start;
            } else if (value === "E") {
                end = { x: xIndex, y: yIndex, value: "z".charCodeAt(0), steps: 0 };
                nodes[yIndex][xIndex] = end;
            } else {
                nodes[yIndex][xIndex] = {
                    x: xIndex,
                    y: yIndex,
                    value: value.charCodeAt(0),
                    steps: 0,
                };
            }
        });
    });

    const queue = [start];
    const visited = new Set<string>(toKey(start));

    const checkAndAddQueue = (currentPos: Position, position?: Position) => {
        if (!position) {
            return;
        }

        const key = toKey(position);
        if (position.value <= currentPos.value + 1 && !visited.has(key)) {
            queue.push(position);
            position.steps = currentPos.steps + 1;
            visited.add(key);
        }
    };

    while (queue.length > 0) {
        const currentPos = queue.shift()!;

        if (currentPos.x === end.x && currentPos.y === end.y) {
            console.log("Found it!", currentPos.steps);
            break;
        }

        const leftValue = nodes[currentPos.y]?.[currentPos.x - 1];
        const rightValue = nodes[currentPos.y]?.[currentPos.x + 1];
        const topValue = nodes[currentPos.y + 1]?.[currentPos.x];
        const downValue = nodes[currentPos.y - 1]?.[currentPos.x];

        checkAndAddQueue(currentPos, leftValue);
        checkAndAddQueue(currentPos, rightValue);
        checkAndAddQueue(currentPos, topValue);
        checkAndAddQueue(currentPos, downValue);
    }
}

function toKey({ x, y }: Position) {
    return `${x},${y}`;
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
