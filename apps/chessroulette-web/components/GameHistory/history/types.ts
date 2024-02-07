import {
  BlackColor,
  ChessColor,
  DetailedChessMove,
  WhiteColor,
} from '@xmatter/util-kit';

export type ChessHistoryBaseNonMove_NEW = {
  isNonMove: true;
  san: '...';
  color: ChessColor;
  from?: undefined;
  to?: undefined;
};

export type ChessHistoryBaseRealMove_NEW = {
  isNonMove?: false;
} & Pick<DetailedChessMove, 'from' | 'to' | 'color' | 'san'>; // TODO: This can expand later on

export type ChessHistoryBaseMove_NEW =
  | ChessHistoryBaseRealMove_NEW
  | ChessHistoryBaseNonMove_NEW;

export type ChessHistoryWhiteMove_NEW = ChessHistoryBaseMove_NEW & {
  color: WhiteColor;
};

export type ChessHistoryBlackMove_NEW = ChessHistoryBaseMove_NEW & {
  color: BlackColor;
};

// TODO: Needed?
export type ChessHistoryMove_NEW =
  | ChessHistoryWhiteMove_NEW
  | ChessHistoryBlackMove_NEW;

export type ChessRecursiveHistoryBaseMove_NEW = {
  branchedHistories?: ChessRecursiveHistory_NEW[];
};

export type ChessRecursiveHistoryWhiteMove_NEW =
  ChessRecursiveHistoryBaseMove_NEW & ChessHistoryWhiteMove_NEW;
export type ChessRecursiveHistoryBlackMove_NEW =
  ChessRecursiveHistoryBaseMove_NEW & ChessHistoryBlackMove_NEW;

export type ChessRecursiveHistoryMove_NEW =
  | ChessRecursiveHistoryWhiteMove_NEW
  | ChessRecursiveHistoryBlackMove_NEW;

export type ChessRecursiveHistoryHalfTurn_NEW = [
  whiteMove: ChessRecursiveHistoryWhiteMove_NEW
];
export type ChessRecursiveHistoryFullTurn_NEW = [
  whiteMove: ChessRecursiveHistoryWhiteMove_NEW,
  blackMove: ChessRecursiveHistoryBlackMove_NEW
];

export type ChessRecursiveHistoryTurn_NEW =
  | ChessRecursiveHistoryHalfTurn_NEW
  | ChessRecursiveHistoryFullTurn_NEW;

export type ChessRecursiveHistory_NEW =
  | ChessRecursiveHistoryFullTurn_NEW[]
  | [...ChessRecursiveHistoryFullTurn_NEW[], ChessRecursiveHistoryHalfTurn_NEW];

// export type ChessLinearHistoryIndex_NEW = [
//   turn: number,
//   move: 0 | 1,
//   branch: 0
// ]; // move: 0 = 'w', 1 = 'b'
// export type ChessRecursiveHistoryIndex_NEW =
//   | [
//       linearIndex: ChessLinearHistoryIndex_NEW,
//       branchIndex: number,
//       branchedLinearIndex?: ChessLinearHistoryIndex_NEW
//     ];

// export type ChessHistoryIndex_NEW =
//   | ChessLinearHistoryIndex_NEW
//   | ChessRecursiveHistoryIndex_NEW;

export type ChessHistoryTurn_NEW = ChessRecursiveHistoryTurn_NEW;
export type ChessHistory_NEW = ChessRecursiveHistory_NEW;

export type ChessLinearHistory_NEW = ChessHistoryMove_NEW[];

export type ChessHistoryIndexMovePosition_NEW = 0 | 1; // 0 = white, 1 = black

export type ChessHistoryRecursiveIndexes_NEW = [
  recursiveHistoryIndex: -1 | ChessRecursiveHistoryIndex_NEW, // '-1' = end of history
  paralelBranchesIndex?: number // Defaults to 0 (root), '-1' = apends?
];

export type ChessRecursiveHistoryIndex_NEW =
  | [
      turn: number, // 0, 1, 2, 3
      move: ChessHistoryIndexMovePosition_NEW,
      recursiveIndexes?: ChessHistoryRecursiveIndexes_NEW
    ];

export type ChessNonRecursiveHistoryIndex_NEW = [
  turn: number, // 0, 1, 2, 3
  move: ChessHistoryIndexMovePosition_NEW
];

export type ChessHistoryIndex_NEW = ChessRecursiveHistoryIndex_NEW;
// | [
//     turn: number, // 0, 1, 2, 3
//     move: 0 | 1,
//     // This is the index of the branch or the nested index
//     branchIndex: 0 // Defaults to Root Branch '0'
//   ]
// | [
//     turn: number, // 0, 1, 2, 3
//     move: 0 | 1,
//     branchIndex: number, // When bigger than 0
//     // This is the index of the branch or the nested index
//     branchRecursiveIndex: ChessHistoryIndex_NEW
//   ];
