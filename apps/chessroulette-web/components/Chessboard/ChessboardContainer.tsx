import {
  ChessArrowId,
  ChessFEN,
  GetComponentProps,
  PromotionalPieceSan,
  ShortChessMove,
  deepEquals,
  isDarkSquare,
  isLightSquare,
  keyInObject,
  objectKeys,
  toChessArrowFromId,
  toChessArrowId,
  toDictIndexedBy,
  toLongColor,
} from '@xmatter/util-kit';
import { Move, Square } from 'chess.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Arrow } from 'react-chessboard/dist/chessboard/types';
import { useArrowColor } from './useArrowColor';
import { isPromotableMove } from 'util-kit/src/lib/ChessFENBoard/chessUtils';
import { isDeepStrictEqual } from 'util';
import { ArrowsMap } from 'apps/chessroulette-web/modules/room/activity/reducer';
import useDeepCompareEffect from 'use-deep-compare-effect';

type ChessBoardProps = GetComponentProps<typeof Chessboard>;

export type ChessboardContainerProps = Omit<
  ChessBoardProps,
  'position' | 'onArrowsChange'
> & {
  fen: ChessFEN;
  sizePx: number;
  arrowsMap?: ArrowsMap;
  circledSquare?: Square;
  arrowColor?: string;
  onMove?: (m: ShortChessMove) => boolean;
  lastMove?: ShortChessMove;
  onArrowsChange?: (arrows: ArrowsMap) => void;
};

export const ChessboardContainer = ({
  fen,
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
  const [arrowsList, setArrowsList] = useState<Arrow[]>();

  useEffect(() => {
    setTimeout(() => {
      setArrowsList(objectKeys(props.arrowsMap || {}).map(toChessArrowFromId));
      setAreArrowsAllowed(true);
    }, 3000);
  }, [props.arrowsMap]);

  const [areArrowsAllowed, setAreArrowsAllowed] = useState(true);
  const [localBoardArrowsMap, setLocalBoardArrowsMap] = useState<ArrowsMap>({});

  useDeepCompareEffect(() => {
    onArrowsChangeCb(localBoardArrowsMap);
  }, [localBoardArrowsMap]);

  const onArrowsChangeCb = useCallback(
    (nextLocalBoardArrowsMap: ArrowsMap) => {
      if (!onArrowsChange) {
        return;
      }

      if (!deepEquals(nextLocalBoardArrowsMap, props.arrowsMap)) {
        // Send them all outside
        onArrowsChange({
          ...props.arrowsMap,
          ...nextLocalBoardArrowsMap,
        });
      }
    },
    [onArrowsChange, props.arrowsMap, localBoardArrowsMap]
  );

  const arrowsToRender = useMemo(() => {
    return objectKeys(props.arrowsMap || {})
      .filter((a) => !Object(localBoardArrowsMap).hasOwnProperty(a))
      .map(toChessArrowFromId);
  }, [localBoardArrowsMap, props.arrowsMap]);

  const resetArrows = useCallback(() => {
    onArrowsChange({});
  }, []);

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
        customArrows={arrowsToRender}
        areArrowsAllowed={areArrowsAllowed}
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
        onArrowsChange={(nextArrows) => {
          if (
            nextArrows.length === 0 &&
            Object.keys(props.arrowsMap).length > 0
          ) {
            // Reset when the arrows are set back to 0
            resetArrows();
            return;
          }

          // console.log('on arrow change cb', nextArrows);
          return setLocalBoardArrowsMap(
            toDictIndexedBy(nextArrows, toChessArrowId, () => null)
          );
        }}
        {...props}
      />
    </div>
  );
};
