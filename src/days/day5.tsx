import { lineList, Parts, Line as LineSegment, Point } from "../utils";
import { flatten, range, round } from "lodash";
import { Stage, Layer, Circle, Line } from 'react-konva';

function renderLines(lines: LineSegment[], intersections: Point[]) {
    return (
        <div>
            <p>{intersections.length}</p>
            <Stage width={2000} height={2000}>
                <Layer width={1000} height={1000} scaleX={2} scaleY={2}>
                    {lines.map(l => <Line points={[l.start.x, l.start.y, l.end.x, l.end.y]} strokeWidth={0.5} stroke="black" />)}
                    {intersections.map(p => <Circle x={p.x} y={p.y} radius={1} fill="red" />)}
                </Layer>
            </Stage>
        </div>
    )
}

function pointsBetween({ start, end }: LineSegment): Point[] {
    if (start.x === end.x) {
        return range(Math.min(start.y, end.y), Math.max(start.y, end.y) + 1).map(y => ({ x: start.x, y }));
    } else if (start.y === end.y) {
        return range(Math.min(start.x, end.x), Math.max(start.x, end.x) + 1).map(x => ({ x, y: start.y }));
    } else {
        const m = (end.y - start.y) / (end.x - start.x);
        const c = start.y - m * start.x;
        const sign = Math.sign(end.x - start.x);
        return range(start.x, end.x + sign, sign).map(x => ({ x, y: x * m + c }));
    }
}

function intercepts(lines: LineSegment[]): Point[] {
    const points: Point[] = flatten(lines.map(pointsBetween));
    const pointStrings = points.map(({ x, y }) => `${x},${y}`);
    const freqs: Map<string, number> = new Map();
    for (let p of pointStrings) {
        freqs.set(p, (freqs.get(p) ?? 0) + 1);
    }
    return Array.from(freqs.entries())
        .filter(([, count]) => count > 1)
        .map(([p,]) => p)
        .map(p => p.split(',').map(s => parseInt(s)))
        .map(([x, y]) => ({ x, y }));
}

export function day5(input: string): Parts {
    const lines: LineSegment[] = lineList(input);

    function part1(): JSX.Element {
        const straightLines = lines.filter(({ start, end }) => start.y == end.y || start.x == end.x);
        const intersections = intercepts(straightLines);
        return renderLines(straightLines, intersections);
    }

    function part2(): JSX.Element {
        const intersections = intercepts(lines);
        return renderLines(lines, intersections);
    }

    return { part1: part1(), part2: part2() };
}