import useEventListener from '@use-it/event-listener';
import {
  FBHHistory,
  FBHIndex,
  FBHRecursiveMove,
  FreeBoardHistory,
  isOneOf,
  keyInObject,
} from '@xmatter/util-kit';

const arrowsMap = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
} as const;

export const useKeyboardEventListener = (
  onPress: (a: KeyboardEvent['key'], event: KeyboardEvent) => void
) => {
  useEventListener('keydown', (event: KeyboardEvent) => {
    if (keyInObject(event, 'key')) {
      onPress(event.key, event);
    }
  });
};

export const useArrowsListener = (
  onPress: (a: 'left' | 'right' | 'up' | 'down') => void
) => {
  useEventListener('keydown', (event: KeyboardEvent) => {
    if (
      keyInObject(event, 'key') &&
      isOneOf(event.key, ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'])
      // (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
    ) {
      // onPress(event.key === 'ArrowLeft' ? 'left' : 'right');
      onPress(arrowsMap[event.key]);
    }
  });
};

export const useKeysToRefocusHistory = (
  history: FBHHistory,
  currentIndex: FBHIndex,
  onRefocus: (i: FBHIndex, move?: FBHRecursiveMove) => void
  // onChooseVariant: () => void,
) => {
  useArrowsListener((arrow) => {
    if (!isOneOf(arrow, ['left', 'right'])) {
      return;
    }

    if (
      arrow === 'right' &&
      FreeBoardHistory.findMoveAtIndex(history, currentIndex)?.branchedHistories
    ) {
      // If the current move needs to show the branches histories stop!
      console.log('needs to select');
      return;
    }

    const nextIndex = FreeBoardHistory.findNextValidMoveIndex(
      history,
      currentIndex,
      arrow
    );

    const isStartingIndex = FreeBoardHistory.areIndexesEqual(
      nextIndex,
      FreeBoardHistory.getStartingIndex()
    );

    const isDifferentThanCurrent = !FreeBoardHistory.areIndexesEqual(
      nextIndex,
      currentIndex
    );

    const foundMove = FreeBoardHistory.findMoveAtIndex(history, nextIndex);

    if ((foundMove || isStartingIndex) && isDifferentThanCurrent) {
      // const menuId = '0.f3-e6';
      // console.log('show id', menuId);
      // contextMenu.show({
      //   id: menuId,
      //   event,
      //   position: {
      //     x: 100,
      //     y: 10,
      //   },
      // });

      onRefocus(nextIndex, foundMove);
    }
  });

  // TODO: might need to optimize the onRefocus callback updates
};
