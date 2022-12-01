import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const lines = file.split('\n').filter((l) => l !== '');

    const draws = lines.shift()?.split(',').map(Number);

    if (!draws) {
        throw new Error('No draws');
    }

    const boards = [];

    const chunk = 5;
    for (let i = 0, j = lines.length; i < j; i += chunk) {
        boards.push(lines.slice(i, i + chunk));
    }

    const highest = { bingoDraw: 0, score: 0 };
    boards.forEach((board) => {
        const lowest = { bingoDraw: Number.MAX_SAFE_INTEGER, score: 0 };

        const allNumbers = board
            .join(' ')
            .split(' ')
            .filter((t) => t !== '')
            .map(Number);

        const yBingos: string[] = [];
        board.forEach((b) => {
            const rows = b
                .split(',')[0]
                .split(' ')
                .filter((l) => l !== '');

            rows.forEach((bb, index) => {
                if (yBingos[index] === undefined) {
                    yBingos[index] = bb;
                } else {
                    yBingos[index] += ` ${bb}`;
                }
            });

            const bingoScore = getBingoDraws(rows.map(Number), draws, allNumbers);

            if (bingoScore.bingoDraw < lowest.bingoDraw) {
                console.log(`new best:  ${lowest.bingoDraw} ${lowest.score}`);
                lowest.bingoDraw = bingoScore.bingoDraw;
                lowest.score = bingoScore.score;
            }
        });

        yBingos.forEach((y) => {
            const yRows = y
                .split(',')[0]
                .split(' ')
                .filter((l) => l !== '')
                .map(Number);

            const bingoScore = getBingoDraws(yRows, draws, allNumbers);

            if (bingoScore.bingoDraw < lowest.bingoDraw) {
                console.log(`new best: ${lowest.bingoDraw} ${lowest.score}`);
                lowest.bingoDraw = bingoScore.bingoDraw;
                lowest.score = bingoScore.score;
            }
        });

        if (lowest.bingoDraw > highest.bingoDraw) {
            highest.bingoDraw = lowest.bingoDraw;
            highest.score = lowest.score;
        }
    });

    console.log(`Worst: ${highest.bingoDraw} ${highest.score}`);
}

function getBingoDraws(row: number[], draws: number[], allNumbersInBoardFlatten: number[]) {
    const currentDraws: number[] = [];

    for (const draw of draws) {
        currentDraws.push(draw);

        if (row.every((r) => currentDraws.includes(r))) {
            // console.log(`Bingo! ${row} - ${currentDraws}`);
            break;
        }
    }

    const unmarked = allNumbersInBoardFlatten.filter((n) => !currentDraws.includes(n)).map(Number);
    const sum = unmarked.reduce((prev, curr) => {
        return (prev += curr);
    }, 0);

    return {
        bingoDraw: currentDraws.length,
        score: sum * currentDraws[currentDraws.length - 1],
    };
}

main();
