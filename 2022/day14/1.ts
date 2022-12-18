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

function toString(coord: Coordinate): string {
    return `${coord.x},${coord.y}`;
}

function main(path: string) {
    const coords = fs
        .readFileSync(path, "utf-8")
        .split("\n")
        .filter(Boolean)
        .map((line) => {
            return line.split("->").map(toCoordinate);
        });

    const map = new Set<string>();

    let mapMinX = Number.MAX_VALUE;
    let mapMinY = Number.MAX_VALUE;
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
            mapMinY = Math.min(minY, mapMinY);

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    map.add(toString({ x, y }));
                }
            }
        });
    });

    console.log(mapMinX, mapMaxX, mapMinY, mapMaxY);

    const startMap = map.size;

    let simulate = true;

    const simulateDropStep = (pos: Coordinate): Coordinate | boolean => {
        if (pos.x < mapMinX || pos.x > mapMaxX || pos.y > mapMaxY) {
            simulate = false;
            return true;
        }

        let newPos = { x: pos.x, y: pos.y + 1 };
        if (!map.has(toString(newPos))) {
            return newPos;
        }

        newPos.x -= 1;
        if (!map.has(toString(newPos))) {
            return newPos;
        }

        newPos.x += 2;
        if (!map.has(toString(newPos))) {
            return newPos;
        }

        return true;
    };

    let start = { x: 500, y: 0 };
    let currPos = { ...start };
    while (simulate) {
        const sim = simulateDropStep(currPos);

        if (simulate) {
            if (typeof sim === "boolean") {
                map.add(toString(currPos));
                currPos = { ...start };
            } else {
                currPos = sim;
            }
        }

        // for (let yIndex = 0; yIndex <= mapMaxY; yIndex++) {
        //     let spaces = "";
        //     for (let xIndex = mapMinX; xIndex <= mapMaxX; xIndex++) {
        //         if (currPos.x === xIndex && currPos.y === yIndex) {
        //             spaces += "o";
        //         } else {
        //             spaces += map.has(toString({ x: xIndex, y: yIndex })) ? "#" : ".";
        //         }
        //     }
        //     console.log(spaces);
        // }
    }

    console.log(map.size - startMap);
}

// main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
