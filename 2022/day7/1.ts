import path from "path";
import fs from "fs";
import { dir } from "console";
import { filter, keyBy } from "lodash";

interface Dir {
    name: string;
    parent: string;
    files: File[];
    subDirs: Dir[];
}

interface File {
    size: number;
    name: string;
}

function main(path: string) {
    const content = fs.readFileSync(path, "utf-8").split("\n");

    const dirMap = {} as Record<string, Dir>;

    let currDir = "";

    content.forEach((line) => {
        if (line.startsWith("$")) {
            const cmds = line.split(" ");

            switch (cmds[1]) {
                case "cd":
                    const subCmd = cmds[2];

                    if (subCmd === "..") {
                        currDir = dirMap[currDir].parent;
                    } else {
                        const newDir = currDir ? (currDir += `${subCmd}/`) : subCmd;
                        if (!dirMap[newDir]) {
                            dirMap[newDir] = {
                                files: [],
                                name: newDir,
                                subDirs: [],
                                parent: currDir,
                            };
                        }

                        currDir = newDir;
                    }
                    break;
                case "ls":
                    break;
                default:
                    throw new Error(`Unknown command: ${cmds[1]}`);
            }

            return;
        }

        if (line.startsWith("dir")) {
            const dir = currDir + line.split(" ")[1] + "/";

            const newDir = dirMap[dir] ?? { files: [], name: dir, parent: currDir, subDirs: [] };

            if (!dirMap[dir]) {
                dirMap[dir] = newDir;
            }

            dirMap[currDir].subDirs.push(newDir);
            return;
        }

        const [size, name] = line.split(" ");

        dirMap[currDir].files.push({ name, size: Number(size) });
    });

    const totals = Object.entries(dirMap).map(([key, value]) => {
        return {
            name: key,
            size: getTotalSize(value),
        };
    });

    const filtered = totals.filter((t) => t.size <= 100000);
    filtered.forEach((f) => {
        console.log(`name: ${f.name} - size: ${f.size}`);
    });

    console.log(`Total: ${filtered.reduce((prev, curr) => prev + curr.size, 0)}`);
}

function getTotalSize(dir: Dir): number {
    const size = dir.subDirs.map(getTotalSize).reduce((prev, curr) => curr + prev, 0);
    const files = dir.files.reduce((prev, curr) => curr.size + prev, 0);
    return files + size;
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
