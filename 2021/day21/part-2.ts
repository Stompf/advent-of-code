import { promises as fs } from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

const WINING_SCORE = 21;

const TIMES: Record<number, number> = {
    9: 1,
    8: 3,
    7: 6,
    6: 7,
    5: 6,
    4: 3,
    3: 1,
};

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');

    const rawRows = file.split('\n').filter((r) => r.trim());

    console.log(`P1_WINS: ${checkPlayerWins(rawRows, 0)}`);
    console.log(`P2_WINS: ${checkPlayerWins(rawRows, 1)}`);
}

function checkPlayerWins(rawRows: string[], index: number) {
    let wins = 0;
    wins += start(rawRows, 9, index);
    wins += start(rawRows, 8, index);
    wins += start(rawRows, 7, index);
    wins += start(rawRows, 6, index);
    wins += start(rawRows, 5, index);
    wins += start(rawRows, 4, index);
    wins += start(rawRows, 3, index);
    return wins;
}

function start(rawRows: string[], roll: number, index: number) {
    const players: Player[] = [];

    rawRows.forEach((r, index) => {
        players.push(new Player(Number(r.split(':')[1]), index + 1));
    });

    return play(players, roll, true, players[index]) * TIMES[roll];
}

function play(players: Player[], roll: number, p1Turn: boolean, player: Player): number {
    let wins = 0;
    const p = p1Turn ? players[0] : players[1];

    if (p.walk(roll)) {
        if (p.index === player.index) {
            return 1;
        } else {
            return 0;
        }
    } else {
        wins += play(_.cloneDeep(players), 9, !p1Turn, player);
        wins += play(_.cloneDeep(players), 8, !p1Turn, player) * 3;
        wins += play(_.cloneDeep(players), 7, !p1Turn, player) * 6;
        wins += play(_.cloneDeep(players), 6, !p1Turn, player) * 7;
        wins += play(_.cloneDeep(players), 5, !p1Turn, player) * 6;
        wins += play(_.cloneDeep(players), 4, !p1Turn, player) * 3;
        wins += play(_.cloneDeep(players), 3, !p1Turn, player);
    }

    return wins;
}

class Player {
    public score = 0;

    constructor(public position: number, public index: number) {}

    walk(steps: number) {
        this.position += steps;
        this.position %= 10;

        if (this.position === 0) {
            this.position = 10;
        }

        this.score += this.position;

        return this.score >= WINING_SCORE;
    }
}

main();
