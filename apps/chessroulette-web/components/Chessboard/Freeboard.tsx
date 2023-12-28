import { Color, toLongColor } from 'chessterrain-react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import { ChessFEN, ChessFENBoard } from '@xmatter/util-kit';
import { useMemo } from 'react';

type Props = {
  sizePx: number;
  fen?: ChessFEN;
  playingColor?: Color;
  boardOrientation?: Color;
  onPieceDrop?: (p: { from: Square; to: Square }) => void;
};

export const Freeboard = ({
  fen = ChessFENBoard.STARTING_FEN,
  ...props
}: Props) => {
  const boardOrientation = useMemo(
    () => props.boardOrientation ? toLongColor(props.boardOrientation) : undefined,
    [props.boardOrientation]
  );

  return (
    <Chessboard
      position={fen}
      boardWidth={props.sizePx}
      showBoardNotation
      boardOrientation={boardOrientation}
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
