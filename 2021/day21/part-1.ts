import { promises as fs } from 'fs';
import * as path from 'path';

const WINING_STEPS = 1000;

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    const players: Player[] = [];

    rawRows.forEach((r) => {
        players.push(new Player(Number(r.split(':')[1])));
    });

    let currentDiceThrows = 0;
    let currentDiceScore = 0;
    let playerWon: Player;
    let gameOver = false;

    while (!gameOver) {
        players.forEach((p) => {
            if (gameOver) {
                return;
            }

            let dice = 0;
            for (let throws = 0; throws < 3; throws++) {
                currentDiceThrows++;
                currentDiceScore = currentDiceScore + 1;
                dice += currentDiceScore;
            }
            if (p.walk(dice)) {
                gameOver = true;
                playerWon = p;
                console.log(`Player ${players.indexOf(p) + 1} won`);
            }
        });
    }
    const loosing = players.filter((p) => p !== playerWon);

    console.log(
        `Game over! Throws: ${currentDiceThrows} loosing: ${loosing[0].score} score: ${
            currentDiceThrows * loosing[0].score
        }`
    );
}

class Player {
    public score = 0;

    constructor(public position: number) {}

    walk(steps: number) {
        this.position += steps;
        this.position %= 10;

        if (this.position === 0) {
            this.position = 10;
        }

        this.score += this.position;

        return this.score >= WINING_STEPS;
    }
}

main();
