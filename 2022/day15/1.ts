import path, { relative } from "path";
import fs from "fs";

interface Coordinate {
    x: number;
    y: number;
}

interface Sensor {
    pos: Coordinate;
    beacon: Coordinate;
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

function main(path: string, yToCheck: number) {
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

            return {
                pos: toCoordinate(str[0]),
                beacon: toCoordinate(str[1]),
            };
        });

    const set = new Set<string>();

    sensors.forEach((sensor) => {
        const distance =
            Math.abs(sensor.pos.x - sensor.beacon.x) + Math.abs(sensor.pos.y - sensor.beacon.y);

        if (sensor.pos.y === yToCheck) {
            for (
                let xIndex = sensor.pos.x - distance;
                xIndex <= sensor.pos.x + distance;
                xIndex++
            ) {
                set.add(toString({ x: xIndex, y: sensor.pos.y }));
            }
        }

        if (
            (sensor.pos.y < yToCheck && sensor.pos.y + distance >= yToCheck) ||
            (sensor.pos.y > yToCheck && sensor.pos.y - distance <= yToCheck)
        ) {
            const yDist = distance - Math.abs(yToCheck - sensor.pos.y);
            for (let xIndex = sensor.pos.x - yDist; xIndex <= sensor.pos.x + yDist; xIndex++) {
                set.add(toString({ x: xIndex, y: yToCheck }));
            }
        }
    });

    sensors.forEach((sensor) => {
        set.delete(toString(sensor.beacon));
    });

    console.log(set.size);
}

main(path.join(__dirname, "./example.txt"), 10);
main(path.join(__dirname, "./input.txt"), 2000000);
