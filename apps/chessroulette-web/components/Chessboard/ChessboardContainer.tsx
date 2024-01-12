import {
  ChessFEN,
  GetComponentProps,
  ShortChessMove,
  isDarkSquare,
  objectKeys,
  toChessArrowFromId,
  toChessArrowId,
  toDictIndexedBy,
  toLongColor,
  useCallbackIf,
} from '@xmatter/util-kit';
import { Square } from 'chess.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Arrow } from 'react-chessboard/dist/chessboard/types';
import { useArrowColor } from './useArrowColor';
import { isPromotableMove } from 'util-kit/src/lib/ChessFENBoard/chessUtils';
import {
  ArrowsMap,
  CircleDrawTuple,
  CirclesMap,
} from 'apps/chessroulette-web/modules/room/activity/reducer';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { noop } from 'movex-core-util';
import { shallowEqualObjects } from 'shallow-equal';

type ChessBoardProps = GetComponentProps<typeof Chessboard>;

export type ChessboardContainerProps = Omit<
  ChessBoardProps,
  'position' | 'onArrowsChange'
> & {
  fen: ChessFEN;
  sizePx: number;
  arrowsMap?: ArrowsMap;
  circlesMap?: CirclesMap;
  arrowColor?: string;
  onMove?: (m: ShortChessMove) => boolean;
  lastMove?: ShortChessMove;
  onArrowsChange?: (arrows: ArrowsMap) => void;
  onCircleDraw?: (circleTuple: CircleDrawTuple) => void;
  onClearCircles?: () => void;
  inCheckSquare?: Square;
};

export const ChessboardContainer = ({
  fen,
  lastMove,
  // circledSquare,
  circlesMap,
  onArrowsChange = noop,
  onCircleDraw = noop,
  inCheckSquare,
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
      ...(circlesMap &&
        toDictIndexedBy(
          Object.values(circlesMap),
          ([sq]) => sq,
          ([_, hex]) => ({
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, 
              rgba(255,113,12,0) 80%,
              ${hex} 51.5%)`,
          })
        )),
      ...(inCheckSquare && {
        [inCheckSquare]: {
          borderRadius: '50%',
          // backdropFilter: 'blur(200px)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 0, 0, .6)',
          clipPath: 'circle(40%)',
          // border: `${props.sizePx / 64}px ${hex || 'red'} solid`,
        },
      }),
    };
  }, [lastMove, circlesMap, props.sizePx, inCheckSquare]);

  const [promoMove, setPromoMove] = useState<ShortChessMove>();
  const [localBoardArrowsMap, setLocalBoardArrowsMap] = useState<ArrowsMap>({});

  useDeepCompareEffect(() => {
    onArrowsChangeCb(localBoardArrowsMap);
  }, [localBoardArrowsMap]);

  const onArrowsChangeCb = useCallback(
    (nextLocalBoardArrowsMap: ArrowsMap) => {
      if (!onArrowsChange) {
        return;
      }

      if (!shallowEqualObjects(nextLocalBoardArrowsMap, props.arrowsMap)) {
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
  }, [onArrowsChange]);

  const resetCircles = useCallback(() => {
    props.onClearCircles?.();
  }, [props.onClearCircles]);

  const onSquareRightClick = useCallback(
    (sq: Square) => {
      onCircleDraw([sq, arrowColor]);
    },
    [onCircleDraw, arrowColor]
  );

  const [safelyMounted, setSafelyMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setSafelyMounted(true);
    }, 250);
  }, []);

  const onArrowsChangeAfterMount = useCallbackIf(
    safelyMounted,
    (nextArrows: Arrow[]) => {
      if (
        nextArrows.length === 0 &&
        Object.keys(props.arrowsMap || {}).length > 0
      ) {
        // Reset when the arrows are set back to 0
        resetArrows();
        return;
      }

      return setLocalBoardArrowsMap(
        toDictIndexedBy(nextArrows, toChessArrowId)
      );
    },
    []
  );

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
          // resetCircles();
          // resetArrows();

          // As long as the on PromotionPieceSelect is present this doesn't get triggered with a pieceSelect
          return !!props.onMove?.({ from, to });
        }}
        customSquareStyles={customSquareStyles}
        customArrows={arrowsToRender}
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
        onArrowsChange={onArrowsChangeAfterMount}
        onSquareRightClick={onSquareRightClick}
        {...props}
      />
    </div>
  );
};
