import path from "path";
import fs from "fs";

interface Valve {
    name: string;
    rate: number;
    leadsTo: string[];
}

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
                name: str[0],
                rate: Number(str[1]),
                leadsTo: str.slice(2),
            };
        });

    const set = new Set<string>();
    let minutesLeft = 30;
    let currentPressure = 0;

    let previousValve: Valve | undefined;
    let currentValve = valves.find((v) => v.name === "AA");
    if (!currentValve) {
        throw new Error("Could not find valve AA");
    }

    while (minutesLeft > 0) {
        set.add(currentValve.name);
        currentPressure += minutesLeft * (previousValve?.rate || 0);

        minutesLeft -= 1;
    }

    console.log(valves);
}

main(path.join(__dirname, "./example.txt"));
// main(path.join(__dirname, "./input.txt"), 2000000);
