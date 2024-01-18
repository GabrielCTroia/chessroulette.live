import { deepmerge } from 'deepmerge-ts';
import { getNewChessGame, isShortChessColor } from '../Chess/lib';
import { ChessFEN, DetailedChessMove } from '../Chess/types';
import { invoke, isOneOf } from '../misc';
import {
  FENBoard,
  FenBoardPieceSymbol,
  FenBoardPromotionalPieceSymbol,
  emptyBoard,
  fenBoardPieceSymbolToDetailedChessPiece,
  fenBoardPieceSymbolToPieceSymbol,
  getFileRank,
} from './chessUtils';
import { SQUARES, type Color, type PieceSymbol, type Square } from 'chess.js';
import { Err, Ok, Result } from 'ts-results';
import { DeepPartial } from '../miscType';

export type FenState = {
  turn: Color;
  castlingRights: {
    w: { kingSide: boolean; queenSide: boolean };
    b: { kingSide: boolean; queenSide: boolean };
  };
  enPassant: Square | undefined;
  halfMoves: number;
  fullMoves: number;
};

export class ChessFENBoard {
  static STARTING_FEN: ChessFEN =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  // This is a get because it's meant to be readonly
  static get STARTING_FEN_STATE(): FenState {
    return {
      turn: 'w',
      castlingRights: {
        w: { kingSide: false, queenSide: false },
        b: { kingSide: false, queenSide: false },
      },
      enPassant: undefined,
      halfMoves: 0,
      fullMoves: 1, // This always needs to be bigger than 0
    };
  }

  private _state: {
    board: FENBoard;
    fen: ChessFEN;
    fenState: FenState;
  } = {
    board: ChessFENBoard.calculateBoard(ChessFENBoard.STARTING_FEN),
    fen: ChessFENBoard.STARTING_FEN,
    fenState: ChessFENBoard.STARTING_FEN_STATE,
  };

  constructor(fen?: ChessFEN) {
    if (fen) {
      this.loadFen(fen);
    }
  }

  /**
   * Gets the piece at a square
   *
   * @param {string} square - The square. Eg: "a2"
   * @return {string} piece - the ascii representation of a piece. Eg: "K"
   */
  piece(square: Square) {
    const [file, rank] = getFileRank(square);
    return ChessFENBoard.getPiece(this._state.board, file, rank);
  }

  /**
   * Places a piece in the given square.
   *
   * @param {string} square - The square. Eg: "a2"
   * @param {string} piece - the ascii representation of a piece. Eg: "K"
   */
  put(square: Square, piece: FenBoardPieceSymbol | '') {
    const [file, rank] = getFileRank(square);

    // TODO: Add it back This needs to recalcualte the fen as well
    const nextBoard = ChessFENBoard.setPieceInBoard(
      this.board,
      file,
      rank,
      piece
    );

    const nextFen = ChessFENBoard.calculateFen(nextBoard);

    // TODO: Can Optimize to not calc fen all the time
    this._state = {
      board: nextBoard,
      fen: nextFen.fen,
      fenState: nextFen.fenState,
    };
  }

  /**
   * Removes the piece at the given square.
   *
   * @param {string} square - The square. Eg: "a2"
   */
  clear(square: Square) {
    // TODO: Add it back This needs to recalcualte the fen as well
    this.put(square, '');
  }

  /**
   * Moves a piece.
   *
   * @param {string} from - The square to move from. Eg: "a2"
   * @param {string} to - The square to move to. Eg: "a3"
   */
  move(
    from: Square,
    to: Square,
    promoteTo?: FenBoardPromotionalPieceSymbol
  ): DetailedChessMove {
    const piece = promoteTo || this.piece(from);

    if (!piece) {
      throw new Error(`Move Error: the from square (${from}) was empty!`);
    }

    const toPiece = this.piece(to);
    const captured: PieceSymbol | undefined = toPiece
      ? fenBoardPieceSymbolToPieceSymbol(toPiece)
      : undefined;

    this.put(to, piece);

    // TODO: here the fen gets recalculate 2 times
    this.clear(from);

    const chessInstance = getNewChessGame({ fen: this.fen });

    const state = {
      inCheck: chessInstance.inCheck(),
      // isCheck: chessInstance.isCheck(),
      isCheckmate: chessInstance.isCheckmate(),
      isGameOver: chessInstance.isGameOver(),
    };

    const detailedPiece = fenBoardPieceSymbolToDetailedChessPiece(piece);

    const sanPiece =
      detailedPiece.piece === 'p'
        ? ''
        : detailedPiece.piece.toLocaleUpperCase();
    const sanCaptured = invoke(() => {
      if (!captured) {
        return '';
      }

      if (detailedPiece.piece === 'p') {
        return `${from[0]}x`;
      }

      return 'x';
    });

    const san = `${sanPiece}${sanCaptured}${to}`;

    return {
      color: detailedPiece.color,
      piece: detailedPiece.piece,
      captured,
      san,
      to,
      from,
    };
  }

