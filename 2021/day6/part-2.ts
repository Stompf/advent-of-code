import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const fish = file.split(',').map(Number);
    const max = 9;
    let merged: number[] = new Array(max);
    merged.fill(0);

    fish.forEach((f) => {
        merged[f] = merged[f] + 1;
    });

    for (let day = 1; day <= 256; day++) {
        const newA: number[] = new Array(max);
        newA.fill(0);

        for (let index = 0; index < max; index++) {
            if (index === 0) {
                newA[8] = merged[0];
                newA[6] += merged[0];
            } else {
                newA[index - 1] += merged[index];
            }
        }

        merged = newA;
    }

    const total = merged.reduce((prev, curr) => {
        return (prev += curr);
    }, 0);

    console.log(`Fish: ${total}`);
}

main();
