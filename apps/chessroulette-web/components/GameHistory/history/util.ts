import {
  ChessColor,
  ChessPGN,
  flatten,
  getNewChessGame,
  invoke,
  isWhiteColor,
  toShortColor,
} from '@xmatter/util-kit';
import {
  ChessHistoryBlackMove_NEW,
  ChessHistoryIndex_NEW,
  ChessHistoryMove_NEW,
  ChessHistoryRecursiveIndexes_NEW,
  ChessHistoryTurn_NEW,
  ChessHistoryWhiteMove_NEW,
  ChessHistory_NEW,
  ChessLinearHistory_NEW,
  ChessNonRecursiveHistoryIndex_NEW,
  ChessRecursiveHistoryFullTurn_NEW,
  ChessRecursiveHistoryHalfTurn_NEW,
  ChessRecursiveHistoryIndex_NEW,
  ChessRecursiveHistoryMove_NEW,
  ChessRecursiveHistoryTurn_NEW,
  ChessRecursiveHistory_NEW,
} from './types';
import { ChessLinearHistory } from '../types';
import { getMoveAtIndex } from '../lib';

export const getHistoryNonMoveWhite = (): ChessHistoryWhiteMove_NEW => ({
  color: 'w',
  san: '...',
  isNonMove: true,
  from: undefined,
  to: undefined,
});

export const getHistoryNonMove = <T extends ChessHistoryMove_NEW>(
  color: T['color']
) =>
  ({
    color,
    san: '...',
    isNonMove: true,
    from: undefined,
    to: undefined,
  } as ChessHistoryMove_NEW); // TODO: This could be infered more

export const getHistoryIndex = (
  turn: number,
  color: ChessColor
): ChessHistoryIndex_NEW => [turn, toShortColor(color) === 'b' ? 1 : 0];

export const getStartingHistoryIndex = () => getHistoryIndex(-1, 'b');

export const isStartingHistoryIndex = (i: ChessHistoryIndex_NEW) =>
  areHistoryIndexesEqual(getStartingHistoryIndex(), i);

export const isLastHistoryIndexInBranch = (
  h: ChessHistory_NEW,
  i: ChessHistoryIndex_NEW
) =>
  !isStartingHistoryIndex(i) && // not the starting one
  areHistoryIndexesEqual(getHistoryLastIndex(h), i);

export const areHistoryIndexesEqual = (
  a: ChessHistoryIndex_NEW | -1,
  b: ChessHistoryIndex_NEW | -1
): boolean => {
  if (a === -1 || b === -1) {
    return a === b;
  }

  const [aTurnIndex, aMoveIndex, aRecursiveIndex] = a;
  const [bTurnIndex, bMoveIndex, bRecursiveIndex] = b;

  const recursivesAreEqual = () => {
    if (aRecursiveIndex && bRecursiveIndex) {
      return (
        aRecursiveIndex[1] === bRecursiveIndex[1] && // the paralels are equal
        areHistoryIndexesEqual(aRecursiveIndex[0], bRecursiveIndex[0])
      );
    }
    // return true;
    return typeof aRecursiveIndex === typeof bRecursiveIndex;
  };

  return !!(
    aTurnIndex === bTurnIndex &&
    aMoveIndex === bMoveIndex &&
    recursivesAreEqual()
  );
};

export const incrementHistoryIndex = ([turn, move]: ChessHistoryIndex_NEW) =>
  (move === 1 ? [turn + 1, 0] : [turn, move + 1]) as ChessHistoryIndex_NEW;

export const incrementNestedHistoryIndex = ([
  turn,
  move,
  recursiveIndexes,
]: ChessHistoryIndex_NEW): ChessHistoryIndex_NEW => {
  if (recursiveIndexes) {
    if (recursiveIndexes[0] === -1) {
      throw new Error('This is not good. need to change it from -1');
    }

    return [
      turn,
      move,
      [incrementNestedHistoryIndex(recursiveIndexes[0]), recursiveIndexes[1]],
    ];
  }

  return incrementHistoryIndex([turn, move]);
};

