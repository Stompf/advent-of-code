import path from "path";
import fs from "fs";

const stone1 = [["#", "#", "#", "#"]];
const stone2 = [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
];
const stone3 = [
    [".", ".", "#"],
    [".", ".", "#"],
    ["#", "#", "#"],
];
const stone4 = [
    ["#", "#"],
    ["#", "#"],
];

const STONE_ROTATION = [stone1, stone2, stone3, stone4];

interface BoundingBox {
    width: number;
    height: number;
}

class Stone {
    public bbox: BoundingBox;

    constructor(private body: string[][], public x: number, public y: number) {
        this.bbox = {
            width: body[0].length,
            height: body.length,
        };
    }

    public contains(other: Stone) {
        const bboxContains =
            this.x <= other.x &&
            this.y <= other.y &&
            this.x + this.bbox.width - 1 >= other.x + other.bbox.width - 1 &&
            this.y + this.bbox.height - 1 >= other.y + other.bbox.height - 1;

        if (!bboxContains) {
            return false;
        }

        // const minX = Math.min(this.x, other.x);
        // const maxX = Math.max(this.x + this.bbox.width - 1, other.x + other.bbox.width - 1);
        const minY = Math.min(this.y, other.y);
        const maxY = Math.max(this.y + this.bbox.height - 1, other.y + other.bbox.height - 1);

        const arr: string[][] = [];

        for (let yIndex = minY; yIndex <= maxY; yIndex++) {
            arr[yIndex] = [];
        }

        for (let yIndex = 0; yIndex <= this.body.length; yIndex++) {
            for (let xIndex = 0; xIndex <= this.body[yIndex].length; xIndex++) {
                arr[this.y + yIndex][this.x + xIndex] = this.body[yIndex][xIndex];
            }
        }

        for (let yIndex = 0; yIndex <= other.body.length; yIndex++) {
            for (let xIndex = 0; xIndex <= other.body[yIndex].length; xIndex++) {
                const t = this.body[yIndex][xIndex];
                if (t === "#" && arr[this.y + yIndex][this.x + xIndex] === "#") {
                    return true;
                }
            }
        }

        return false;
    }
}

function main(path: string) {
    const windDirections = fs.readFileSync(path, "utf-8").split("").filter(Boolean);
    console.log(windDirections);

    let currStoneIndex = 0;
    let currDirection = 0;
    const stone = new Stone(STONE_ROTATION[currStoneIndex], 2, 4);
    const stones: Stone[] = [];

    stones.push(stone);
    for (let step = 1; step < 2023; step++) {
        const windDirection = windDirections[currDirection];

        switch (windDirection) {
            case "<":
                stone.x = Math.max(0, stone.x - 1);
                break;
            case ">":
                stone.x = Math.min(6, stone.x + 1);
                break;
            default:
                throw new Error(`Unknown direction ${windDirection}`);
        }
    }
}

main(path.join(__dirname, "./example.txt"));
// main(path.join(__dirname, "./input.txt"));
