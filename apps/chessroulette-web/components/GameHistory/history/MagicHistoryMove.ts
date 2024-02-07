import { ChessColor } from '@xmatter/util-kit';
import {
  ChessHistory_NEW,
  ChessRecursiveHistoryFullTurn_NEW,
  ChessRecursiveHistoryHalfTurn_NEW,
  ChessRecursiveHistoryMove_NEW,
} from './types';
import { Square } from 'chess.js';

export interface MagicHistoryMove {
  color: ChessColor;
  isNonMove: boolean;
  from?: Square;
  to?: Square;

  // constructor(color: ChessColor) {}

  prev(): MagicHistoryMove | undefined;

  next(): MagicHistoryMove | undefined;

  export(): ChessRecursiveHistoryMove_NEW;
}

export interface MagicHistoryTurn {
  type: 'full' | 'half'; // f = full, h = half

  // constructor(
  //   p:
  //     | {
  //         whiteMove: MagicHistoryMove; // TODO: per color
  //         blackMove: MagicHistoryMove; // TODO: per color
  //       }
  //     | {
  //         whiteMove: MagicHistoryMove; // TODO: per color
  //         blackMove?: undefined;
  //       }
  //     | {
  //         whiteMove?: undefined; // TODO: per color
  //         blackMove: MagicHistoryMove; // TODO: per color
  //       }
  // ) {}

  export():
    | ChessRecursiveHistoryHalfTurn_NEW
    | ChessRecursiveHistoryFullTurn_NEW;
}

export interface MagicHistory {
  export(): ChessHistory_NEW;
}
