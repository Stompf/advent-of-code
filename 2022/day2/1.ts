import path from "path";
import fs from "fs";

type Tool = "paper" | "scissors" | "rock";

function main(path: string) {
    const content = fs.readFileSync(path, "utf-8");
    const lines = content.split("\n");

    let score = 0;

    lines.forEach((line) => {
        const split = line.split(" ");
        const elfPlay = mapToTool(split[0]);
        const youPlay = mapToTool(split[1]);
        score += calculateScore(elfPlay, youPlay);
    });

    console.log(score);
}

function mapToTool(input: string): Tool {
    switch (input.toUpperCase()) {
        case "A":
        case "X":
            return "rock";
        case "B":
        case "Y":
            return "paper";
        case "C":
        case "Z":
            return "scissors";
        default:
            throw Error(`Unsupported tool: ${input}`);
    }
}

function mapToScore(tool: Tool) {
    switch (tool) {
        case "paper":
            return 2;
        case "rock":
            return 1;
        case "scissors":
            return 3;
    }
}

function calculateScore(elfPlay: Tool, youPlay: Tool) {
    if (elfPlay === youPlay) {
        return mapToScore(youPlay) + 3;
    }

    if (
        (elfPlay === "paper" && youPlay === "scissors") ||
        (elfPlay === "rock" && youPlay === "paper") ||
        (elfPlay === "scissors" && youPlay === "rock")
    ) {
        return mapToScore(youPlay) + 6;
    }

    return mapToScore(youPlay);
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
