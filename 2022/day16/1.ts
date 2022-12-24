import path from "path";
import fs from "fs";
import { trim } from "lodash";

interface Valve {
    name: string;
    rate: number;
    leadsTo: string[];
}

const distanceMemo = new Map();

const distanceMemoKey = (currValve: Valve, targetValve: Valve) => {
    return currValve.name < targetValve.name
        ? currValve.name + targetValve.name
        : targetValve.name + currValve.name;
};

function main(path: string) {
    const valves = fs
        .readFileSync(path, "utf-8")
        .split("\n")
        .filter(Boolean)
        .map((line): Valve => {
            const str = line
                .replace("Valve ", "")
                .replace(" has flow rate=", ",")
                .replace("; tunnels lead to valves ", ",")
                .replace("; tunnel leads to valve ", ",")
                .split(",");

            return {
                name: str[0].trim(),
                rate: Number(str[1].trim()),
                leadsTo: str.slice(2).map(trim),
            };
        });

    const nextOptimalValve = (currValve: Valve, timeLeft: number, contesters: Valve[]) => {
        let optimalValve = null;
        let value = 0;

        for (let contester of contesters) {
            let newContesters = [...contesters].filter((v) => v.name !== contester.name);
            let newTime = timeLeft - distanceTo(currValve, contester) - 1;
            if (newTime <= 0) {
                continue;
            }
            let score = newTime * contester.rate;
            let optimal = nextOptimalValve(contester, newTime, newContesters);
            score += optimal.value;

            if (score > value) {
                optimalValve = contester;
                value = score;
            }
        }

        return { optimalValve, value };
    };

    const distanceTo = (currValve: Valve, targetValve: Valve) => {
        let key = distanceMemoKey(currValve, targetValve);
        if (distanceMemo.has(key)) {
            return distanceMemo.get(key);
        }
        let visited = new Set<string>();
        let queue = [currValve];
        let traveled = 0;

        while (queue.length > 0) {
            let nextQueue = [];
            for (let valve of queue) {
                if (visited.has(valve.name)) {
                    continue;
                }
                visited.add(valve.name);
                if (valve.name === targetValve.name) {
                    distanceMemo.set(key, traveled);
                    return traveled;
                }
                for (let neighbor of valve.leadsTo) {
                    const n = valves.find((v) => v.name === neighbor);
                    nextQueue.push(n!);
                }
            }
            queue = nextQueue;
            traveled++;
        }
    };

    const start = valves.find(({ name }) => name === "AA");
    if (!start) {
        throw new Error("Could not find valve AA");
    }

    const contesters = valves.filter(({ rate }) => rate > 0);
    console.log(nextOptimalValve(start, 30, contesters).value);
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
