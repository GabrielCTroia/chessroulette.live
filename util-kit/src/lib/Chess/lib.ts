import { ChessColor, LongChessColor, ShortChessColor } from './types';

export const toShortColor = (c: ChessColor): ShortChessColor =>
  c[0] as ShortChessColor;

export const toLongColor = (c: ChessColor): LongChessColor =>
  c === 'b' || c === 'black' ? 'black' : 'white';
