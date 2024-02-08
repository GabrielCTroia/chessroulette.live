// import {
//   BRANCHED_HISTORY_1,
//   BRANCHED_HISTORY_2,
//   BRANCHED_HISTORY_3,
//   LONG_HISTORY_WITH_FULL_LAST_TURN,
//   LONG_HISTORY_WITH_PARALEL_HISTORIES,
//   PARALEL_BRANCHED_HISTORIES,
// } from './specUtils';
// import {
//   ChessHistoryIndex_NEW,
//   ChessHistoryMove_NEW,
//   ChessHistory_NEW,
//   ChessRecursiveHistoryFullTurn_NEW,
//   ChessRecursiveHistoryHalfTurn_NEW,
// } from './types';
// import {
//   addMoveToChessHistory,
//   decrementNestedHistoryIndex,
//   findMoveAtIndexRecursively,
//   getHistoryNonMoveWhite,
//   incrementHistoryIndex,
//   incrementNestedHistoryIndex,
//   renderHistoryIndex,
// } from './util';

// describe('Nested indexes', () => {
//   test('increment one generation nested index', () => {
//     const index: ChessHistoryIndex_NEW = [0, 0, [[0, 1], 0]];
//     const actual = incrementNestedHistoryIndex(index);

//     expect(actual).toEqual([0, 0, [[1, 0], 0]]);
//   });

//   test('increment multi generatation nested index', () => {
//     const index: ChessHistoryIndex_NEW = [
//       0,
//       0,
//       [[0, 1, [[2, 0, [[5, 1], 0]], 2]], 0],
//     ];
//     const actual = incrementNestedHistoryIndex(index);

//     expect(actual).toEqual([0, 0, [[0, 1, [[2, 0, [[6, 0], 0]], 2]], 0]]);
//   });

//   test('decrement one generation nested index', () => {
//     const index: ChessHistoryIndex_NEW = [0, 0, [[0, 1], 0]];
//     const actual = decrementNestedHistoryIndex(index);

//     expect(actual).toEqual([0, 0, [[0, 0], 0]]);
//   });

//   test('decrement multi generatation nested index', () => {
//     const index: ChessHistoryIndex_NEW = [
//       0,
//       0,
//       [[0, 1, [[2, 0, [[5, 1], 0]], 2]], 0],
//     ];
//     const actual = decrementNestedHistoryIndex(index);

//     expect(actual).toEqual([0, 0, [[0, 1, [[2, 0, [[5, 0], 0]], 2]], 0]]);
//   });

//   test('when decrementing hits -1 jump to the root history', () => {
//     const index: ChessHistoryIndex_NEW = [
//       0,
//       0,
//       [[0, 1, [[2, 0, [[0, 0], 0]], 2]], 0],
//     ];
//     const actual = decrementNestedHistoryIndex(index);

//     expect(actual).toEqual([0, 0, [[0, 1, [[2, 0], 2]], 0]]);
//   });

//   test('when all generations hit -1 jump to the each root history', () => {
//     const index: ChessHistoryIndex_NEW = [0, 1, [[0, 0, [[0, 0, [[0, 0]]]]]]];
//     const actual = decrementNestedHistoryIndex(index);
//     const expected = [0, 1, [[0, 0, [[0, 0]]]]] satisfies ChessHistoryIndex_NEW;

//     expect(actual).toEqual(expected);
//   });
// });

// describe('Add Nested Move', () => {
//   test('adds a first branched history (Black Move) to a Half turn (White Move)', () => {
//     const move: ChessHistoryMove_NEW = {
//       from: 'f7',
//       to: 'f6',
//       color: 'b',
//       san: 'f6',
//     };

//     const actual = addMoveToChessHistory(
//       LONG_HISTORY_WITH_FULL_LAST_TURN,
//       move,
//       [1, 0]
//     );

//     // console.log('actual', JSON.stringify(actual[1], null, 2));

//     const expectedTurn: ChessRecursiveHistoryFullTurn_NEW = [
//       getHistoryNonMoveWhite(),
//       move,
//     ];
//     const expectedHistory = [
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           color: 'w',
//           san: 'd4',
//           branchedHistories: [[expectedTurn]],
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           color: 'b',
//           san: 'd5',
//         },
//       ],
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
//     ] as ChessHistory_NEW;
//     const expectedIndex: ChessHistoryIndex_NEW = [1, 0, [[0, 1], 0]];
//     const expected = [expectedHistory, expectedIndex];

//     // console.log('expected', JSON.stringify(expected, null, 2));

//     expect(actual).toEqual(expected);
//   });

//   test('adds a first branched history (white move) to a Full turn (black move)', () => {
//     const move: ChessHistoryMove_NEW = {
//       from: 'f2',
//       to: 'f3',
//       color: 'w',
//       san: 'f3',
//     };

