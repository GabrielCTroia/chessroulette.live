import { Chess } from 'chess.js';

type PGNHeader = {
  date?: Date;
  result?: string;
  // winner?: 'white' | 'black' | d;
  white?: string;
  whiteElo?: number;
  black?: string;
  blackElo?: number;
};

export type ChessPGN = string;
export type ChessFEN = string;

export const getPgnDetails = (pgn: ChessPGN) => {
  const instance = new Chess();

  instance.loadPgn(pgn);

  const header = instance.header();

  return {
    fen: instance.fen(),
    header: {
      date: header.Date,
      result: header.Result,
      white: header.White,
      whiteElo: header.WhiteElo ? Number(header.WhiteElo) : undefined,
      black: header.Black,
      blackElo: header.BlackElo ? Number(header.BlackElo) : undefined,
    },
  };
};
