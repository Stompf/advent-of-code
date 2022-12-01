import { promises as fs } from 'fs';
import * as path from 'path';

const OPEN_CHARS = ['(', '{', '<', '['];

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n');

    const rows: string[][] = [];

    rawRows.forEach((r, i) => {
        rows[i] = [];

        const all = r.split('');
        all.forEach((rr, ii) => {
            rows[i][ii] = rr;
        });
    });

    let count = 0;

    rows.forEach((r) => {
        console.log(`rows ${r}`);
        const openChars: string[] = [];

        for (let i = 0; i < r.length; i++) {
            const element = r[i];

            if (OPEN_CHARS.includes(element)) {
                openChars.push(element);
                continue;
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const o = openChars.pop()!;

            if (element === '>' && o !== '<') {
                count += mapToPoint(element);
                return;
            }

            if (element === ')' && o !== '(') {
                count += mapToPoint(element);
                return;
            }

            if (element === '}' && o !== '{') {
                count += mapToPoint(element);
                return;
            }

            if (element === ']' && o !== '[') {
                count += mapToPoint(element);
                return;
            }
        }
    });

    console.log(`Count: ${count}`);
}

function mapToPoint(c: string) {
    switch (c) {
        case ')':
            return 3;
        case ']':
            return 57;
        case '}':
            return 1197;
        case '>':
            return 25137;
        default:
            throw Error(`Unknown char ${c}`);
    }
}

main();
