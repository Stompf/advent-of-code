import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const lines = file.split('\n');

    const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    lines.forEach((line) => {
        for (let i = 0; i < line.length; i++) {
            const n = Number(line.charAt(i));

            if (n === 1) {
                arr[i] += 1;
            } else {
                arr[i] -= 1;
            }
        }
    });

    const finalEpsilon = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const finalGamma = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    arr.forEach((a, index) => {
        if (a > 0) {
            finalGamma[index] = 1;
            finalEpsilon[index] = 0;
        } else {
            finalGamma[index] = 0;
            finalEpsilon[index] = 1;
        }
    });

    console.log(`epsilon is ${finalEpsilon.join('')}`);
    console.log(`gamma is ${finalGamma.join('')}`);

    const gamma = parseInt(finalGamma.join(''), 2);
    const epsilon = parseInt(finalEpsilon.join(''), 2);

    console.log(`power consumption is ${gamma * epsilon}`);
}

main();
