import { promises as fs } from 'fs';
import * as path from 'path';

type Step = [boolean, number, number, number, number, number, number];

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

type Range = [from: number, to: number];
const rangeSize = ([f, t]: Range) => t - f + 1;
const isIntersecting = ([af, at]: Range, [bf, bt]: Range): boolean => af <= bt && bf <= at;
const mergerRange = ([af, at]: Range, [bf, bt]: Range) =>
    [Math.max(af, bf), Math.min(at, bt)] as Range;

class Cube {
    private xRange: Range;
    private yRange: Range;
    private zRange: Range;

    constructor(xRange: Range, yRange: Range, zRange: Range) {
        this.xRange = xRange;
        this.yRange = yRange;
        this.zRange = zRange;
    }

    isOverlapping = (other: Cube) =>
        isIntersecting(this.xRange, other.xRange) &&
        isIntersecting(this.yRange, other.yRange) &&
        isIntersecting(this.zRange, other.zRange);

    getOverlap = (other: Cube) =>
        new Cube(
            mergerRange(this.xRange, other.xRange),
            mergerRange(this.yRange, other.yRange),
            mergerRange(this.zRange, other.zRange)
        );

    volume = () => rangeSize(this.xRange) * rangeSize(this.yRange) * rangeSize(this.zRange);
}

const reboot = (steps: Step[]) => {
    const onCubes: Cube[] = [];
    const allOverLapping: Cube[] = [];
    for (const [action, xf, xt, yf, yt, zf, zt] of steps) {
        const cube = new Cube([xf, xt], [yf, yt], [zf, zt]);
        const overlaps: Cube[] = [];
        const parts: Cube[] = [];
        for (const onc of onCubes) if (cube.isOverlapping(onc)) overlaps.push(cube.getOverlap(onc));
        for (const olc of allOverLapping)
            if (cube.isOverlapping(olc)) parts.push(cube.getOverlap(olc));
        onCubes.push(...parts);
        allOverLapping.push(...overlaps);
        if (action) onCubes.push(cube);
    }
    let onCount = BigInt(0);
    for (const c of onCubes) onCount = onCount + BigInt(c.volume());
    for (const c of allOverLapping) onCount = onCount - BigInt(c.volume());
    return onCount;
};

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    const steps = rawRows.map(lineToStep);

    const result = reboot(steps);
    console.log(`result: ${result}`);
}

main();
