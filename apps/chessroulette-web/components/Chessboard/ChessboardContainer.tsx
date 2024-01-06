import {
  ChessFEN,
  GetComponentProps,
  PromotionalPieceSan,
  ShortChessMove,
  isDarkSquare,
  isLightSquare,
  toLongColor,
} from '@xmatter/util-kit';
import { Move, Square } from 'chess.js';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Arrow } from 'react-chessboard/dist/chessboard/types';
import { useArrowColor } from './useArrowColor';
import { isPromotableMove } from 'util-kit/src/lib/ChessFENBoard/chessUtils';

type ChessBoardProps = GetComponentProps<typeof Chessboard>;

export type ChessboardContainerProps = Omit<
  ChessBoardProps,
  'position' | 'onArrowsChange'
> & {
  fen: ChessFEN;
  sizePx: number;
  arrows?: Arrow[];
  circledSquare?: Square;
  arrowColor?: string;
  onMove?: (m: ShortChessMove) => boolean;
  lastMove?: ShortChessMove;
  onArrowsChange?: (arrows: Arrow[]) => void;
};

export const ChessboardContainer = ({
  fen,
  arrows,
  lastMove,
  circledSquare,
  onArrowsChange,
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

  const [promoMove, setPromoMove] = useState<ShortChessMove>();

  // const lastArrowsRef = useRef<Arrow[]>();
  // const onArrowsChangeCb = useCallback(
  //   (arrows: Arrow[]) => {
  //     if (!onArrowsChange) {
  //       return;
  //     }

  //     console.log('arrows', arrows, lastArrowsRef.current, arrows === lastArrowsRef.current)

  //     if (arrows === lastArrowsRef.current) {
  //       return;
  //     }

  //     onArrowsChange(arrows);

  //     lastArrowsRef.current = arrows;
  //   },
  //   [onArrowsChange]
  // );

  return (
    <div className="relative">
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
        onPieceDrop={(from, to) => {
          // As long as the on PromotionPieceSelect is present this doesn't get triggered with a pieceSelect

          return !!props.onMove?.({ from, to });
        }}
        customSquareStyles={customSquareStyles}
        customArrows={arrows}
        autoPromoteToQueen={false}
        onPromotionCheck={(from, to, piece) => {
          const isPromoMove = isPromotableMove({ from, to }, piece);

          if (isPromoMove) {
            setPromoMove({ from, to });
          }

          return isPromoMove;
        }}
        onPromotionPieceSelect={(promoteTo) => {
          if (!promoMove) {
            return false;
          }

          if (promoteTo === undefined) {
            setPromoMove(undefined);

            return false;
          }

          return !!props.onMove?.({
            ...promoMove,
            promoteTo,
          });
        }}
        customArrowColor={arrowColor}
        // onArrowsChange={onArrowsChangeCb}
        {...props}
      />
    </div>
  );
};
