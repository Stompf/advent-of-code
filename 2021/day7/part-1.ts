import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const crabs = file.split(',').map(Number);

    const median = getMedian(crabs);
    console.log(`Median is ${median}`);

    let fuel = 0;

    crabs.forEach((crab) => {
        fuel += Math.abs(crab - median);
    });

    console.log(`Fuel: ${fuel}`);
}

function getMedian(arr: number[]) {
    const middle = Math.floor(arr.length / 2);
    arr = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? arr[middle] : (arr[middle - 1] + arr[middle]) / 2;
}

main();
