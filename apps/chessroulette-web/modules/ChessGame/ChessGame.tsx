'use client';

import {
  ChessTerrain,
  ChessBoard,
  FENToChessBoard,
  chessBoardToPieceLayout,
} from 'chessterrain-react';
import { Chess } from 'chess.js';

export type ChessPropsProps = {
  sizePx: number;
};

export const ChessGame = (props: ChessPropsProps) => {
  const chess = new Chess(); // TODO: this should be under useInstance

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
