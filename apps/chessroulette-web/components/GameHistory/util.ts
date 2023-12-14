import { ChessPGN, flatten, toShortColor } from '@xmatter/util-kit';
import {
  ChessHistoryBaseMove,
  ChessHistoryBlackMove,
  ChessHistoryIndex,
  ChessHistoryMove,
  ChessHistoryWhiteMove,
  ChessLinearHistory,
  ChessRecursiveHistory,
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

// export const isChessRecursiveHistoryIndex = (
//   a: unknown
// ): a is ChessRecursiveHistoryIndex =>
//   Array.isArray(a) &&
//   (a.length === 2 || a.length === 3) &&
//   typeof a[0] === 'number' &&
//   typeof a[1] === 'number';

  // Adds a new move from the given index at the next availalbe slot
//  In case of a nested move it simply adds a new branch if the move not already there
//  If the move is already present as a following move (on the main or branched histories) it simply refocuses
//  Otherwise it appends it to the given history
// export const addMoveToChessHistoryAtNextAvailableIndex = (
//   history: ChessRecursiveHistory,
//   atIndex: ChessHistoryIndex,
//   move: ChessHistoryMove
// ) => {
//   const lastIndexInBranch = getBranchedHistoryLastIndex(history, atIndex);
//   // If the Branched History atIndex is the last one or not given, just append it to the current history branch
//   if (!(normalizeChessHistoryIndex(atIndex) < normalizeChessHistoryIndex(lastIndexInBranch))) {
//     return addMoveToChessHistory(history, move, atIndex);
//   }

//   const foundFollowingMoveAndIndex = getAllFollowingMoves(history, atIndex).find(
//     ([m]) => m.san === move.san
//   );

//   // If the move is the same as an already following history branch just refocus on it
//   if (foundFollowingMoveAndIndex) {
//     const [_, followingFoundIndex] = foundFollowingMoveAndIndex;
//     return [history, followingFoundIndex] as const;
//   }

//   // Otherwise add a parallel history branch for the move
//   return addMoveToChessHistory(history, move, getNextAvailableParallelIndex(history, atIndex));
// };

// export const addMoveToChessHistory = (
//   history: ChessRecursiveHistory,
//   m: ChessHistoryMove,
//   chessHistoryIndex?: ChessHistoryIndex
// ): [nextHistory: ChessRecursiveHistory, nextIndex: ChessHistoryIndex] => {
//   if (isChessRecursiveHistoryIndex(chessHistoryIndex)) {
//     const [moveIndex, branchIndex, nestedBranchedHistoryOrMoveIndex] = chessHistoryIndex;

//     const nestedBranchIndex = isChessRecursiveHistoryIndex(nestedBranchedHistoryOrMoveIndex)
//       ? nestedBranchedHistoryOrMoveIndex
//       : undefined;

//     const currentMove = history[moveIndex];

//     if (currentMove.branchedHistories) {
//       const [nextNestedHistory, nextNestedHistoryIndex] = addMoveToChessHistory(
//         currentMove.branchedHistories[branchIndex],
//         m,
//         nestedBranchIndex
//       );

//       const nextBranchedHistories = currentMove.branchedHistories
//         ? [
//             ...currentMove.branchedHistories.slice(0, branchIndex),
//             nextNestedHistory,
//             ...currentMove.branchedHistories.slice(branchIndex + 1),
//           ]
//         : [[m]];

//       const nextHistory = [
//         ...history.slice(0, moveIndex),
//         {
//           ...history[moveIndex],
//           branchedHistories: nextBranchedHistories,
//         },
//         ...history.slice(moveIndex + 1),
//       ];

//       return [nextHistory, [moveIndex, branchIndex, nextNestedHistoryIndex]];
//     }

//     const nextBranchedHistories = [[m]];

//     const nextHistory = [
//       ...history.slice(0, moveIndex),
//       {
//         ...history[moveIndex],
//         branchedHistories: nextBranchedHistories,
//       },
//       ...history.slice(moveIndex + 1),
//     ];

//     return [nextHistory, [moveIndex, 0, 0]];
//   }

//   if (typeof chessHistoryIndex === 'number' && chessHistoryIndex < history.length - 1) {
//     const nextHistory = [
//       ...history.slice(0, chessHistoryIndex),
//       {
//         ...history[chessHistoryIndex],
//         branchedHistories: [[m]],
//       },
//       ...history.slice(chessHistoryIndex + 1),
//     ];

//     return [nextHistory, [chessHistoryIndex, 0, 0]];
//   }

//   const nextHistory = [...(history || []), m];
//   return [nextHistory, nextHistory.length - 1];
// };


// export const getBranchedHistoryLastIndex = (
//   history: ChessRecursiveHistory,
//   fromIndex?: ChessHistoryIndex
// ): ChessHistoryIndex => {
//   // If it's already a number (moveIndex) the actual history is the correct branch
//   if (typeof fromIndex === 'number' || fromIndex === undefined) {
//     return history.length - 1;
//   }

//   const [moveIndex, branchIndex, nestedBranchedHistoryOrMoveIndex] = fromIndex;

//   const move = history[moveIndex];

//   // If the move doesn't exist just return the last in history
//   if (!move) {
//     return history.length - 1;
//   }

//   // If the move doesn't have branches just return the last in history
//   if (!move.branchedHistories) {
//     return history.length - 1;
//   }

//   // If the given branch doesn't exist just return the last in history
//   if (!move.branchedHistories[branchIndex]) {
//     return history.length - 1;
//   }

//   return [
//     moveIndex,
//     branchIndex,
//     getBranchedHistoryLastIndex(
//       move.branchedHistories[branchIndex],
//       nestedBranchedHistoryOrMoveIndex
//     ),
//   ];
// };

// export const normalizeChessHistoryIndex = (index: ChessHistoryIndex = 0): number => {
//   if (typeof index === 'number') {
//     return index; // add the 2 other 0s so it's equal to the nested return
//   }

//   const [_, __, nestedMoveIndex] = index;

//   // const denormalizedNestedMoveIndex =
//   //   typeof nestedMoveIndex === 'number' ? nestedMoveIndex / 100 : nestedMoveIndex;

//   const flattendBranchIndex = normalizeChessHistoryIndex(nestedMoveIndex);

//   const next = Number(
//     `${index[0]}${index[1]}${flattendBranchIndex > 0 ? flattendBranchIndex : ''}`
//   );

//   return next;
// };

// export const getAllFollowingMoves = (
//   history: ChessRecursiveHistory,
//   atIndex: ChessHistoryIndex
// ) => {
//   const mainFollowingMove = getMainFollowingMove(history, atIndex);
//   const alternativeFollowingMoves = getAlternativeFollowingMoves(history, atIndex);

//   return [...(mainFollowingMove ? [mainFollowingMove] : []), ...alternativeFollowingMoves];
// };


// export const getMainFollowingMove = (
//   history: ChessRecursiveHistory,
//   atIndex: ChessHistoryIndex
// ) => {
//   const followingIndex = incrementChessHistoryIndex(atIndex);
//   const followingMove = getMoveAtIndex(history, followingIndex);

//   return followingMove ? ([followingMove, followingIndex] as const) : undefined;
// };

// export const getAlternativeFollowingMoves = (
//   history: ChessRecursiveHistory,
//   atIndex: ChessHistoryIndex
// ): [ChessRecursiveMove, ChessHistoryIndex][] => {
//   const move = getMoveAtIndex(history, atIndex);

//   if (!(move && move.branchedHistories)) {
//     return [];
//   }

//   const deconstructedAtIndex: ChessHistoryIndex[] = [];
//   every(atIndex, (i) => deconstructedAtIndex.push(i), { reverse: true });

//   return move.branchedHistories
//     .map((branch, branchIndex) => {
//       const branchMoveIndex = 0;
//       const followingMove = branch[branchMoveIndex];

//       if (!followingMove) {
//         return undefined;
//       }

//       const reconstructedFollowingMoveIndex = deconstructedAtIndex.reduce((prev, nextIndex) => {
//         // First position only
//         if (typeof nextIndex === 'number') {
//           return [nextIndex, branchIndex, 0];
//         }

//         return [nextIndex[0], nextIndex[1], prev];
//       }, [] as unknown as ChessHistoryIndex);

//       return [followingMove, reconstructedFollowingMoveIndex] as const;
//     })
//     .filter((m) => !!m) as [ChessRecursiveMove, ChessHistoryIndex][];
// };