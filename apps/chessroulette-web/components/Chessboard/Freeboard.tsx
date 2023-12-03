import ChessFENBoard from 'apps/chessroulette-web/lib/ChessFENBoard/ChessFENBoard';
import { fenBoardToChessBoard } from 'apps/chessroulette-web/lib/ChessFENBoard/chessUtils';
// import {
//   ChessBoard,
//   ChessFEN,
//   chessBoardToPieceLayout,
// } from 'chessterrain-react';
import { useState } from 'react';
import { chessBoardToPieceLayout } from './util';
import { ChessFEN } from './type';
import { ChessBoardAsClass } from './ChessBoardAsClass';
import { Color } from 'chessterrain-react';

type Props = {
  sizePx: number;
  fen?: ChessFEN;
  playingColor?: Color;
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

export const Freeboard = (props: Props) => {
  const [boardState, setBoardState] = useState(calcState(props.fen));

  return (
    <ChessBoardAsClass
      sizePx={props.sizePx}
      playingColor={props.playingColor || 'white'}
      fen={boardState.fen}
      // pieceLayoutState={boardState.pieceLayoutState}
      onMove={(p) => {
        try {
          boardState.chessBoard.move(p.move.from, p.move.to);

          setBoardState(calcState(boardState.chessBoard.fen));
        } catch (e) {
          console.warn('No piece to move Error');
        }
      }}
    />
  );
};
