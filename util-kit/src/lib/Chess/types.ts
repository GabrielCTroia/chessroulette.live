import type { Square, Move, PieceSymbol } from 'chess.js';

// Remove in favor of ShortChessMove
export type ChessMove = {
  from: Square;
  to: Square;
  promoteTo?: PromotionalPieceSan;
};

export type ShortChessMove = {
  from: Square;
  to: Square;
  promoteTo?: PromotionalPieceSan;
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

export type PieceSan =
  | 'wP'
  | 'wB'
  | 'wN'
  | 'wR'
  | 'wQ'
  | 'wK'
  | 'bP'
  | 'bB'
  | 'bN'
  | 'bR'
  | 'bQ'
  | 'bK';

export type PromotionalPieceSan = Exclude<PieceSan, 'wP' | 'wK' | 'bP' | 'bK'>;

// export type ChessArrowId = `${Square}${Square}-${string}`;
export type ChessArrowId = string;
export type ChesscircleId = string;
