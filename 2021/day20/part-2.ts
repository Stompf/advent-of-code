import { promises as fs } from 'fs';
import * as path from 'path';

let boundKey = '.';

function flip() {
    boundKey = boundKey === '.' ? '#' : '.';
}

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    const key = rawRows.shift()?.split('');

    if (!key) {
        throw new Error('No key');
    }

    let image = rawRows.slice().reduce((prev, curr, index) => {
        prev[index] = curr.split('');
        return prev;
    }, [] as string[][]);

    for (let step = 0; step < 50; step++) {
        const { enhancedImage } = enhance(image, key);
        image = enhancedImage;
    }
}

function enhance(image: string[][], key: string[]) {
    // console.log(image, key);

    let hashes = 0;

    const paddedImage = padImage(image);
    const enhancedImage: string[][] = [];

    paddedImage.forEach((row, rIndex) => {
        row.forEach((_, cIndex) => {
            if (!enhancedImage[rIndex]) {
                enhancedImage[rIndex] = [];
            }

            const r1 = getRow(paddedImage, rIndex - 1, cIndex);
            const r2 = getRow(paddedImage, rIndex, cIndex);
            const r3 = getRow(paddedImage, rIndex + 1, cIndex);
            const t = translate(r1, r2, r3, key);

            if (t === '#') {
                hashes++;
            }
            enhancedImage[rIndex].push(t);
        });
    });

    console.log(`Hashes: ${hashes}`);
    // enhancedImage.forEach((r) => {
    //     console.log(`${r.join('')}`);
    // });

    if (key[0] === '#' && boundKey !== '#') {
        flip();
    } else if (key[key.length - 1] === '.' && boundKey !== '.') {
        flip();
    }

    return { enhancedImage, hashes };
}

function getRow(image: string[][], rIndex: number, cIndex: number) {
    if (rIndex < 0 || !image[rIndex]) {
        return [boundKey, boundKey, boundKey];
    }

    const cRow: string[] = [];

    if (cIndex <= 0) {
        cRow.push(boundKey);
    } else {
        cRow.push(image[rIndex][cIndex - 1]);
    }

    cRow.push(image[rIndex][cIndex]);

    if (cIndex > image[rIndex].length - 2) {
        cRow.push(boundKey);
    } else {
        cRow.push(image[rIndex][cIndex + 1]);
    }

    return cRow;
}

function translate(r1: string[], r2: string[], r3: string[], key: string[]) {
    const all: number[] = translateRow(r1).concat(translateRow(r2)).concat(translateRow(r3));
    const binary = parseInt(all.join(''), 2);
    return key[binary];
}

function translateRow(r: string[]) {
    const all: number[] = [];

    r.forEach((w) => {
        if (w === '.') {
            all.push(0);
        } else {
            all.push(1);
        }
    });
    return all;
}

function padImage(image: string[][]) {
    const paddedImage: string[][] = [];
    // paddedImage.push(new Array(image[0].length + 4).fill('.'));
    paddedImage.push(new Array(image[0].length + 2).fill(boundKey));

    image.forEach((r) => {
        // const newA: string[] = ['.', '.'];
        const newA: string[] = [boundKey];
        newA.push(...r);
        // newA.push('.');
        newA.push(boundKey);
        paddedImage.push(newA);
    });

    // paddedImage.push(new Array(image[0].length + 4).fill('.'));
    paddedImage.push(new Array(image[0].length + 2).fill(boundKey));
    // console.log(paddedImage);
    return paddedImage;
}

main();
