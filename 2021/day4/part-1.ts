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

    const lowest = { bingoDraw: Number.MAX_SAFE_INTEGER, score: Number.MAX_SAFE_INTEGER };
    boards.forEach((board) => {
        console.log(`board: ${board}`);

        const allNumbers = board
            .join(' ')
            .split(' ')
            .filter((t) => t !== '')
            .map(Number);

        console.log(`all ${allNumbers}`);

        const yBingos: string[] = [];
        board.forEach((b) => {
            const rows = b
                .split(',')[0]
                .split(' ')
                .filter((l) => l !== '');
            console.log(`rows ${rows}`);

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
            console.log(`y rows ${yRows}`);

            const bingoScore = getBingoDraws(yRows, draws, allNumbers);

            if (bingoScore.bingoDraw < lowest.bingoDraw) {
                console.log(`new best: ${lowest.bingoDraw} ${lowest.score}`);
                lowest.bingoDraw = bingoScore.bingoDraw;
                lowest.score = bingoScore.score;
            }
        });
    });

    console.log(`Best: ${lowest.bingoDraw} ${lowest.score}`);
}

function getBingoDraws(row: number[], draws: number[], allNumbersInBoardFlatten: number[]) {
    console.log(`row: ${row}`);
    console.log(`draws: ${draws}`);
    console.log(`allNumbersInBoardFlatten: ${allNumbersInBoardFlatten}`);

    const currentDraws: number[] = [];

    for (const draw of draws) {
        currentDraws.push(draw);

        if (row.every((r) => currentDraws.includes(r))) {
            console.log(`Bingo! ${row} - ${currentDraws}`);
            break;
        }
    }

    const unmarked = allNumbersInBoardFlatten.filter((n) => !currentDraws.includes(n)).map(Number);
    const sum = unmarked.reduce((prev, curr) => {
        return (prev += curr);
    }, 0);
    console.log(`sum ${sum}`);

    return { bingoDraw: currentDraws.length, score: sum * currentDraws[currentDraws.length - 1] };
}

main();
