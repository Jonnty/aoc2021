import { Parts, stringList } from "../utils";

interface Vector {
  position: number
  depth: number
  aim: number
  depthMultiplier?: number
}

const commandsToVector: { [command: string]: Vector } = {
  forward: { position: 1, depth: 0, aim: 0, depthMultiplier: 1 },
  down: { position: 0, depth: 1, aim: 1 },
  up: { position: 0, depth: -1, aim: -1 }
}

function times({ position, depth, aim, depthMultiplier }: Vector, n: number) {
  return {
    position: position * n,
    depth: depth * n,
    aim: aim * n,
    depthMultiplier: depthMultiplier === undefined ? undefined : depthMultiplier * n
  };
}

function vectorList(strings: string[]): Vector[] {
  return strings
    .map(s => s.split(/\s+/))
    .map(([direction, size]) => times(commandsToVector[direction], parseInt(size)))
}

function add(v1: Vector, v2: Vector): Vector {
  return {
    position: v1.position + v2.position,
    depth: v1.depth + v2.depth,
    aim: v1.aim + v2.aim
  }
}

function addPart2(v1: Vector, v2: Vector): Vector {
  const deltaDepth = v2.depthMultiplier === undefined ? 0 :v1.aim * v2.depthMultiplier
  return {
    position: v1.position + v2.position,
    depth: v1.depth + deltaDepth,
    aim: v1.aim + v2.aim
  }
}

export function day2(input: string): Parts {
  const commands = vectorList(stringList(input));

  function part1(): number {
    const result = commands.reduce(add);
    return result.position * result.depth;
  }

  function part2(): number {
    const result = commands.reduce(addPart2);
    return result.position * result.depth;
  }

  return { part1: part1().toString(), part2: part2().toString() };
}