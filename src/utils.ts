import { removeTypeDuplicates } from '@babel/types';
import raw from 'raw.macro';

export interface Parts {
    part1: string
    part2: string
}

export type DayFn = (s: string) => Parts;
export type DayMap = Map<number, () => Parts>;


export function numberList(s: string) {
    return s.split("\n").map(i => parseInt(i));
}

export function stringList(s: string) {
    return s.split("\n");
}


export async function importDays(): Promise<DayMap> {
    const days: DayMap = new Map();
    for (let i = 1; i <= 25; i++) {
        try {
            const day = (await import(`./days/day${i}`))[`day${i}`] as DayFn;
            console.log(`day ${i} code succesfully imported`, day);
            const loc = `day${i}`;
            const input = raw(`./inputs/${loc}.txt`)
            console.log(`day ${i} input succesfully loaded`, input);
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