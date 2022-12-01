import { promises as fs } from 'fs';
import * as path from 'path';
import { solve } from './solve';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    const map: number[][] = [];

    for (let step = 0; step < 5; step++) {
        rawRows.forEach((row, yIndex) => {
            yIndex += step * rawRows.length;

            if (!map[yIndex]) {
                map[yIndex] = [];
            }
            const coords = row.split('').map(Number);

            for (let xStep = 0; xStep < 5; xStep++) {
                coords.forEach((c, xIndex) => {
                    xIndex += xStep * coords.length;
                    let value = c + xStep + step;
                    if (value > 9) {
                        value -= 9;
                    }

                    map[yIndex][xIndex] = value;
                });
            }
        });
    }

    console.log(`solve: ${solve(map)}`);
}
main();
