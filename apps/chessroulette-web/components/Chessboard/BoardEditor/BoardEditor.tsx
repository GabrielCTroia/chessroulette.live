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
  fen: ChessFEN;
  onUpdated: (fen: ChessFEN) => void;
};

const whitePieces: PieceSan[] = ['wP', 'wB', 'wN', 'wQ', 'wR'];
const blackPieces: PieceSan[] = ['bP', 'bB', 'bN', 'bQ', 'bR'];

export const BoardEditor = ({
  fen = ChessFENBoard.STARTING_FEN,
  sizePx,
  onUpdated = noop,
  ...props
}: Props) => {
  const fenBoard = useInstance<ChessFENBoard>(new ChessFENBoard(fen));
  // const [editedFen, setEditedFen] = useState(fenBoard.fen);
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

  // useEffect(() => {
  //   onUpdated(editedFen);
  // }, [editedFen, onUpdated]);

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

  const [draggedPiece, setDraggedPiece] = useState<{
    piece: PieceSan;
    from: Square;
    dropped: boolean;
  }>();

  const cb = useCallback(() => {
    console.log('dragged piece', draggedPiece);
  }, [draggedPiece]);

  return (
    <div
      className="flex flex-col sjustify-between items-center justify-center"
      style={{ height: sizePx }}
    >
      <DndProvider backend={HTML5Backend}>
        <div
          className="flex flex-cosl justify-between items-center justify-center"
          style={{
            width: sizePx,
            // height: sizePx,
          }}
        >
          <div className="flex flex-col flex-1s rounded-lg overflow-hidden bg-slate-100">
            {blackPieces.map(renderPiece)}
          </div>
          <DropContainer
            isActive={isDragging}
            onHover={(_, square) => {
              setHoveredSquare(square);
            }}
            onDrop={(pieceSan, square) => {
              fenBoard.put(square, pieceSanToFenBoardPieceSymbol(pieceSan));

              // setEditedFen(fenBoard.fen);
              onUpdated(fenBoard.fen);
              setHoveredSquare(undefined);
            }}
          >
            <ChessboardContainer
              fen={fen}
              id="board-editor"
              {...props}
              onMove={(p) => {
                fenBoard.move(p.from, p.to);

                // setEditedFen(fenBoard.fen);
                onUpdated(fenBoard.fen);

                setHoveredSquare(undefined);

                return true;
              }}
              onPieceDragBegin={(piece, from) => {
                // console.log('onPieceDragStart', piece, from);
                // console.log('onPieceDragStart', draggedPiece);

                setDraggedPiece({ piece, dropped: false, from });
              }}
              onPieceDrop={(from, to, piece) => {
                // console.log('on piece drop boar deditor', args);
                // console.log('dropped', draggedPiece);

                setDraggedPiece({ piece, dropped: true, from });
                return true;
              }}
              onPieceDragEnd={(piece, from) => {
                setDraggedPiece((prev) => {
                  if (prev) {
                    const {
                      piece: draggedPiece,
                      dropped,
                      from: prevFrom,
                    } = prev;

                    console.log('on drag end', prev, from, prevFrom);

                    // If the draggedPiece haven't dropped yet, it means it got dragged outside
                    if (
                      draggedPiece === piece &&
                      // prevFrom !== from &&
                      dropped === false
                    ) {
                      fenBoard.clear(from);

                      onUpdated(fenBoard.fen);
                    }
                  }

                  return undefined;
                });
              }}
              arePiecesDraggable
              allowDragOutsideBoard
              dropOffBoardAction="trash"
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
          <div className="flex flex-col flex-1s rounded-lg overflow-hidden sbg-opacity-30 bg-slate-100">
            {whitePieces.map(renderPiece)}
          </div>
        </div>
      </DndProvider>
      {/* <div> */}
      {/* {draggedPiece} */}
      {/* <Text>{editedFen}</Text> */}
      {/* </div> */}
    </div>
  );
};
