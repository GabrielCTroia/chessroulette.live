import { BlackColor, DetailedChessMove, WhiteColor } from '@xmatter/util-kit';

export type ChessHistoryBaseMove = DetailedChessMove;

export type ChessHistoryWhiteMove = ChessHistoryBaseMove & {
  color: WhiteColor;
};

export type ChessHistoryBlackMove = ChessHistoryBaseMove & {
  color: BlackColor;
};

export type ChessHistoryMove = ChessHistoryWhiteMove | ChessHistoryBlackMove;

export type ChessLinearHistory = ChessHistoryMove[];

export type ChessRecursiveBaseMove = {
  // Rename this to "branches"
  branchedHistories?: ChessRecursiveHistory[] | undefined;
};

export type ChessRecursiveWhiteMove = ChessHistoryWhiteMove &
  ChessRecursiveBaseMove;
export type ChessRecursiveBlackMove = ChessHistoryBlackMove &
  ChessRecursiveBaseMove;

export type ChessRecursiveMove =
  | ChessRecursiveWhiteMove
  | ChessRecursiveBlackMove;
export type ChessRecursiveHistory = ChessRecursiveMove[];

export type ChessLinearHistoryIndex = number;

export type ChessRecursiveHistoryIndex =
  | [
      moveIndex: number,
      branchIndex: number,
      branchedMoveIndex: ChessHistoryIndex | undefined
    ]
  | [moveIndex: number, branchIndex: number];

export type ChessHistoryIndex =
  | ChessLinearHistoryIndex
  | ChessRecursiveHistoryIndex;

export type PartialWhiteMove = [ChessRecursiveWhiteMove];
export type PartialBlackMove = [ChessRecursiveBlackMove];

export type PartialMove = [ChessRecursiveMove];

export type FullMove = [ChessRecursiveWhiteMove, ChessRecursiveBlackMove];

export type PairedMove = PartialMove | FullMove;
export type PairedHistory = PairedMove[];
