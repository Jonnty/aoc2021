import { range } from "lodash";
import { frequencies, numberCommaList, Parts, sum } from "../utils";

function transition(freqs: Map<number, number>): void {
    const birthing = freqs.get(0) ?? 0;
    range(1, 9).forEach(i => freqs.set(i - 1, (freqs.get(i) ?? 0)));
    freqs.set(8, birthing);
    freqs.set(6, (freqs.get(6) ?? 0) + birthing);
}

function lanternfish(freqs: Map<number, number>, generations: number) {
    for (let i = 0; i < generations; i++) {
        transition(freqs);
    }
    return Array.from(freqs.values()).reduce(sum);
}

export function day6(input: string): Parts {


    function part1(): JSX.Element {
        return <p>{lanternfish(frequencies(numberCommaList(input)), 80)}</p>;
    }

    function part2(): JSX.Element {
        return <p>{lanternfish(frequencies(numberCommaList(input)), 256)}</p>;
    }

    return { part1: part1(), part2: part2() };
}