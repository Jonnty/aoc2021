import { frequencies, numberCommaList, numberList, Parts, stringList, sum } from "../utils";
import { flatten, isEqual, range } from "lodash";

function lettersSets(ss: string[]) {
    return ss.map(s => new Set(s.split("")));
}

function isSuperset<T>(a: Set<T>, b: Set<T>) {
    return !Array.from(b).some(e => !a.has(e));
}

function intersection<T>(a: Set<T>, b: Set<T>) {
    return new Set(Array.from(a).filter(x => b.has(x)));
}

function only<T>(a: T[]) {
    if (a.length != 1) {
        console.log(a);
        throw new Error(`array   length not 1: ${a.join("")}`);
    }
    return a[0];
}

function segmentsToNumber(numbers: Set<string>[]): (p: string) => number {
    console.log(numbers.map(s => Array.from(s).join("")).join());
   
    const one = only(numbers.filter(n => n.size == 2));
    const four = only(numbers.filter(n => n.size == 4));
    const seven = only(numbers.filter(n => n.size == 3));
    const eight = only(numbers.filter(n => n.size == 7));

    const twoThreeFive = numbers.filter(n => n.size == 5);
    const zeroSixNine = numbers.filter(n => n.size == 6);
    const six = only(zeroSixNine.filter(s => !isSuperset(s, one)).filter(s => !isSuperset(s, seven)));
    const nine = only(zeroSixNine.filter(s => isSuperset(s, four)));
    const zero = only(zeroSixNine.filter(s => isSuperset(s, one)).filter(s => s !== nine));
    const three = only(twoThreeFive.filter(s => isSuperset(s, one)));
    const five = only(twoThreeFive.filter(s => s !== three).filter(s => isSuperset(s, intersection(one, six))));
    const two = only(twoThreeFive.filter(s => s !== three).filter(s => s !== five));

    const patterns = [zero, one, two, three, four, five, six, seven, eight, nine];
    console.log(patterns);
    return p => {
        const result = patterns.findIndex(e => isEqual(new Set(p.split('')), e))!
        if (result == -1) {
            throw Error("couldn't find " + p)
        }
        return result;
    }
}

export function day8(input: string): Parts {
    const lines = stringList(input);
    const outputs = lines.map(s => s.split('|')[1].trim().split(' '))
    const numbers: Set<string>[][] = lines.map(s => s.split('|')[0].trim().split(' ')).map(lettersSets);
    const allOutputs = flatten(outputs);

    function part1(): JSX.Element {
        const freqs = frequencies(allOutputs.map(s => s.length));
        //1, 4, 7, 8
        const easies = freqs.get(2)! + freqs.get(4)! + freqs.get(3)! + freqs.get(7)!;
        return <p>{easies}</p>;
    }

    function part2(): JSX.Element {
        const total = outputs.map((digits, i) => {
            const toNumber = segmentsToNumber(numbers[i]);
            console.log(numbers[i], digits, digits.map(toNumber));
            return parseInt(digits.map(toNumber).join(""));
        }).reduce(sum);
        return <p>{total}</p>;
    }

    return { part1: part1(), part2: part2() };
}