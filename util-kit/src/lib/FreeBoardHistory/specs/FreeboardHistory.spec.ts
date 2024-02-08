import {
  HISTORY_WITH_FULL_LAST_TURN,
  HISTORY_WITH_HALF_LAST_TURN,
  LONG_HISTORY_WITH_HALF_LAST_TURN,
} from './specUtils';
import { FBHBlackMove, FBHIndex, FBHMove, FBHHistory } from '../types';
import { FreeBoardHistory as FBH } from '../FreeBoardHistory';

describe('History Index', () => {
  test('starting index', () => {
    expect(FBH.getStartingHistoryIndex()).toEqual([-1, 1]);
  });

  test('increment index at turn level', () => {
    const starting: FBHIndex = [0, 0];
    const actual = FBH.incrementIndex(
      FBH.incrementIndex(starting)
    );

    expect(actual).toEqual([1, 0]);
  });

  test('increment index at move level', () => {
    const starting: FBHIndex = [0, 0];
    const actual = FBH.incrementIndex(starting);

    expect(actual).toEqual([0, 1]);
  });

  test('decrement index at turn level', () => {
    const starting: FBHIndex = [2, 0];
    const actual = FBH.decrementIndex(starting);

    expect(actual).toEqual([1, 1]);
  });

  test('decrement index at move level', () => {
    const starting: FBHIndex = [2, 1];
    const actual = FBH.decrementIndex(starting);

    expect(actual).toEqual([2, 0]);
  });

  test('get last index from last half index', () => {
    const actual = FBH.getHistoryLastIndex(HISTORY_WITH_HALF_LAST_TURN);
    expect(actual).toEqual([1, 0]);
  });

  test('get last index from last full index', () => {
    const actual = FBH.getHistoryLastIndex(HISTORY_WITH_FULL_LAST_TURN);
    expect(actual).toEqual([0, 1]);
  });

  describe('areHistoryIndexesEqual', () => {
    test('true when equal non recursive', () => {
      expect(FBH.areHistoryIndexesEqual([0, 1], [0, 1])).toBe(true);
    });

    test('true when equal recursive', () => {
      expect(
        FBH.areHistoryIndexesEqual([0, 1, [[0, 1], 0]], [0, 1, [[0, 1], 0]])
      ).toBe(true);
    });

    test('false when not equal non recursive', () => {
      expect(FBH.areHistoryIndexesEqual([0, 1], [0, 0])).toBe(false);
      expect(FBH.areHistoryIndexesEqual([0, 0], [1, 0])).toBe(false);
    });

    test('false when not equal recusive', () => {
      expect(
        FBH.areHistoryIndexesEqual([0, 1, [[0, 0], 0]], [0, 1, [[0, 1], 0]])
      ).toBe(false);
      expect(
        FBH.areHistoryIndexesEqual([0, 1, [[0, 1], 1]], [0, 1, [[0, 1], 0]])
      ).toBe(false);
    });
  });
});

describe('Find Move At Index', () => {
  test('Gets an existent move', () => {
    const actual = FBH.findMoveAtIndex(HISTORY_WITH_HALF_LAST_TURN, [0, 1]);

    expect(actual).toEqual({
      from: 'e7',
      to: 'e6',
      san: 'e6',
      color: 'b',
    });
  });

  test('Returns "undefined" when no move', () => {
    const actual = FBH.findMoveAtIndex(HISTORY_WITH_HALF_LAST_TURN, [4, 0]);

    expect(actual).toBe(undefined);
  });
});

