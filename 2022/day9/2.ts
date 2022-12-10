import path from "path";
import fs from "fs";

interface Position {
    x: number;
    y: number;
}

function main(path: string) {
    const lines = fs.readFileSync(path, "utf-8").split("\n");
    const map = new Set<string>(["0,0"]);
    const heads = [] as Position[];

    for (let index = 0; index < 10; index++) {
        heads.push({ x: 0, y: 0 });
    }

    lines.forEach((line) => {
        const split = line.split(" ");
        const direction = split[0];
        const steps = Number(split[1]);

        switch (direction) {
            case "U":
                for (let step = 0; step < steps; step++) {
                    heads.forEach((headPos, index) => {
                        if (index === 0) {
                            headPos.y += 1;
                            return;
                        }

                        const pHeadPos = heads[index - 1];
                        if (shouldMoveHead(pHeadPos, headPos)) {
                            headPos.x += Math.sign(pHeadPos.x - headPos.x);
                            headPos.y += Math.sign(pHeadPos.y - headPos.y);
                        }

                        if (index === 9) {
                            map.add(`${headPos.x},${headPos.y}`);
                        }
                    });
                }
                break;
            case "D":
                for (let step = 0; step < steps; step++) {
                    heads.forEach((headPos, index) => {
                        if (index === 0) {
                            headPos.y -= 1;
                            return;
                        }

                        const pHeadPos = heads[index - 1];
                        if (shouldMoveHead(pHeadPos, headPos)) {
                            headPos.x += Math.sign(pHeadPos.x - headPos.x);
                            headPos.y += Math.sign(pHeadPos.y - headPos.y);
                        }

                        if (index === 9) {
                            map.add(`${headPos.x},${headPos.y}`);
                        }
                    });
                }
                break;
            case "L":
                for (let step = 0; step < steps; step++) {
                    heads.forEach((headPos, index) => {
                        if (index === 0) {
                            headPos.x -= 1;
                            return;
                        }

                        const pHeadPos = heads[index - 1];
                        if (shouldMoveHead(pHeadPos, headPos)) {
                            headPos.x += Math.sign(pHeadPos.x - headPos.x);
                            headPos.y += Math.sign(pHeadPos.y - headPos.y);
                        }

                        if (index === 9) {
                            map.add(`${headPos.x},${headPos.y}`);
                        }
                    });
                }
                break;
            case "R":
                for (let step = 0; step < steps; step++) {
                    heads.forEach((headPos, index) => {
                        if (index === 0) {
                            headPos.x += 1;
                            return;
                        }

                        const pHeadPos = heads[index - 1];
                        if (shouldMoveHead(pHeadPos, headPos)) {
                            headPos.x += Math.sign(pHeadPos.x - headPos.x);
                            headPos.y += Math.sign(pHeadPos.y - headPos.y);
                        }

                        if (index === 9) {
                            map.add(`${headPos.x},${headPos.y}`);
                        }
                    });
                }
                break;
            default:
                throw new Error(`Unknown direction: ${direction}`);
        }
    });

    console.log(map.size);
}

function shouldMoveHead(headPos: Position, tailPos?: Position) {
    if (!tailPos) {
        return false;
    }

    return Math.abs(headPos.x - tailPos.x) >= 2 || Math.abs(headPos.y - tailPos.y) >= 2;
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./example2.txt"));
main(path.join(__dirname, "./input.txt"));
