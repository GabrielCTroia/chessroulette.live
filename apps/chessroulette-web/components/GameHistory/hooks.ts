import useEventListener from '@use-it/event-listener';
import { keyInObject } from '@xmatter/util-kit';
import {
  ChessHistoryIndex_NEW,
  ChessRecursiveHistory_NEW,
} from './history/types';
import {
  areHistoryIndexesEqual,
  decrementNestedHistoryIndex,
  findMoveAtIndex,
  findMoveAtIndexRecursively,
  getStartingHistoryIndex,
  incrementNestedHistoryIndex,
  renderHistoryIndex,
} from './history/util';

export const useKeysToRefocusHistory = (
  history: ChessRecursiveHistory_NEW,
  currentIndex: ChessHistoryIndex_NEW,
  onRefocus: (i: ChessHistoryIndex_NEW) => void
) => {
  useEventListener('keydown', (event: object) => {
    if (
      !(
        keyInObject(event, 'key') &&
        (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
      )
    ) {
      return;
    }

    const nextIndex = findNextValidMoveIndex(
      history,
      currentIndex,
      event.key === 'ArrowRight' ? 'right' : 'left'
    );

    const isStartingIndex = areHistoryIndexesEqual(
      nextIndex,
      getStartingHistoryIndex()
    );

    if (findMoveAtIndex(history, nextIndex) || isStartingIndex) {
      onRefocus(nextIndex);
    }
  });
};

/**
 * If there are non moves it skips over them
 *
 * @param index
 * @param dir
 * @returns
 */
const findNextValidMoveIndex = (
  history: ChessRecursiveHistory_NEW,
  index: ChessHistoryIndex_NEW,
  dir: 'right' | 'left'
): ChessHistoryIndex_NEW => {
  console.log('inc/dev >', renderHistoryIndex(index));

  const nextIndex =
    dir === 'right'
      ? incrementNestedHistoryIndex(index)
      : decrementNestedHistoryIndex(index);

  // console.log('next inc/dev >', renderHistoryIndex(nextIndex));

  const nextMove = findMoveAtIndexRecursively(history, nextIndex);

  console.log('nextMove', nextMove, !!nextMove?.isNonMove ? 'nonMove' : '', renderHistoryIndex(nextIndex));

  if (nextMove?.isNonMove) {
    return findNextValidMoveIndex(history, nextIndex, dir);
  }

  return nextIndex;
};
