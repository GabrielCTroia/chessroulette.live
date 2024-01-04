import {
  ChessFEN,
  ChessFENBoard,
  ChessMove,
  ChessPGN,
} from '@xmatter/util-kit';
import {
  addMoveToChessHistoryAtNextAvailableIndex,
  getChessHistoryAtIndex,
  pgnToHistory,
} from 'apps/chessroulette-web/components/GameHistory/lib';
import {
  ChessHistoryIndex,
  ChessRecursiveHistory,
} from 'apps/chessroulette-web/components/GameHistory/types';
import { getNewChessGame, isValidPgn } from 'apps/chessroulette-web/lib/chess';
import { Color } from 'chessterrain-react';
import { Action } from 'movex-core-util';
import { Arrow, Square } from 'react-chessboard/dist/chessboard/types';
import {
  FenBoardPromotionalPieceSymbol,
  pieceSanToFenBoardPieceSymbol,
} from 'util-kit/src/lib/ChessFENBoard/chessUtils';

// type ParticipantId = string;

// type ChessRecursiveHistoryWithFen = (ChessRecursiveMove & { fen: ChessFEN })[];

export type LearnActivityState = {
  activityType: 'learn';
  activityState: {
    fen: ChessFEN;
    boardOrientation: Color;
    arrows: Arrow[];
    circle?: Square;
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

export const initialLearnActivityState: LearnActivityState = {
  activityType: 'learn',
  activityState: {
    boardOrientation: 'white',
    fen: ChessFENBoard.STARTING_FEN,
    arrows: [],
    circle: undefined,
    history: {
      startingFen: ChessFENBoard.STARTING_FEN,
      moves: [],
      focusedIndex: -1,
    },
  },
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
  | Action<'changeBoardOrientation', Color>
  | Action<'arrowChange', Arrow[]>
  | Action<'drawCircle', { square: Square }>
  | Action<'clearCircle'>;

// PART 3: The Reducer – This is where all the logic happens

export default (
  prev: ActivityState = initialActivtityState,
  action: ActivityActions
): ActivityState => {
  if (prev.activityType === 'learn') {
    // TODO: Should this be split?

    if (action.type === 'dropPiece') {
      try {
        const { from, to, promoteTo } = action.payload;

        console.log('passes', action);

        const instance = new ChessFENBoard(prev.activityState.fen);
        const fenPiece = instance.piece(from);

        if (!fenPiece) {
          console.error('Err', instance.board);
          throw new Error(`No Piece at ${from}`);
        }

        console.log('HERE', action);

        // const { color, piece } =
        //   fenBoardPieceSymbolToDetailedChessPiece(fenPiece);

        const promoteToFenBoardPiecesymbol:
          | FenBoardPromotionalPieceSymbol
          | undefined = promoteTo
          ? (pieceSanToFenBoardPieceSymbol(
              promoteTo
            ) as FenBoardPromotionalPieceSymbol)
          : undefined;

        const nextMove = instance.move(from, to, promoteToFenBoardPiecesymbol);

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

        console.log('next history', nextHistory, nextHistory.length);
        console.log('addedAtIndex', addedAtIndex);

        return {
          ...prev,
          activityState: {
            ...prev.activityState,
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
        console.error('failed', e);

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
          circle: undefined,
          arrows: [],
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

    if (action.type === 'arrowChange') {
      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          arrows: action.payload,
        },
      };
    }

    if (action.type === 'drawCircle') {
      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          circle: action.payload.square,
        },
      };
    }

    if (action.type === 'clearCircle') {
      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          circle: undefined,
        },
      };
    }
  }

  return prev;
};
