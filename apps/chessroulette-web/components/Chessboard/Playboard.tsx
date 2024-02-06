import { useEffect } from 'react';
import useInstance from '@use-it/instance';
import { Chess } from 'chess.js';
import { ChessColor, ChessFENBoard, getNewChessGame, toShortColor } from '@xmatter/util-kit';
import {
  ChessboardContainer,
  ChessboardContainerProps,
} from './ChessboardContainer';

type Props = ChessboardContainerProps & {
  playingColor?: ChessColor;
};

export const Playboard = ({
  fen = ChessFENBoard.STARTING_FEN,
  playingColor = 'white',
  boardOrientation = playingColor,
  onMove,
  ...props
}: Props) => {
  const chessInstance = useInstance<Chess>(getNewChessGame({ fen }));

  useEffect(() => {
    try {
      chessInstance.load(fen);
    } catch (e) {
      console.error(e);
    }
  }, [fen]);

  return (
    <ChessboardContainer
      fen={fen}
      boardOrientation={playingColor || boardOrientation}
      onMove={(m) => {
        if (chessInstance.turn() !== toShortColor(playingColor)) {
          return false;
        }

        // Validate move
        try {
          chessInstance.move(m);

          onMove?.(m);

          return true;
        } catch {
          return false;
        }
      }}
      {...props}
    />
  );
};
