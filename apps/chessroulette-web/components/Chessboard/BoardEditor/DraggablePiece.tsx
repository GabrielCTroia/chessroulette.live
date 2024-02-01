import React from 'react';
import { PieceSan, isObject, keyInObject } from '@xmatter/util-kit';
import { pieces as pieceGraphics } from '../assets/mahaPieces';
import { DraggableItem, DraggablePieceProps } from './DraggableItem';

type Props = DraggablePieceProps & {
  pieceSan: PieceSan;
  squareSize: number;
};

export const DraggablePiece: React.FC<Props> = React.memo(
  ({ squareSize, ...props }) => {
    const img = pieceGraphics[props.pieceSan];
    const imgSrc = isObject(img) && keyInObject(img, 'src') ? img.src : img;

    return (
      <DraggableItem {...props}>
        <img src={imgSrc} style={{ width: squareSize }} />
      </DraggableItem>
    );
  }
);
