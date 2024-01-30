import { PieceSan } from '@xmatter/util-kit';
import { Square } from 'chess.js';
import { useMemo, useRef } from 'react';
import { useContainerRect } from '../../ContainerWithDimensions';
import {
  absoluteCoordsToSquare,
  boardCoordsToSquare,
  getBoardCoordsFromAbsoluteCoords,
  getSquareSize,
} from './util';
import { useDrop } from 'react-dnd';
import { DndItem } from './types';

export const DropContainer = (
  props: React.PropsWithChildren & {
    onDrop: (pieceSan: PieceSan, sq: Square) => void;
    onHover?: (pieceSan: PieceSan, sq: Square) => void;
    isActive: boolean;
  }
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rect = useContainerRect(containerRef);
  const squareSize = useMemo(() => getSquareSize(rect.width), [rect]);

  const [_, drop] = useDrop(
    () => ({
      // The type (or types) to accept - strings or symbols
      accept: 'piece',
      // Props to collect
      drop: (item: DndItem, monitor) => {
        // return;
        const offsets = monitor.getClientOffset();

        if (!offsets) {
          return;
        }

        const absoluteCoords = {
          x: offsets.x - rect.left,
          y: offsets.y - rect.top,
        };

        const droppedOnSquare = absoluteCoordsToSquare({
          absoluteCoords,
          squareSize,
        });

        if (droppedOnSquare) {
          props.onDrop(item.pieceSan, droppedOnSquare);
        }
      },
      ...(props.onHover && {
        hover: (item: DndItem, monitor) => {
          const offsets = monitor.getClientOffset();

          if (!offsets) {
            return;
          }

          const absoluteCoords = {
            x: offsets.x - rect.left,
            y: offsets.y - rect.top,
          };

          const droppedOnSquare = boardCoordsToSquare(
            getBoardCoordsFromAbsoluteCoords({
              absoluteCoords,
              squareSize,
            })
          );

          if (props.onHover && droppedOnSquare) {
            props.onHover(item.pieceSan, droppedOnSquare);
          }
        },
      }),
      // collect: (monitor) => ({
      //   isOver: monitor.isOver(),
      //   canDrop: monitor.canDrop(),
      //   item: monitor.getItem(),
      //   res: monitor.getDropResult(),
      //   offset: monitor.getDifferenceFromInitialOffset(),
      // }),
    }),
    [rect, squareSize]
  );

  return (
    <div ref={drop} role={'Dustbin'} className="relative">
      <div ref={containerRef}>
        {props.children}
        {/* This is needed in orderd to stop/start the native Board Dnd */}
        {props.isActive && (
          <div className="absolute inset-0 flex items-center justify-center" />
        )}
      </div>
    </div>
  );
};
