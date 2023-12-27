import type { Color, PieceSymbol, Square, Move } from 'chess.js';
import { Chess } from 'chess.js';
import { Matrix, MatrixIndex, matrixMap } from '../matrix';
import { ChessMove, ChessMoveSan, ChessPGN, DetailedChessMove } from '../Chess/types';

export const ranks = { 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1, 8: 0 };
export const files = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };

/**
 * Returns indices for a cell
 * (can be used to access board arrays)
 *
 * Example:
 *   getFileRank("a2") => [0, 6]
 *
 *   2 = 6 because arrays usally are displayed with 0,0 in the upper
 *   left corner
 *
 * @param {string} square - Eg: "a2"
 */
export function getFileRank(square: Square) {
  const [file, rank] = square;

  return [
    files[file as keyof typeof files],
    ranks[Number(rank) as keyof typeof ranks],
  ];
}

export function emptyBoard() {
  const board = [];
  for (let i = 0; i < 8; i++) {
    board[i] = [];
  }
  return board;
}

export const indexedRanks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;
export const indexedFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

const fileToIndex = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

export const squareToMatrixIndex = (sq: Square): MatrixIndex => {
  const file = fileToIndex[sq[0] as keyof typeof fileToIndex];
  const rank = 8 - Number(sq[1]);

  return [rank, file];
};

// export const matrixIndexToSquare = ([row, col]: MatrixIndex): Square => {
//   const file = indexedFiles[sq[0] as keyof typeof indexedFiles];
//   const rank = 8 - Number(sq[1]);

//   return [rank, file];
// };

export const matrixIndexToSquare = ([row, col]: MatrixIndex): Square => {
  const rank = 8 - row;
  const file = indexedFiles[col];

  return `${file}${rank}` as Square;
};

export type FenBoardPieceSymbol = PieceSymbol | Uppercase<PieceSymbol>;

export type FENBoard = Matrix<FenBoardPieceSymbol | ''>;

export type ChessBoard = Matrix<{
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null>;

export const fenBoardToChessBoard = (fenBoard: FENBoard): ChessBoard =>
  matrixMap(fenBoard, (m, index) => {
    if (!m) {
      return null;
    }

    const p = fenBoardPieceSymbolToDetailedChessPiece(m);

    return {
      square: matrixIndexToSquare(index),
      color: p.color,
      type: p.piece,
    };
  });

export const fenBoardPieceSymbolToDetailedChessPiece = (
  p: FenBoardPieceSymbol
) =>
  ({
    piece: p.toLowerCase() as PieceSymbol,
    color: isUpperCase(p) ? 'w' : 'b',
  } as const);

const isUpperCase = (s: string) => s === s.toUpperCase();

export const chessBoardToFenBoard = (chessBoard: ChessBoard): FENBoard =>
  matrixMap(chessBoard, (p) => {
    if (!p) {
      return '';
    }

    return (p.color === 'b' ? p.type : p.type.toUpperCase()) as PieceSymbol;
  });

export const fenBoardPieceSymbolToPieceSymbol = (
  p: FenBoardPieceSymbol
): PieceSymbol => {
  const { color, piece } = fenBoardPieceSymbolToDetailedChessPiece(p);

  return `${color}${piece.toUpperCase()}` as PieceSymbol;
};

export const detailedPieceToPieceSymbol = () => {};

export const pgnToFen = (pgn: ChessPGN) => {
  const instance = new Chess();

  // instance.

  instance.loadPgn(pgn);

  return instance.fen();
};

// export const BITS: Record<string, number> = {
//   NORMAL: 1,
//   CAPTURE: 2,
//   BIG_PAWN: 4,
//   EP_CAPTURE: 8,
//   PROMOTION: 16,
//   KSIDE_CASTLE: 32,
//   QSIDE_CASTLE: 64,
// }

// export const chessNoveToSan = (move: Move): ChessMoveSan => {
//   let output = '';

//   if ((move.flags as any) & BITS['KSIDE_CASTLE']) {
//     output = 'O-O'
//   } else if ((move.flags as any) & BITS['QSIDE_CASTLE']) {
//     output = 'O-O-O'
//   } else {
//     if (move.piece !== 'p') {
//       const disambiguator = getDisambiguator(move, moves);
//       output += move.piece.toUpperCase() + disambiguator
//     }

//     if ((move.flags as any) & (BITS['CAPTURE'] | BITS['EP_CAPTURE'])) {
//       if (move.piece === 'p') {
//         output += algebraic(move.from)[0]
//       }
//       output += 'x'
//     }

//     output += algebraic(move.to)

//     if (move.promotion) {
//       output += '=' + move.promotion.toUpperCase()
//     }
//   }

//   this._makeMove(move)
//   if (this.isCheck()) {
//     if (this.isCheckmate()) {
//       output += '#'
//     } else {
//       output += '+'
//     }
//   }
//   this._undoMove()

//   return output
// }
