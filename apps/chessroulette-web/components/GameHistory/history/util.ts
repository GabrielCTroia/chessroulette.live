import { ChessColor } from '@xmatter/util-kit';
import {
  ChessHistoryIndex_NEW,
  ChessHistoryMove_NEW,
  ChessHistory_NEW,
  ChessRecursiveHistoryFullTurn_NEW,
  ChessRecursiveHistoryHalfTurn_NEW,
  ChessRecursiveHistoryTurn_NEW,
  ChessRecursiveHistory_NEW,
} from './types';
import { toShortColor } from 'chessterrain-react';

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
  [turn, move]: ChessHistoryIndex_NEW
) => history[turn]?.[move];

const getHistoryLastTurn = (
  history: ChessHistory_NEW
): ChessRecursiveHistoryTurn_NEW => history.slice(-1)[0];

export const getHistoryLastIndex = (
  history: ChessHistory_NEW
): ChessHistoryIndex_NEW => {
  const lastTurn = getHistoryLastTurn(history);

  if (!lastTurn) {
    return [0, 0];
  }

  return [history.length - 1, isHalfTurn(lastTurn) ? 0 : 1];
};

export const addMoveToChessHistory = (
  history: ChessRecursiveHistory_NEW,
  move: ChessHistoryMove_NEW,
  atIndex?: ChessHistoryIndex_NEW
): [
  nextHistory: ChessRecursiveHistory_NEW,
  nextIndex: ChessHistoryIndex_NEW
] => {
  const prevTurn = getHistoryLastTurn(history);

  if (isHalfTurn(prevTurn)) {
    const historyWithoutLastTurn = getHistoryToIndex(
      history,
      decrementHistoryIndex(getHistoryLastIndex(history))
    );

    const nextHistory = [
      ...historyWithoutLastTurn,
      [prevTurn[0], move],
    ] as ChessRecursiveHistory_NEW;

    return [nextHistory, getHistoryLastIndex(nextHistory)];
  }

  const nextHistory = [...history, [move]] as ChessRecursiveHistory_NEW;

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

export const isFullTurn = (
  mt: ChessRecursiveHistoryTurn_NEW
): mt is ChessRecursiveHistoryFullTurn_NEW => !!mt[1];

export const isHalfTurn = (
  mt: ChessRecursiveHistoryTurn_NEW
): mt is ChessRecursiveHistoryHalfTurn_NEW => !isFullTurn(mt);
