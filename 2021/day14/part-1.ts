import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    let code = rawRows[0].split('');
    console.log(`Code: ${code}`);

    const map: Record<string, string> = {};

    rawRows.forEach((r) => {
        const split = r.split('->');
        if (split.length <= 1) {
            return;
        }

        map[split[0].trim()] = split[1].trim();
    });

    console.log(`map: ${JSON.stringify(map)}`);

    for (let step = 0; step < 10; step++) {
        let codeDone = '';
        code.forEach((v, i) => {
            codeDone += v;
            const mapped = map[v + code[i + 1]];
            if (mapped) {
                codeDone += mapped;
            }
        });
        code = codeDone.split('');
    }

    console.log(`Length: ${code.length}`);

    const occurrences = code.reduce((acc, curr) => {
        acc[curr] ? acc[curr]++ : (acc[curr] = 1);

        return acc;
    }, {} as Record<string, number>);

    let min = Number.MAX_VALUE;
    let max = 0;

    Object.values(occurrences).forEach((o) => {
        min = Math.min(o, min);
        max = Math.max(o, max);
    });

    console.log(`Max: ${max}`);
    console.log(`Min: ${min}`);
    console.log(`Result: ${max - min}`);
}

main();
