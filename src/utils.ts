import raw from 'raw.macro';

export interface Parts {
    part1: JSX.Element | string;
    part2: JSX.Element | string;
}

export interface Point {
    x: number;
    y: number;
}

export interface Line {
    start: Point;
    end: Point;
}

export type DayFn = (s: string) => Parts;
export type DayMap = Map<number, () => Parts>;


export function numberList(s: string) {
    return stringList(s).map(i => parseInt(i));
}

export function stringList(s: string) {
    return s.split("\n").map(s => s.trim());
}

export function digitGrid(s: string) {
    return stringList(s).map(s => s.split("").map(s => parseInt(s)));
}

export function adjacents<T>(grid: T[][], i: number, j: number): T[] {
    const raw = [
        [i + 1, j],
        [i, j + 1],
        [i - 1, j],
        [i, j - 1]
    ];
    return raw.map(([i, j]) => grid[i]?.[j]).filter(n => n !== undefined);
}

export function adjacentPoints<T>(grid: T[][], i: number, j: number): number[][] {
    const raw = [
        [i + 1, j],
        [i, j + 1],
        [i - 1, j],
        [i, j - 1]
    ];
    return raw.filter(([i, j]) => grid[i]?.[j] !== undefined);
}

export function mapGrid<T, R>(grid: T[][], fn: (elem: T, i: number, j: number) => R) {
    return grid.map((row, i) => row.map((elem, j) => fn(elem, i, j)));
}

function parseLine(s: string) {
    const pairs: number[][] = s.split(' -> ').map(s => s.split(',').map(s => parseInt(s)));
    return {
        start: { x: pairs[0][0], y: pairs[0][1] },
        end: { x: pairs[1][0], y: pairs[1][1] }
    }
}

export function lineList(s: string): Line[] {
    return stringList(s).map(parseLine);
}

export function numberCommaList(input: string): number[] {
    return input.split(',').map(s => parseInt(s));
}

export function sum(a: number, b: number): number {
    return a + b;
}

export function frequencies<T>(items: T[]): Map<T, number> {
    const freqs: Map<T, number> = new Map();
    for (let i of items) {
        freqs.set(i, (freqs.get(i) ?? 0) + 1);
    }
    return freqs;
}

export async function importDays(): Promise<DayMap> {
    const days: DayMap = new Map();
    for (let i = 1; i <= 25; i++) {
        try {
            const day = (await import(`./days/day${i}`))[`day${i}`] as DayFn;
            console.log(`day ${i} code succesfully imported`);
            const loc = `day${i}`;
            const input = raw(`./inputs/${loc}.txt`)
            console.log(`day ${i} input succesfully loaded`);
            days.set(i, () => day(input));
        } catch (e) {
            console.warn(`day ${i} code or input not found`);
        }
    }
    return days;
}


export function without<T>(s: Set<T>, e: T): Set<T> {
    if (!s.has(e)) return s;
    const newSet = new Set(s);
    newSet.delete(e);
    return newSet;
}