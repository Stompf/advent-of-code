import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    const xy = rawRows[0].split(':')[1].split(',');
    const targetX = xy[0].split('=')[1].split('..').map(Number);
    const targetY = xy[1].split('=')[1].split('..').map(Number);
    console.log(`targetX ${targetX} - targetY ${targetY}`);

    const isInside = (x: number, y: number) => {
        return x >= targetX[0] && x <= targetX[1] && y <= targetY[1] && y >= targetY[0];
    };

    const shoot = (xVel: number, yVel: number) => {
        let xPos = 0;
        let yPos = 0;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const s = doStep(xPos, yPos, xVel, yVel);

            if (s.yPos < targetY[0] || s.xPos > targetX[1]) {
                // console.log(` ${JSON.stringify(s)} ${s.yPos < targetY[0]} ${s.xPos > targetX[1]}`);
                break;
            }
            xPos = s.xPos;
            yPos = s.yPos;
            xVel = s.xVel;
            yVel = s.yVel;
        }

        // console.log(`End pos: [${xPos},${yPos}] - steps ${step} - ${xVel},${yVel}`);
        return { xPos, yPos };
    };

    const hits: { x: number; y: number }[] = [];

    for (let x = 0; x <= targetX[1]; x++) {
        for (let y = targetY[0]; y <= Math.abs(targetY[0]); y++) {
            const { xPos, yPos } = shoot(x, y);
            if (isInside(xPos, yPos)) {
                hits.push({ x, y });
            }
        }
    }
    console.log(`Hits ${hits.length}`);
    // console.log(`Hits ${JSON.stringify(hits)}`);
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
