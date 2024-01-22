import { LONG_HISTORY_WITH_FULL_LAST_TURN } from './specUtils';
import {
  ChessHistoryIndex_NEW,
  ChessHistoryMove_NEW,
  ChessHistory_NEW,
  ChessRecursiveHistoryFullTurn_NEW,
  ChessRecursiveHistoryHalfTurn_NEW,
} from './types';
import { addMoveToChessHistory, getHistoryNonMoveWhite } from './util';

describe('Add Nested Move', () => {
  test('adds a first branched history (Black Move) to a Half turn (White Move)', () => {
    const move: ChessHistoryMove_NEW = {
      from: 'f7',
      to: 'f6',
      color: 'b',
    };

    const actual = addMoveToChessHistory(
      LONG_HISTORY_WITH_FULL_LAST_TURN,
      move,
      [1, 0]
    );

    // console.log('actual', JSON.stringify(actual[1], null, 2));

    const expectedTurn: ChessRecursiveHistoryFullTurn_NEW = [
      getHistoryNonMoveWhite(),
      move,
    ];
    const expectedHistory = [
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
      [
        {
          from: 'd2',
          to: 'd4',
          color: 'w',
          branchedHistories: [[expectedTurn]],
        },
        {
          from: 'd7',
          to: 'd5',
          color: 'b',
        },
      ],
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
    ] as ChessHistory_NEW;
    const expectedIndex: ChessHistoryIndex_NEW = [1, 0, [[0, 1], 0]];
    const expected = [expectedHistory, expectedIndex];

    // console.log('expected', JSON.stringify(expected, null, 2));

    expect(actual).toEqual(expected);
  });

  test('adds a first branched history (white move) to a Full turn (black move)', () => {
    const move: ChessHistoryMove_NEW = {
      from: 'f2',
      to: 'f3',
      color: 'w',
    };

    const actual = addMoveToChessHistory(
      LONG_HISTORY_WITH_FULL_LAST_TURN,
      move,
      [1, 1]
    );

    // console.log('actual', JSON.stringify(actual, null, 2));

    const expectedTurn: ChessRecursiveHistoryHalfTurn_NEW = [move];
    const expectedHistory = [
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
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
          branchedHistories: [[expectedTurn]],
        },
      ],
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
    ] as ChessHistory_NEW;
    const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[0, 0], 0]];
    const expected = [expectedHistory, expectedIndex];

    // console.log('expected', JSON.stringify(expected, null, 2));

    expect(actual).toEqual(expected);
  });

  test('adds a continous move to an existent first branched history', () => {
    const branchedHistory: ChessHistory_NEW = [
      [
        {
          from: 'f2',
          to: 'f3',
          color: 'w',
        },
        {
          from: 'f7',
          to: 'f5',
          color: 'b',
        },
      ],
    ];
    const historyWithBranches = [
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
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
          branchedHistories: [branchedHistory],
        },
      ],
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
    ] as ChessHistory_NEW;

    const move: ChessHistoryMove_NEW = {
      color: 'w',
      from: 'h2',
      to: 'h3',
    };

    const actual = addMoveToChessHistory(historyWithBranches, move, [
      1,
      1,
      [-1], // [-1] is same as [-1, 0], meaning: -1 = append to the end of the history branch, 0 = implicit first history branch
    ]);

    // console.log('actual', JSON.stringify(actual, null, 2));

    const expectedTurn: ChessRecursiveHistoryHalfTurn_NEW = [move];
    const expectedHistory = [
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
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
          branchedHistories: [[...branchedHistory, expectedTurn]],
        },
      ],
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
    ] as ChessHistory_NEW;
    const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[1, 0], 0]];
    const expected = [expectedHistory, expectedIndex];

    // console.log('expected', JSON.stringify(expected, null, 2));

    expect(actual).toEqual(expected);
  });

  test('starts a parallel branched history', () => {
    const branchedHistory: ChessHistory_NEW = [
      [
        {
          from: 'f2',
          to: 'f3',
          color: 'w',
        },
        {
          from: 'f7',
          to: 'f5',
          color: 'b',
        },
      ],
    ];
    const historyWithBranches = [
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
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
          branchedHistories: [branchedHistory],
        },
      ],
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
    ] as ChessHistory_NEW;

    const move: ChessHistoryMove_NEW = {
      color: 'w',
      from: 'f2',
      to: 'f4',
    };

    const actual = addMoveToChessHistory(historyWithBranches, move, [1, 1]);

    // console.log('actual', JSON.stringify(actual, null, 2));

    const expectedTurn: ChessRecursiveHistoryHalfTurn_NEW = [move];
    const expectedNewBranchedHistory: ChessHistory_NEW = [expectedTurn];
    const expectedHistory = [
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
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
          branchedHistories: [branchedHistory, expectedNewBranchedHistory],
        },
      ],
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
    ] as ChessHistory_NEW;
    const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[0, 0], 1]];
    const expected = [expectedHistory, expectedIndex];

    // console.log('expected', JSON.stringify(expected, null, 2));

    expect(actual).toEqual(expected);
  });
});

// Describe multi gen nested
