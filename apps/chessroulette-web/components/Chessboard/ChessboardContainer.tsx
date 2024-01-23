import {
  ChessColor,
  ChessFEN,
  GetComponentProps,
  LongChessColor,
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Arrow } from 'react-chessboard/dist/chessboard/types';
import { useArrowColor } from './useArrowColor';
import { isPromotableMove } from 'util-kit/src/lib/ChessFENBoard/chessUtils';
import {
  ArrowsMap,
  CircleDrawTuple,
  CirclesMap,
  SquareMap,
} from 'apps/chessroulette-web/modules/room/activity/reducer';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { noop } from 'movex-core-util';
import { shallowEqualObjects } from 'shallow-equal';
import { deepmerge } from 'deepmerge-ts';
import { ChessboardSquare } from './ChessboardSquare';
import { useBoardTheme } from './useBoardTheme';

type ChessBoardProps = GetComponentProps<typeof Chessboard>;

export type ChessboardContainerProps = Omit<
  ChessBoardProps,
  'position' | 'onArrowsChange' | 'boardOrientation'
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
  inCheckSquares?: SquareMap;
  boardOrientation?: ChessColor;
};

export const ChessboardContainer = ({
  fen,
  lastMove,
  circlesMap,
  onArrowsChange = noop,
  onCircleDraw = noop,
  inCheckSquares,
  boardOrientation = 'white',
  ...props
}: ChessboardContainerProps) => {
  const boardTheme = useBoardTheme();

  const customStyles = useMemo(
    () => ({
      customDarkSquareStyle: props.customDarkSquareStyle || {
        backgroundColor: boardTheme.darkSquare,
      },
      customLightSquareStyle: props.customLightSquareStyle || {
        backgroundColor: boardTheme.lightSquare,
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
    const lastMoveStyle = lastMove && {
      [lastMove.from]: {
        background: boardTheme.lastMoveFromSquare,
      },
      [lastMove.to]: {
        background: boardTheme.lastMoveToSquare,
      },
    };

    const circledStyle =
      circlesMap &&
      toDictIndexedBy(
        Object.values(circlesMap),
        ([sq]) => sq,
        ([_, hex]) => ({
          position: 'relative',
          '> .circleDiv': {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            background: `radial-gradient(ellipse at     center, 
              rgba(255,113,12,0) 60%,
              ${hex} 51.5%)`,
            borderRadius: '50%',
          },
        })
      );

    const checkedStyle =
      inCheckSquares &&
      toDictIndexedBy(
        objectKeys(inCheckSquares),
        (sq) => sq,
        () => ({
          position: 'relative',
          '> .inCheckDiv': {
            // content: `''`,
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            background: 'red',
            borderRadius: '50%',
            opacity: 0.7,
          },
        })
      );

    return deepmerge(
      lastMoveStyle || {},
      circledStyle || {},
      checkedStyle || {}
    );
  }, [lastMove, circlesMap, props.sizePx, inCheckSquares, boardTheme]);

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
        boardOrientation={toLongColor(boardOrientation)}
        snapToCursor={false}
        arePiecesDraggable
        customBoardStyle={customStyles.customBoardStyle}
        customLightSquareStyle={customStyles.customLightSquareStyle}
        customDarkSquareStyle={customStyles.customDarkSquareStyle}
        customSquare={ChessboardSquare}
        onPieceDrop={(from, to) => {
          // As long as the on PromotionPieceSelect is present this doesn't get triggered with a pieceSelect
          return !!props.onMove?.({ from, to });
        }}
        onSquareClick={() => {
          // Reset the Arrows and Circles if present
          if (circlesMap && Object.keys(circlesMap).length > 0) {
            resetCircles();
          }

          if (props.arrowsMap && Object.keys(props.arrowsMap).length > 0) {
            resetArrows();
          }
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
