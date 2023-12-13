import { useState } from 'react';
import { ChessBoardAsClass } from './ChessBoardAsClass';
import { Color, toLongColor } from 'chessterrain-react';
import { Chess, Square } from 'chess.js';
import { ChessFEN } from '@xmatter/util-kit';

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
    // movable: chess.moves(),
  };
};

export const Playboard = (props: Props) => {
  const [boardState, setBoardState] = useState(calcState(props.fen));
  const [movable, setMovable] = useState<Square[]>();

  // console.log('movable', movable);

  return (
    <ChessBoardAsClass
      sizePx={props.sizePx}
      playingColor={props.playingColor || 'white'}
      fen={boardState.fen}
      orientation={boardState.turn}
      showAnnotations
      movable={movable}
      onPieceTouched={(p) => {
        // console.log('touched', p);
        setMovable(
          boardState.game
            .moves({ square: p.square, verbose: true })
            .map((s) => s.to)
        );
      }}
      onMove={(p) => {
        try {
          boardState.game.move(p.move);

          setBoardState(calcState(boardState.game.fen()));
          setMovable(undefined);
        } catch (e) {
          console.error(e);
        }
      }}
    />
  );
};
