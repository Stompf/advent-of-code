import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const lines = file.split('\n');

    let x = 0;
    let y = 0;

    lines.forEach((line) => {
        const [direction, value] = line.split(' ');

        const valueNum = Number(value);

        switch (direction) {
            case 'forward':
                x += valueNum;
                break;
            case 'down':
                y += valueNum;
                break;
            case 'up':
                y -= valueNum;
                break;
        }
    });

    console.log(`Position is ${x * y}`);
}

main();
