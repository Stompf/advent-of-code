import { promises as fs } from 'fs';
import * as path from 'path';

let COUNT = 0;

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n');

    const rows: number[][] = [];

    rawRows.forEach((r, i) => {
        rows[i] = [];

        const all = r.split('').map(Number);
        all.forEach((rr, ii) => {
            rows[i][ii] = rr;
        });
    });

    for (let step = 0; step < 100; step++) {
        rows.forEach((r, rIndex) => {
            r.forEach((rr, ii) => {
                if (rr >= 10) {
                    rows[rIndex][ii] = 0;
                }
            });
            console.log(`rows ${r}`);
        });

        rows.forEach((r, rIndex) => {
            r.forEach((_rr, ii) => {
                handleStep(rows, rIndex, ii);
            });
        });

        console.log(`step done!`);
    }

    console.log(`Count: ${COUNT}`);
}

function handleStep(rows: number[][], rowIndex: number, index: number) {
    if (rows[rowIndex]?.[index] === undefined) {
        return;
    }

    rows[rowIndex][index] += 1;

    if (rows[rowIndex][index] === 10) {
        COUNT++;
        handleStep(rows, rowIndex - 1, index);
        handleStep(rows, rowIndex, index + 1);
        handleStep(rows, rowIndex + 1, index + 1);
        handleStep(rows, rowIndex + 1, index - 1);
        handleStep(rows, rowIndex + 1, index);
        handleStep(rows, rowIndex - 1, index - 1);
        handleStep(rows, rowIndex - 1, index + 1);
        handleStep(rows, rowIndex, index - 1);
    }
}

main();
