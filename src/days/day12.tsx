import { flatten } from "lodash";
import Multimap from "multimap";
import { connected } from "process";
import { edgeList, frequencies, Parts } from "../utils";

type CaveSystem = Multimap<string, string>;

function big(cave: string) {
    return cave.toUpperCase() === cave;
}

function small(cave: string) {
    return !big(cave);
}

function hasSmall(caves: Set<string>) {
    return Array.from(caves).some(small);
}


function paths(previous: string[], curr: string, system: CaveSystem): string[][] {
    if (curr == "end") {
        return [[...previous, curr]];
    }
    const visited = new Set(previous);
    return flatten(
        system.get(curr)
            .filter(o => big(o) || !visited.has(o))
            .map(o => paths([...previous, curr], o, system))
    );
}

function paths2(previous: string[], curr: string, system: CaveSystem): string[][] {
    if (curr == "end") {
        return [[...previous, curr]];
    }
    const smallsVisited = [...previous, curr].filter(small);
    const visitedSmallTwice = smallsVisited.length !== new Set(smallsVisited).size;
    const visited = new Set(previous);

    return flatten(
        system.get(curr)
            .filter(o => o !== "start" && (big(o) || !visited.has(o) || !visitedSmallTwice))
            .map(o => paths2([...previous, curr], o, system))
    );
}

function flip([a, b]: [string, string]): [string, string] {
    return [b, a];
}

export function day12(input: string): Parts {
    const edges = edgeList(input);
    const system = new Multimap([...edges, ...edges.map(flip)]);

    function part1(): JSX.Element {
        const total = (new Set(paths([], "start", system).map(p => JSON.stringify(p)))).size;

        return <p>{total}</p>;
    }

    function part2(): JSX.Element {
        const paths = new Set(paths2([], "start", system).map(p => JSON.stringify(p)));

        return <div>
            <p>{paths.size}</p>;

            {Array.from(paths).map(p => <p>{JSON.parse(p).join(',')}</p>)};
        </div>
    }

    return { part1: part1(), part2: part2() };
}