import path from "path";
import fs from "fs";

interface Position {
    x: number;
    y: number;
}

function main(path: string) {
    const lines = fs.readFileSync(path, "utf-8").split("\n");
    const map = new Set<string>(["0,0"]);
    const headPos = { x: 0, y: 0 };
    const tailPos = { x: 0, y: 0 };

    lines.forEach((line) => {
        const split = line.split(" ");
        const direction = split[0];
        const steps = Number(split[1]);

        switch (direction) {
            case "U":
                for (let step = 0; step < steps; step++) {
                    headPos.y += 1;

                    if (shouldMoveHead(headPos, tailPos)) {
                        tailPos.y = headPos.y - 1;
                        tailPos.x = headPos.x;
                        map.add(`${tailPos.x},${tailPos.y}`);
                    }
                }
                break;
            case "D":
                for (let step = 0; step < steps; step++) {
                    headPos.y -= 1;

                    if (shouldMoveHead(headPos, tailPos)) {
                        tailPos.y = headPos.y + 1;
                        tailPos.x = headPos.x;

                        map.add(`${tailPos.x},${tailPos.y}`);
                    }
                }
                break;
            case "L":
                for (let step = 0; step < steps; step++) {
                    headPos.x -= 1;

                    if (shouldMoveHead(headPos, tailPos)) {
                        tailPos.y = headPos.y;
                        tailPos.x = headPos.x + 1;
                        map.add(`${tailPos.x},${tailPos.y}`);
                    }
                }
                break;
            case "R":
                for (let step = 0; step < steps; step++) {
                    headPos.x += 1;

                    if (shouldMoveHead(headPos, tailPos)) {
                        tailPos.y = headPos.y;
                        tailPos.x = headPos.x - 1;
                        map.add(`${tailPos.x},${tailPos.y}`);
                    }
                }
                break;
            default:
                break;
            // throw new Error(`Unknown direction: ${direction}`);
        }
    });

    // console.log(map);
    console.log(map.size);
}

function shouldMoveHead(headPos: Position, tailPos: Position) {
    return Math.abs(headPos.x - tailPos.x) >= 2 || Math.abs(headPos.y - tailPos.y) >= 2;
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
