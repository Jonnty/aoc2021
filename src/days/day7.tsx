import { frequencies, numberCommaList, numberList, Parts, sum } from "../utils";
import { range } from "lodash";

function cost(pos: number, x: number): number {
    const d = Math.abs(pos - x);
    return d * ((d + 1) / 2);
}

export function day7(input: string): Parts {
    const positions = numberCommaList(input);
    const freqs = frequencies(positions);
    const maxPos = Math.max(...positions);

    function part1(): JSX.Element {
        let leftCount = 0;
        let leftCost = 0;
        let rightCount = positions.length - (freqs.get(0) ?? 0);
        let rightCost = positions.reduce(sum);
        let fuelCosts: number[] = [];
        for (let x of range(0, maxPos)) {
            fuelCosts = [...fuelCosts, leftCost + rightCost];
            leftCount += freqs.get(x) ?? 0;
            leftCost += leftCount;
            rightCost -= rightCount;
            rightCount -= freqs.get(x + 1) ?? 0;
        }
        return (
            <div>
                <p>{Math.min(...fuelCosts)}</p>
            </div>
        );
    }

    function part2(): JSX.Element {

        const fuelCosts = range(0, maxPos)
            .map(x => positions.map(pos => cost(pos, x)).reduce(sum));
        return <p>{Math.min(...fuelCosts)}</p>;
    }

    return { part1: part1(), part2: part2() };
}