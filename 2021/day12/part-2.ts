import { promises as fs } from 'fs';
import * as path from 'path';

interface Part {
    a: string;
    b: string;
}

const PATHS: string[][] = [];

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n');
    const parts: Part[] = [];
    const startParts: Part[] = [];

    rawRows.forEach((r) => {
        const split = r.split('-');
        const part = { a: split[0], b: split[1] };
        parts.push(part);

        if (part.a === 'start' || part.b === 'start') {
            startParts.push(part);
        }
    });

    startParts.forEach((sP) => {
        const walkedPathPoints: string[] = ['start'];
        if (sP.a === 'start') {
            walkedPathPoints.push(sP.b);
        } else {
            walkedPathPoints.push(sP.a);
        }
        walk(parts, walkedPathPoints);
    });

    console.log(`All paths ${PATHS.length}`);
}

function walk(parts: Part[], walked: string[]) {
    // console.log('walk', walked);

    const prev = walked[walked.length - 1];
    const availablePaths = parts.filter((p) => p.a === prev || p.b === prev);

    availablePaths.forEach((ap) => {
        const newWalked = walked.slice();
        const path = ap.a === prev ? ap.b : ap.a;

        if (path === 'end') {
            newWalked.push(path);
            PATHS.push(newWalked);
            // console.log(`Found path ${newWalked}`);
            return;
        }
        if (path === 'start') {
            return;
        }

        if (path.toLowerCase() === path) {
            if (newWalked.includes(path) && hasVisitedTwice(newWalked)) {
                return;
            }
        }
        newWalked.push(path);
        walk(parts, newWalked);
    });
}

function hasVisitedTwice(walked: string[]) {
    return walked.some(
        (w) => walked.filter((ww) => ww.toLowerCase() === ww && ww === w).length >= 2
    );
}

main();
