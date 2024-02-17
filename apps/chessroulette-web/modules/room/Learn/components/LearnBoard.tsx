import { LearnActivityState, SquareMap } from '../../activity/reducer';
import { useMemo } from 'react';
import { MovexBoundResourceFromConfig } from 'movex-react';
import movexConfig from 'apps/chessroulette-web/movex.config';
import { useLearnActivitySettings } from '../useLearnActivitySettings';
import { Freeboard } from 'apps/chessroulette-web/components/Chessboard/Freeboard';
import { Playboard } from 'apps/chessroulette-web/components/Chessboard/Playboard';
import {
  ChessFEN,
  ChessFENBoard,
  FreeBoardHistory,
  getNewChessGame,
  toDictIndexedBy,
} from '@xmatter/util-kit';
import { Square } from 'chess.js';
import { ChessboardContainerProps } from 'apps/chessroulette-web/components/Chessboard/ChessboardContainer';

type Props = Pick<
  ChessboardContainerProps,
  'onMove' | 'onArrowsChange' | 'onCircleDraw' | 'onClearCircles'
> & {
  state: LearnActivityState['activityState'];
  sizePx: number;
};

export const LearnBoard = ({
  state: { history, fen, boardOrientation, arrows, circles },
  // dispatch,
  sizePx,
  ...chessBoardProps
}: Props) => {
  const settings = useLearnActivitySettings();
  const lm = FreeBoardHistory.findMoveAtIndex(
    history.moves,
    history.focusedIndex
  );
  const lastMove = lm?.isNonMove ? undefined : lm;

  // Don't leave this here as it's not optimal
  const inCheckSquaresMap = useMemo(() => getInCheckSquareMap(fen), [fen]);

  const Board = settings.canMakeInvalidMoves ? Freeboard : Playboard;

  return (
    <>
      <Board
        containerClassName="shadow-2xl"
        boardOrientation={boardOrientation}
        playingColor={boardOrientation}
        sizePx={sizePx}
        fen={fen}
        lastMove={lastMove}
        inCheckSquares={inCheckSquaresMap}
        arrowsMap={arrows}
        circlesMap={circles}
        {...chessBoardProps}
      />
      {/* <div className="flex flex-col pt-0 pb-0">
                        {settings.canFlipBoard && (
                          <IconButton
                            icon="ArrowsUpDownIcon"
                            iconKind="outline"
                            type="clear"
                            size="sm"
                            tooltip="Flip Board"
                            tooltipPositon="right"
                            className="mb-2"
                            onClick={() => {
                              dispatch({
                                type: 'changeBoardOrientation',
                                payload:
                                  activityState.boardOrientation === 'black'
                                    ? 'white'
                                    : 'black',
                              });
                            }}
                          />
                        )}
                      </div> */}
    </>
  );
};

// TODO: This can be doner at the history level
const getInCheckSquareMap = (fen: ChessFEN): SquareMap => {
  let result: Square[] = [];

  const fenBoardInstance = new ChessFENBoard(fen);

  fenBoardInstance.setFenNotation({
    fromState: { turn: 'w', enPassant: undefined },
  });

  const fenAsWhiteTurn = fenBoardInstance.fen;

  fenBoardInstance.setFenNotation({
    fromState: { turn: 'b', enPassant: undefined },
  });

  const fenAsBlackTurn = fenBoardInstance.fen;

  const chessInstanceAsWhite = getNewChessGame({
    fen: fenAsWhiteTurn,
  });

  if (chessInstanceAsWhite.isCheck()) {
    const whiteKingSquare = fenBoardInstance.getKingSquare('w');

    if (whiteKingSquare) {
      result = [whiteKingSquare];
    }
  }

  const chessInstanceAsBlack = getNewChessGame({
    fen: fenAsBlackTurn,
  });

  if (chessInstanceAsBlack.isCheck()) {
    const blackKingSquare = fenBoardInstance.getKingSquare('b');

    if (blackKingSquare) {
      result = [...result, blackKingSquare];
    }
  }

  return toDictIndexedBy(
    result,
    (sq) => sq,
    () => undefined
  ) as SquareMap;
};
