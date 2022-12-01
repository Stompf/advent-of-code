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

    let count = 0;

    rows.forEach((row, rowIndex) => {
        row.forEach((n, index) => {
            const left = row[index - 1] ?? Number.MAX_SAFE_INTEGER;
            const right = row[index + 1] ?? Number.MAX_SAFE_INTEGER;
            const up = rows[rowIndex - 1]?.[index] ?? Number.MAX_SAFE_INTEGER;
            const down = rows[rowIndex + 1]?.[index] ?? Number.MAX_SAFE_INTEGER;

            if (n < left && n < right && n < up && n < down) {
                console.log(`Found: ${n}, left ${left} right ${right} - index ${index}`);
                count += n + 1;
            }
        });
    });

    console.log(`Count: ${count}`);
}

main();
