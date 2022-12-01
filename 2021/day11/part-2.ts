import { promises as fs } from 'fs';
import * as path from 'path';

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

    let step = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let allFlashes = true;
        rows.forEach((r, rIndex) => {
            r.forEach((rr, ii) => {
                if (rr >= 10) {
                    rows[rIndex][ii] = 0;
                } else {
                    allFlashes = false;
                }
            });
        });

        if (allFlashes) {
            console.log(`All flashing! Step ${step}`);
            break;
        }
        step++;

        rows.forEach((r, rIndex) => {
            r.forEach((_rr, ii) => {
                handleStep(rows, rIndex, ii);
            });
        });
    }
}

function handleStep(rows: number[][], rowIndex: number, index: number) {
    if (rows[rowIndex]?.[index] === undefined) {
        return;
    }

    rows[rowIndex][index] += 1;

    if (rows[rowIndex][index] === 10) {
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
