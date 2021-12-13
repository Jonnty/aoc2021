import { isEqual, range } from "lodash";
import { adjacentsDiagPoints, adjacentsDiags, digitGrid, gridToString, mapGrid, Parts, stringList, sumGrid } from "../utils";

type Grid = number[][];

function processFlashes(elem: number, i: number, j: number, grid: Grid): number {
    if (elem <= 0) return 0;
    return elem + adjacentsDiags(grid, i, j).filter(e => e === -1).length;
}

function incremented(grid: Grid): Grid {
    return mapGrid(grid, e => e + 1);
}

function flash(grid: Grid): Grid {
    let newGrid = grid;
    let oldGrid = new Array(new Array);
    while (!isEqual(newGrid, oldGrid)) {
        oldGrid = newGrid;
        newGrid = mapGrid(newGrid, e => e > 9 ? -1 : e);
        newGrid = mapGrid(newGrid, processFlashes);
        newGrid = mapGrid(newGrid, e => e == -1 ? 0 : e);
    }
    return newGrid
}

export function day11(input: string): Parts {
    const inputGrid = digitGrid(input);

    function part1(): JSX.Element {
        let flashes = 0;
        let grid = inputGrid;
        range(0, 100).forEach((step) => {
            grid = incremented(grid);
            grid = flash(grid);
            flashes += sumGrid(mapGrid(grid, e => e == 0 ? 1 : 0))
            console.log(gridToString(grid));
            console.log(step + 1, flashes);

        })
        return <p>{flashes}</p>;
    }

    function part2(): JSX.Element {
        let step = 0
        let grid = inputGrid;
        while (true) {
            step++;
            grid = incremented(grid);
            grid = flash(grid);
            if (sumGrid(mapGrid(grid, e => e == 0 ? 1 : 0)) == 100) {
                break;
            }
            console.log(gridToString(grid));

        }
        return <p>{step}</p>;
    }

    return { part1: part1(), part2: part2() };
}