  /**
   * Set the current position.
   *
   * @param {string} fen - a position string as FEN
   */
  loadFen(fen: ChessFEN) {
    // TODO: Validate FEN

    if (this._state.fen === fen) {
      // They are the same
      return;
    }

    const nextBoard = ChessFENBoard.calculateBoard(fen);

    const fenStateNotation = fen.slice(fen.indexOf(' '));

    const nextFenStateResult =
      ChessFENBoard.fenNotationToFenState(fenStateNotation);

    // Throw for now
    if (nextFenStateResult.err) {
      throw nextFenStateResult.val;
    }

    const nextFen = ChessFENBoard.calculateFen(
      nextBoard,
      fenStateNotation ? nextFenStateResult.val : undefined
    );

    this._state = {
      board: nextBoard,
      fen: nextFen.fen,
      fenState: nextFen.fenState,
    };
  }

  setFenNotation(
    p:
      | { fromState: DeepPartial<FenState>; fromNotation?: undefined }
      | { fromState?: undefined; fromNotation: string }
  ) {
    const prevFen = this.fen;
    const prevFenWithoutNotation = prevFen
      .slice(0, prevFen.indexOf(' '))
      .trim();
    const prevFenState = this._state.fenState;

    if (p.fromState) {
      const nextFenState = deepmerge(prevFenState, p.fromState) as FenState;

      const isValidFenStateResult =
        ChessFENBoard.validateFenState(nextFenState);

      if (isValidFenStateResult.err) {
        throw isValidFenStateResult.val;
      }

      const nextFenNotation = ChessFENBoard.fenStateToFenNotation(nextFenState);

      this._state = {
        ...this._state,
        fen: `${prevFenWithoutNotation} ${nextFenNotation}`,
        fenState: nextFenState,
      };
    } else if (p.fromNotation) {
      const nextFenNotation = p.fromNotation;
      const nextFenStateResult =
        ChessFENBoard.fenNotationToFenState(nextFenNotation);

      if (!nextFenStateResult.ok) {
        throw nextFenStateResult.val;
      }

      this._state = {
        ...this._state,
        fen: `${prevFenWithoutNotation} ${nextFenNotation}`,
        fenState: nextFenStateResult.val,
      };
    }
  }

  getFenNotation(): string {
    return this.fen.slice(this.fen.indexOf(' '));
  }

  getFenState() {
    return this._state.fenState;
  }

  private static calculateBoard(fromFen: ChessFEN): FENBoard {
    const nextBoard = emptyBoard();

    // TODO: Can optimize a little if fen is starting fen just return the empty board

    let rank = 0;
    let file = 0;
    let fenIndex = 0;

    let fenChar;
    let count;

    while (fenIndex < fromFen.length) {
      fenChar = fromFen[fenIndex];

      if (fenChar === ' ') {
        break; // ignore the rest
      }
      if (fenChar === '/') {
        rank++;
        file = 0;
        fenIndex++;
        continue;
      }

      if (isNaN(parseInt(fenChar, 10))) {
        ChessFENBoard.setPieceInBoard(
          nextBoard,
          file,
          rank,
          fenChar as FenBoardPieceSymbol
        );
        file++;
      } else {
        count = parseInt(fenChar, 10);
        for (let i = 0; i < count; i++) {
          ChessFENBoard.setPieceInBoard(nextBoard, file, rank, '');
          file++;
        }
      }

      fenIndex++;
    }

    return nextBoard;
  }

