import { map } from "lodash";
import { frequencies, numberCommaList, numberList, Parts, stringList, sum } from "../utils";

const endToStart: { [key: string]: string } = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
}

const openers = Object.values(endToStart);

const errorScores: { [key: string]: number } = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
}

const correctScores: { [key: string]: number } = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4,
}


function illegalScore(s: string): number {
    const stack = [];
    for (let c of s.split('')) {
        if (openers.indexOf(c) >= 0) {
            stack.push(c);
        } else {
            const o = stack.pop();
            if (o !== endToStart[c]) {
                return errorScores[c];
            }
        }
    }
    return 0;
}

function completeScore(s: string): number {
    const stack: string[] = [];
    for (let c of s.split('')) {
        if (openers.indexOf(c) >= 0) {
            stack.push(c);
        } else {
            const o = stack.pop();
            if (o !== endToStart[c]) {
                throw Error("bad character");
            }
        }
    }
    let total = 0;
    while (stack.length > 0) {
        total = (total * 5) + correctScores[stack.pop()!];
    }
    return total;
}

export function day10(input: string): Parts {
    const lines = stringList(input);


    function part1(): JSX.Element {
        const totalScore = lines.map(illegalScore).reduce(sum);

        return <p>{totalScore}</p>;
    }

    function part2(): JSX.Element {
        let scores = lines.filter(l => illegalScore(l) === 0).map(completeScore);
        const score = scores.sort((a, b) => a - b)[Math.round(scores.length / 2) - 1];

        return <>
            <p>{score}</p>
        </>;
    }

    return { part1: part1(), part2: part2() };
}