describe('Get History At Index', () => {
  test('Get Empty History', () => {
    const actual = FBH.getHistoryAtIndex(
      LONG_HISTORY_WITH_HALF_LAST_TURN,
      [-1, 1]
    );

    expect(actual).toEqual([]);
  });

  test('Get History At Starting Index', () => {
    const actual = FBH.getHistoryAtIndex(
      LONG_HISTORY_WITH_HALF_LAST_TURN,
      [0, 0]
    );

    expect(actual).toEqual([
      [
        {
          from: 'e2',
          to: 'e4',
          color: 'w',
          san: 'e4',
        },
      ],
    ]);
  });

  test('Get History At 1st Full Turn Index ', () => {
    const actual = FBH.getHistoryAtIndex(
      LONG_HISTORY_WITH_HALF_LAST_TURN,
      [0, 1]
    );

    expect(actual).toEqual([
      [
        {
          from: 'e2',
          to: 'e4',
          color: 'w',
          san: 'e4',
        },
        {
          from: 'e7',
          to: 'e6',
          color: 'b',
          san: 'e6',
        },
      ],
    ]);
  });

  test('Get History At Half Turn Index ', () => {
    const actual = FBH.getHistoryAtIndex(
      LONG_HISTORY_WITH_HALF_LAST_TURN,
      [1, 0]
    );

    expect(actual).toEqual([
      [
        {
          from: 'e2',
          to: 'e4',
          color: 'w',
          san: 'e4',
        },
        {
          from: 'e7',
          to: 'e6',
          color: 'b',
          san: 'e6',
        },
      ],
      [
        {
          from: 'd2',
          to: 'd4',
          color: 'w',
          san: 'd4',
        },
      ],
    ]);
  });

  test('Get History At Full Turn Index ', () => {
    const actual = FBH.getHistoryAtIndex(
      LONG_HISTORY_WITH_HALF_LAST_TURN,
      [1, 1]
    );

    expect(actual).toEqual([
      [
        {
          from: 'e2',
          to: 'e4',
          color: 'w',
          san: 'e4',
        },
        {
          from: 'e7',
          to: 'e6',
          color: 'b',
          san: 'e6',
        },
      ],
      [
        {
          from: 'd2',
          to: 'd4',
          color: 'w',
          san: 'd4',
        },
        {
          from: 'd7',
          to: 'd5',
          color: 'b',
          san: 'd5',
        },
      ],
    ]);
  });

  test('Get History At Longer than length Index', () => {
    const actual = FBH.getHistoryAtIndex(
      LONG_HISTORY_WITH_HALF_LAST_TURN,
      [19, 1]
    );

    expect(actual).toEqual(LONG_HISTORY_WITH_HALF_LAST_TURN);
  });

  describe('Recursively', () => {
    test('Get Hstory from first nested branch', () => {
      const nestedHistory = [
        [
          {
            from: 'd2',
            to: 'd4',
            san: 'd4',
            color: 'w',
            branchedHistories: [
              [
                [
                  {
                    isNonMove: true,
                    san: '...',
                    color: 'w',
                    // this: 'yess'
                  },
                  {
                    from: 'b7',
                    to: 'b5',
                    color: 'b',
                    san: 'b5',
                    branchedHistories: [
                      [
                        [
                          {
                            from: 'b2',
                            to: 'b4',
                            color: 'w',
                            san: 'b4',
                          },
                        ],
                      ],
                    ],
                  },
                ],
              ],
            ],
          },
          {
            from: 'd7',
            to: 'd5',
            san: 'd5',
            color: 'b',
          },
        ],
      ] satisfies FBHHistory;

      const actual = FBH.calculateLinearHistoryAtIndex(nestedHistory, [
        0,
        0,
        [[0, 1, [[0, 0]]]],
      ]);

      expect(actual).toEqual([
        {
          from: 'd2',
          to: 'd4',
          san: 'd4',
          color: 'w',
        },
        {
          from: 'b7',
          to: 'b5',
          color: 'b',
          san: 'b5',
        },
        {
          from: 'b2',
          to: 'b4',
          color: 'w',
          san: 'b4',
        },
      ]);
    });
  });
});

describe('Add Move', () => {
  test('adds a white move at the end of history', () => {
    const history = HISTORY_WITH_FULL_LAST_TURN;

    const newMove: FBHMove = {
      from: 'a2',
      to: 'a3',
      color: 'w',
      san: 'a3',
    };

    const actual = FBH.addMoveToChessHistory(history, newMove);

    const expectedHistory = [...history, [newMove]];
    const expectedIndex = [1, 0];
    const expected = [expectedHistory, expectedIndex];

    expect(actual).toEqual(expected);
  });

  test('adds a black move at the end of history', () => {
    const newMove: FBHBlackMove = {
      from: 'a7',
      to: 'a6',
      color: 'b',
      san: 'a6',
    };

    const actual = FBH.addMoveToChessHistory(
      HISTORY_WITH_HALF_LAST_TURN,
      newMove
    );

    const expectedHistory = [
      HISTORY_WITH_HALF_LAST_TURN[0],
      [
        {
          from: 'a2',
          to: 'a3',
          color: 'w',
          san: 'a3',
        },
        newMove,
      ],
    ];

    const expectedIndex = [1, 1];
    const expected = [expectedHistory, expectedIndex];

    expect(actual).toEqual(expected);
  });
});
