import {
  ChessArrowId,
  ChessFEN,
  ChessFENBoard,
  ChessMove,
  ChessPGN,
  ChesscircleId,
  FenBoardPromotionalPieceSymbol,
  getNewChessGame,
  isValidPgn,
  pieceSanToFenBoardPieceSymbol,
} from '@xmatter/util-kit';
import {
  addMoveToChessHistory,
  decrementChessHistoryIndex,
  getChessHistoryAtIndex,
  pgnToHistory,
} from 'apps/chessroulette-web/components/GameHistory/lib';
import {
  ChessHistoryIndex,
  ChessRecursiveHistory,
} from 'apps/chessroulette-web/components/GameHistory/types';
import { Color } from 'chessterrain-react';
import { Action } from 'movex-core-util';
import { Square } from 'react-chessboard/dist/chessboard/types';

// type ParticipantId = string;

// type ChessRecursiveHistoryWithFen = (ChessRecursiveMove & { fen: ChessFEN })[];

export type ArrowDrawTuple = [from: Square, to: Square, hex?: string];
export type ArrowsMap = Record<ChessArrowId, ArrowDrawTuple>;

export type CircleDrawTuple = [at: Square, hex: string];
export type CirclesMap = Record<ChesscircleId, CircleDrawTuple>;

export type SquareMap = Record<Square, undefined>;

export type LearnActivityState = {
  activityType: 'learn';
  activityState: {
    fen: ChessFEN;
    boardOrientation: Color;
    arrows: ArrowsMap;
    circles: CirclesMap;
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
    arrows: {},
    circles: {},
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
  | Action<'deleteHistoryMove', { atIndex: ChessHistoryIndex }>
  | Action<'changeBoardOrientation', Color>
  | Action<'arrowChange', ArrowsMap>
  | Action<'drawCircle', CircleDrawTuple>
  | Action<'clearCircles'>;

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

        const promoteToFenBoardPiecesymbol:
          | FenBoardPromotionalPieceSymbol
          | undefined = promoteTo
          ? (pieceSanToFenBoardPieceSymbol(
              promoteTo
            ) as FenBoardPromotionalPieceSymbol)
          : undefined;

        const nextMove = instance.move(from, to, promoteToFenBoardPiecesymbol);

        // const addAtIndex = atIndex !== undefined ? atIndex : prev.history.length;
        // const [nextHistory, addedAtIndex] =
        //   addMoveToChessHistoryAtNextAvailableIndex(
        //     prev.activityState.history.moves,
        //     prev.activityState.history.moves.length,
        //     nextMove
        //   );

        const [nextHistory, addedAtIndex] = addMoveToChessHistory(
          prev.activityState.history.moves,
          nextMove,
          prev.activityState.history.focusedIndex
        );

        console.log('next history', nextHistory, nextHistory.length);
        console.log('addedAtIndex', addedAtIndex);

        return {
          ...prev,
          activityState: {
            ...prev.activityState,
            fen: instance.fen,
            circles: {},
            arrows: {},
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
          circles: {},
          arrows: {},
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

      historyAtFocusedIndex.forEach((m, i) => {
        try {
          instance.move(m.from, m.to);
        } catch (e) {
          console.log('failed at m', m, 'i', i);
          throw e;
        }
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

    if (action.type === 'deleteHistoryMove') {
      const nextIndex = decrementChessHistoryIndex(action.payload.atIndex);
      const nextMoves = getChessHistoryAtIndex(
        prev.activityState.history.moves,
        nextIndex
      );

      const instance = new ChessFENBoard(
        prev.activityState.history.startingFen
      );

      nextMoves.forEach((m, i) => {
        instance.move(m.from, m.to);
      });

      const nextFen = instance.fen;

      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          circles: {},
          arrows: {},
          fen: nextFen,
          history: {
            ...prev.activityState.history,
            focusedIndex: nextIndex,
            moves: nextMoves,
          },
        },
      };
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
      const [at, hex] = action.payload;

      const circleId = `${at}`;

      const { [circleId]: existent, ...restOfCirles } =
        prev.activityState.circles;

      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          circles: {
            ...restOfCirles,
            ...(!!existent
              ? undefined // Set it to undefined if same
              : { [circleId]: action.payload }),
          },
        },
      };
    }

    if (action.type === 'clearCircles') {
      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          circles: {},
        },
      };
    }
  }

  return prev;
};
