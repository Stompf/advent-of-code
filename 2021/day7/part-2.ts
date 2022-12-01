import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const crabs = file.split(',').map(Number);

    const ranges = calcRange(crabs);
    console.log(`ranges is ${ranges}`);

    let minFuel = Number.MAX_SAFE_INTEGER;

    for (let range = ranges[0]; range < ranges[1]; range++) {
        let fuel = 0;
        crabs.forEach((crab) => {
            fuel += factorialize(Math.abs(crab - range));
        });

        if (fuel < minFuel) {
            minFuel = fuel;
        }
    }

    console.log(`Min fuel: ${minFuel}`);
}

function calcRange(numbers: number[]) {
    numbers.sort();
    return [numbers[0], numbers[numbers.length - 1]];
}

function factorialize(num: number): number {
    if (num === 0) {
        return 0;
    }
    return num + factorialize(num - 1);
}

main();
