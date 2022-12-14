import path, { posix } from "path";
import fs from "fs";

interface Coordinate {
    x: number;
    y: number;
}

function toCoordinate(str: string): Coordinate {
    const [x, y] = str.split(",").map(Number);
    return {
        x,
        y,
    };
}

function main(path: string) {
    const coords = fs
        .readFileSync(path, "utf-8")
        .split("\n")
        .filter(Boolean)
        .map((line) => {
            return line.split("->").map(toCoordinate);
        });

    const map = [] as string[][];

    let mapMinX = Number.MAX_VALUE;
    let mapMaxX = -1;
    let mapMaxY = -1;

    coords.forEach((coordArray) => {
        coordArray.forEach((coord, index) => {
            const nextCoord = coordArray[index + 1];
            if (!nextCoord) {
                return;
            }

            const minX = Math.min(coord.x, nextCoord.x);
            const maxX = Math.max(coord.x, nextCoord.x);
            const minY = Math.min(coord.y, nextCoord.y);
            const maxY = Math.max(coord.y, nextCoord.y);

            mapMinX = Math.min(minX, mapMinX);
            mapMaxX = Math.max(maxX, mapMaxX);
            mapMaxY = Math.max(maxY, mapMaxY);

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    if (!map[x]) {
                        map[x] = [];
                    }
                    map[x][y] = "#";
                }
            }
        });
    });

    let oldPos: Coordinate = { x: 500, y: 0 };
    let steps = 0;

    while (true) {
        const pos = { ...oldPos };
        while (pos.y <= mapMaxY) {
            steps++;
            const newPosY = pos.y + 1;
            if (map[pos.x][newPosY] === "#") {
                let newPosX = pos.x - 1;
                if (map[newPosX][newPosY] !== "#") {
                    map[newPosX][newPosY] = "#";
                    oldPos = { ...pos };
                    break;
                }

                newPosX = pos.x + 1;
                if (map[newPosX][newPosY] !== "#") {
                    map[newPosX][newPosY] = "#";
                    oldPos = { ...pos };
                    break;
                }

                map[pos.x][pos.y] = "#";
                oldPos = { x: pos.x, y: pos.y - 1 };
                break;
            }

            pos.y++;
        }

        if (pos.y === 0 && pos.x === 500) {
            break;
        }
    }

    console.log(steps);
}

main(path.join(__dirname, "./example.txt"));
// main(path.join(__dirname, "./input.txt"));
