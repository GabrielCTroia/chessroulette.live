import { ChessColor, invoke, isWhiteColor } from '@xmatter/util-kit';
import {
  ChessHistoryBaseMove_NEW,
  ChessHistoryBaseNonMove_NEW,
  ChessHistoryBlackMove_NEW,
  ChessHistoryIndex_NEW,
  ChessHistoryMove_NEW,
  ChessHistoryRecursiveIndexes,
  ChessHistoryWhiteMove_NEW,
  ChessHistory_NEW,
  ChessRecursiveHistoryFullTurn_NEW,
  ChessRecursiveHistoryHalfTurn_NEW,
  ChessRecursiveHistoryIndex_NEW,
  ChessRecursiveHistoryMove_NEW,
  ChessRecursiveHistoryTurn_NEW,
  ChessRecursiveHistory_NEW,
} from './types';
import { toShortColor } from 'chessterrain-react';

export const getHistoryNonMoveWhite = (): ChessHistoryWhiteMove_NEW => ({
  color: 'w',
  san: '...',
  isNonMove: true,
  from: undefined,
  to: undefined,
});

export const getHistoryIndex = (
  turn: number,
  color: ChessColor
): ChessHistoryIndex_NEW => [turn, toShortColor(color) === 'b' ? 1 : 0];

export const getStartingHistoryIndex = () => getHistoryIndex(0, 'w');

export const incrementHistoryIndex = ([turn, move]: ChessHistoryIndex_NEW) =>
  (move === 1 ? [turn + 1, 0] : [turn, move + 1]) as ChessHistoryIndex_NEW;

export const decrementHistoryIndex = ([turn, move]: ChessHistoryIndex_NEW) =>
  (move === 1 ? [turn, move - 1] : [turn - 1, 1]) as ChessHistoryIndex_NEW;

export const findMoveAtIndex = (
  history: ChessHistory_NEW,
  atIndex: ChessHistoryIndex_NEW
) => findTurnAtIndex(history, atIndex)?.[atIndex[1]];

export const findTurnAtIndex = (
  history: ChessHistory_NEW,
  [turn]: ChessHistoryIndex_NEW
) => history[turn];

const getHistoryLastTurn = (
  history: ChessHistory_NEW
): ChessRecursiveHistoryTurn_NEW => history.slice(-1)[0];

export const getHistoryLastIndex = (
  history: ChessHistory_NEW,
  recursiveIndexes?: ChessHistoryRecursiveIndexes
  // branchIndex?: number
): ChessHistoryIndex_NEW => {
  const lastTurn = getHistoryLastTurn(history);

  // The reason it's done as a tuple is so it can be spread which on undefined it becomes empty
  const recursiveIndexesTuple: [ChessHistoryRecursiveIndexes] | [] =
    typeof recursiveIndexes !== 'undefined' ? [recursiveIndexes] : [];

  if (!lastTurn) {
    return [0, 0, ...recursiveIndexesTuple];
  }

  return [
    history.length - 1,
    isHalfTurn(lastTurn) ? 0 : 1,
    ...recursiveIndexesTuple,
  ];
};

