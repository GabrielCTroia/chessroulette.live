import {
  HISTORY_WITH_FULL_LAST_TURN,
  HISTORY_WITH_HALF_LAST_TURN,
  LONG_HISTORY_WITH_HALF_LAST_TURN,
} from './specUtils';
import {
  ChessHistoryBlackMove_NEW,
  ChessHistoryIndex_NEW,
  ChessHistoryMove_NEW,
} from './types';
import {
  addMoveToChessHistory,
  getStartingHistoryIndex,
  incrementHistoryIndex,
  decrementHistoryIndex,
  findMoveAtIndex,
  getHistoryLastIndex,
  getHistoryToIndex,
} from './util';

describe('History Index', () => {
  test('starting index', () => {
    expect(getStartingHistoryIndex()).toEqual([0, 0]);
  });

  test('increment index at turn level', () => {
    const starting: ChessHistoryIndex_NEW = [0, 0];
    const actual = incrementHistoryIndex(incrementHistoryIndex(starting));

    expect(actual).toEqual([1, 0]);
  });

  test('increment index at move level', () => {
    const starting: ChessHistoryIndex_NEW = [0, 0];
    const actual = incrementHistoryIndex(starting);

    expect(actual).toEqual([0, 1]);
  });

  test('decrement index at turn level', () => {
    const starting: ChessHistoryIndex_NEW = [2, 0];
    const actual = decrementHistoryIndex(starting);

    expect(actual).toEqual([1, 1]);
  });

  test('decrement index at move level', () => {
    const starting: ChessHistoryIndex_NEW = [2, 1];
    const actual = decrementHistoryIndex(starting);

    expect(actual).toEqual([2, 0]);
  });

  test('get last index from last half index', () => {
    const actual = getHistoryLastIndex(HISTORY_WITH_HALF_LAST_TURN);
    expect(actual).toEqual([1, 0]);
  });

  test('get last index from last full index', () => {
    const actual = getHistoryLastIndex(HISTORY_WITH_FULL_LAST_TURN);
    expect(actual).toEqual([0, 1]);
  });
});

describe('Find Move At Index', () => {
  test('Gets an existent move', () => {
    const actual = findMoveAtIndex(HISTORY_WITH_HALF_LAST_TURN, [0, 1]);

    expect(actual).toEqual({
      from: 'e7',
      to: 'e6',
      color: 'b',
    });
  });

  test('Returns "undefined" when no move', () => {
    const actual = findMoveAtIndex(HISTORY_WITH_HALF_LAST_TURN, [4, 0]);

    expect(actual).toBe(undefined);
  });
});

describe('Get History To Index', () => {
  test('Get History At Starting Index', () => {
    const actual = getHistoryToIndex(LONG_HISTORY_WITH_HALF_LAST_TURN, [0, 0]);

    expect(actual).toEqual([]);
  });

  test('Get History At Longer than length Index', () => {
    const actual = getHistoryToIndex(LONG_HISTORY_WITH_HALF_LAST_TURN, [19, 1]);

    expect(actual).toEqual(LONG_HISTORY_WITH_HALF_LAST_TURN);
  });

  test('Get History At 1st Full Turn Index ', () => {
    const actual = getHistoryToIndex(LONG_HISTORY_WITH_HALF_LAST_TURN, [0, 1]);

    expect(actual).toEqual([
      [
        {
          from: 'e2',
          to: 'e4',
          color: 'w',
        },
        {
          from: 'e7',
          to: 'e6',
          color: 'b',
        },
      ],
    ]);
  });

  test('Get History At Half Turn Index ', () => {
    const actual = getHistoryToIndex(LONG_HISTORY_WITH_HALF_LAST_TURN, [1, 0]);

    expect(actual).toEqual([
      [
        {
          from: 'e2',
          to: 'e4',
          color: 'w',
        },
        {
          from: 'e7',
          to: 'e6',
          color: 'b',
        },
      ],
      [
        {
          from: 'd2',
          to: 'd4',
          color: 'w',
        },
      ],
    ]);
  });

  test('Get History At Full Turn Index ', () => {
    const actual = getHistoryToIndex(LONG_HISTORY_WITH_HALF_LAST_TURN, [1, 1]);

    expect(actual).toEqual([
      [
        {
          from: 'e2',
          to: 'e4',
          color: 'w',
        },
        {
          from: 'e7',
          to: 'e6',
          color: 'b',
        },
      ],
      [
        {
          from: 'd2',
          to: 'd4',
          color: 'w',
        },
        {
          from: 'd7',
          to: 'd5',
          color: 'b',
        },
      ],
    ]);
  });

  test('Get History At Half Turn Index ', () => {
    const actual = getHistoryToIndex(LONG_HISTORY_WITH_HALF_LAST_TURN, [1, 0]);

    expect(actual).toEqual([
      [
        {
          from: 'e2',
          to: 'e4',
          color: 'w',
        },
        {
          from: 'e7',
          to: 'e6',
          color: 'b',
        },
      ],
      [
        {
          from: 'd2',
          to: 'd4',
          color: 'w',
        },
      ],
    ]);
  });
});

describe('Add Move', () => {
  test('adds a white move at the end of history', () => {
    const history = HISTORY_WITH_FULL_LAST_TURN;

    const newMove: ChessHistoryMove_NEW = {
      from: 'a2',
      to: 'a3',
      color: 'w',
    };

    const actual = addMoveToChessHistory(history, newMove);

    const expectedHistory = [...history, [newMove]];
    const expectedIndex = [1, 0];
    const expected = [expectedHistory, expectedIndex];

    expect(actual).toEqual(expected);
  });

  test('adds a black move at the end of history', () => {
    const newMove: ChessHistoryBlackMove_NEW = {
      from: 'a7',
      to: 'a6',
      color: 'b',
    };

    const actual = addMoveToChessHistory(HISTORY_WITH_HALF_LAST_TURN, newMove);

    const expectedHistory = [
      HISTORY_WITH_HALF_LAST_TURN[0],
      [
        {
          from: 'a2',
          to: 'a3',
          color: 'w',
        },
        newMove,
      ],
    ];

    const expectedIndex = [1, 1];
    const expected = [expectedHistory, expectedIndex];

    expect(actual).toEqual(expected);
  });
});
