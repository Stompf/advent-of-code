import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const lines = file.split('\n');
    const map: number[][] = [];

    let overlaps = 0;

    const updateMap = (x: number, y: number) => {
        if (!map[x]) {
            map[x] = [];
        }

        map[x][y] = map[x][y] ? (map[x][y] += 1) : 1;

        if (map[x][y] === 2) {
            overlaps++;
        }
    };

    lines.forEach((line) => {
        const coords = line.replace(' -> ', ',').split(',').map(Number);
        const x1 = coords[0];
        const y1 = coords[1];
        const x2 = coords[2];
        const y2 = coords[3];

        if (x1 == x2) {
            const yMin = Math.min(y1, y2);
            const yAbs = Math.abs(y1 - y2);

            for (let i = 0; i <= yAbs; i++) {
                updateMap(x1, yMin + i);
            }
        } else if (y1 == y2) {
            const xMin = Math.min(x1, x2);
            const xAbs = Math.abs(x1 - x2);

            for (let i = 0; i <= xAbs; i++) {
                updateMap(xMin + i, y1);
            }
        }
    });

    console.log(`Overlaps: ${overlaps}`);
}

main();
