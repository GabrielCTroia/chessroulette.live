import {
  ChessFEN,
  ChessFENBoard,
  ChessMove,
  DetailedChessMove,
} from '@xmatter/util-kit';
import { addMoveToChessHistoryAtNextAvailableIndex } from 'apps/chessroulette-web/components/GameHistory/lib';
import {
  ChessHistoryIndex,
  ChessRecursiveHistory,
} from 'apps/chessroulette-web/components/GameHistory/types';

import { Action } from 'movex-core-util';
import { fenBoardPieceSymbolToDetailedChessPiece } from 'util-kit/src/lib/ChessFENBoard/chessUtils';

// type ParticipantId = string;

export type LearnActivityState = {
  activityType: 'learn';
  activityState: {
    fen: ChessFEN;
    history: {
      moves: ChessRecursiveHistory;
      focusedIndex: ChessHistoryIndex;
    };
  };
};

export type OtherActivities = {
  activityType: 'play' | 'meetup' | 'none';
  activityState: {};
};

export type ActivityState = LearnActivityState | OtherActivities;

export const initialActivtityState: ActivityState = {
  activityType: 'none',
  activityState: {},
};

// PART 2: Action Types

export type ActivityActions = Action<'dropPiece', ChessMove>;

// PART 3: The Reducer – This is where all the logic happens

export default (
  prev: ActivityState = initialActivtityState,
  action: ActivityActions
): ActivityState => {
  if (prev.activityType === 'learn') {
    // TODO: Should this be split?

    if (action.type === 'dropPiece') {
      try {
        const { from, to } = action.payload;

        const instance = new ChessFENBoard(prev.activityState.fen);
        const fenPiece = instance.piece(from);

        if (!fenPiece) {
          throw new Error(`No Piece at ${from}`);
        }

        const { color, piece } =
          fenBoardPieceSymbolToDetailedChessPiece(fenPiece);

        instance.move(from, to);

        const nextMove: DetailedChessMove = {
          from: from,
          to: to,
          san: `${from}${to}`,
          color: color,
          piece: piece,
        };

        // const addAtIndex = atIndex !== undefined ? atIndex : prev.history.length;
        const [nextHistory, addedAtIndex] =
          addMoveToChessHistoryAtNextAvailableIndex(
            prev.activityState.history.moves,
            prev.activityState.history.moves.length,
            nextMove
          );

        return {
          ...prev,
          activityState: {
            fen: instance.fen,
            history: {
              moves: nextHistory,
              focusedIndex: addedAtIndex,
            },
            // moveHistory: ,
            // focusedIndex:
          },
        };
      } catch (e) {
        console.warn('failed', e);

        return prev;
      }
    }
  }

  return prev;
};
