import ChessFENBoard from 'apps/chessroulette-web/lib/ChessFENBoard/ChessFENBoard';
import { useState } from 'react';
import { ChessFEN } from './type';
import { ChessBoardAsClass } from './ChessBoardAsClass';
import { Color } from 'chessterrain-react';

type Props = {
  sizePx: number;
  fen?: ChessFEN;
  playingColor?: Color;
};

const calcState = (fen?: ChessFEN) => {
  const fenBoard = new ChessFENBoard(fen);

  return {
    chessBoard: fenBoard,
    fen: fenBoard.fen,
  };
};

export const Freeboard = (props: Props) => {
  const [boardState, setBoardState] = useState(calcState(props.fen));

  return (
    <ChessBoardAsClass
      sizePx={props.sizePx}
      playingColor={props.playingColor || 'white'}
      fen={boardState.fen}
      onMove={(p) => {
        try {
          boardState.chessBoard.move(p.move.from, p.move.to);

          setBoardState(calcState(boardState.chessBoard.fen));
        } catch {
          console.warn('No piece to move Error');
        }
      }}
    />
  );
};
