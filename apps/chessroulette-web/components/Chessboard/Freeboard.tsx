'use client';

import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import {
  ChessColor,
  ChessFEN,
  ChessFENBoard,
  toLongColor,
} from '@xmatter/util-kit';

type Props = {
  sizePx: number;
  fen?: ChessFEN;
  playingColor?: ChessColor;
  boardOrientation?: ChessColor;
  onPieceDrop?: (p: { from: Square; to: Square }) => void;
};

export const Freeboard = ({
  fen = ChessFENBoard.STARTING_FEN,
  ...props
}: Props) => {
  const boardOrientation = useMemo(
    () =>
      props.boardOrientation ? toLongColor(props.boardOrientation) : undefined,
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
