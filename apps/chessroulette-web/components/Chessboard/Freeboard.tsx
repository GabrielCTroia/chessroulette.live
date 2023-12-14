

import { Color } from 'chessterrain-react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import { ChessFEN, ChessFENBoard } from '@xmatter/util-kit';


type Props = {
  sizePx: number;
  fen?: ChessFEN;
  playingColor?: Color;
  onPieceDrop?: (p: { from: Square; to: Square }) => void;
};

export const Freeboard = ({
  fen = ChessFENBoard.STARTING_FEN,
  ...props
}: Props) => {
  return (
    <Chessboard
      position={fen}
      boardWidth={props.sizePx}
      showBoardNotation
      snapToCursor={false}
      arePiecesDraggable
      customBoardStyle={{
        background: 'white',
      }}
      customLightSquareStyle={{
        background: 'white',
      }}
      customDarkSquareStyle={{
        background: 'rgba(0, 163, 255, .4)',
      }}
      
      onPieceDrop={(fromSq, toSq) => {
        props.onPieceDrop?.({
          from: fromSq,
          to: toSq,
        });
        return true;
      }}
    />
  );
};
