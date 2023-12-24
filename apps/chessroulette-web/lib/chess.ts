import { ChessFEN, ChessPGN } from '@xmatter/util-kit';
import { Chess } from 'chess.js';
// import { ChessFEN, ChessPGN } from '../components/Chessboard/type';

export const getNewChessGame = (
  props?:
    | { pgn: ChessPGN; fen?: undefined }
    | { fen: ChessFEN; pgn?: undefined }
) => {
  const instance = new Chess();

  if (props?.pgn) {
    instance.loadPgn(props.pgn);

    return instance;
  }

  if (props?.fen) {
    instance.load(props.fen);

    return instance;
  }

  return instance;
};
