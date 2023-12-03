import { Chess, Square } from 'chess.js';
import { matrixMap } from 'apps/chessroulette-web/lib/matrix';
import { GeneralPieceLayoutState, RelativeCoord } from 'chessterrain-react';

type ChessBoard = ReturnType<Chess['board']>;
export const chessBoardToPieceLayout = (
  b: ChessBoard
): GeneralPieceLayoutState =>
  matrixMap(b, (s) =>
    s
      ? { id: `${s.color}:${s.type.toUpperCase()}:${s.square}`, color: s.color }
      : 0
  );

export const relativeCoordToSquare = (c: RelativeCoord): Square =>
  tupleCoordToMahaChessSquare([
    c.row,
    c.col,
  ] as AcceptableTupleCoordForChessSquare);

export const indexedFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const indexedRanks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

const tupleCoordToMahaChessSquare = ([
  row,
  col,
]: AcceptableTupleCoordForChessSquare): Square => {
  const rank = indexedRanks[row];
  const file = indexedFiles[col];

  return `${file}${rank}`;
};

type AcceptableTupleCoordForChessSquare = [
  row: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
  col: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
];
