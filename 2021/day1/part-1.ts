import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const lines = file.split('\n').map(Number);

    let increase = 0;

    lines.forEach((line, index) => {
        if (index === 0) {
            return;
        }

        const prev = lines[index - 1];
        if (prev < line) {
            increase++;
        }
    });

    console.log(`Increase was ${increase}`);
}

main();
