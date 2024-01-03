import {
  ChessFEN,
  GetComponentProps,
  ShortChessMove,
  isDarkSquare,
  isLightSquare,
  toLongColor,
} from '@xmatter/util-kit';
import { Move, Square } from 'chess.js';
import { useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Arrow } from 'react-chessboard/dist/chessboard/types';

type ChessBoardProps = GetComponentProps<typeof Chessboard>;

export type ChessboardContainerProps = Omit<ChessBoardProps, 'position'> & {
  fen: ChessFEN;
  sizePx: number;
  arrows?: Arrow[];
  arrowColor?: string;
  onMove?: (m: ShortChessMove) => boolean;
  lastMove?: ShortChessMove;
};

export const ChessboardContainer = ({
  fen,
  arrows,
  arrowColor,
  lastMove,
  ...props
}: ChessboardContainerProps) => {
  const boardOrientation = useMemo(
    () =>
      props.boardOrientation ? toLongColor(props.boardOrientation) : undefined,
    [props.boardOrientation]
  );

  const customStyles = useMemo(
    () => ({
      customDarkSquareStyle: props.customDarkSquareStyle || {
        backgroundColor: 'rgba(0, 163, 255, .4)',
      },
      customLightSquareStyle: props.customLightSquareStyle || {
        backgroundColor: 'white',
      },
      customBoardStyle: props.customBoardStyle || { backgroundColor: 'white' },
    }),
    [
      props.customDarkSquareStyle,
      props.customLightSquareStyle,
      props.customBoardStyle,
    ]
  );

  const customSquareStyles = useMemo(() => {
    return {
      ...(lastMove && {
        [lastMove.from]: {
          background: isDarkSquare(lastMove.from)
            ? 'rgba(234, 183, 255, .6)'
            : 'rgba(234, 183, 255, .3)',
        },
        [lastMove.to]: {
          background: isDarkSquare(lastMove.to)
            ? 'rgba(234, 183, 255, .6)'
            : 'rgba(234, 183, 255, .3)',
        },
      }),
    };
  }, [lastMove]);

  //
  // const lastMove =

  return (
    <Chessboard
      position={fen}
      boardWidth={props.sizePx}
      showBoardNotation
      boardOrientation={boardOrientation}
      snapToCursor={false}
      arePiecesDraggable
      customBoardStyle={customStyles.customBoardStyle}
      customLightSquareStyle={customStyles.customLightSquareStyle}
      customDarkSquareStyle={customStyles.customDarkSquareStyle}
      onPieceDrop={(from, to) => !!props.onMove?.({ from, to })}
      customSquareStyles={customSquareStyles}
      customArrows={arrows}
      // onArrowsChange={onArrowsChangeConditioned}
      customArrowColor={arrowColor}
    />
  );
};
