import { frequencies, numberCommaList, numberList, Parts, stringList, sum } from "../utils";
import { flatten, range } from "lodash";

function lettersSets(ss: string[]) {
    return ss.map(s => new Set(s.split("")));
}

export function day8(input: string): Parts {
    const lines = stringList(input);
    const outputs = lines.map(s => s.split('|')[1].trim().split(' '))
    const numbers: Set<string>[][] = lines.map(s => s.split('|')[0].trim().split(' ')).map(lettersSets);
    const allOutputs = flatten(outputs);

    //example...
    const mapping: { [key: string]: number } = {
        acedgfb: 8,
        cdfbe: 5,
        gcdfa: 2,
        fbcad: 3,
        dab: 7,
        cefabd: 9,
        cdfgeb: 6,
        eafb: 4,
        cagedb: 0,
        ab: 1,
    }

    function part1(): JSX.Element {
        const freqs = frequencies(allOutputs.map(s => s.length));
        //1, 4, 7, 8
        const easies = freqs.get(2)! + freqs.get(4)! + freqs.get(3)! + freqs.get(7)!;
        return <p>{easies}</p>;
    }

    function part2(): JSX.Element {
     //   numbers.forEach((n, i))
        const total = outputs.map(v => parseInt(v.map(o => mapping[o]).join(""))).reduce(sum);
        return <p>{total}</p>;
    }

    return { part1: part1(), part2: part2() };
}