//     const actual = addMoveToChessHistory(
//       LONG_HISTORY_WITH_FULL_LAST_TURN,
//       move,
//       [1, 1]
//     );

//     // console.log('actual', JSON.stringify(actual, null, 2));

//     const expectedTurn: ChessRecursiveHistoryHalfTurn_NEW = [move];
//     const expectedHistory = [
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           color: 'w',
//           san: 'd4',
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           color: 'b',
//           san: 'd5',
//           branchedHistories: [[expectedTurn]],
//         },
//       ],
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
//     ] as ChessHistory_NEW;
//     const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[0, 0], 0]];
//     const expected = [expectedHistory, expectedIndex];

//     // console.log('expected', JSON.stringify(expected, null, 2));

//     expect(actual).toEqual(expected);
//   });

//   test('adds a continous move to an existent first branched history with FULL TURN', () => {
//     const branchedHistory: ChessHistory_NEW = BRANCHED_HISTORY_2;
//     const historyWithBranches = [
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           color: 'w',
//           san: 'd4',
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           color: 'b',
//           san: 'd5',
//           branchedHistories: [branchedHistory],
//         },
//       ],
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
//     ] as ChessHistory_NEW;

//     const move: ChessHistoryMove_NEW = {
//       color: 'w',
//       from: 'h2',
//       to: 'h3',
//       san: 'h2',
//     };

//     const actual = addMoveToChessHistory(historyWithBranches, move, [
//       1,
//       1,
//       [-1], // [-1] is same as [-1, 0], meaning: -1 = append to the end of the history branch, 0 = implicit first history branch
//     ]);

//     // console.log('actual', JSON.stringify(actual, null, 2));

//     const expectedTurn: ChessRecursiveHistoryHalfTurn_NEW = [move];
//     const expectedHistory = [
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           color: 'w',
//           san: 'd4',
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           color: 'b',
//           san: 'd5',
//           branchedHistories: [[...branchedHistory, expectedTurn]],
//         },
//       ],
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
//     ] as ChessHistory_NEW;
//     const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[1, 0], 0]];
//     const expected = [expectedHistory, expectedIndex];

//     // console.log('expected', JSON.stringify(expected, null, 2));

//     expect(actual).toEqual(expected);
//   });

//   test('adds a continous white move to an existent branch in between paralel histories', () => {
//     const move: ChessHistoryMove_NEW = {
//       color: 'w',
//       from: 'h2',
//       to: 'h3',
//       san: 'h2',
//     };

//     const actual = addMoveToChessHistory(
//       LONG_HISTORY_WITH_PARALEL_HISTORIES,
//       move,
//       [
//         1,
//         1,
//         [-1, 1], // [-1] is same as [-1, 0], meaning: -1 = append to the end of the history branch, 0 = implicit first history branch
//       ]
//     );

//     const expectedTurn: ChessRecursiveHistoryHalfTurn_NEW = [move];
//     const expectedHistory = [
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           san: 'd4',
//           color: 'w',
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           san: 'd5',
//           color: 'b',
//           branchedHistories: [
//             BRANCHED_HISTORY_1,
//             [...BRANCHED_HISTORY_2, expectedTurn],
//             BRANCHED_HISTORY_3,
//           ],
//         },
//       ],
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
//     ] as ChessHistory_NEW;
//     const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[1, 0], 1]];
//     const expected = [expectedHistory, expectedIndex];

//     expect(actual).toEqual(expected);
//   });

//   test('adds a continous black move to an existent branch in a list of paralel histories', () => {
//     const move: ChessHistoryMove_NEW = {
//       color: 'b',
//       from: 'h7',
//       san: 'h7',
//       to: 'h5',
//     };

//     const actual = addMoveToChessHistory(
//       LONG_HISTORY_WITH_PARALEL_HISTORIES,
//       move,
//       [
//         1,
//         1,
//         [-1, 0], // [-1] is same as [-1, 0], meaning: -1 = append to the end of the history branch, 0 = implicit first history branch
//       ]
//     );

//     const expectedTurn: ChessRecursiveHistoryFullTurn_NEW = [
//       PARALEL_BRANCHED_HISTORIES[0][1][0],
//       move,
//     ];
//     const expectedHistory = [
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           san: 'd4',
//           color: 'w',
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           san: 'd5',
//           color: 'b',
//           branchedHistories: [
//             [...BRANCHED_HISTORY_1.slice(0, 1), expectedTurn],
//             BRANCHED_HISTORY_2,
//             BRANCHED_HISTORY_3,
//           ],
//         },
//       ],
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
//     ] as ChessHistory_NEW;
//     const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[1, 1], 0]];
//     const expected = [expectedHistory, expectedIndex];

//     expect(actual).toEqual(expected);
//   });

