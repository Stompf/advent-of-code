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
        score += calculateScore(elfPlay, split[1]);
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

function calculateScore(elfPlay: Tool, youPlay: string) {
    if (youPlay === "X") {
        if (elfPlay === "paper") {
            return mapToScore("rock");
        }
        if (elfPlay === "rock") {
            return mapToScore("scissors");
        }
        if (elfPlay === "scissors") {
            return mapToScore("paper");
        }
    }

    if (youPlay === "Z") {
        if (elfPlay === "paper") {
            return mapToScore("scissors") + 6;
        }
        if (elfPlay === "rock") {
            return mapToScore("paper") + 6;
        }
        if (elfPlay === "scissors") {
            return mapToScore("rock") + 6;
        }
    }

    return mapToScore(elfPlay) + 3;
}

main(path.join(__dirname, "./example.txt"));
main(path.join(__dirname, "./input.txt"));
