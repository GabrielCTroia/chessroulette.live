import React from 'react';
import {
  SerializedCoord,
  RelativeCoord,
  serializeCoord,
  invoke,
  ChessTerrainProps,
  ChessTerrain,
  RelativeCoordsWithPiece,
  RelativeCoordsWithOptionalPiece,
  toShortColor,
  StyledTerrainCoord,
  toDictIndexedBy,
  Terrain,
  GeneralBoardState,
} from 'chessterrain-react';
import { Chess } from 'chess.js';
import { ChessFEN, ChessMove } from './type';
import { chessBoardToPieceLayout, relativeCoordToSquare } from './util';
import {
  hoveredOwnPieceSquareStyle,
  touchedPieceSquareStyle,
} from './squareStyles';
import { fenBoardToChessBoard } from 'apps/chessroulette-web/lib/ChessFENBoard/chessUtils';
import ChessFENBoard from 'apps/chessroulette-web/lib/ChessFENBoard/ChessFENBoard';
/**
 * This is the component that works with the Chess Game rules and makes the Terrain (piece, square) interaction possible
 * It would be a different such Board component per Game type (i.e. Maha would have a different one)
 */

// TODO: The identifiablePiece should be given gerneically so the pieceSTate is inferrred correctly outside
export type ChessBoardAsClassProps = Pick<
  ChessTerrainProps,
  'sizePx' | 'playingColor' | 'showAnnotations'
> & {
  // pieceLayoutState: GeneralPieceLayoutState<PieceRegistry>; // TODO: PieceRegistry this can be hardcoded for chess
  fen?: ChessFEN;
  onMove: (p: { move: ChessMove }) => void;
};

const terrain = new Terrain({ props: { width: 8 } });

const gameClient = new Chess();

const startingChessBoard = gameClient.board();

// export type PieceWithCoord = {
//   piece: IdentifiablePieceState;
//   relativeCoords: RelativeCoord;
// };

export type RelativeCoordsMap = Record<SerializedCoord, RelativeCoord>;

export type StyledSquaresState = {
  hoveredSquare?: RelativeCoordsMap;
  possibleMoves?: RelativeCoordsMap;
};

type State = {
  touchedPiece?: RelativeCoordsWithPiece;
  hoveredPiece?: RelativeCoordsWithPiece;

  // pendingPromoMove?: PendingPromoMove;

  styledSquares: StyledSquaresState;

  // pieceLayoutState: GeneralPieceLayoutState<PieceRegistry>;

  board: GeneralBoardState;
};

const CLEAR_STYLED_SQUARES_STATE: StyledSquaresState = {
  possibleMoves: undefined,
  hoveredSquare: undefined,
};

export class ChessBoardAsClass extends React.Component<
  ChessBoardAsClassProps,
  State