//   test('starts a parallel branched history', () => {
//     const branchedHistory: ChessHistory_NEW = BRANCHED_HISTORY_1;
//     const historyWithBranches = [
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           san: 'd4',
//           color: 'w',
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           san: 'd5',
//           color: 'b',
//           branchedHistories: [branchedHistory],
//         },
//       ],
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
//     ] as ChessHistory_NEW;

//     const move: ChessHistoryMove_NEW = {
//       color: 'w',
//       from: 'f2',
//       san: 'f2',
//       to: 'f4',
//     };

//     const actual = addMoveToChessHistory(historyWithBranches, move, [1, 1]);

//     const expectedTurn: ChessRecursiveHistoryHalfTurn_NEW = [move];
//     const expectedNewBranchedHistory: ChessHistory_NEW = [expectedTurn];
//     const expectedHistory = [
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           san: 'd4',
//           color: 'w',
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           san: 'd5',
//           color: 'b',
//           branchedHistories: [branchedHistory, expectedNewBranchedHistory],
//         },
//       ],
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
//     ] as ChessHistory_NEW;
//     const expectedIndex: ChessHistoryIndex_NEW = [1, 1, [[0, 0], 1]];
//     const expected = [expectedHistory, expectedIndex];

//     expect(actual).toEqual(expected);
//   });
// });

// describe('Multi level nested histories', () => {
//   test('Adds multiple moves to nested branches ', () => {
//     const move1: ChessHistoryMove_NEW = {
//       color: 'b',
//       from: 'h7',
//       to: 'h5',
//       san: 'h5',
//     };

//     // Added black move to branched history
//     const afterMove1 = addMoveToChessHistory(
//       LONG_HISTORY_WITH_PARALEL_HISTORIES,
//       move1,
//       [
//         1,
//         1,
//         [[0, 1], 1], // [-1] is same as [-1, 0], meaning: -1 = append to the end of the history branch, 0 = implicit first history branch
//       ]
//     );

//     // console.log('move 1 actual', JSON.stringify(afterMove1, null, 2));

//     const [addedMove1History, addedMove1AtIndex] = afterMove1;

//     const move2: ChessHistoryMove_NEW = {
//       color: 'w',
//       from: 'h2',
//       to: 'h4',
//       san: 'h4',
//     };

//     const actual = addMoveToChessHistory(
//       addedMove1History,
//       move2,
//       addedMove1AtIndex
//     );

//     const expectedHistory = [
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           san: 'd4',
//           color: 'w',
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           san: 'd5',
//           color: 'b',
//           branchedHistories: [
//             // [...BRANCHED_HISTORY_1.slice(0, 1), expectedTurn],
//             BRANCHED_HISTORY_1,
//             [
//               [
//                 BRANCHED_HISTORY_2[0][0],
//                 {
//                   ...BRANCHED_HISTORY_2[0][1],
//                   branchedHistories: [
//                     [
//                       [
//                         getHistoryNonMoveWhite(),
//                         {
//                           ...move1,
//                           branchedHistories: [[[move2]]],
//                         },
//                       ],
//                     ],
//                   ],
//                 },
//               ],
//             ],
//             BRANCHED_HISTORY_3,
//           ],
//         },
//       ],
//       ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
//     ] as ChessHistory_NEW;
//     const expectedIndex: ChessHistoryIndex_NEW = [
//       1,
//       1,
//       [[0, 1, [[0, 1, [[0, 0], 0]], 0]], 1],
//     ];
//     const expected = [expectedHistory, expectedIndex];

//     // console.log('expected', JSON.stringify(expected, null, 2));

//     expect(actual).toEqual(expected);
//   });
// });

// describe('Find Move At Index Recursively', () => {
//   test('finds the correct nested Move', () => {
//     const nestedHistory = [
//       [
//         {
//           from: 'd2',
//           to: 'd4',
//           san: 'd4',
//           color: 'w',
//           branchedHistories: [
//             [
//               [
//                 {
//                   isNonMove: true,
//                   san: '...',
//                   color: 'w',
//                 },
//                 {
//                   from: 'b7',
//                   to: 'b5',
//                   color: 'b',
//                   san: 'b5',
//                   branchedHistories: [
//                     [
//                       [
//                         {
//                           from: 'b2',
//                           to: 'b4',
//                           color: 'w',
//                           san: 'b4',
//                         },
//                       ],
//                     ],
//                   ],
//                 },
//               ],
//             ],
//           ],
//         },
//         {
//           from: 'd7',
//           to: 'd5',
//           san: 'd5',
//           color: 'b',
//         },
//       ],
//     ] as ChessHistory_NEW;

//     const actual = findMoveAtIndexRecursively(nestedHistory, [
//       0,
//       0,
//       [[0, 1, [[0, 0]]]], // should be b7
//     ]);

//     expect(actual).toEqual({
//       from: 'b2',
//       to: 'b4',
//       color: 'w',
//       san: 'b4',
//     });
//   });
// });

// // Describe multi gen nested