  /**
   * This is the fenState -> "w KQkq - 0 1"
   *
   * @param fenNotation
   * @returns
   */
  private static fenNotationToFenState = (
    fenNotation: string
  ): Result<FenState, unknown> => {
    const [turn, castlingRights, enPassant, halfMoves, fullMoves] = fenNotation
      .trim()
      .split(' ');

    let state: FenState = ChessFENBoard.STARTING_FEN_STATE;

    // TODO: Left it here, need to do this in oder to have the castling working, which makes the history refocus break!
    if (turn && isShortChessColor(turn)) {
      state = {
        ...state,
        turn,
      };
    } else {
      return new Err('InvalidTurnNotation');
    }

    // KQkq | Kk | Qq | Kq | kQ | -
    if (
      isOneOf(castlingRights, [
        'KQkq',
        'KQk',
        'KQq',
        'Kkq',
        'Qkq',
        'Kk',
        'Qq',
        'Kq',
        'Qk',
        'K',
        'Q',
        'k',
        'q',
        '-',
      ])
    ) {
      if (castlingRights !== '-') {
        state = {
          ...state,
          castlingRights: {
            w: {
              kingSide: castlingRights.indexOf('K') > -1,
              queenSide: castlingRights.indexOf('Q') > -1,
            },
            b: {
              kingSide: castlingRights.indexOf('k') > -1,
              queenSide: castlingRights.indexOf('q') > -1,
            },
          },
        };
      } else {
        state = {
          ...state,
          castlingRights: {
            w: {
              kingSide: false,
              queenSide: false,
            },
            b: {
              kingSide: false,
              queenSide: false,
            },
          },
        };
      }
    } else {
      return new Err('InvalidCastlingRightsNotation');
    }

    if (enPassant && isOneOf(enPassant, [...SQUARES, '-'])) {
      state = {
        ...state,
        enPassant: enPassant === '-' ? undefined : (enPassant as Square),
      };
    } else {
      return new Err('InvalidEnPassantNotation');
    }

    if (Number(halfMoves) > -1) {
      state = {
        ...state,
        halfMoves: Number(halfMoves),
      };
    } else {
      return new Err('InvalidHalfMovesNotation');
    }

    if (Number(fullMoves) > 0) {
      state = {
        ...state,
        fullMoves: Number(fullMoves),
      };
    } else {
      return new Err('InvalidFullMovesNotation');
    }

    return new Ok(state);
  };

  private static validateFenState(s: FenState) {
    if (s.fullMoves < 1) {
      return new Err('InvalidFenState:InvalidFullMoves');
    }

    if (s.halfMoves < 0) {
      return new Err('InvalidFenState:InvalidHalfMoves');
    }

    return Ok.EMPTY;
  }

  private static validateFenNotation(s: string) {
    return ChessFENBoard.fenNotationToFenState(s);
  }

  private static fenStateToFenNotation(fenState: FenState) {
    const {
      turn,
      castlingRights: cr,
      enPassant,
      halfMoves,
      fullMoves,
    } = fenState;

    const castlingRightsNotation = `${cr.w.kingSide ? 'K' : ''}${
      cr.w.queenSide ? 'Q' : ''
    }${cr.b.kingSide ? 'k' : ''}${cr.b.queenSide ? 'q' : ''}`;

    return `${turn} ${castlingRightsNotation || '-'} ${
      enPassant || '-'
    } ${halfMoves} ${fullMoves}`;
  }

  private static calculateFen(
    fromBoard: FENBoard,
    fenState: Partial<FenState> = {}
  ): {
    fen: ChessFEN;
    fenState: FenState;
    fenStateNotation: string;
  } {
    const nextFen = [];
    for (let i = 0; i < 8; i++) {
      let empty = 0;
      for (let j = 0; j < 8; j++) {
        const piece = ChessFENBoard.getPiece(fromBoard, j, i);
        if (piece) {
          if (empty > 0) {
            nextFen.push(empty);
            empty = 0;
          }
          nextFen.push(piece);
        } else {
          empty++;
        }
      }
      if (empty > 0) {
        nextFen.push(empty);
      }
      nextFen.push('/');
    }
    nextFen.pop();

    const nextFenState = {
      ...ChessFENBoard.STARTING_FEN_STATE,
      ...fenState,
    };

    const isValidFenStateResult = ChessFENBoard.validateFenState(nextFenState);

    if (isValidFenStateResult.err) {
      throw isValidFenStateResult.val;
    }

    const nextFenNotation = ChessFENBoard.fenStateToFenNotation(nextFenState);

    return {
      fen: nextFen.join('') + ` ${nextFenNotation}`,
      fenState: nextFenState,
      fenStateNotation: nextFenNotation,
    };
  }

  loadBoard(fenBoard: FENBoard) {
    //
  }

  get board() {
    return this._state.board;
  }

  get fen() {
    return this._state.fen;
  }

  private static setPieceInBoard = (
    board: FENBoard,
    file: number,
    rank: number,
    fenChar: FenBoardPieceSymbol | ''
  ) => {
    board[rank][file] = fenChar;

    return board;
  };

  private static getPiece = (board: FENBoard, file: number, rank: number) => {
    return board[rank][file];
  };
}
