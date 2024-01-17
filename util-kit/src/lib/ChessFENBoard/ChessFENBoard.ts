import { getNewChessGame } from '../Chess/lib';
import { ChessFEN, DetailedChessMove } from '../Chess/types';
import { invoke } from '../misc';
import {
  FENBoard,
  FenBoardPieceSymbol,
  FenBoardPromotionalPieceSymbol,
  emptyBoard,
  fenBoardPieceSymbolToDetailedChessPiece,
  fenBoardPieceSymbolToPieceSymbol,
  getFileRank,
} from './chessUtils';
import type { Color, PieceSymbol, Square } from 'chess.js';

export class ChessFENBoard {
  static STARTING_FEN: ChessFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

  private _state: {
    board: FENBoard;
    fen: ChessFEN;
  } = {
    board: ChessFENBoard.calculateBoard(ChessFENBoard.STARTING_FEN),
    fen: ChessFENBoard.STARTING_FEN,
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

    // TODO: Can Optimize to not calc fen all the time
    this._state = {
      board: nextBoard,
      fen: ChessFENBoard.calculateFen(nextBoard),
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

    // const piece = this.piece(from);
    if (!piece) {
      console.error('Move Error: the from square was empty', {
        from,
        to,
        promoteTo,
      });
      throw new Error(`Move Error: the from square (${from}) was empty!`);
    }

    const toPiece = this.piece(to);
    const captured: PieceSymbol | undefined = toPiece
      ? fenBoardPieceSymbolToPieceSymbol(toPiece)
      : undefined;

    this.put(to, piece);

    // TODO: here the fen gets recalculate 2 times
    this.clear(from);

    console.log('fen', this.fen);

    const chessInstance = getNewChessGame({ fen: this.fen });

    const state = {
      inCheck: chessInstance.inCheck(),
      // isCheck: chessInstance.isCheck(),
      isCheckmate: chessInstance.isCheckmate(),
      isGameOver: chessInstance.isGameOver(),
    };

    console.log('chess state', state);

    // console.log('chess instance', chessInstance.fen(), chessInstance.pgn());

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

    console.log('fenStateNotation', fenStateNotation);

    this._state = {
      board: nextBoard,
      fen: ChessFENBoard.calculateFen(nextBoard),
    };
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

  private static calculateFen(
    fromBoard: FENBoard,
    state: {
      turn?: Color;
      castlingRights?: {
        w: { kingSide: boolean; queenSide: boolean };
        b: { kingSide: boolean; queenSide: boolean };
      };
      enPassant?: Square | undefined;
      halfMoves?: number;
      fullMoves?: number;
    } = {}
  ): ChessFEN {
    const {
      turn = 'w',
      castlingRights = {
        w: { kingSide: false, queenSide: false },
        b: { kingSide: false, queenSide: false },
      },
      enPassant = undefined,
      halfMoves = 0,
      fullMoves = 1,
    } = state;

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

    const cr = castlingRights;
    const castlingRightsNotation = `${cr.w.kingSide ? 'K' : ''}${
      cr.w.kingSide ? 'Q' : ''
    }${cr.b.kingSide ? 'k' : ''}${cr.b.queenSide ? 'q' : ''}`;

    return (
      nextFen.join('') +
      ` ${turn} ${castlingRightsNotation || '-'} ${
        enPassant || '-'
      } ${halfMoves} ${fullMoves}`
    );
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

    // console.log('seting', rank, file, fenChar, board);
  };

  private static getPiece = (board: FENBoard, file: number, rank: number) => {
    return board[rank][file];
  };
}
