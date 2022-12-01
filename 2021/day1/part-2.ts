import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const lines = file.split('\n').map(Number);

    let increase = 0;

    let prevCount: number | undefined;
    lines.forEach((line, index) => {
        if (index === lines.length - 2) {
            return;
        }

        const count = line + lines[index + 1] + lines[index + 2];
        if (prevCount && prevCount < count) {
            increase++;
        }
        prevCount = count;
    });

    console.log(`Increase was ${increase}`);
}

main();
