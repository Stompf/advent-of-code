import path from "path";
import fs from "fs";

function main(path: string) {
    const content = fs.readFileSync(path, "utf-8");
    const lines = content.split("\n");

    const map = [] as string[][];

    lines.forEach((line) => {
        if (line.trim().startsWith("1")) {
            return;
        }

        if (line.startsWith("move")) {
            const [steps, start, end] = line
                .split(" ")
                .map(Number)
                .filter((n) => !isNaN(n) && n !== 0);

            let st = 0;
            const boxes = [] as string[];
            while (st < steps) {
                const box = map[start - 1]?.shift();
                if (box) {
                    boxes.unshift(box);
                }
                st++;
            }

            boxes.forEach((b) => {
                map[end - 1].unshift(b);
            });

            return;
        }

        const chars = line.split("");

        let currIndex = 1;
        let step = 0;
        while (currIndex < chars.length - 1) {
            const c = chars[currIndex];

            if (c.trim()) {
                if (!map[step]) {
                    map[step] = [];
                }

                map[step].push(c);
            }

            currIndex += 4;
            step++;
        }
    });

    console.log(map.map((m) => m.shift()).join(""));
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
