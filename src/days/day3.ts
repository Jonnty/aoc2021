import { reverse } from "lodash";
import { Parts, stringList } from "../utils";

function toBitField(s: string) {
    return s.split("").map(b => parseInt(b));
}

function add(tally: number[], bf: number[]) {
    return tally.map((t, i) => t + (bf[i] ? 1 : -1));
}

function unsignedBinToDec(bf: number[]): number {
    return reverse(bf).map((b, i) => b * 2 ** i).reduce((a, b) => a + b);
}

function not(bf: number[]): number[]{
    return bf.map(b => b ? 0 : 1);
;}

export function day3(input: string): Parts {
    const bitfields = stringList(input).map(toBitField);

    function part1(): number {
        const gamma = bitfields.reduce(add).map(tally => tally > 0 ? 1 : 0);
        const epsilon = not(gamma);
        return unsignedBinToDec(gamma) * unsignedBinToDec(epsilon);
    }

    function part2(): number {
        return 0;
    }

    return { part1: part1().toString(), part2: part2().toString() };
}