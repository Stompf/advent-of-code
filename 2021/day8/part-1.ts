import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const allDigits = file.split('\n');

    let counts = 0;

    allDigits.forEach((digits) => {
        const output = digits.split('|')[1];
        const outputDigits = output.split(' ');

        outputDigits.forEach((outputDigit) => {
            if (outputDigit.length === 3) {
                counts++;
            }

            if (outputDigit.length == 2) {
                counts++;
            }

            if (outputDigit.length === 4) {
                counts++;
            }

            if (outputDigit.length === 7) {
                counts++;
            }
        });
    });

    console.log(`Count: ${counts}`);
}

main();
