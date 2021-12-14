import { map, max } from "lodash";
import { edgeList, Parts, stringList } from "../utils";

type Fold = [string, number];
type Point = [number, number];

function distinct<T>(ts: T[]): T[] {
    return Array.from(new Set(ts.map(t => JSON.stringify(t)))).map(j => JSON.parse(j));
}

function parseFolds(folds: string[]): Fold[] {
    return folds.map(s => s.split(" ")[2].split('=')).map(([a, b]) => [a, parseInt(b)]);
}

function parsePoints(folds: string[]): Point[] {
    return folds.map(s => s.split(",")).map(([a, b]) => [parseInt(a), parseInt(b)]);
}

function xs(ps: Point[]): number[] {
    return ps.map(([x,]) => x);
}

function ys(ps: Point[]): number[] {
    return ps.map(([, y]) => y);
}

function bounds(ps: Point[]) {
    return [max(xs(ps))!, max(ys(ps))!]
}

function stringify(p: Point): string {
    return JSON.stringify(p);
}

function stringifyList(ps: Point[]): string[] {
    return ps.map(stringify);
}



function draw(ps: Point[]): string {
    const points = new Set(stringifyList(ps))
    const [X, Y] = bounds(ps);
    let canvas: string[] = [];
    for (let y = 0; y <= Y; y++) {
        for (let x = 0; x <= X; x++) {
            canvas.push(points.has(stringify([x, y])) ? '#' : '.');
        }
        canvas.push('\n');
    }
    return canvas.join('');
}

function fold([coord, line]: Fold, points: Point[]): Point[] {
    console.log(points);
    if (coord == 'x') {
        const next: Point[] = points.map(([x, y]) => x > line ? [x - line - 1, y] : [line - (x + 1), y]);
        console.log(next);
        return distinct(next);
    } else if (coord == 'y') {
        const next: Point[] = points.map(([x, y]) => y > line ? [x, y - ((y - line) * 2)] : [x, y]);
        return distinct(next);
    }
    throw Error('unrecognised: ' + coord);
}
export function day13(input: string): Parts {
    const strings = stringList(input);
    const folds = parseFolds(strings.filter(s => s.indexOf("=") >= 0));
    const points = parsePoints(strings.filter(s => s.indexOf(",") >= 0));

    function part1(): JSX.Element {
        const fold1 = fold(folds[0], points);
        const fold2 = fold(folds[1], fold1);
        return <div>
            <p>{fold1.length}</p>
            <pre>{draw(points)}</pre>
            <pre>{draw(fold1)}</pre>
            <pre>{draw(fold2)}</pre>
        </div>;
    }

    function part2(): JSX.Element {
        const result = folds.reduce((points, f) => fold(f, points), points);
        return <div>
            <pre>{draw(result)}</pre>
        </div>;
    }

    return { part1: part1(), part2: part2() };
}