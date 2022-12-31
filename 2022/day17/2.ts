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

const stone4 = [["#"], ["#"], ["#"], ["#"]];
const stone5 = [
    ["#", "#"],
    ["#", "#"],
];

const STONE_ROTATION = [stone1, stone2, stone3, stone4, stone5];

interface BoundingBox {
    width: number;
    height: number;
}

class Stone {
    public bbox: BoundingBox;
    private body: string[][];

    constructor(body: string[][], public x: number, public y: number) {
        this.bbox = {
            width: body[0].length,
            height: body.length,
        };

        this.body = body.slice();
    }

    public contains(other: Stone) {
        const bboxContains =
            this.x <= other.x + other.bbox.width - 1 &&
            this.x + this.bbox.width - 1 >= other.x &&
            this.y >= other.y - other.bbox.height + 1 &&
            this.y - this.bbox.height + 1 <= other.y;

        if (!bboxContains) {
            return false;
        }

        // const minX = Math.min(this.x, other.x);
        // const maxX = Math.max(this.x + this.bbox.width - 1, other.x + other.bbox.width - 1);
        const minY = Math.min(this.y - this.bbox.height + 1, other.y - this.bbox.height + 1);
        const maxY = Math.max(this.y, other.y);

        let arr: string[][] = [];

        for (let yIndex = minY; yIndex <= maxY; yIndex++) {
            arr[yIndex] = [];
        }

        for (let yIndex = 0; yIndex < this.body.length; yIndex++) {
            for (let xIndex = 0; xIndex < this.body[yIndex].length; xIndex++) {
                arr[this.y - yIndex][this.x + xIndex] = this.body[yIndex][xIndex];
            }
        }

        // arr = arr.reverse();

        for (let yIndex = 0; yIndex < other.body.length; yIndex++) {
            for (let xIndex = 0; xIndex < other.body[yIndex].length; xIndex++) {
                const t = other.body[yIndex][xIndex];
                if (t === "#" && arr[other.y - yIndex]?.[other.x + xIndex] === "#") {
                    return true;
                }
            }
        }

        return false;
    }

    public clone() {
        return new Stone(this.body, this.x, this.y);
    }
}

function main(path: string) {
    const windDirections = fs.readFileSync(path, "utf-8").split("").filter(Boolean);
    console.log(windDirections);

    let currStoneIndex = 0;
    let currDirection = 0;
    let maxY = 0;
    let stone = new Stone(STONE_ROTATION[currStoneIndex], 2, 4);
    const stones: Stone[] = [];

    stones.push(stone);
    while (stones.length < 1000000000001) {
        const clone = stone.clone();

        const windDirection = windDirections[currDirection];

        switch (windDirection) {
            case "<":
                clone.x = Math.max(0, clone.x - 1);
                break;
            case ">":
                clone.x = Math.min(clone.x + 1, 7 - clone.bbox.width);
                break;
            default:
                throw new Error(`Unknown direction ${windDirection}`);
        }

        let collide = stones.some((s) => {
            if (s === stone) {
                return false;
            }
            return s.contains(clone);
        });

        if (collide) {
            clone.x = stone.x;
        }

        stone.x = clone.x;
        clone.y -= 1;

        collide = stones.some((s) => {
            if (s === stone) {
                return false;
            }
            return s.contains(clone);
        });

        if (clone.y === clone.bbox.height - 1 || collide) {
            maxY = Math.max(stone.y, maxY);
            currStoneIndex++;
            if (currStoneIndex > STONE_ROTATION.length - 1) {
                currStoneIndex = 0;
            }
            const body = STONE_ROTATION[currStoneIndex];
            stone = new Stone(body, 2, maxY + 3 + body.length);
            stones.push(stone);

            if (stones.length % 10000 === 0) {
                console.log(stones.length);
            }
        } else {
            stone.y = clone.y;
        }

        currDirection++;
        if (currDirection > windDirections.length - 1) {
            currDirection = 0;
        }
    }

    console.log(maxY);
}

// main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
