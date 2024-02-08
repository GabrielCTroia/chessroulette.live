import {
  ChessArrowId,
  ChessColor,
  ChessFEN,
  ChessFENBoard,
  ChessMove,
  ChessPGN,
  ChesscircleId,
  FBHHistory,
  FBHIndex,
  FBHMove,
  FenBoardPromotionalPieceSymbol,
  FreeBoardHistory,
  getNewChessGame,
  invoke,
  isValidPgn,
  pieceSanToFenBoardPieceSymbol,
  swapColor,
} from '@xmatter/util-kit';
import { Square } from 'chess.js';
import { Action } from 'movex-core-util';

export type ArrowDrawTuple = [from: Square, to: Square, hex?: string];
export type ArrowsMap = Record<ChessArrowId, ArrowDrawTuple>;

export type CircleDrawTuple = [at: Square, hex: string];
export type CirclesMap = Record<ChesscircleId, CircleDrawTuple>;

export type SquareMap = Record<Square, undefined>;

export type LearnActivityState = {
  activityType: 'learn';
  activityState: {
    fen: ChessFEN;
    boardOrientation: ChessColor;
    arrows: ArrowsMap;
    circles: CirclesMap;
    history: {
      startingFen: ChessFEN;
      moves: FBHHistory;
      focusedIndex: FBHIndex;
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
      focusedIndex: [-1, 1],
    },
  },
};

// PART 2: Action Types

export type ActivityActions =
  | Action<'dropPiece', ChessMove>
  | Action<'importPgn', ChessPGN>
  | Action<'importFen', ChessFEN>
  | Action<'focusHistoryIndex', { index: FBHIndex }>
  | Action<'deleteHistoryMove', { atIndex: FBHIndex }>
  | Action<'changeBoardOrientation', ChessColor>
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
      // TODO: the logic for this should be in GameHistory class/static  so it can be tested

      try {
        const { from, to, promoteTo } = action.payload;

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

        const nextMove = instance.move(
          from,
          to,
          promoteToFenBoardPiecesymbol
        ) as FBHMove;

        const prevMove = FreeBoardHistory.findMoveAtIndex(
          prev.activityState.history.moves,
          prev.activityState.history.focusedIndex
        );

        const { moves: prevHistoryMoves, focusedIndex: prevFocusedIndex } =
          prev.activityState.history;

        // If the moves are the same introduce a non move
        const [nextHistory, addedAtIndex] = invoke(() => {
          const isFocusedIndexLastInBranch =
            FreeBoardHistory.isLastIndexInHistoryBranch(
              prevHistoryMoves,
              prevFocusedIndex
            );

          const [_, __, prevFocusRecursiveIndexes] = prevFocusedIndex;

          if (prevFocusRecursiveIndexes) {
            const addAtIndex =
              FreeBoardHistory.incrementIndex(prevFocusedIndex);

            if (prevMove?.color === nextMove.color) {
              const [nextHistory, addedAtIndex] =
                FreeBoardHistory.addMove(
                  prev.activityState.history.moves,
                  FreeBoardHistory.getNonMove(swapColor(nextMove.color)),
                  addAtIndex
                );

              return FreeBoardHistory.addMove(
                nextHistory,
                nextMove,
                FreeBoardHistory.incrementIndex(addedAtIndex)
              );
            }

            return FreeBoardHistory.addMove(
              prev.activityState.history.moves,
              nextMove,
              addAtIndex
            );
          }

          const addAtIndex = isFocusedIndexLastInBranch
            ? FreeBoardHistory.incrementIndex(
                prev.activityState.history.focusedIndex
              )
            : prev.activityState.history.focusedIndex;

          // if 1st move is black add a non move
          if (prevHistoryMoves.length === 0 && nextMove.color === 'b') {
            const [nextHistory] = FreeBoardHistory.addMove(
              prev.activityState.history.moves,
              FreeBoardHistory.getNonMove(swapColor(nextMove.color))
            );

            return FreeBoardHistory.addMove(
              nextHistory,
              nextMove
            );
          }

          // If it's not the last branch
          if (!isFocusedIndexLastInBranch) {
            return FreeBoardHistory.addMove(
              prev.activityState.history.moves,
              nextMove,
              prevFocusedIndex
            );
          }

          // Add nonMoves for skipping one
          if (prevMove?.color === nextMove.color) {
            const [nextHistory] = FreeBoardHistory.addMove(
              prev.activityState.history.moves,
              FreeBoardHistory.getNonMove(swapColor(nextMove.color)),
              addAtIndex
            );

            return FreeBoardHistory.addMove(
              nextHistory,
              nextMove
            );
          }

          return FreeBoardHistory.addMove(
            prev.activityState.history.moves,
            nextMove
          );
        });

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
          },
        };
      } catch (e) {
        console.error('failed', e);

        return prev;
      }
    }
    // TODO: Bring all of these back
    else if (action.type === 'importFen') {
      if (!ChessFENBoard.validateFenString(action.payload).ok) {
        return prev;
      }

      const nextMoves: FBHHistory = [];

      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          fen: action.payload,
          circles: {},
          arrows: {},
          history: {
            startingFen: ChessFENBoard.STARTING_FEN,
            moves: nextMoves,
            focusedIndex: FreeBoardHistory.getLastIndexInHistory(nextMoves),
          },
        },
      };
    } else if (action.type === 'importPgn') {
      if (!isValidPgn(action.payload)) {
        return prev;
      }

      const instance = getNewChessGame({
        pgn: action.payload,
      });

      const nextHistoryMovex = FreeBoardHistory.pgnToHistory(action.payload);

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
            focusedIndex:
              FreeBoardHistory.getLastIndexInHistory(nextHistoryMovex),
          },
        },
      };
    } else if (action.type === 'focusHistoryIndex') {
      const historyAtFocusedIndex =
        FreeBoardHistory.calculateLinearHistoryAtIndex(
          prev.activityState.history.moves,
          action.payload.index
        );

      const instance = new ChessFENBoard(
        prev.activityState.history.startingFen
      );

      historyAtFocusedIndex.forEach((m) => {
        if (!m.isNonMove) {
          instance.move(m.from, m.to);
        }
      });

      return {
        ...prev,
        activityState: {
          ...prev.activityState,
          fen: instance.fen,
          history: {
            ...prev.activityState.history,
            focusedIndex: action.payload.index,
          },
        },
      };
    }

    if (action.type === 'deleteHistoryMove') {
      // TODO: Fix this!

      const nextIndex = FreeBoardHistory.decrementIndex(action.payload.atIndex);
      const nextHistory = FreeBoardHistory.slice(
        prev.activityState.history.moves,
        nextIndex
      );

      const instance = new ChessFENBoard(
        prev.activityState.history.startingFen
      );

      nextHistory.forEach((turn, i) => {
        turn.forEach((m) => {
          if (m.isNonMove) {
            return;
          }
          instance.move(m.from, m.to);
        });
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
            moves: nextHistory,
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
