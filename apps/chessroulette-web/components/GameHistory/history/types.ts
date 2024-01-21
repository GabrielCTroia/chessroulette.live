import { BlackColor, DetailedChessMove, WhiteColor } from '@xmatter/util-kit';

export type ChessHistoryBaseNonMove_NEW = {
  isNonMove: true;
  san: '...';
  from?: undefined;
  to?: undefined;
};

export type ChessHistoryBaseRealMove_NEW = {
  isNonMove?: false;
} & Pick<DetailedChessMove, 'from' | 'to'>; // TODO: This can expand later on

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
  histories?: ChessRecursiveHistory_NEW[];
};

export type ChessRecursiveHistoryWhiteMove = ChessRecursiveHistoryBaseMove_NEW &
  ChessHistoryWhiteMove_NEW;
export type ChessRecursiveHistoryBlackMove = ChessRecursiveHistoryBaseMove_NEW &
  ChessHistoryBlackMove_NEW;

export type ChessRecursiveHistoryHalfTurn_NEW = [
  whiteMove: ChessRecursiveHistoryWhiteMove
];
export type ChessRecursiveHistoryFullTurn_NEW = [
  whiteMove: ChessRecursiveHistoryWhiteMove,
  blackMove: ChessRecursiveHistoryBlackMove
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

export type ChessHistory_NEW = ChessRecursiveHistory_NEW;

export type ChessHistoryIndex_NEW =
  | [
      turn: number, // 0, 1, 2, 3
      move: 0 | 1,
      branches?: ChessHistoryIndex_NEW[]
    ];
