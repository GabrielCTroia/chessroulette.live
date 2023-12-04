import { useState } from 'react';
import { ChessFEN } from './type';
import { ChessBoardAsClass } from './ChessBoardAsClass';
import { Color, toLongColor } from 'chessterrain-react';
import { Chess } from 'chess.js';

type Props = {
  sizePx: number;
  fen?: ChessFEN;
  playingColor?: Color;
};

const calcState = (fen?: ChessFEN) => {
  const chess = new Chess(fen);

  return {
    game: chess,
    fen: chess.fen(),
    turn: toLongColor(chess.turn()),
  };
};

export const Playboard = (props: Props) => {
  const [boardState, setBoardState] = useState(calcState(props.fen));

  return (
    <ChessBoardAsClass
      sizePx={props.sizePx}
      playingColor={props.playingColor || 'white'}
      fen={boardState.fen}
      orientation={boardState.turn}
      showAnnotations
      onMove={(p) => {
        try {
          boardState.game.move(p.move);

          setBoardState(calcState(boardState.game.fen()));
        } catch (e) {
          console.error(e);
        }
      }}
    />
  );
};
