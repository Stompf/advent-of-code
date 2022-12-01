import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    const xy = rawRows[0].split(':')[1].split(',');
    const targetX = xy[0].split('=')[1].split('..').map(Number);
    const targetY = xy[1].split('=')[1].split('..').map(Number);
    console.log(`targetX ${targetX} - targetY ${targetY}`);

    const xPoses = getXpos(targetX);
    console.log(`xPoses: ${JSON.stringify(xPoses)}`);

    const shoot = (xVel: number, yVel: number) => {
        let maxY = Number.MIN_SAFE_INTEGER;
        let xPos = 0;
        let yPos = 0;

        let step = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            step++;
            const s = doStep(xPos, yPos, xVel, yVel);

            if (s.yPos < targetY[0] || s.xPos > targetX[1]) {
                console.log(` ${JSON.stringify(s)} ${s.yPos < targetY[0]} ${s.xPos > targetX[1]}`);
                break;
            }
            xPos = s.xPos;
            yPos = s.yPos;
            xVel = s.xVel;
            yVel = s.yVel;

            if (yPos > maxY) {
                maxY = yPos;
            }
        }

        console.log(`End pos: [${xPos},${yPos}] - steps ${step} - ${xVel},${yVel}`);
        return { xPos, yPos, maxY };
    };

    console.log(JSON.stringify(shoot(xPoses.xMin, Math.abs(targetY[0]) - 1)));
}

function getXpos(targetX: number[]) {
    const minX = targetX[0];
    const maxX = targetX[1];

    let xMin = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        xMin += 1;
        const sum = sumFac(xMin);
        if (sum >= minX) {
            break;
        }
    }
    let xMax = xMin;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        xMax += 1;
        const sum = sumFac(xMax);
        if (sum > maxX) {
            console.log(`maxX: ${sum} - ${maxX} - ${xMax}`);
            break;
        }
    }
    xMax += 1;
    return { xMin, xMax };
}

function sumFac(n: number) {
    let sum = 0;

    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}

function doStep(xPos: number, yPos: number, xVel: number, yVel: number) {
    xPos += xVel;
    yPos += yVel;

    if (xVel > 0) {
        xVel -= 1;
    } else if (xVel < 0) {
        xVel += 1;
    }

    yVel -= 1;

    return { xPos, yPos, xVel, yVel };
}

main();
