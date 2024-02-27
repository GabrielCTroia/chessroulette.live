import { Action } from 'movex-core-util';
import { Chapter, ChapterState, CircleDrawTuple } from './reducer';
import {
  ChessFEN,
  ChessFENBoard,
  ChessMove,
  ChessPGN,
  FenBoardPromotionalPieceSymbol,
  FreeBoardHistory,
  getNewChessGame,
  isValidPgn,
  pieceSanToFenBoardPieceSymbol,
} from '@xmatter/util-kit';

export type InputState =
  | {
      // this means the instructor creates or edits chapters atm
      isActive: true;
      isBoardEditorShown: boolean;
      chapterState: ChapterState; // Create or Update Chapter but it will come here!
    }
  | {
      isActive: false;
      isBoardEditorShown?: false;
      chapterState: undefined;
    };

type InputAction =
  | Action<
      'activate',
      {
        isBoardEditorShown?: boolean;
        chapterState: ChapterState; // Create or Update Chapter but it will come here!
      }
    >
  | Action<'deactivate'>
  | Action<'move', { move: ChessMove }>
  | Action<'updateChapterFen', { fen: ChessFEN }>
  | Action<'updatePartialChapter', Partial<Omit<ChapterState, 'notation'>>>
  | Action<'drawCircle', CircleDrawTuple>
  | Action<'clearCircles'>
  | Action<
      'import',
      { type: 'FEN'; input: ChessFEN } | { type: 'PGN'; input: ChessPGN }
    >

  // TODO This maybe is too generericzx
  | Action<
      'update',
      Partial<{
        chapterState: ChapterState;
        isBoardEditorShown?: boolean;
      }>
    >;

export const initialInputState: InputState = {
  isActive: false,
  chapterState: undefined,
  isBoardEditorShown: false,
};

export default (
  prev: InputState = initialInputState,
  action: InputAction
): InputState => {
  console.group('Input Action', action.type);
  console.log('payload', (action as any).payload);
  console.log('prev', prev);
  console.log('');
  console.groupEnd();

  if (action.type === 'activate') {
    return {
      isActive: true,
      isBoardEditorShown: !!action.payload.isBoardEditorShown,
      chapterState: action.payload.chapterState,
    };
  }

  if (action.type === 'deactivate') {
    return {
      isActive: false,
      chapterState: undefined,
    };
  }

  if (action.type === 'move') {
    if (!prev.isActive) {
      return prev;
    }

    const { move } = action.payload;

    const instance = new ChessFENBoard(prev.chapterState.displayFen);
    const fenPiece = instance.piece(move.from);
    if (!fenPiece) {
      console.error('Err', instance.board);
      throw new Error(`No Piece at ${move.from}`);
    }

    const promoteToFenBoardPiecesymbol:
      | FenBoardPromotionalPieceSymbol
      | undefined = move.promoteTo
      ? (pieceSanToFenBoardPieceSymbol(
          move.promoteTo
        ) as FenBoardPromotionalPieceSymbol)
      : undefined;

    instance.move(move.from, move.to, promoteToFenBoardPiecesymbol);

    const nextFen = instance.fen;

    const nextChapterState: ChapterState = {
      ...prev.chapterState,
      displayFen: nextFen,
      notation: {
        ...prev.chapterState.notation,
        startingFen: nextFen,
      },
    };

    return {
      ...prev,
      chapterState: nextChapterState,
    };
  }

  if (action.type === 'updateChapterFen') {
    if (!prev.isActive) {
      return prev;
    }

    const nextFen = action.payload.fen;

    const nextChapterState: ChapterState = {
      ...prev.chapterState,
      displayFen: nextFen,
      notation: {
        ...prev.chapterState.notation,
        startingFen: nextFen,
      },
    };

    return {
      ...prev,
      chapterState: nextChapterState,
    };
  }

  if (action.type === 'updatePartialChapter') {
    if (!prev.isActive) {
      return prev;
    }

    const nextChapterState: ChapterState = {
      ...prev.chapterState,
      ...action.payload,
    };

    return {
      ...prev,
      chapterState: nextChapterState,
    };
  }

  if (action.type === 'drawCircle') {
    if (!prev.isActive) {
      return prev;
    }

    const [at, hex] = action.payload;
    const circleId = `${at}`;
    const { [circleId]: existent, ...restOfCirlesMap } =
      prev.chapterState.circlesMap;

    const nextChapterState: ChapterState = {
      ...prev.chapterState,
      circlesMap: {
        ...restOfCirlesMap,
        ...(!!existent
          ? undefined // Set it to undefined if same
          : { [circleId]: action.payload }),
      },
    };

    return {
      ...prev,
      chapterState: nextChapterState,
    };
  }
  if (action.type === 'clearCircles') {
    if (!prev.isActive) {
      return prev;
    }

    const nextChapterState: ChapterState = {
      ...prev.chapterState,
      circlesMap: {},
    };

    return {
      ...prev,
      chapterState: nextChapterState,
    };
  }

  if (action.type === 'update') {
    // TODO: Maybe this is too generic but it's ok for now
    if (!prev.isActive) {
      return prev;
    }

    return {
      ...prev,
      ...action.payload,
    };
  }

  if (action.type === 'import') {
    if (!prev.isActive) {
      return prev;
    }

    if (action.payload.type === 'FEN') {
      if (!ChessFENBoard.validateFenString(action.payload.input).ok) {
        return prev;
      }

      const nextFen = action.payload.input;

      const nextChapterState: ChapterState = {
        ...prev.chapterState,
        displayFen: nextFen,

        // When importing PGNs set the notation from this fen
        notation: {
          startingFen: nextFen,
          history: [],
          focusedIndex: FreeBoardHistory.getStartingIndex(),
        },
      };

      return {
        ...prev,
        chapterState: nextChapterState,
      };
    }

    if (action.payload.type === 'PGN') {
      if (!isValidPgn(action.payload.input)) {
        return prev;
      }

      const instance = getNewChessGame({
        pgn: action.payload.input,
      });
      const nextHistory = FreeBoardHistory.pgnToHistory(action.payload.input);

      const nextChapterState: ChapterState = {
        ...prev.chapterState,
        displayFen: instance.fen(),

        // When importing PGNs set the notation history as well
        notation: {
          startingFen: ChessFENBoard.STARTING_FEN,
          history: nextHistory,
          focusedIndex: FreeBoardHistory.getLastIndexInHistory(nextHistory),
        },
      };

      return {
        ...prev,
        chapterState: nextChapterState,
      };
    }

    return prev;

    // return {

    // }

    // return {
    //   ...prev,
    //   activityState: {
    //     ...prev.activityState,
    //     fen: instance.fen(),
    //     circles: {},
    //     arrows: {},
    //     history: {
    //       startingFen: ChessFENBoard.STARTING_FEN,
    //       moves: nextHistoryMovex,
    //       focusedIndex:
    //         FreeBoardHistory.getLastIndexInHistory(nextHistoryMovex),
    //     },
    //   },
    // };
  }

  return prev;
};
