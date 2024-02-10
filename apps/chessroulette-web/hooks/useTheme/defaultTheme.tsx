import {
  GetComponentProps,
  PieceSan,
  objectKeys,
  toDictIndexedBy,
} from '@xmatter/util-kit';
import { Chessboard } from 'react-chessboard';
import { Piece } from 'apps/chessroulette-web/components/Chessboard/Piece';
import { pieces as MahaPieces } from 'apps/chessroulette-web/components/Chessboard/assets/mahaPieces';

export type ChessBoardProps = GetComponentProps<typeof Chessboard>;

type Theme = {
  name: string;
  board: {
    darkSquare: string;
    lightSquare: string;
    arrowColors: [string, string, string];
    lastMoveToSquare: string;
    lastMoveFromSquare: string;
    hoveredSquare: string;
    customPieces?: ChessBoardProps['customPieces'];
    renderPiece?: (p: {
      pieceSan: PieceSan;
      squareWidth: number;
    }) => React.ReactElement;
  };
};

const chessrouletteTheme: Theme = {
  name: 'chessroulette',
  board: {
    darkSquare: 'rgba(0, 163, 255, .4)',
    lightSquare: 'white',
    arrowColors: ['#11c6d1', '#f2358d', '#6f7381'],
    lastMoveToSquare: 'rgba(234, 183, 255, .5)',
    lastMoveFromSquare: 'rgba(234, 183, 255, .5)',
    hoveredSquare: 'rgba(204, 183, 255, .9)',
  },
};

const outpostTheme: Theme = {
  name: 'outpost',
  board: {
    darkSquare: '#C8A07D',
    lightSquare: 'white',
    arrowColors: ['#11c6d1', '#f2358d', '#6f7381'],
    lastMoveToSquare: 'rgba(95, 15, 15, .6)',
    lastMoveFromSquare: 'rgba(95, 15, 15, .6)',
    hoveredSquare: 'rgba(134, 583, 255, .5)',
  },
};

const renderKidsThemePiece: Theme['board']['renderPiece'] = ({
  pieceSan,
  squareWidth,
}) => (
  <Piece
    registry={MahaPieces}
    squareSize={squareWidth * 1}
    pieceSan={pieceSan}
    className="mb-4"
    style={{
      marginTop: '-1%',
    }}
  />
);

const kidsTheme: Theme = {
  name: 'kids',
  board: {
    ...chessrouletteTheme.board,
    renderPiece: renderKidsThemePiece,
    customPieces: toDictIndexedBy(
      objectKeys(MahaPieces),
      (pieceSan) => pieceSan,
      (pieceSan) => (p: { squareWidth: number }) =>
        renderKidsThemePiece({ pieceSan, squareWidth: p.squareWidth })
      // (
      //   <Piece
      //     registry={MahaPieces}
      //     squareSize={p.squareWidth * 1}
      //     pieceSan={pieceSan}
      //     className="mb-4"
      //     style={{
      //       marginTop: '-1%',
      //     }}
      //   />
      // )
    ),
  },
};

export const defaultTheme = chessrouletteTheme;

export const themes = {
  chessroulette: chessrouletteTheme,
  cr: chessrouletteTheme,
  outpost: outpostTheme,
  op: outpostTheme,
  kids: kidsTheme,
};
