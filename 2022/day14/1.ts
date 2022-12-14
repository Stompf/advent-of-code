import path from "path";
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

    while (true) {
        const pos = { ...oldPos };
    }
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
