import path, { relative } from "path";
import fs from "fs";
import { last } from "lodash";

interface Coordinate {
    x: number;
    y: number;
}

interface Sensor {
    pos: Coordinate;
    beacon: Coordinate;
    distance: number;
}

function toCoordinate(str: string): Coordinate {
    const [x, y] = str.split(", ").map(Number);
    return {
        x,
        y,
    };
}

function toString(coord: Coordinate): string {
    return `${coord.x},${coord.y}`;
}

function main(path: string, maxCoordPos: number) {
    const sensors = fs
        .readFileSync(path, "utf-8")
        .split("\n")
        .filter(Boolean)
        .map((line): Sensor => {
            const str = line
                .replace("Sensor at ", "")
                .replace("closest beacon is at ", "")
                .replace(/x=/g, "")
                .replace(/y=/g, "")
                .split(": ");

            const pos = toCoordinate(str[0]);
            const beacon = toCoordinate(str[1]);

            return {
                pos,
                beacon,
                distance: Math.abs(pos.x - beacon.x) + Math.abs(pos.y - beacon.y),
            };
        });

    const isOutofRange = (coord: Coordinate) =>
        sensors.every(
            (sensor) =>
                Math.abs(sensor.pos.x - coord.x) + Math.abs(sensor.pos.y - coord.y) >
                sensor.distance
        );

    // for (let xIndex = 0; xIndex <= maxCoordPos; xIndex++) {
    //     for (let yindex = 0; yindex <= maxCoordPos; yindex++) {
    //         if (isOutofRange({ x: xIndex, y: yindex })) {
    //             console.log(xIndex, yindex);
    //         }
    //     }
    // }

    const xy = [-1, 1];
    let val = 0;

    sensors.forEach((sensor) => {
        if (val !== 0) {
            return;
        }

        const { distance, pos } = sensor;

        xy.forEach((xo) => {
            xy.forEach((yo) => {
                for (let dx = 0; dx <= distance + 1; dx++) {
                    const dy = distance + 1 - dx;
                    const x = pos.x + dx * xo;
                    const y = pos.y + dy * yo;
                    if (
                        x >= 0 &&
                        y >= 0 &&
                        x <= maxCoordPos &&
                        y <= maxCoordPos &&
                        isOutofRange({ x, y })
                    ) {
                        val = x * 4000000 + y;
                        return;
                    }
                }
            });
        });
    });

    console.log(val);
}

main(path.join(__dirname, "./example.txt"), 20);
main(path.join(__dirname, "./input.txt"), 4000000);
