import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const map: number[][] = [];
    const rawRows = file.split('\n');

    const allCoords = rawRows.filter((r) => r.split(',').map(Number).length > 1);
    const allFolds = rawRows.filter((r) => r.startsWith('fold'));

    allCoords.forEach((row) => {
        const coords = row.split(',').map(Number);

        const x = coords[0];
        const y = coords[1];

        if (!map[y]) {
            map[y] = [];
        }

        map[y][x] = 1;
    });

    let maxX = 0;
    let maxY = 0;
    allFolds.forEach((fold) => {
        console.log(`fold ${fold}`);
        const where = fold.split(' ')[2].split('=');
        const axis = where[0];
        const coord = Number(where[1]);

        if (axis === 'y') {
            map[coord] = [];

            for (let yIndex = coord; yIndex < map.length; yIndex++) {
                map[yIndex]?.forEach((_, xIndex) => {
                    const newYIndex = coord - (yIndex - coord);

                    if (!map[newYIndex]) {
                        map[newYIndex] = [];
                    }

                    map[newYIndex][xIndex] = 1;
                });

                map[yIndex] = [];
            }
            maxY = coord;
        } else if (axis === 'x') {
            map.forEach((_, yIndex) => {
                delete map[yIndex][coord];
            });

            for (let yIndex = 0; yIndex < map.length; yIndex++) {
                map[yIndex]?.forEach((_, xIndex) => {
                    const newXIndex = coord - (xIndex - coord);

                    map[yIndex][newXIndex] = 1;
                    delete map[yIndex][xIndex];
                });
            }
            maxX = coord;
        } else {
            throw new Error(`Unexpected axis ${axis}`);
        }
    });

    for (let y = 0; y < maxY; y++) {
        const grap = [];
        for (let x = 0; x < maxX; x++) {
            if (map[y]?.[x] === 1) {
                grap.push('#');
            } else {
                grap.push('.');
            }
        }
        console.log(`${y}: ${grap}`);
    }
}

main();
