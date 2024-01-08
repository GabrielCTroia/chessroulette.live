import { Square } from 'chess.js';
import {
  ChessArrowId,
  ChessColor,
  LongChessColor,
  ShortChessColor,
} from './types';
import { Arrow } from 'react-chessboard/dist/chessboard/types';

export const toShortColor = (c: ChessColor): ShortChessColor =>
  c[0] as ShortChessColor;

export const toLongColor = (c: ChessColor): LongChessColor =>
  c === 'b' || c === 'black' ? 'black' : 'white';

export const isDarkSquare = (s: Square): boolean => {
  const [file, rank] = s;

  // 97 is chardCodeAt of 'a'
  return (file.charCodeAt(0) - 97 + Number(rank)) % 2 === 1;
};

export const isLightSquare = (s: Square): boolean => !isDarkSquare(s);

export const toChessArrowId = ([from, to, color]: Arrow): ChessArrowId =>
  `${from}${to}-${color}`;

export const toChessArrowFromId = (aid: ChessArrowId): Arrow => {
  const from = aid.slice(0, 2) as Square;
  const to = aid.slice(2, 4) as Square;
  const color = aid.slice(5) as string;

  return [from, to, color];
};
