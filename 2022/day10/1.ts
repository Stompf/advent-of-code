import path from "path";
import fs from "fs";

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

    const values = [] as number[];

    for (let cycle = 0; cycle <= 220; cycle++) {
        if (
            cycle === 20 ||
            cycle === 60 ||
            cycle === 100 ||
            cycle === 140 ||
            cycle === 180 ||
            cycle === 220
        ) {
            console.log(cycle + ": " + value);

            values.push(value * cycle);
        }

        if (cycle < pauseToCycle) {
            continue;
        }

        value += newValue;

        const exec = lines[execution];
        if (!exec) {
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

    console.log(values);
    console.log(values.reduce((prev, curr) => curr + prev, 0));
}

main(path.join(__dirname, "./example.txt"));
// main(path.join(__dirname, "./example2.txt"));
main(path.join(__dirname, "./input.txt"));
