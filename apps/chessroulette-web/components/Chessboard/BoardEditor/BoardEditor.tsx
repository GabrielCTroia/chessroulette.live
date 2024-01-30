import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChessFEN,
  ChessFENBoard,
  PieceSan,
  objectKeys,
  pieceSanToFenBoardPieceSymbol,
} from '@xmatter/util-kit';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  ChessboardContainer,
  ChessboardContainerProps,
} from '../ChessboardContainer';
import { Square } from 'chess.js';
import useInstance from '@use-it/instance';
import { noop } from 'movex-core-util';

import { useBoardTheme } from '../useBoardTheme';
import { getSquareSize } from './util';
import { DropContainer } from './DropContainer';
import { DraggablePiece } from './DraggablePiece';

type Props = Pick<ChessboardContainerProps, 'sizePx'> & {
  fen?: ChessFEN;
  onUpdated?: (fen: ChessFEN) => void;
};

const whitePieces: PieceSan[] = ['wP', 'wB', 'wK', 'wN', 'wQ', 'wR'];
const blackPieces: PieceSan[] = ['bP', 'bB', 'bK', 'bN', 'bQ', 'bR'];

export const BoardEditor = ({
  fen = ChessFENBoard.STARTING_FEN,
  sizePx,
  onUpdated = noop,
  ...props
}: Props) => {
  const fenBoard = useInstance<ChessFENBoard>(new ChessFENBoard(fen));
  const [editedFen, setEditedFen] = useState(fenBoard.fen);
  const [draggingPieces, setDraggingPieces] = useState<
    Partial<Record<PieceSan, boolean>>
  >({});

  const isDragging = useMemo(
    () => objectKeys(draggingPieces).length > 0,
    [draggingPieces]
  );

  const { boardSize, squareSize } = useMemo(() => {
    const nextBoardSize = sizePx / 1.3;

    return {
      boardSize: nextBoardSize,
      squareSize: getSquareSize(nextBoardSize),
    };
  }, [sizePx]);

  useEffect(() => {
    onUpdated(editedFen);
  }, [editedFen, onUpdated]);

  const boardTheme = useBoardTheme();
  const [hoveredSquare, setHoveredSquare] = useState<Square>();

  const onPieceDraggingStarted = useCallback(
    (pieceSan: PieceSan) => {
      if (!draggingPieces[pieceSan]) {
        setDraggingPieces((prev) => ({
          ...prev,
          [pieceSan]: true,
        }));
      }
    },
    [draggingPieces]
  );

  const onPieceDraggingStopped = useCallback(
    (pieceSan: PieceSan) => {
      if (draggingPieces[pieceSan]) {
        const { [pieceSan]: _removed, ...prevWithoutRemoved } = draggingPieces;

        setDraggingPieces(prevWithoutRemoved);
      }
    },
    [draggingPieces]
  );

  const renderPiece = (pieceSan: PieceSan) => (
    <DraggablePiece
      key={pieceSan}
      pieceSan={pieceSan}
      squareSize={squareSize}
      onDraggingStarted={onPieceDraggingStarted}
      onDraggingStopped={onPieceDraggingStopped}
      className="hover:cursor-pointer hover:bg-slate-200"
    />
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="flex flex-col justify-between items-center justify-center"
        style={{
          width: sizePx,
          height: sizePx,
        }}
      >
        <div className="flex flex-1s rounded-lg overflow-hidden bg-slate-100">
          {blackPieces.map(renderPiece)}
        </div>
        <DropContainer
          isActive={isDragging}
          onHover={(_, square) => {
            setHoveredSquare(square);
          }}
          onDrop={(pieceSan, square) => {
            fenBoard.put(square, pieceSanToFenBoardPieceSymbol(pieceSan));

            setEditedFen(fenBoard.fen);
            setHoveredSquare(undefined);
          }}
        >
          <ChessboardContainer
            fen={editedFen}
            id="board-editor"
            // {...props}
            onMove={(p) => {
              fenBoard.move(p.from, p.to);

              setEditedFen(fenBoard.fen);

              setHoveredSquare(undefined);

              return true;
            }}
            onPieceDrop={(...args) => {
              console.log('on piece drop boar deditor', args);
            }}
            onPieceDragEnd={(p, from) => {
              console.log('onPieceDragEnd', p, from)
            }}
            onDragOverSquare={(s) => {
              console.log('s', s)
            }}
            // customNotationStyle
            arePiecesDraggable
            allowDragOutsideBoard
            dropOffBoardAction="snapback"
            sizePx={boardSize}
            customSquareStyles={{
              ...(hoveredSquare && {
                [hoveredSquare]: {
                  boxShadow: `inset 0 0 5px 5px ${boardTheme.hoveredSquare}`,
                },
              }),
            }}
          />
        </DropContainer>
        <div className="flex flex-1s rounded-lg overflow-hidden sbg-opacity-30 bg-slate-100">
          {whitePieces.map(renderPiece)}
        </div>
      </div>
    </DndProvider>
  );
};
