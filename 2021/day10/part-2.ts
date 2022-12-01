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

    const scores: number[] = [];

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
                return;
            }

            if (element === ')' && o !== '(') {
                return;
            }

            if (element === '}' && o !== '{') {
                return;
            }

            if (element === ']' && o !== '[') {
                return;
            }
        }

        let o = openChars.pop();
        let score = 0;
        while (o) {
            score *= 5;

            if (o === '<') {
                score += mapToPoint('>');
            } else if (o === '{') {
                score += mapToPoint('}');
            } else if (o === '[') {
                score += mapToPoint(']');
            } else if (o === '(') {
                score += mapToPoint(')');
            }

            o = openChars.pop();
        }

        scores.push(score);
        console.log(`Score: ${score}`);
    });

    scores.sort((a, b) => b - a);

    console.log(`Score: ${scores[Math.floor(scores.length / 2)]}`);
}

function mapToPoint(c: string) {
    switch (c) {
        case ')':
            return 1;
        case ']':
            return 2;
        case '}':
            return 3;
        case '>':
            return 4;
        default:
            throw Error(`Unknown char ${c}`);
    }
}

main();