// TODO: Rename to decrementHistoryIndexRecrsively
export const decrementNestedHistoryIndex = ([
  turn,
  move,
  recursiveIndexes,
]: ChessHistoryIndex_NEW): ChessHistoryIndex_NEW => {
  if (recursiveIndexes) {
    if (recursiveIndexes[0] === -1) {
      throw new Error('This is not good. need to change it from -1');
    }

    const nestedIndex = decrementNestedHistoryIndex(recursiveIndexes[0]);

    // If went down, remove it and go to the upper generation
    if (nestedIndex[0] === -1) {
      return [turn, move];
    }

    return [
      turn,
      move,
      [decrementNestedHistoryIndex(recursiveIndexes[0]), recursiveIndexes[1]],
    ];
  }

  return decrementHistoryIndex([turn, move]);
};

export const decrementHistoryIndex = ([turn, move]: ChessHistoryIndex_NEW) =>
  (move === 1 ? [turn, move - 1] : [turn - 1, 1]) as ChessHistoryIndex_NEW;

export const findMoveAtIndex = (
  history: ChessHistory_NEW,
  atIndex: ChessHistoryIndex_NEW
) => findTurnAtIndex(history, atIndex)?.[atIndex[1]];

export const findTurnAtIndex = (
  history: ChessHistory_NEW,
  [turnIndex]: ChessHistoryIndex_NEW
) => history[turnIndex];

export const findTurnAtIndexRecursively = (
  history: ChessHistory_NEW,
  [turn, movePosition, recursiveHistoryIndex]: ChessHistoryIndex_NEW
): ChessHistoryTurn_NEW | undefined => {
  // console.log('findTurnAtIndexRecursively', history, [turn, movePosition]);

  if (recursiveHistoryIndex) {
    // console.log('> recursiveHistoryIndex', recursiveHistoryIndex);
    const [recursiveIndexes, paralelBranchIndex = 0] = recursiveHistoryIndex;

    const nestedHistory =
      history[turn][movePosition]?.branchedHistories?.[paralelBranchIndex];

    if (!nestedHistory) {
      return undefined;
    }

    // console.log('> recursiveIndexes', recursiveIndexes);

    return findTurnAtIndexRecursively(
      nestedHistory,
      recursiveIndexes === -1
        ? getHistoryLastIndex(nestedHistory) // -1 means last one
        : recursiveIndexes
    );
  }

  return history[turn];
};

export const findMoveAtIndexRecursively = (
  history: ChessHistory_NEW,
  atIndex: ChessHistoryIndex_NEW
) => {
  const turn = findTurnAtIndexRecursively(history, atIndex);

  if (!turn) {
    return undefined;
  }

  // console.log('turn', turn);
  // console.log('at index', renderHistoryIndex(atIndex));
  // console.log('at index[1]', atIndex[1]);

  return turn[getDeepestIndex(atIndex)[1]];
};

export const getDeepestIndex = (
  index: ChessRecursiveHistoryIndex_NEW
): ChessNonRecursiveHistoryIndex_NEW => {
  const nextNestedIndex = getNextDeepIndex(index);

  return nextNestedIndex
    ? getDeepestIndex(nextNestedIndex)
    : (index as ChessNonRecursiveHistoryIndex_NEW);
};

const getNextDeepIndex = ([
  _,
  __,
  nestedIndex,
]: ChessRecursiveHistoryIndex_NEW):
  | ChessRecursiveHistoryIndex_NEW
  | undefined => {
  if (!nestedIndex) {
    return undefined;
  }

  if (nestedIndex[0] === -1) {
    return undefined;
  }

  return nestedIndex[0];
};

const getHistoryLastTurn = (
  history: ChessHistory_NEW
): ChessRecursiveHistoryTurn_NEW | undefined => history.slice(-1)[0];

