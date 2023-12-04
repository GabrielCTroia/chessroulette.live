import ChessFENBoard from 'apps/chessroulette-web/lib/ChessFENBoard/ChessFENBoard';
import { useState } from 'react';
import { ChessFEN } from './type';
import { ChessBoardAsClass } from './ChessBoardAsClass';
import { Color } from 'chessterrain-react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';

export type Piece = "wP" | "wB" | "wN" | "wR" | "wQ" | "wK" | "bP" | "bB" | "bN" | "bR" | "bQ" | "bK";

type Props = {
  sizePx: number;
  fen?: ChessFEN;
  playingColor?: Color;
};

const calcState = (fen?: ChessFEN) => {
  const fenBoard = new ChessFENBoard(fen);

  return {
    chessBoard: fenBoard,
    fen: fenBoard.fen,
  };
};

export const Freeboard = (props: Props) => {
  const [boardState, setBoardState] = useState(calcState(props.fen));

  const [touchedPiece, setTouchedPiece] = useState<Piece>();

  const [moveFrom, setMoveFrom] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});

  // function getMoveOptions(square: Square) {
  //   const moves = game.moves({
  //     square,
  //     verbose: true,
  //   });
  //   if (moves.length === 0) {
  //     setOptionSquares({});
  //     return false;
  //   }

  //   const newSquares = {};
  //   moves.map((move) => {
  //     newSquares[move.to] = {
  //       background:
  //         game.get(move.to) &&
  //         game.get(move.to).color !== game.get(square).color
  //           ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
  //           : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
  //       borderRadius: "50%",
  //     };
  //     return move;
  //   });
  //   newSquares[square] = {
  //     background: "rgba(255, 255, 0, 0.4)",
  //   };
  //   setOptionSquares(newSquares);
  //   return true;
  // }

  // function onSquareClick(square: Square) {
  //   setRightClickedSquares({});

  //   // from square
  //   if (!moveFrom) {
  //     const hasMoveOptions = getMoveOptions(square);
  //     if (hasMoveOptions) setMoveFrom(square);
  //     return;
  //   }

  //   // to square
  //   if (!moveTo) {
  //     // check if valid move before showing dialog
  //     const moves = game.moves({
  //       moveFrom,
  //       verbose: true,
  //     });
  //     const foundMove = moves.find(
  //       (m) => m.from === moveFrom && m.to === square
  //     );
  //     // not a valid move
  //     if (!foundMove) {
  //       // check if clicked on new piece
  //       const hasMoveOptions = getMoveOptions(square);
  //       // if new piece, setMoveFrom, otherwise clear moveFrom
  //       setMoveFrom(hasMoveOptions ? square : "");
  //       return;
  //     }

  //     // valid move
  //     setMoveTo(square);

  //     // if promotion move
  //     if (
  //       (foundMove.color === "w" &&
  //         foundMove.piece === "p" &&
  //         square[1] === "8") ||
  //       (foundMove.color === "b" &&
  //         foundMove.piece === "p" &&
  //         square[1] === "1")
  //     ) {
  //       setShowPromotionDialog(true);
  //       return;
  //     }

  //     // is normal move
  //     const gameCopy = { ...game };
  //     const move = gameCopy.move({
  //       from: moveFrom,
  //       to: square,
  //       promotion: "q",
  //     });

  //     // if invalid, setMoveFrom and getMoveOptions
  //     if (move === null) {
  //       const hasMoveOptions = getMoveOptions(square);
  //       if (hasMoveOptions) setMoveFrom(square);
  //       return;
  //     }

  //     setGame(gameCopy);

  //     setTimeout(makeRandomMove, 300);
  //     setMoveFrom("");
  //     setMoveTo(null);
  //     setOptionSquares({});
  //     return;
  //   }
  // }


  return (
    <Chessboard
      position={boardState.fen}
      boardWidth={props.sizePx}
      showBoardNotation
      snapToCursor={false}
      arePiecesDraggable
      // onPieceClick={(p) => {
      //   console.log('piece clicked', p);

      //   if (touchedPiece) {
      //     setTouchedPiece()
      //   }
      //   setTouchedPiece(p);
      // }}
      onSquareClick={(sq) => {
        if (touchedPiece) {

        }
        console.log('sq clicked', sq)
      }}
    />
  );

  // return (
  //   <ChessBoardAsClass
  //     sizePx={props.sizePx}
  //     playingColor={props.playingColor || 'white'}
  //     fen={boardState.fen}
  //     onMove={(p) => {
  //       try {
  //         boardState.chessBoard.move(p.move.from, p.move.to);

  //         setBoardState(calcState(boardState.chessBoard.fen));
  //       } catch {
  //         console.warn('No piece to move Error');
  //       }
  //     }}
  //   />
  // );
};
