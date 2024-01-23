import useEventListener from '@use-it/event-listener';
import { keyInObject } from '@xmatter/util-kit';
import {
  ChessHistoryIndex_NEW,
  ChessRecursiveHistory_NEW,
} from './history/types';
import {
  areHistoryIndexesEqual,
  decrementHistoryIndex,
  findMoveAtIndex,
  getStartingHistoryIndex,
  incrementHistoryIndex,
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

    const nextIndex =
      event.key === 'ArrowRight'
        ? incrementHistoryIndex(currentIndex)
        : decrementHistoryIndex(currentIndex);

    const isStartingIndex = areHistoryIndexesEqual(
      nextIndex,
      getStartingHistoryIndex()
    );

    if (findMoveAtIndex(history, nextIndex) || isStartingIndex) {
      onRefocus(nextIndex);
    }
  });
};
