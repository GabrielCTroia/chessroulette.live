import {
  BRANCHED_HISTORY_1,
  BRANCHED_HISTORY_2,
  BRANCHED_HISTORY_3,
  LONG_HISTORY_WITH_FULL_LAST_TURN,
  LONG_HISTORY_WITH_PARALEL_HISTORIES,
  PARALEL_BRANCHED_HISTORIES,
} from './specUtils';
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

  test('adds a continous move to an existent first branched history with FULL TURN', () => {
    const branchedHistory: ChessHistory_NEW = BRANCHED_HISTORY_2;
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

  test('adds a continous white move to an existent branch in between paralel histories', () => {
    const move: ChessHistoryMove_NEW = {
      color: 'w',
      from: 'h2',
      to: 'h3',
    };

    const actual = addMoveToChessHistory(
      LONG_HISTORY_WITH_PARALEL_HISTORIES,
      move,
      [
        1,
        1,
        [-1, 1], // [-1] is same as [-1, 0], meaning: -1 = append to the end of the history branch, 0 = implicit first history branch
      ]
    );

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
          branchedHistories: [
            BRANCHED_HISTORY_1,
            [...BRANCHED_HISTORY_2, expectedTurn],
            BRANCHED_HISTORY_3,
          ],
        },
      ],
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
    ] as ChessHistory_NEW;
    const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[1, 0], 1]];
    const expected = [expectedHistory, expectedIndex];

    expect(actual).toEqual(expected);
  });

  test('adds a continous black move to an existent branch in a list of paralel histories', () => {
    const move: ChessHistoryMove_NEW = {
      color: 'b',
      from: 'h7',
      to: 'h5',
    };

    const actual = addMoveToChessHistory(
      LONG_HISTORY_WITH_PARALEL_HISTORIES,
      move,
      [
        1,
        1,
        [-1, 0], // [-1] is same as [-1, 0], meaning: -1 = append to the end of the history branch, 0 = implicit first history branch
      ]
    );

    const expectedTurn: ChessRecursiveHistoryFullTurn_NEW = [
      PARALEL_BRANCHED_HISTORIES[0][1][0],
      move,
    ];
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
          branchedHistories: [
            [...BRANCHED_HISTORY_1.slice(0, 1), expectedTurn],
            BRANCHED_HISTORY_2,
            BRANCHED_HISTORY_3,
          ],
        },
      ],
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
    ] as ChessHistory_NEW;
    const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[1, 1], 0]];
    const expected = [expectedHistory, expectedIndex];

    expect(actual).toEqual(expected);
  });

  test('starts a parallel branched history', () => {
    const branchedHistory: ChessHistory_NEW = BRANCHED_HISTORY_1;
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

    expect(actual).toEqual(expected);
  });
});

describe('Multi level nested histories', () => {
  test('Adds multiple moves to nested branches ', () => {
    const move1: ChessHistoryMove_NEW = {
      color: 'b',
      from: 'h7',
      to: 'h5',
    };

    // Added black move to branched history
    const afterMove1 = addMoveToChessHistory(
      LONG_HISTORY_WITH_PARALEL_HISTORIES,
      move1,
      [
        1,
        1,
        [[0, 1], 1], // [-1] is same as [-1, 0], meaning: -1 = append to the end of the history branch, 0 = implicit first history branch
      ]
    );

    // console.log('move 1 actual', JSON.stringify(afterMove1, null, 2));

    const [addedMove1History, addedMove1AtIndex] = afterMove1;

    const move2: ChessHistoryMove_NEW = {
      color: 'w',
      from: 'h2',
      to: 'h4',
    };

    const actual = addMoveToChessHistory(
      addedMove1History,
      move2,
      addedMove1AtIndex
    );

    // console.log('actual', JSON.stringify(actual, null, 2));

    // const expectedTurn: ChessRecursiveHistoryFullTurn_NEW = [
    //   BRANCHED_HISTORY_2[0],
    //   {
    //     ...move1,
    //     branchedHistories: [[[move2]]],
    //   },
    // ];
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
          branchedHistories: [
            // [...BRANCHED_HISTORY_1.slice(0, 1), expectedTurn],
            BRANCHED_HISTORY_1,
            [
              [
                BRANCHED_HISTORY_2[0][0],
                {
                  ...BRANCHED_HISTORY_2[0][1],
                  branchedHistories: [
                    [
                      [
                        getHistoryNonMoveWhite(),
                        {
                          ...move1,
                          branchedHistories: [[[move2]]],
                        },
                      ],
                    ],
                  ],
                },
              ],
            ],
            BRANCHED_HISTORY_3,
          ],
        },
      ],
      ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
    ] as ChessHistory_NEW;
    const expectedIndex: ChessHistoryIndex_NEW = [
      1,
      1,
      [[0, 1, [[0, 1, [[0, 0], 0]], 0]], 1],
    ];
    const expected = [expectedHistory, expectedIndex];

    // console.log('expected', JSON.stringify(expected, null, 2));

    expect(actual).toEqual(expected);
  });
});

// Describe multi gen nested
