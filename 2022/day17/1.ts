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

function main(path: string) {
    const directions = fs.readFileSync(path, "utf-8").split("").filter(Boolean);
    console.log(directions);

    const map: string[] = [];

    map.push(..."#######".split(""));

    let currStoneIndex = 0;
    let currDirection = 0;
    const stone = STONE_ROTATION[currStoneIndex];
    for (let step = 1; step < 2023; step++) {
        const direction = directions[currDirection];

        // currStoneIndex++
        // if (currStoneIndex > STONE_ROTATION.length - 1) {
        //     currStoneIndex = 0;
        // }

        currDirection++;
        if (currDirection > directions.length - 1) {
            currDirection = 0;
        }
    }
}

main(path.join(__dirname, "./example.txt"));
// main(path.join(__dirname, "./input.txt"));
