import type { Square, Move } from 'chess.js';

export type ChessMove = {
  from: Square;
  to: Square;
};

export type DetailedChessMove = Move;

export type ChessPGN = string; // TODO: Brand this type

export type ChessFEN = string; // TODO: Brand this type

export type WhiteShortColor = 'w';
export type BlackShortColor = 'b';

export type WhiteLongColor = 'white';
export type BlackLongColor = 'black';

export type WhiteColor = WhiteShortColor | WhiteLongColor;
export type BlackColor = BlackShortColor | BlackLongColor;

export type LongChessColor = WhiteLongColor | BlackLongColor;
export type ShortChessColor = WhiteShortColor | BlackShortColor;

export type ChessColor = WhiteColor | BlackColor;
