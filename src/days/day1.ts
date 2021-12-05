import { numberList, Parts } from "../utils";

export function day1(input: string): Parts {
    const ns = numberList(input);

    function slidingWindow(size: number, ns: number[]): number[][] {
        return ns.map((n, i) => {
            if (i < size - 1) return [];
            return ns.slice(i - (size - 1), i + 1);
        }).filter(window => window.length > 0);
    }

    function increasing(ns: number[]): boolean {
        return slidingWindow(2, ns).map(([a, b]) => b > a).reduce((a, b) => a && b);
    }

    function countIncreasingWindows(ns: number[], window: number) {
        return slidingWindow(window, ns).map(ns => increasing(ns) ? 1 : 0 as number).reduce((a, b) => a + b).toString();
    }

    function part1(): string {
        return countIncreasingWindows(ns, 2).toString();
    }

    function part2(): string {
        const windowSums = slidingWindow(3, ns).map(w => w.reduce((a, b) => a + b));
        return countIncreasingWindows(windowSums, 2).toString();
    }

    return { part1: part1().toString(), part2: part2().toString() };
}