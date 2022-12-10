import path from "path";
import fs from "fs";
import { chunk } from "lodash";

function main(path: string) {
    const lines = fs
        .readFileSync(path, "utf-8")
        .split("\n")
        .map((l) => {
            const split = l.split(" ");
            return {
                cmd: split[0],
                value: Number(split[1]),
            };
        });

    let value = 1;
    let execution = 0;
    let pauseToCycle = 0;
    let newValue = 0;

    const prints = [] as string[];

    for (let cycle = 0; cycle < 240; cycle++) {
        if (cycle < pauseToCycle) {
            prints.push(getValue(cycle, value));
            continue;
        } else {
            value += newValue;
            prints.push(getValue(cycle, value));
        }

        const exec = lines[execution];
        if (!exec) {
            console.log("No more commands!");
            break;
        }

        switch (exec.cmd) {
            case "noop":
                pauseToCycle = cycle + 1;
                newValue = 0;
                break;
            case "addx":
                pauseToCycle = cycle + 2;
                newValue = exec.value;
                break;
            default:
                throw new Error(`Unknown cmd: ${exec.cmd}`);
        }

        execution++;
    }

    const chunks = chunk(prints, 40);

    console.log(chunks);
    return chunks;
}

function getValue(cycle: number, value: number) {
    if (cycle >= 40 && cycle <= 80) {
        cycle -= 40;
    }
    if (cycle >= 80 && cycle <= 120) {
        cycle -= 80;
    }
    if (cycle >= 120 && cycle <= 160) {
        cycle -= 120;
    }
    if (cycle >= 160 && cycle <= 200) {
        cycle -= 160;
    }
    if (cycle >= 200 && cycle <= 240) {
        cycle -= 200;
    }

    const inRange = cycle + 1 >= value && cycle + 1 <= value + 2;
    return inRange ? "#" : ".";
}

main(path.join(__dirname, "./example.txt"));
// main(path.join(__dirname, "./example2.txt"));
const res = main(path.join(__dirname, "./input.txt"));

fs.writeFileSync(path.join(__dirname, "./output.txt"), res.join("\n"));
