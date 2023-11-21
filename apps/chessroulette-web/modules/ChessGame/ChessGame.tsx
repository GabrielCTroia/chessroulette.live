import {
  ChessTerrain,
  ChessBoard,
  FENToChessBoard,
  chessBoardToPieceLayout,
} from 'chessterrain-react';
import { Chess } from 'chess.js';
const chess = new Chess();

export type ChessPropsProps = {
  sizePx: number;
}

export const ChessGame = (props: ChessPropsProps) => {
  return (
    <ChessBoard
      sizePx={props.sizePx}
      playingColor="white"
      pieceLayoutState={chessBoardToPieceLayout(chess.board())}
      onMove={(p) => {
        console.log('on move', p);
      }}
    />
  );
};