> {
  override state: State = {
    styledSquares: CLEAR_STYLED_SQUARES_STATE,
    board: {
      terrainState: new Terrain({ props: { width: 8 } }).state,
      pieceLayoutState: chessBoardToPieceLayout(startingChessBoard),
    },
  };

  setDraggedPiece() {}

  onCoordHover = (p: RelativeCoordsWithOptionalPiece) => {
    // console.log('on coords hover', p);

    // If not piece no hover
    if (!p.piece) {
      if (this.state.hoveredPiece) {
        this.hoverPiece(undefined);
      }

      return;
    }

    if (p.piece.id !== this.state.touchedPiece?.piece.id) {
      this.hoverPiece({
        piece: p.piece,
        relativeCoords: p.relativeCoords,
      });
    }
  };

  override componentDidUpdate(
    prevProps: Readonly<ChessBoardAsClassProps>
  ): void {
    // If the FEN updated
    if (prevProps.fen !== this.props.fen) {
      this.setState({
        board: {
          ...this.state.board,
          pieceLayoutState: chessBoardToPieceLayout(
            // TODO: This could be optimized to load the new fen!
            fenBoardToChessBoard(new ChessFENBoard(this.props.fen).board)
          ),
        },
      });
    }
  }

  private onCoordClicked = (p: RelativeCoordsWithOptionalPiece) => {
    const { touchedPiece } = this.state;

    if (p.piece) {
      if (touchedPiece && p.piece.id === touchedPiece.piece.id) {
        this.touchPiece(undefined);
        return;
      }

      // If same color, just touch it
      // else if (p.piece.color === toShortColor(this.props.playingColor)) {
      this.touchPiece({
        piece: p.piece,
        relativeCoords: p.relativeCoords,
      });
      // }
    }

    if (touchedPiece) {
      this.props.onMove({
        move: {
          from: relativeCoordToSquare(touchedPiece.relativeCoords),
          to: relativeCoordToSquare(p.relativeCoords),
        },
      });
      this.touchPiece(undefined);

      return;
    }

    // if (touchedPiece) {
    //   this.touchPiece(undefined);

    //   if (touchedPiece.piece.id === p.piece?.id) {
    //     return;
    //   }

    //   // if (p.piece && p.piece.id !== touchedPiece.piece.id) {

    //   // }

    //   this.props.onMove({
    //     move: {
    //       from: relativeCoordToSquare(touchedPiece.relativeCoords),
    //       to: relativeCoordToSquare(p.relativeCoords),
    //     },
    //   });
    // }
    // else if (p.piece !== undefined) {
    //   this.touchPiece({
    //     piece: p.piece,
    //     relativeCoords: p.relativeCoords,
    //   });
    // }
    //  else {
    // this.props.onMove({
    //   move: {
    //     from: relativeCoordToSquare(touchedPiece.relativeCoords),
    //     to: relativeCoordToSquare(p.relativeCoords),
    //   },
    // });
    // }

    // if (p?.piece.id === .piece.id) {
    //   this.touchPiece(undefined);
    //   return;
    // }

    // if (p.piece) {

    //   this.onPieceClicked({
    //     piece: p.piece,
    //     relativeCoords: p.relativeCoords,
    //   });
    // } else {
    //   // this.onEmptySquareClicked(p.relativeCoords);
    // }
    // const onInteractableCoordClicked = useCallbackIf(
    //   canTouch,
    //   (coord: Coord, piece?: IdentifiablePieceState) =>
    //     piece ? onPieceClicked({ piece, coord }) : onEmptySquareClicked(coord),
    //   [onPieceClicked, onEmptySquareClicked]
    // );
  };

  private onPieceClicked = (p: RelativeCoordsWithPiece) => {
    const { touchedPiece } = this.state;

    // If the next Touched Piece is also mine (but moving) maybe the Touched Piece wants to take it's place there
    if (touchedPiece) {
      // TODO: move
      // const drawingResult = this.attemptToDrawArrowForTouchedPiece({
      //   to: p.relativeCoords,
      //   piece: touchedPiece.piece,
      //   from: touchedPiece.coord,
      // });
      // if (drawingResult.ok) {
      //   this.clearTouchedPiece();
      //   return;
      // }
      if (touchedPiece.piece.id === p.piece.id) {
        this.touchPiece(undefined);
        return;
      }
    }

    // Otherwise, if the Piece is mine, it means: "touch"
    if (toShortColor(this.props.playingColor) === p.piece.color) {
      this.touchPiece(p);
    }
  };

  onEmptySquareClicked = (coords: RelativeCoord) => {
    this.setState({
      styledSquares: {
        hoveredSquare: {
          [serializeCoord(coords)]: coords,
        },
      },
    });
  };

  private touchPiece = (p: RelativeCoordsWithPiece | undefined) => {
    this.setState({
      touchedPiece: p,
      hoveredPiece: undefined,
    });

    // TODO: Actual capture if needed
  };

  private hoverPiece = (p: RelativeCoordsWithPiece | undefined) => {
    this.setState({
      hoveredPiece: p,
    });
  };

  private onPieceDragStarted = () => {};

  private onPieceDragUpdated = () => {};

  private onPieceDragEnded = () => {};

  render() {
    const { playingColor, ...chessTerrainProps } = this.props;

    // This could be memoized
    const mergedStyledCoords: Record<SerializedCoord, StyledTerrainCoord> =
      invoke(() => {
        const { styledSquares } = this.state;

        if (!this.state.styledSquares) {
          return {};
        }

        const { hoveredSquare } = this.state.styledSquares;

        const { touchedPiece, hoveredPiece } = this.state;

        return {
          ...toDictIndexedBy(
            [
              ...(touchedPiece
                ? [
                    {
                      // ...touchedPiece.,
                      relativeCoord: touchedPiece.relativeCoords,
                      style: touchedPieceSquareStyle,
                      // hoveredSquare.piece.color ===
                      // chessTerrainProps.playingColor
                      //   ? hoveredOwnPieceSquareStyle
                      //   : hoveredOtherPieceSquareStyle,
                    },
                  ]
                : []),
              ...(hoveredPiece
                ? [
                    {
                      relativeCoord: hoveredPiece.relativeCoords,
                      style: hoveredOwnPieceSquareStyle,
                    },
                  ]
                : []),
              // ...(hoveredSquare ? Object.values(hoveredSquare).map((dest) => [
              //   relativeCoord: hoveredSquare.,
              //   style: touchedPieceSquareStyle,
              // ] : []),
              ...Object.values(styledSquares.hoveredSquare || {}).map(
                (dest) => ({
                  relativeCoord: dest,
                  style: hoveredOwnPieceSquareStyle,
                })
              ),
            ],
            (p) => serializeCoord(p.relativeCoord)
          ),

          // Extra
          // ...styledCoords,
        };
      });
    return (
      <>
        <ChessTerrain
          board={this.state.board}
          darkSquareColor="rgba(0, 163, 255, .3)"
          playingColor={this.props.playingColor}
          onCoordClicked={this.onCoordClicked}
          onCoordHover={this.onCoordHover}
          styledCoords={mergedStyledCoords}
          {...chessTerrainProps}
        />
        {/* <div className="draggable-layer">
          {draggedPiece && (
            <img
              src={
                dark[
                  `${draggedPiece.color}${draggedPiece.label}` as keyof typeof dark
                ]
              }
              style={{
                height: draggedPiece.squareSize,
                position: 'absolute',
                top: absoluteCoords?.y,
                left: absoluteCoords?.x,
                // scale: '.8',
              }}
            />
          )}
        </div> */}
      </>
    );
  }
}
