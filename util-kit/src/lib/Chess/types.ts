import type { Square, Move, PieceSymbol } from 'chess.js';

// Remove in favor of ShortChessMove
export type ChessMove = {
  from: Square;
  to: Square;
};

export type ShortChessMove = {
  from: Square;
  to: Square;
};

export type DetailedChessMove = Pick<
  Move,
  'color' | 'san' | 'to' | 'from' | 'piece' | 'captured' | 'promotion'
>;

export type ChessPGN = string; // TODO: Brand this type
export type ChessFEN = string; // TODO: Brand this type
export type ChessMoveSan = string; // TODO: Brand this type

export type WhiteShortColor = 'w';
export type BlackShortColor = 'b';

export type WhiteLongColor = 'white';
export type BlackLongColor = 'black';

export type WhiteColor = WhiteShortColor | WhiteLongColor;
export type BlackColor = BlackShortColor | BlackLongColor;

export type LongChessColor = WhiteLongColor | BlackLongColor;
export type ShortChessColor = WhiteShortColor | BlackShortColor;

export type ChessColor = WhiteColor | BlackColor;

export type DetailedChessPiece = {
  piece: PieceSymbol;
  color: ShortChessColor;
};