export const getHistoryLastIndex = (
  history: ChessHistory_NEW,
  recursiveIndexes?: ChessHistoryRecursiveIndexes_NEW
  // branchIndex?: number
): ChessHistoryIndex_NEW => {
  const lastTurn = getHistoryLastTurn(history);

  // The reason it's done as a tuple is so it can be spread which on undefined it becomes empty
  const recursiveIndexesTuple: [ChessHistoryRecursiveIndexes_NEW] | [] =
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

/**
 * This does it recursively
 *
 * @param history
 * @param move
 * @param atIndex
 * @returns
 */
export const addMoveToChessHistory = (
  history: ChessRecursiveHistory_NEW,
  move: ChessHistoryMove_NEW,
  atIndex?: ChessHistoryIndex_NEW
): [
  nextHistory: ChessRecursiveHistory_NEW,
  nextIndex: ChessHistoryIndex_NEW
] => {
  const isRecursive = atIndex && findMoveAtIndex(history, atIndex);

  // console.log('addMoveToChessHistory', history, move, atIndex);

  // Branched History
  if (isRecursive) {
    const [turnIndex, moveIndex, recursiveIndexes] = atIndex;
    const prevMoveAtIndex = findMoveAtIndex(history, [turnIndex, moveIndex]);

    // if move isn't find return Prev
    if (!prevMoveAtIndex) {
      // console.log('and fails here');
      // TODO: Add test case for this
      throw new Error('AddMoveToChessHistory() Error: This should not happen');
    }

    //TODO: Add use case for when there already are branched histories
    // This is where it becomes recursive

    const prevTurnAtIndex = findTurnAtIndex(history, atIndex);

    if (!prevTurnAtIndex) {
      throw new Error('This should not happen b/c findMoveAtIndex() exists');
    }

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
            ...(prevMoveAtIndex.branchedHistories || []).slice(
              0,
              paralelBranchesIndex
            ),
            nextHistoryBranch,
            ...(prevMoveAtIndex.branchedHistories || []).slice(
              paralelBranchesIndex + 1
            ),
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

        // console.log('heererere parallel branch')

        const nextHistoryBranch: ChessRecursiveHistory_NEW = [
          // ...(prevMoveAtIndex.branchedHistories?.[0] || []),
          nextBranchedTurn,
        ] as ChessRecursiveHistory_NEW;

        const nextBranchedHistories: ChessRecursiveHistory_NEW[] = [
          ...(prevMoveAtIndex.branchedHistories || []),
          nextHistoryBranch,
        ];

        const nextRecursiveIndexes: ChessHistoryRecursiveIndexes_NEW = [
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

  const nextHistory = invoke(() => {
    const prevTurn = getHistoryLastTurn(history);

    if (prevTurn && isHalfTurn(prevTurn)) {
      const historyWithoutLastTurn = getHistoryAtIndex(
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
 * Returns the History at the given index (including the index). Returns all history if the index is greater
 *
 * @param history
 * @param toIndex inclusive
 * @returns
 */
export const getHistoryAtIndex = (
  history: ChessHistory_NEW,
  toIndex: ChessHistoryIndex_NEW
): ChessHistory_NEW => {
  const [turnIndex, movePosition] = toIndex;

  // Don't return last items as it's the default for array.slice() with negative numbers
  if (turnIndex < 0) {
    return [];
  }

  const turnsToIndex = history.slice(0, turnIndex) as ChessHistory_NEW;
  const turnAtIndex = history[turnIndex];

  if (!turnAtIndex) {
    return turnsToIndex;
  }

  return [
    ...turnsToIndex,
    movePosition === 0 ? [turnAtIndex[0]] : turnAtIndex,
  ] as ChessHistory_NEW;
};

export const getLinearChessHistoryAtRecursiveIndex_2 = (
  history: ChessHistory_NEW,
  atIndex: ChessHistoryIndex_NEW
): ChessLinearHistory_NEW => {
  const appendMovesRecursively = (
    index: ChessHistoryIndex_NEW,
    cache: ChessLinearHistory_NEW = []
  ): ChessLinearHistory_NEW => {
    const moveAtIndex = findMoveAtIndexRecursively(history, index);

    if (!moveAtIndex) {
      return cache;
    }

    // Skip if the move is a non move
    // TODO: maybe this isn't desired? hmm
    if (moveAtIndex.isNonMove) {
      return [
        ...appendMovesRecursively(decrementNestedHistoryIndex(index), cache),
      ] as ChessLinearHistory_NEW;
    }

    // Take the branchedHistories out
    const { branchedHistories, ...moveAtIndexWithoutNested } = moveAtIndex;

    return [
      ...appendMovesRecursively(decrementNestedHistoryIndex(index), cache),
      moveAtIndexWithoutNested,
    ] as ChessLinearHistory_NEW;
  };

  return appendMovesRecursively(atIndex);
};

// export const getLinearChessHistoryAtRecursiveIndex = (
//   history: ChessHistory_NEW,
//   index: ChessHistoryIndex_NEW
// ): ChessLinearHistory => {
//   // if (typeof index === 'number') {
//   //   return history.slice(0, index + 1);
//   // }
//   const [turnIndex, movePosition, recursiveIndexes] = index;

//   // Don't return last items as it's the default for array.slice() with negative numbers
//   if (turnIndex < 0) {
//     return [];
//   }

//   // const [moveIndex, branchIndex, nestedBranchedHistoryOrMoveIndex] = index;

//   // const move = history[moveIndex];
//   const move = findMoveAtIndex(history, [turnIndex, movePosition]);

//   if (!move) {
//     return []; // return an empty history if index is out of bounderies
//   }

//   const rootSlice = invoke(() => {
//     const turnsToIndex = history.slice(0, turnIndex) as ChessHistory_NEW;
//     const turnAtIndex = history[turnIndex];

//     if (!turnAtIndex) {
//       return turnsToIndex;
//     }

//     return [
//       ...turnsToIndex,
//       movePosition === 0 ? [turnAtIndex[0]] : turnAtIndex,
//     ] as ChessHistory_NEW;
//   });

//   // if (!move.branchedHistories) {
//   //   return rootSlice;
//   // }

//   if (recursiveIndexes) {
//     const [nestedIndex, branchIndex = 0] = recursiveIndexes;

//     // If the given branch doesn't exist just slice it up to the move index
//     if (!move.branchedHistories?.[branchIndex]) {
//       return turnHistoryToLinearHistory(rootSlice);
//       // return rootSlice.map((m) => );
//     }

//     return turnHistoryToLinearHistory([
//       ...rootSlice,
//       ...getLinearChessHistoryAtRecursiveIndex(
//         move.branchedHistories[branchIndex],
//         nestedIndex === -1
//           ? getHistoryLastIndex(move.branchedHistories[branchIndex])
//           : nestedIndex
//       ),
//     ] as ChessHistory_NEW);
//   }

//   return turnHistoryToLinearHistory(rootSlice);
// };

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

export const pgnToHistory = (pgn: ChessPGN): ChessHistory_NEW =>
  linearToTurnHistory(getNewChessGame({ pgn }).history({ verbose: true }));

export const turnHistoryToLinearHistory = (h: ChessHistory_NEW) => {
  // TODO:
  return flatten(h) as unknown as ChessLinearHistory;
};

export const linearToTurnHistory = (
  linearHistory: ChessLinearHistory
): ChessHistory_NEW => {
  type U = {
    turns: ChessHistory_NEW;
    cached: ChessHistoryWhiteMove_NEW | undefined;
  };

  // TODO: This is the most ridiculous thing, I have to recast to U each time
  //  otherwise the reducer thinks it's not the right one
  const { turns, cached } = linearHistory.reduce<U>(
    (prev, nextMove, i) => {
      // On Every half turn
      if (i % 2 === 0) {
        if (nextMove.color === 'w') {
          return {
            ...prev,
            cached: nextMove,
          };
        } else {
          // TODO: If the next move is not white this is an error
          throw new Error(
            `LinearToTurnHistory Error: Move (${i}) ${nextMove.from} ${nextMove.to} is not of correct color!`
          );
        }

        // return {
        // } as U;
      }

      // On Every Full Turn
      const nextTurn = [prev.cached, nextMove];

      return {
        cached: undefined,
        turns: [...prev.turns, nextTurn],
      } as U;
    },
    { turns: [], cached: undefined }
  );

  return cached ? ([...turns, [cached]] as ChessHistory_NEW) : turns;
};

export const renderHistoryIndex = ([
  turn,
  move,
  nestedIndex,
]: ChessHistoryIndex_NEW): string => {
  const nested = invoke(() => {
    if (!nestedIndex) {
      return '';
    }

    if (nestedIndex[0] === -1) {
      return ' -1';
    }

    return (
      ', ' +
      renderHistoryIndex(nestedIndex[0]) +
      (nestedIndex[1] && nestedIndex[1] > 0 ? `:${nestedIndex[1]}` : '')
      // + ']'
    );
  });

  // TODO: This doesn't take care of the branches

  return `[${turn}, ${move}${nested}]`;
};
