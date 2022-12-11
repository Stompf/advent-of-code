import path from "path";
import fs from "fs";
import { chunk } from "lodash";

interface Item {
    worryLevel: number;
}

class Monkey {
    name: string;
    items: Item[] = [];
    operation: string;
    test: number;
    trueTest: number;
    falseTest: number;
    inspections: number = 0;

    constructor(lines: string[]) {
        this.name = lines[0].replace(":", "");

        this.items = lines[1]
            .replace("Starting items: ", "")
            .split(", ")
            .map((i): Item => ({ worryLevel: Number(i) }));

        this.operation = lines[2].replace("Operation: new = ", "");

        this.test = Number(lines[3].replace("Test: divisible by ", ""));

        this.trueTest = Number(lines[4].replace("If true: throw to monkey ", ""));
        this.falseTest = Number(lines[5].replace("If false: throw to monkey ", ""));
    }

    doRound(monkeys: Array<Monkey>, modulo: number) {
        while (this.items.length > 0) {
            this.inspections++;
            const item = this.items.shift()!;
            item.worryLevel = eval(
                this.operation.replace(/old/g, String(item.worryLevel % modulo))
            );

            if (item.worryLevel % this.test === 0) {
                monkeys[this.trueTest].items.push(item);
            } else {
                monkeys[this.falseTest].items.push(item);
            }
        }
    }
}

function main(path: string) {
    const lines = fs
        .readFileSync(path, "utf-8")
        .split("\n")
        .filter(Boolean)
        .map((l) => l.trim());
    const monkeyLines = chunk(lines, 6);
    const monkeys = [] as Monkey[];

    monkeyLines.forEach((l) => {
        monkeys.push(new Monkey(l));
    });

    // LCM: https://en.wikipedia.org/wiki/Least_common_multiple
    let modulo = 1;
    monkeys.forEach((monkeyObj) => {
        modulo *= monkeyObj.test;
    });

    for (let round = 0; round < 10000; round++) {
        monkeys.forEach((monkey) => {
            monkey.doRound(monkeys, modulo);
        });
    }

    console.log(monkeys.map((m) => m.items));

    const sorted = monkeys.map((m) => m.inspections).sort((a, b) => b - a);

    console.log(sorted[0] * sorted[1]);
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
