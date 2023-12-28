import {
  ChessColor,
  ChessFEN,
  ChessFENBoard,
  ChessMove,
  ChessPGN,
  DetailedChessMove,
} from '@xmatter/util-kit';
import {
  addMoveToChessHistoryAtNextAvailableIndex,
  getChessHistoryAtIndex,
  pgnToHistory,
} from 'apps/chessroulette-web/components/GameHistory/lib';
import {
  ChessHistoryIndex,
  ChessRecursiveHistory,
  ChessRecursiveMove,
} from 'apps/chessroulette-web/components/GameHistory/types';
import { getNewChessGame, isValidPgn } from 'apps/chessroulette-web/lib/chess';
import { Color } from 'chessterrain-react';

import { Action } from 'movex-core-util';
import { fenBoardPieceSymbolToDetailedChessPiece } from 'util-kit/src/lib/ChessFENBoard/chessUtils';

// type ParticipantId = string;

// type ChessRecursiveHistoryWithFen = (ChessRecursiveMove & { fen: ChessFEN })[];

export type LearnActivityState = {
  activityType: 'learn';
  activityState: {
    fen: ChessFEN;
    boardOrientation: Color;
    history: {
      // moves: ChessRecursiveHistoryWithFen;
      startingFen: ChessFEN;
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

export type ActivityActions =
  | Action<'dropPiece', ChessMove>
  | Action<'importPgn', ChessPGN>
  | Action<
      'focusHistoryIndex',
      {
        index: ChessHistoryIndex;
      }
    >
  | Action<'changeBoardOrientation', Color>;

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
          console.error('Err', instance.board);
          throw new Error(`No Piece at ${from}`);
        }

        // const { color, piece } =
        //   fenBoardPieceSymbolToDetailedChessPiece(fenPiece);

        const nextMove = instance.move(from, to);

        // const nextMove: DetailedChessMove = {
        //   from: from,
        //   to: to,
        //   san: `${piece === 'p' ? '' : piece}${to}`,
        //   color: color,
        //   piece: piece,
        // };

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
            boardOrientation: 'white',
            fen: instance.fen,
            history: {
              ...prev.activityState.history,
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
    } else if (action.type === 'importPgn') {
      if (!isValidPgn(action.payload)) {
        return prev;
      }

      const instance = getNewChessGame({
        pgn: action.payload,
      });

      const nextHistoryMovex = pgnToHistory(action.payload);

      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          fen: instance.fen(),
          history: {
            startingFen: ChessFENBoard.STARTING_FEN,
            moves: nextHistoryMovex,
            focusedIndex: nextHistoryMovex.length - 1,
          },
        },
      };
    } else if (action.type === 'focusHistoryIndex') {
      const historyAtFocusedIndex = getChessHistoryAtIndex(
        prev.activityState.history.moves,
        action.payload.index
      );

      const instance = new ChessFENBoard(
        prev.activityState.history.startingFen
      );

      historyAtFocusedIndex.forEach((m) => {
        instance.move(m.from, m.to);
      });

      const nextFen = instance.fen;

      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          fen: nextFen,
          history: {
            ...prev.activityState.history,
            focusedIndex: action.payload.index,
          },
        },
      };

      // const fenPiece = instance.piece(from);
    }

    if (action.type === 'changeBoardOrientation') {
      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          boardOrientation: action.payload,
        },
      };
    }
  }

  return prev;
};
