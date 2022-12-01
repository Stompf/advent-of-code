import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n');

    const rows: number[][] = [];
    const handled: number[][] = [];

    rawRows.forEach((r, i) => {
        rows[i] = [];
        handled[i] = [];

        const all = r.split('').map(Number);
        all.forEach((rr, ii) => {
            rows[i][ii] = rr;
        });
    });

    const counts: number[] = [];

    rows.forEach((row, rowIndex) => {
        row.forEach((n, index) => {
            if (handled[rowIndex][index] || n === 9) {
                return;
            }

            counts.push(recusive(rows, handled, rowIndex, index));
            // console.log(`reset`);
        });
    });

    counts.sort((a, b) => b - a);
    console.log(`Count: ${counts}`);

    console.log(`Count: ${counts[0] * counts[1] * counts[2]}`);
}

function recusive(rows: number[][], handled: number[][], rowIndex: number, index: number): number {
    handled[rowIndex][index] = 1;
    if (rows[rowIndex][index] === 9) {
        return 0;
    }

    let count = 0;
    const left = rows[rowIndex][index - 1];
    if (left !== undefined && !handled[rowIndex][index - 1]) {
        count += recusive(rows, handled, rowIndex, index - 1);
    }

    const right = rows[rowIndex][index + 1];
    if (right !== undefined && !handled[rowIndex][index + 1]) {
        count += recusive(rows, handled, rowIndex, index + 1);
    }

    const up = rows[rowIndex - 1]?.[index];
    if (up !== undefined && !handled[rowIndex - 1][index]) {
        count += recusive(rows, handled, rowIndex - 1, index);
    }

    const down = rows[rowIndex + 1]?.[index];
    if (down !== undefined && !handled[rowIndex + 1][index]) {
        count += recusive(rows, handled, rowIndex + 1, index);
    }

    // console.log(`count: ${count} - ${rowIndex} ${index} - ${rows[rowIndex][index]}`);

    return count + 1;
}

main();
