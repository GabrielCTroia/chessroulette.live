import { ChessPGN, flatten, toShortColor } from '@xmatter/util-kit';
import {
  ChessHistoryBaseMove,
  ChessHistoryBlackMove,
  ChessHistoryMove,
  ChessHistoryWhiteMove,
  ChessLinearHistory,
  ChessRecursiveHistoryIndex,
  FullMove,
  PairedHistory,
  PairedMove,
  PartialBlackMove,
  PartialMove,
  PartialWhiteMove,
} from './types';

export const isPartialMove = (pm: PairedMove): pm is PartialMove =>
  isPartialWhiteMove(pm) || isPartialBlackMove(pm);
export const isPartialWhiteMove = (pm: PairedMove): pm is PartialWhiteMove =>
  Array.isArray(pm) && pm.length === 1 && toShortColor(pm[0].color) === 'w';
export const isPartialBlackMove = (pm: PairedMove): pm is PartialBlackMove =>
  Array.isArray(pm) && pm.length === 1 && toShortColor(pm[0].color) === 'b';

export const isChessHistoryBlackMove = (
  m: ChessHistoryMove
): m is ChessHistoryBlackMove => toShortColor(m.color) === 'b';
export const isChessHistoryWhiteMove = (
  m: ChessHistoryMove
): m is ChessHistoryWhiteMove => toShortColor(m.color) === 'w';

export const isFullMove = (pm: PairedMove): pm is FullMove =>
  Array.isArray(pm) &&
  pm.length === 2 &&
  !!pm[0] &&
  toShortColor(pm[0].color) === 'w' &&
  !!pm[1] &&
  toShortColor(pm[1].color) === 'b';

export const toPairedHistory = (history: ChessLinearHistory): PairedHistory =>
  history.reduce((prev, next) => {
    const currentPartialMove: PartialMove = [next];

    // If the length is zero just return the partial move
    //  Note (could be a black one as well if the history starts in the middle)
    if (prev.length === 0) {
      return [currentPartialMove];
    }

    // If the previous move is a partial white and the current move is a partial black
    //  then just merge them
    const prevPartialMove = prev.slice(-1)[0];
    if (
      isPartialWhiteMove(prevPartialMove) &&
      isPartialBlackMove(currentPartialMove)
    ) {
      const prevWithoutLast = prev.slice(0, -1);
      const nextFullMove: FullMove = [
        prevPartialMove[0],
        currentPartialMove[0],
      ];
      return [...prevWithoutLast, nextFullMove];
    }

    // Otherwise just append the current white partial move to prev
    return [...prev, currentPartialMove];
  }, [] as PairedHistory);

export const pairedHistoryToLinearHistory = (
  ph: PairedHistory
): ChessLinearHistory => flatten(ph) as unknown as ChessLinearHistory;

// [0] - The PairedMove index
// [1] - The color/side index
export type PairedIndex = [number, number];

export const linearToPairedIndex = (
  history: ChessLinearHistory,
  index: number
): PairedIndex => {
  return [Math.floor(index / 2), index % 2];
};

export const pairedToLinearIndex = (index: PairedIndex) =>
  index[0] * 2 + index[1];

export const reversedLinearIndex = (
  history: ChessLinearHistory,
  index: number
) => history.length - index - 1;

// @deprecated in favor of the safer chessHistoryToSimplePgn
// export const historyToPgn = (moves: ChessLinearHistory): ChessPGN =>
//   toPairedHistory(moves)
//     .map(
//       (pm, index) =>
//         isFullMove(pm)
//           ? `${index + 1}. ${pm[0].san} ${pm[1].san}` // full move
//           : isPartialWhiteMove(pm)
//           ? `${index + 1}. ${pm[0].san}` // halfMove
//           : '' // if a PartialBlackMove do nothing as this won't be a valid PGN
//     )
//     .join(' ');

export const isChessRecursiveHistoryIndex = (
  a: unknown
): a is ChessRecursiveHistoryIndex =>
  Array.isArray(a) &&
  (a.length === 2 || a.length === 3) &&
  typeof a[0] === 'number' &&
  typeof a[1] === 'number';
