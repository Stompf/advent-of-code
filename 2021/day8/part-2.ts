import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const allDigits = file.split('\n');

    let count = 0;

    allDigits.forEach((digits) => {
        const outputs = digits.split('|');
        const lineDigits = outputs[0].split(' ').concat(outputs[1].split(' '));

        const mappedDigits = new Array(10).fill('');
        const fives: string[] = [];
        const sixes: string[] = [];

        lineDigits.forEach((digit) => {
            if (digit.length == 2) {
                mappedDigits[1] = digit;
            }

            if (digit.length === 3) {
                mappedDigits[7] = digit;
            }

            if (digit.length === 4) {
                mappedDigits[4] = digit;
            }

            if (digit.length === 7) {
                mappedDigits[8] = digit;
            }

            if (digit.length === 5 && !fives.includes(digit)) {
                fives.push(digit);
            }

            if (digit.length === 6 && !sixes.includes(digit)) {
                sixes.push(digit);
            }
        });
        console.log(`sixes: ${sixes}`);
        console.log(`fives: ${fives}`);

        sixes.forEach((sixW) => {
            if (hasSameChars(mappedDigits[4], sixW)) {
                mappedDigits[9] = sixW;
            } else if (hasSameChars(mappedDigits[1], sixW)) {
                mappedDigits[0] = sixW;
            } else {
                mappedDigits[6] = sixW;
            }
        });

        fives.forEach((fiveW) => {
            if (hasSameChars(mappedDigits[1], fiveW)) {
                mappedDigits[3] = fiveW;
            } else if (diffCount(mappedDigits[6], fiveW) === 1) {
                mappedDigits[5] = fiveW;
            } else {
                mappedDigits[2] = fiveW;
            }
        });

        let s = '';
        outputs[1].split(' ').forEach((o) => {
            for (let index = 0; index < mappedDigits.length; index++) {
                if (isSame(mappedDigits[index], o)) {
                    s += index;
                    break;
                }
            }
        });

        console.log(`Mapped: ${s}`);
        count += Number(s);
    });
    console.log(`count: ${count}`);
}

function hasSameChars(a: string, b: string) {
    return a.split('').every((w) => b.includes(w));
}

function isSame(a: string, b: string) {
    return a.split('').sort().join('') === b.split('').sort().join('');
}

function diffCount(a: string, b: string) {
    let c = 0;
    a.split('').forEach((w) => {
        if (!b.includes(w)) {
            c++;
        }
    });
    return c;
}

main();
