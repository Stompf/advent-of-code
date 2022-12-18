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

function main(path: string) {
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

    console.log(sensors);
}

main(path.join(__dirname, "./example.txt"));
// main(path.join(__dirname, "./input.txt"));
