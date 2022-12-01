import { promises as fs } from 'fs';
import * as path from 'path';
import { solve } from './solve';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    const map: number[][] = [];

    rawRows.forEach((row, yIndex) => {
        if (!map[yIndex]) {
            map[yIndex] = [];
        }
        const coords = row.split('').map(Number);

        coords.forEach((c, xIndex) => {
            map[yIndex][xIndex] = c;
        });
    });

    console.log(`solve: ${solve(map)}`);
}
main();
