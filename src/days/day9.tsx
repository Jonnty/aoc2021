import { adjacentPoints, adjacents, digitGrid, mapGrid, Parts, sum } from "../utils";
import { flatten } from "lodash";

export function day9(input: string): Parts {
    const grid: number[][] = digitGrid(input);

    function part1(): JSX.Element {
        const total = flatten(mapGrid(grid, (n, i, j) => adjacents(grid, i, j).some(adj => adj <= n) ? 0 : n + 1)).reduce(sum);
        return <p>{total}</p>;
    }

    function part2(): JSX.Element {
        const lowestPoints = flatten(mapGrid(grid, (n, i, j) => adjacents(grid, i, j).some(adj => adj <= n) ? undefined : [i, j]))
            .filter(p => p !== undefined)
            .map(p => p!);
        let basins = lowestPoints.map(([n, m]) => {
            let basin: Set<string> = new Set([JSON.stringify([n, m])]);
            let pointsToExplore: Set<string> = new Set(
                adjacentPoints(grid, n, m).map(p => JSON.stringify(p))
            );
            while (pointsToExplore.size > 0) {
                const next = pointsToExplore.values().next().value;
                pointsToExplore.delete(next);
                const [p, q]: number[] = JSON.parse(next);
                if (grid[p][q] == 9) continue;
                const adjs = adjacentPoints(grid, p, q).filter(([i, j]) => !basin.has(JSON.stringify([i, j])));
                basin.add(JSON.stringify([p, q]));
                adjs.forEach(adj => pointsToExplore.add(JSON.stringify(adj)));
            }
            return Array.from(basin.values());
        });
        const basinSizes = basins.map(b => b.length);
        basinSizes.sort((a, b) => a - b);
        basinSizes.reverse();
        const allBasinPoints = new Set(flatten(basins));
        console.log(grid, basins);
        return <div>
            <p>{basinSizes[0] * basinSizes[1] * basinSizes[2]}</p>
            <pre>{grid.map((row, i) => <>{row.map((e, j) => allBasinPoints.has(JSON.stringify([i, j])) ? <strong>{e}</strong> : <>{e}</>)}<br /></>)}</pre>
        </div>;
    }

    return { part1: part1(), part2: part2() };
}