export const addMoveToChessHistory = (
  history: ChessRecursiveHistory_NEW,
  move: ChessHistoryMove_NEW,
  atIndex?: ChessHistoryIndex_NEW
): [
  nextHistory: ChessRecursiveHistory_NEW,
  nextIndex: ChessHistoryIndex_NEW
] => {
  // console.log('addMoveToChessHistory', history, atIndex);

  // Branched History
  if (atIndex) {
    const [turnIndex, moveIndex, recursiveIndexes] = atIndex;
    const prevMoveAtIndex = findMoveAtIndex(history, [turnIndex, moveIndex]);

    // if move isn't find return Prev
    if (!prevMoveAtIndex) {
      // console.log('and fails here');

      return [history, getHistoryLastIndex(history)];
    }

    //TODO: Add use case for when there already are branched histories
    // This is where it becomes recursive

    const prevTurnAtIndex = findTurnAtIndex(history, atIndex);

    const { nextBranchedHistories, nextIndex } = invoke(
      (): {
        nextBranchedHistories: ChessHistory_NEW[];
        nextIndex: ChessHistoryIndex_NEW;
      } => {
        // Recursive
        if (recursiveIndexes) {
          // Add a Nested Branch
          // console.log('recursiveIndexes', recursiveIndexes);

          const [recursiveHistoryIndex, paralelBranchesIndex = 0] =
            recursiveIndexes;

          const [nextHistoryBranch, nextNestedIndex] = addMoveToChessHistory(
            prevMoveAtIndex.branchedHistories?.[paralelBranchesIndex] || [],
            move,
            recursiveHistoryIndex === -1 ? undefined : recursiveHistoryIndex
          );

          const nextBranchedHistories: ChessRecursiveHistory_NEW[] = [
            // ...(prevMoveAtIndex.branchedHistories || []),
            nextHistoryBranch,
          ];

          return {
            nextBranchedHistories,
            nextIndex: [
              turnIndex,
              moveIndex,
              [nextNestedIndex, paralelBranchesIndex],
            ],
          };
        }

        // Add Parallel brannch

        const nextBranchedTurn: ChessRecursiveHistoryTurn_NEW = isWhiteMove(
          move
        )
          ? [move]
          : [getHistoryNonMoveWhite(), move];

        const nextHistoryBranch: ChessRecursiveHistory_NEW = [
          // ...(prevMoveAtIndex.branchedHistories?.[0] || []),
          nextBranchedTurn,
        ] as ChessRecursiveHistory_NEW;

        const nextBranchedHistories: ChessRecursiveHistory_NEW[] = [
          ...(prevMoveAtIndex.branchedHistories || []),
          nextHistoryBranch,
        ];

        const nextRecursiveIndexes: ChessHistoryRecursiveIndexes = [
          [...getHistoryLastIndex(nextHistoryBranch)],
          nextBranchedHistories.length - 1, // The last branch
        ];

        const nextIndex: ChessRecursiveHistoryIndex_NEW = [
          turnIndex,
          moveIndex,
          nextRecursiveIndexes,
        ];

        // console.log('nextRecursiveIndexes!!!', nextRecursiveIndexes);

        return { nextBranchedHistories, nextIndex };
      }
    );

    const nextMove: ChessRecursiveHistoryMove_NEW = {
      ...prevMoveAtIndex,
      branchedHistories: nextBranchedHistories,
    };

    const nextTurn: ChessRecursiveHistoryTurn_NEW = updateOrInsertMoveInTurn(
      prevTurnAtIndex,
      nextMove
    );

    const nextHistory: ChessRecursiveHistory_NEW = [
      ...history.slice(0, turnIndex),
      nextTurn,
      ...history.slice(turnIndex + 1),
    ] as ChessRecursiveHistory_NEW;

    return [nextHistory, nextIndex];
  }

  // Linear

  const prevTurn = getHistoryLastTurn(history);

  const nextHistory = invoke(() => {
    if (isHalfTurn(prevTurn)) {
      const historyWithoutLastTurn = getHistoryToIndex(
        history,
        decrementHistoryIndex(getHistoryLastIndex(history))
      );

      return [
        ...historyWithoutLastTurn,
        [prevTurn[0], move],
      ] as ChessRecursiveHistory_NEW;
    }

    return [...history, [move]] as ChessRecursiveHistory_NEW;
  });

  return [nextHistory, getHistoryLastIndex(nextHistory)];
};

/**
 * Returns the History up to the given index. Returns all history if the index is greater
 *
 * @param history
 * @param toIndex inclusive
 * @returns
 */
export const getHistoryToIndex = (
  history: ChessHistory_NEW,
  toIndex: ChessHistoryIndex_NEW
): ChessHistory_NEW => {
  const [turn, move] = toIndex;
  if (turn === 0 && move === 0) {
    return [];
  }

  const historyToIndex = history.slice(0, turn) as ChessHistory_NEW;
  const turnAtIndex = history.slice(turn, turn + 1)[0];

  // Return early if 'turnAtIndexæ doesn't exist
  if (!turnAtIndex) {
    return historyToIndex;
  }

  return [
    ...historyToIndex,
    move === 0 ? [turnAtIndex[0]] : turnAtIndex,
  ] as ChessHistory_NEW;
};

export const updateOrInsertMoveInTurn = <
  T extends ChessRecursiveHistoryTurn_NEW
>(
  turn: T,
  move: ChessHistoryMove_NEW
): T => (isWhiteMove(move) ? [move, ...turn.slice(1)] : [turn[0], move]) as T;

export const isFullTurn = (
  mt: ChessRecursiveHistoryTurn_NEW
): mt is ChessRecursiveHistoryFullTurn_NEW => !!mt[1];

export const isHalfTurn = (
  mt: ChessRecursiveHistoryTurn_NEW
): mt is ChessRecursiveHistoryHalfTurn_NEW => !isFullTurn(mt);

export const isWhiteMove = (
  m: ChessHistoryMove_NEW
): m is ChessHistoryWhiteMove_NEW => isWhiteColor(m.color);

export const isBlackMove = (
  m: ChessHistoryMove_NEW
): m is ChessHistoryBlackMove_NEW => !isWhiteColor(m.color);
