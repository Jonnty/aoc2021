import { reverse } from "lodash";
import { Parts, stringList } from "../utils";

function toBitField(s: string) {
    return s.split("").map(b => parseInt(b));
}

function add(tally: number[], bf: number[], i: number) {
    if (i == 0) {
        //tally is first bit, not running total
        return tally.map((t, i) => bf[i] ? 1 : -1);
    }
    return tally.map((t, i) => t + (bf[i] ? 1 : -1));
}

function binToDec(bf: number[]): number {
    return reverse(bf).map((b, i) => b * 2 ** i).reduce((a, b) => a + b);
}

function not(bf: number[]): number[] {
    return bf.map(b => b ? 0 : 1);
}

function bitTallies(bitfields: number[][]): number[] {
    return bitfields.reduce(add, new Array(bitfields[0].length).fill(0));
}

function mostCommonBits(bitfields: number[][]): number[] {
    return bitTallies(bitfields).map(tally => tally >= 0 ? 1 : 0);
}

function leastCommonBits(bitfields: number[][]): number[] {
    return bitTallies(bitfields).map(tally => tally >= 0 ? 0 : 1);
}

function filterBitfield(bf: number[], winningBits: number[], position: number): boolean {
    return bf[position] === winningBits[position];
}

function rating(bitfields: number[][], winningBits: (bfs: number[][]) => number[]): number[] {
    let winners = [...bitfields];
    for (let i = 0; i < bitfields[0].length; i++) {
        winners = winners.filter(bf => filterBitfield(bf, winningBits(winners), i));
        console.log(winners, i);
        if (winners.length == 1) {
            return winners[0];
        }
    }
    throw Error("no nice solution " + winners);
}


export function day3(input: string): Parts {
    const bitfields = stringList(input).map(toBitField);

    function part1(): number {
        const gamma = mostCommonBits(bitfields);
        const epsilon = not(gamma);
        return binToDec(gamma) * binToDec(epsilon);
    }

    function part2(): number {
        console.log("oxy");
        const oxyRating = rating(bitfields, mostCommonBits);
        console.log("co2");
        const co2Rating = rating(bitfields, leastCommonBits);
        return binToDec(oxyRating) * binToDec(co2Rating);
    }

    return { part1: part1().toString(), part2: part2().toString() };
}