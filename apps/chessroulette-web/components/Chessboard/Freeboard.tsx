'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import {
  ChessColor,
  ChessFEN,
  ChessFENBoard,
  toLongColor,
  useCallbackIf,
  useIsFirstRender,
  useIsMounted,
  useMount,
} from '@xmatter/util-kit';
import { useArrowColor } from './useArrowColor';
import { Arrow, ChessboardProps } from 'react-chessboard/dist/chessboard/types';

type Props = {
  sizePx: number;
  fen?: ChessFEN;
  playingColor?: ChessColor;
  boardOrientation?: ChessColor;
  arrows?: Arrow[];
  onPieceDrop?: (p: { from: Square; to: Square }) => void;
  onArrowsChange?: ChessboardProps['onArrowsChange'];
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

  const arrowColor = useArrowColor();

  // const [canCall, setCanCall] = useState(false);

  // TODO: This isn't yet working correctly
  // const onArrowsChangeConditioned = useCallbackIf<
  //   NonNullable<ChessboardProps['onArrowsChange']>
  // >(
  //   canCall,
  //   (arrows) => {
  //     if (arrows.length === 0) {
  //       props.onArrowsChange?.([]);
  //     }
  //     else {
  //       props.onArrowsChange?.([...props.arrows || [], ...arrows]);
  //     }
  //   },
  //   [props.onArrowsChange, props.arrows?.length]
  // );

  // useEffect(() => {
  //   setTimeout(() => {
  //     setCanCall(true);
  //   }, 50);
  // }, []);

  // console.log('customArrows', props.arrows);

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
      customArrows={props.arrows}
      // onArrowsChange={onArrowsChangeConditioned}
      customArrowColor={arrowColor}
    />
  );
};
