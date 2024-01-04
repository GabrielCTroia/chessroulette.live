import useEventListener from '@use-it/event-listener';
import { keyInObject } from '@xmatter/util-kit';
import {
  decrementChessHistoryIndex,
  getBranchedHistoryLastIndex,
  incrementChessHistoryIndex,
  normalizeChessHistoryIndex,
} from './lib';
import { ChessHistoryIndex, ChessRecursiveHistory } from './types';

export const useKeysToRefocusHistory = (
  history: ChessRecursiveHistory,
  currentIndex: ChessHistoryIndex,
  onRefocus: (i: ChessHistoryIndex) => void
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

    const normalizedDisplayedIndex = normalizeChessHistoryIndex(currentIndex);

    const lastInCurrentBranch = getBranchedHistoryLastIndex(
      history,
      currentIndex
    );
    const normalizedLastInCurrentBranch =
      normalizeChessHistoryIndex(lastInCurrentBranch);

    if (
      event.key === 'ArrowRight' &&
      normalizedDisplayedIndex < normalizedLastInCurrentBranch
    ) {
      onRefocus(incrementChessHistoryIndex(currentIndex));
    } else if (event.key === 'ArrowLeft' && normalizedDisplayedIndex >= 0) {
      onRefocus(decrementChessHistoryIndex(currentIndex));
    }
  });
};
