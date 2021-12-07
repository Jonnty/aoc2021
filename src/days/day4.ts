import { chunk, zip } from "lodash";
import { Parts, stringList, without } from "../utils";

interface BingoCard {
    rows: Set<number>[];
    cols: Set<number>[];
    score?: number;
    wonInRound?: number;
}

function parseCard(rows: number[][]): BingoCard {
    const cols: number[][] = zip(...rows).map(col => col.map(e => e!));
    return {
        rows: rows.map(row => new Set(row)),
        cols: cols.map(col => new Set(col))
    }
}

function cardHasWon(card: BingoCard) {
    const lines = [...card.rows, ...card.cols];
    for (let line of lines) {
        if (line.size === 0) {
            return true;
        }
    }
    return false;
}

function score(card: BingoCard, drawnNumber: number) {
    const unMarkedSum = card.rows.map(row => Array.from(row).reduce((a, b) => a + b)).reduce( (a, b) => a + b);
    return unMarkedSum * drawnNumber;
}

function drawNumber(n: number, cards: BingoCard[], round: number) {
    return cards.map(card => {
        if (card.score) {
            return card; // already won
        }
        const newCard =  {
            rows: card.rows.map( row => without(row, n)),
            cols: card.cols.map( col => without(col, n)),
        }
        if (cardHasWon(newCard)) {
            return {
                ...newCard,
                wonInRound: round,
                score: score(newCard, n)
            }
        }
        return newCard;
    })
}

    export function day4(input: string): Parts {
        const lines = stringList(input);
        const drawnNumbers = lines[0].split(',').map(s => parseInt(s));
        const grids: number[][][] = chunk(lines.slice(2).filter(s => s).map(s => s.split(/\s+/).map(s => parseInt(s))));
        const cards = grids.map(parseCard);


        function part1(): number {
            return drawnNumbers.reduce((oldCards, n, i) => drawNumber(n, oldCards, i), cards)
            .filter (card => card.score)
            .reduce( (a, b) => a.wonInRound! < b.wonInRound! ? a : b ).score!;
        }

        function part2(): number {
            return 0;
        }

        return { part1: part1().toString(), part2: part2().toString() };
    }