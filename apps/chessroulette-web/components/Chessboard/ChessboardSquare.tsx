import React from 'react';
import { CustomSquareProps } from 'react-chessboard/dist/chessboard/types';

type Props = CustomSquareProps;

export const ChessboardSquare = React.forwardRef(
  ({ square, squareColor, style: allStyles, children, ...props }: Props) => {
    const {
      ['> .circleDiv']: circleStyle,
      ['> .inCheckDiv']: inCheckStyle,
      ...style
    } = allStyles;

    return (
      <div style={style} {...props}>
        {inCheckStyle && typeof inCheckStyle === 'object' && (
          <div style={inCheckStyle} />
        )}
        {circleStyle && typeof circleStyle === 'object' && (
          <div style={circleStyle} />
        )}
        {children}
      </div>
    );
  }
);
