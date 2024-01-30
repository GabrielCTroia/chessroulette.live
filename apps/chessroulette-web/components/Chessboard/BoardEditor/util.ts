import { Square } from 'chess.js';
import { AbsoluteCoord, Coord } from 'chessterrain-react';

export const getBoardCoordsFromAbsoluteCoords = ({
  absoluteCoords,
  squareSize,
}: {
  absoluteCoords: AbsoluteCoord;
  squareSize: number;
}): Coord => {
  // console.log('absolute', absoluteCoords);

  return {
    row: Math.floor(absoluteCoords.y / squareSize),
    col: Math.floor(absoluteCoords.x / squareSize),
  };
};

export const getSquareSize = (sizePx: number) => sizePx / 8;

export const indexedFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const indexedRanks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

export const boardCoordsToSquare = ({ row, col }: Coord): Square | null => {
  const rank = indexedRanks[row];
  const file = indexedFiles[col];

  if (!(rank && file)) {
    return null;
  }

  return `${file}${rank}`;
};

export const absoluteCoordsToSquare = (p: {
  absoluteCoords: AbsoluteCoord;
  squareSize: number;
}) => boardCoordsToSquare(getBoardCoordsFromAbsoluteCoords(p));
