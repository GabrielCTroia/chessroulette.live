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
import { useArrowColor } from './useArrowColor';

type ChessBoardProps = GetComponentProps<typeof Chessboard>;

export type ChessboardContainerProps = Omit<ChessBoardProps, 'position'> & {
  fen: ChessFEN;
  sizePx: number;
  arrows?: Arrow[];
  circledSquare?: Square;
  arrowColor?: string;
  onMove?: (m: ShortChessMove) => boolean;
  lastMove?: ShortChessMove;
};

export const ChessboardContainer = ({
  fen,
  arrows,
  lastMove,
  circledSquare,
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

  const arrowColor = useArrowColor();

  // const [circledSq, setCircledSq] = useState<Square>();

  const customSquareStyles = useMemo(() => {
    // const circleSvg = encodeURI('<svg height="100" width="100"><circle cx="0" cy="0" r="40" stroke="black" stroke-width="10" fill="transparent" /></svg>');
    // console.log('circleSvg', circleSvg);

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
      ...(circledSquare && {
        [circledSquare]: {
          // backgroundImage: `url("data:image/svg+xml,${circleSvg}")`,
          // background: 'red',
          // circleSvg
          borderRadius: '100%',
          border: `${props.sizePx / 64}px red solid`,
          // marginTop: `-${props.sizePx / 64}px`,
        },
      }),
    };
  }, [lastMove, circledSquare, props.sizePx]);

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
      // onSquareRightClick={setCircledSq}
      // onArrowsChange={onArrowsChangeConditioned}
      customArrowColor={arrowColor}
      {...props}
    />
  );
};
