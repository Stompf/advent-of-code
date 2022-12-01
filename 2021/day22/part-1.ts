import { promises as fs } from 'fs';
import * as path from 'path';

type Grid = Set<string>;
type Step = [boolean, number, number, number, number, number, number];

const on = (grid: Grid, location: string) => grid.add(location);

const off = (grid: Grid, location: string) => grid.delete(location);

const lineToStep = (l: string) => {
    const s = l.split(' ');

    const coords = s[1].split(',');

    const x = coords[0].split('..');
    const minX = Number(x[0].split('=')[1]);
    const maxX = Number(x[1]);

    const y = coords[1].split('..');
    const minY = Number(y[0].split('=')[1]);
    const maxY = Number(y[1]);

    const z = coords[2].split('..');
    const minZ = Number(z[0].split('=')[1]);
    const maxZ = Number(z[1]);

    return [s[0] === 'on', minX, maxX, minY, maxY, minZ, maxZ] as Step;
};

const initialize = (steps: Step[]) => {
    const grid = new Set<string>();
    for (const [action, xf, xt, yf, yt, zf, zt] of steps) {
        for (let x = Math.max(xf, -50); x <= Math.min(xt, 50); x++) {
            for (let y = Math.max(yf, -50); y <= Math.min(yt, 50); y++) {
                for (let z = Math.max(zf, -50); z <= Math.min(zt, 50); z++) {
                    const location = `${x}:${y}:${z}`;
                    (action ? on : off)(grid, location);
                }
            }
        }
    }
    return grid.size;
};

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    const steps = rawRows.map(lineToStep);

    const result = initialize(steps);
    console.log(`result: ${result}`);
}

main();
