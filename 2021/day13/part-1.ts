import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const map: number[][] = [];
    const rawRows = file.split('\n');

    const allCoords = rawRows.filter((r) => r.split(',').map(Number).length > 1);
    const allFolds = [rawRows.filter((r) => r.startsWith('fold'))[0]];

    allCoords.forEach((row) => {
        const coords = row.split(',').map(Number);

        const x = coords[0];
        const y = coords[1];

        if (!map[y]) {
            map[y] = [];
        }

        map[y][x] = 1;
    });

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
        } else {
            throw new Error(`Unexpected axis ${axis}`);
        }
    });

    let dots = 0;
    map.forEach((mX) => {
        mX.forEach((my) => {
            if (my === 1) {
                dots++;
            }
        });
    });

    console.log(`Dots: ${dots}`);
}

main();
