import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    const code = rawRows[0].split('');
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

    let counter: Record<string, number> = {};

    for (let i = 0; i < code.length - 1; i++) {
        const pair = code[i] + code[i + 1];
        counter[pair] = (counter[pair] ?? 0) + 1;
    }
    console.log(`counter: ${JSON.stringify(counter)}`);

    for (let step = 0; step < 40; step++) {
        const newCounter: Record<string, number> = {};
        Object.entries(counter).forEach(([k, v]) => {
            const mapped = map[k];
            if (mapped) {
                const left = k[0] + mapped;
                const right = mapped + k[1];

                newCounter[left] = (newCounter[left] ?? 0) + v;
                newCounter[right] = (newCounter[right] ?? 0) + v;
            } else {
                newCounter[k] = v;
            }
        });
        counter = newCounter;
    }

    console.log(`counter: ${JSON.stringify(counter)}`);

    const occurrences: Record<string, number> = {};

    Object.entries(counter).forEach(([k, v]) => {
        const char1 = k[0];
        const char2 = k[1];

        occurrences[char1] = (occurrences[char1] ?? 0) + v;
        occurrences[char2] = (occurrences[char2] ?? 0) + v;
    });
    console.log(`occurrences: ${JSON.stringify(occurrences)}`);

    let min = Number.MAX_VALUE;
    let max = 0;

    Object.values(occurrences).forEach((o) => {
        min = Math.min(o, min);
        max = Math.max(o, max);
    });

    max = Math.ceil(max / 2);
    min = Math.ceil(min / 2);

    console.log(`Max: ${max}`);
    console.log(`Min: ${min}`);
    console.log(`Result: ${max - min}`);
}

main();
