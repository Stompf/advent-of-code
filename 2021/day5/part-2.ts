import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const lines = file.split('\n');
    const map: number[][] = [];

    let overlaps = 0;

    const updateMap = (x: number, y: number) => {
        // console.log(`updateMap: x ${x} - y ${y}`);

        if (!map[x]) {
            map[x] = [];
        }

        map[x][y] = map[x][y] ? (map[x][y] += 1) : 1;

        if (map[x][y] === 2) {
            overlaps++;
        }
    };

    lines.forEach((line) => {
        console.log(line);
        const coords = line.replace(' -> ', ',').split(',').map(Number);
        const x1 = coords[0];
        const y1 = coords[1];
        const x2 = coords[2];
        const y2 = coords[3];

        const multiplierX = x2 >= x1 ? 1 : -1;
        const multiplierY = y2 >= y1 ? 1 : -1;
        const yAbs = Math.abs(y1 - y2);
        const xAbs = Math.abs(x1 - x2);
        const maxAbs = Math.max(yAbs, xAbs);

        for (let i = 0; i <= maxAbs; i++) {
            let x = x1 + multiplierX * i;
            let y = y1 + multiplierY * i;

            const xBounds = Math.max(x1, x2);

            const yBounds = Math.max(y1, y2);

            if (x >= xBounds) {
                x = xBounds;
            }

            if (y >= yBounds) {
                y = yBounds;
            }

            updateMap(x, y);
        }
    });

    console.log(`Overlaps: ${overlaps}`);
}

main();
