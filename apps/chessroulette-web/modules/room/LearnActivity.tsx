'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource } from 'movex-react';
import { ContainerWithDimensions } from 'apps/chessroulette-web/components/ContainerWithDimensions';
import { Chess, Color, Square } from 'chess.js';
import { useState } from 'react';
import {
  matrixInsert,
  matrixInsertMany,
} from 'apps/chessroulette-web/lib/matrix';
import { MatrixIndex } from 'chessterrain-react/lib/util-kit';
import ChessFENBoard from 'apps/chessroulette-web/lib/ChessFENBoard/ChessFENBoard';
import {
  fenBoardPieceSymbolToDetailed,
  fenBoardToChessBoard,
} from 'apps/chessroulette-web/lib/ChessFENBoard/chessUtils';
import { ChessFEN } from 'apps/chessroulette-web/components/Chessboard/type';
import { Chessboard } from 'react-chessboard';
import { Freeboard } from 'apps/chessroulette-web/components/Chessboard/Freeboard';

type ChessColor = 'white' | 'black';

type Props = {
  rid: ResourceIdentifier<'room'>;
  fen?: ChessFEN;
  playingColor?: ChessColor;
};

// export const indexedFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const indexedRanks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

const indexedFiles = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

export const alphaNotationToMatrixIndex = (sq: Square): MatrixIndex => {
  const file = indexedFiles[sq[0] as keyof typeof indexedFiles];
  const rank = 8 - Number(sq[1]);

  return [rank, file];
};

const calcState = (fen?: ChessFEN) => {
  // const chess = new Chess(fen);
  // const board = chess.board();

  const fenBoard = new ChessFENBoard(fen);

  // console.log('next fen', fenBoard.fen);
  // console.log('next board', fenBoard.board);
  // console.log('actual fen', fen);

  return {
    // chess,
    chessBoard: fenBoard,
    fen: fenBoard.fen,
    // pieceLayoutState: chessBoardToPieceLayout(
    //   fenBoardToChessBoard(fenBoard.board)
    // ),
    // turn: chess.turn() === 'b' ? 'black' : ('white' as ChessColor),
  };
};

export default ({ playingColor = 'white', ...props }: Props) => {
  // const chess = ; // TODO: this should be under useInstance

  // const [pieceLayoutState, setPieceLayoutState] = useState();

  const [boardState, setBoardState] = useState(calcState(props.fen));

  return (
    <MovexBoundResource
      movexDefinition={movexConfig}
      rid={props.rid}
      render={({ boundResource: { state, dispatch } }) => {
        return (
          <ContainerWithDimensions
            className="h-full w-full"
            render={(s) => (
              <Freeboard sizePx={s.height} />
              // <ChessBoard
              //   sizePx={s.height}
              //   playingColor={'black'}
              //   pieceLayoutState={boardState.pieceLayoutState}
              //   onMove={(p) => {
              //     // console.log('learn on move', chess.board());

              //     // const prevBoard = boardState.chessBoard;

              //     try {
              //       boardState.chessBoard.move(p.move.from, p.move.to);

              //       setBoardState(calcState(boardState.chessBoard.fen));
              //     } catch (e) {
              //       console.warn('No piece to move Error');
              //     }

              //     // const movingFenPiece = boardState.chessBoard.piece(
              //     //   p.move.from
              //     // );
              //     // const movingPiece = movingFenPiece
              //     //   ? fenBoardPieceSymbolToDetailed(movingFenPiece)
              //     //   : undefined;

              //     // console.log('movingPiece', movingPiece);

              //     // p.move.from.
              //     // console.log(
              //     //   'alphaNotationToMatrixIndex',
              //     //   p.move.from,
              //     //   alphaNotationToMatrixIndex(p.move.from),
              //     //   '>',
              //     //   p.move.to,
              //     //   alphaNotationToMatrixIndex(p.move.to)
              //     // );
              //     // const nextState = calcState(props.fen);

              //     // const nextBoard = matrixInsertMany(boardState.chessBoard, [
              //     //   {
              //     //     index: alphaNotationToMatrixIndex(p.move.from),
              //     //     nextVal: null,
              //     //   },
              //     //   {
              //     //     index: alphaNotationToMatrixIndex(p.move.to),
              //     //     nextVal: {
              //     //       square: p.move.to,
              //     //       type: movingPiece.type,
              //     //       color: movingPiece.color,
              //     //     },
              //     //   },
              //     // ]);

              //     // setBoardState((prev) => ({
              //     //   ...prev,
              //     //   chessBoard: nextBoard,
              //     //   pieceLayoutState: chessBoardToPieceLayout(nextBoard),
              //     //   // turn: (chess.turn() === 'b'
              //     //   //   ? 'black'
              //     //   //   : 'white') as ChessColor,
              //     // }));

              //     // try {
              //     //   const movingPiece = chess.get(p.move.from);

              //     //   console.log('movingPiece', movingPiece);

              //     //   chess.remove(p.move.from);
              //     //   chess.put(movingPiece, p.move.to);

              //     //   console.log('learn on move', chess.turn());

              //     //   const nextchessBoard = chess.board();

              //     //   setBoardState((prev) => ({
              //     //     chessBoard: nextchessBoard,
              //     //     pieceLayoutState: chessBoardToPieceLayout(nextchessBoard),
              //     //     turn: (chess.turn() === 'b'
              //     //       ? 'black'
              //     //       : 'white') as ChessColor,
              //     //   }));
              //     // } catch (e) {
              //     //   console.log('move invalid', p.move);
              //     // }
              //   }}
              // />
            )}
          />
        );
      }}
    />
  );
};
