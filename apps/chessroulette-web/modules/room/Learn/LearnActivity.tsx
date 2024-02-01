'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource } from 'movex-react';
import { LearnTemplate } from './LearnTemplate';
import { GameHistory } from 'apps/chessroulette-web/components/GameHistory';
import {
  ChessFEN,
  ChessFENBoard,
  getNewChessGame,
  invoke,
  swapColor,
  toDictIndexedBy,
} from '@xmatter/util-kit';
import { useUserId } from 'apps/chessroulette-web/hooks/useUserId/useUserId';
import { useCallback, useState } from 'react';
import Streaming from '../Streaming';
import { PgnInputBox } from 'apps/chessroulette-web/components/PgnInputBox';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Tabs } from 'apps/chessroulette-web/components/Tabs';
import { ClipboardCopyButton } from 'apps/chessroulette-web/components/ClipboardCopyButton';
import { Square } from 'react-chessboard/dist/chessboard/types';
import { SquareMap } from '../activity/reducer';
import { findMoveAtIndex } from 'apps/chessroulette-web/components/GameHistory/history/util';
import { IceServerRecord } from 'apps/chessroulette-web/providers/PeerToPeerProvider/type';
import {
  ArrowsUpDownIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  PencilSquareIcon,
} from '@heroicons/react/16/solid';
import { BoardEditor } from 'apps/chessroulette-web/components/Chessboard/BoardEditor/BoardEditor';
import { useLearnActivitySettings } from './useLearnActivitySettings';
import { Freeboard } from 'apps/chessroulette-web/components/Chessboard/Freeboard';
import { Playboard } from 'apps/chessroulette-web/components/Chessboard/Playboard';
import { toShortColor } from 'chessterrain-react';
import { useBoardTheme } from 'apps/chessroulette-web/components/Chessboard/useBoardTheme';

type ChessColor = 'white' | 'black';

type Props = {
  rid: ResourceIdentifier<'room'>;
  fen?: ChessFEN;
  playingColor?: ChessColor;
  iceServers: IceServerRecord[];
};

type Tabs = 'history' | 'import';

export default ({ playingColor = 'white', iceServers, ...props }: Props) => {
  const userId = useUserId();
  const settings = useLearnActivitySettings();
  const boardTheme = useBoardTheme();

  const [editMode, setEditMode] = useState({
    isActive: false,
    fen: ChessFENBoard.STARTING_FEN,
  }); // TODO: Set it so it's coming from the state (url)

  const Board = settings.canMakeInvalidMoves ? Freeboard : Playboard;

  const updateEditedFen = useCallback((nextFen: ChessFEN) => {
    setEditMode((prev) => ({
      ...prev,
      fen: nextFen,
    }));
  }, []);

  return (
    <LearnTemplate
      mainComponent={(p) => (
        <>
          {userId && (
            <MovexBoundResource
              movexDefinition={movexConfig}
              rid={props.rid}
              onReady={({ boundResource }) => {
                boundResource.dispatch({
                  type: 'join',
                  payload: { userId },
                });
              }}
              onComponentWillUnmount={(s) => {
                if (s.init) {
                  s.boundResource.dispatch({
                    type: 'leave',
                    payload: { userId },
                  });
                }
              }}
              render={({ boundResource: { state, dispatch } }) => {
                if (state.activity.activityType !== 'learn') {
                  return null;
                }

                const { activityState } = state.activity;

                console.group('Learn Activity Rerender');
                console.log('Activity State', activityState);
                console.log('History', activityState.history.moves);
                console.log(
                  'Focused Index',
                  activityState.history.focusedIndex
                );
                console.groupEnd();

                const { history } = activityState;

                const lm = findMoveAtIndex(history.moves, history.focusedIndex);
                const lastMove = lm?.isNonMove ? undefined : lm;

                // Don't leave this here as it's not optimal
                const inCheckSquaresMap = invoke((): SquareMap => {
                  let result: Square[] = [];

                  const fenBoardInstance = new ChessFENBoard(activityState.fen);

                  fenBoardInstance.setFenNotation({ fromState: { turn: 'w', enPassant: undefined } });

                  const fenAsWhiteTurn = fenBoardInstance.fen;

                  fenBoardInstance.setFenNotation({ fromState: { turn: 'b', enPassant: undefined } });

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
                });

                const playingColor = settings.isBoardFlipped
                  ? swapColor(activityState.boardOrientation)
                  : activityState.boardOrientation;

                return (
                  <div className="flex border-slate-900">
                    {editMode.isActive ? (
                      <BoardEditor
                        fen={editMode.fen}
                        sizePx={p.center.width}
                        onUpdated={updateEditedFen}
                      />
                    ) : (
                      <Board
                        containerClassName="shadow-2xl"
                        boardOrientation={playingColor}
                        playingColor={playingColor}
                        sizePx={p.center.width}
                        fen={activityState.fen}
                        lastMove={lastMove}
                        inCheckSquares={inCheckSquaresMap}
                        onMove={(payload) => {
                          dispatch({ type: 'dropPiece', payload });
                          return true;
                        }}
                        onArrowsChange={(payload) => {
                          // console.log('on arrow change?');
                          dispatch({ type: 'arrowChange', payload });
                        }}
                        arrowsMap={activityState.arrows}
                        onCircleDraw={(tuple) => {
                          dispatch({
                            type: 'drawCircle',
                            payload: tuple,
                          });
                        }}
                        onClearCircles={() => {
                          dispatch({ type: 'clearCircles' });
                        }}
                        circlesMap={activityState.circles}
                        customPieces={boardTheme.customPieces}
                      />
                    )}

                    <div className="flex flex-col p-1 pt-0 pb-0">
                      {settings.canFlipBoard && (
                        <div className="mb-2">
                          <ArrowsUpDownIcon
                            className=" h-6 w-6 hover:bg-slate-300 hover:cursor-pointer hover:text-black hover:rounded-lg"
                            title="Flip Board"
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
                        </div>
                      )}
                      {settings.canEditBoard && (
                        <div className="">
                          <PencilSquareIcon
                            className="h-6 w-6 hover:bg-slate-300 hover:cursor-pointer hover:text-black hover:rounded-lg"
                            title="Edit Board"
                            onClick={() => {
                              setEditMode((prev) => ({
                                ...prev,
                                isActive: !prev.isActive,
                              }));
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
          )}
        </>
      )}
      rightSideComponent={(p) => (
        <div
          className="flex flex-col space-between w-full relative"
          style={{ height: p.center.height }}
        >
          <div className="flex flex-col flex-1 min-h-0 gap-4">
            <div className="overflow-hidden rounded-lg shadow-2xl">
              <Streaming
                rid={props.rid}
                iceServers={iceServers}
                aspectRatio={16 / 9}
              />
            </div>

            <MovexBoundResource
              movexDefinition={movexConfig}
              rid={props.rid}
              render={({ boundResource: { state, dispatch } }) => {
                if (state.activity.activityType !== 'learn') {
                  return null;
                }

                const { activityState } = state.activity;

                if (editMode.isActive) {
                  const editFenInstance = new ChessFENBoard(editMode.fen);

                  const changeTo = swapColor(
                    editFenInstance.getFenState().turn
                  );

                  return (
                    <div className="bg-slate-700 p-3 flex flex-col flex-1 min-h-0 soverflow-hidden rounded-lg shadow-2xl">
                      <div className="flex-1 flex min-h-0">
                        <div className="flex flex-col flex-1 gap-2 bg-slate-700 min-h-0 jsutify-between">
                          <div className="flex flex-1 flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                dispatch({
                                  type: 'importFen',
                                  payload: editMode.fen,
                                });

                                setEditMode({
                                  isActive: false,
                                  fen: ChessFENBoard.STARTING_FEN,
                                });
                              }}
                            >
                              Use Board
                            </Button>
                            <Button
                              size="sm"
                              type="custom"
                              className="bg-blue-600 hover:bg-blue-400 capitalize"
                              onClick={() => {
                                editFenInstance.setFenNotation({
                                  fromState: {
                                    turn: toShortColor(changeTo),
                                  },
                                });

                                setEditMode((prev) => ({
                                  ...prev,
                                  fen: editFenInstance.fen,
                                }));
                              }}
                            >
                              Change Turn to{' '}
                              <span className="font-bold">{changeTo}</span>
                            </Button>
                            {/* <Button
                              size="sm"
                              type="custom"
                              className="bg-red-600"
                              onClick={() => {
                                dispatch({
                                  type: 'importFen',
                                  payload: editMode.fen,
                                });

                                setEditMode({
                                  isActive: true,
                                  fen: '',
                                });
                              }}
                            >
                              Clear Board
                            </Button> */}
                          </div>
                          <div className="flex items-space-between p-1 pl-3 border border-slate-400 rounded-lg">
                            <p className="flex-1 overflow-x-scroll text-wrap break-all text-slate-400">
                              FEN: {editMode.fen}
                            </p>
                            <ClipboardCopyButton
                              value={editMode.fen}
                              type="custom"
                              size="sm"
                              render={(copied) =>
                                copied ? (
                                  <CheckIcon className="w-5 h-5 text-slate-400 text-green-500" />
                                ) : (
                                  <DocumentDuplicateIcon className="w-5 h-5 text-slate-400 hover:text-slate-200" />
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Tabs
                    containerClassName="bg-slate-700 p-3 flex flex-col flex-1 min-h-0 soverflow-hidden rounded-lg shadow-2xl"
                    headerContainerClassName="flex gap-3 pb-3 border-b border-slate-500"
                    contentClassName="flex-1 flex min-h-0"
                    currentIndex={0}
                    renderContainerHeader={({ tabs, focus }) => (
                      <div className="flex flex-row gap-3 pb-3 border-b border-slate-500">
                        {tabs.map((c) => c)}
                        <div className="flex-1" />

                        {settings.isInstructor && (
                          <Button
                            className="bg-red-900 hover:bg-red-600 active:bg-red-800 font-bold"
                            onClick={() => {
                              dispatch({ type: 'importPgn', payload: '' });

                              focus(0);
                            }}
                            type="custom"
                            size="sm"
                          >
                            Reset Board
                          </Button>
                        )}
                      </div>
                    )}
                    tabs={[
                      {
                        renderHeader: (p) => (
                          <Button
                            onClick={p.focus}
                            size="sm"
                            className={`bg-slate-600 font-bold hover:bg-slate-800 ${
                              p.isFocused && 'bg-slate-800'
                            }`}
                          >
                            Notation
                          </Button>
                        ),
                        renderContent: () => (
                          <div className="flex flex-col flex-1 gap-2 bg-slate-700 min-h-0">
                            <GameHistory
                              history={activityState.history.moves}
                              // containerClassName="overflow-scroll bg-red-200 sh-full"
                              focusedIndex={activityState.history.focusedIndex}
                              onRefocus={(index) => {
                                dispatch({
                                  type: 'focusHistoryIndex',
                                  payload: { index },
                                });
                              }}
                              onDelete={(atIndex) => {
                                dispatch({
                                  type: 'deleteHistoryMove',
                                  payload: { atIndex },
                                });
                              }}
                            />
                            <div className="flex items-space-between p-1 pl-3 border border-slate-400 rounded-lg">
                              <p className="flex-1 overflow-x-scroll text-wrap break-all text-slate-400">
                                FEN: {activityState.fen}
                              </p>
                              <ClipboardCopyButton
                                value={activityState.fen}
                                type="custom"
                                size="sm"
                                render={(copied) =>
                                  copied ? (
                                    <CheckIcon className="w-5 h-5 text-slate-400 text-green-500" />
                                  ) : (
                                    <DocumentDuplicateIcon className="w-5 h-5 text-slate-400 hover:text-slate-200" />
                                  )
                                }
                              />
                            </div>
                          </div>
                        ),
                      },
                      settings.canImport
                        ? {
                            renderHeader: (p) => (
                              <Button
                                onClick={p.focus}
                                size="sm"
                                className={`bg-slate-600 font-bold hover:bg-slate-800 ${
                                  p.isFocused && 'bg-slate-800'
                                }`}
                              >
                                Import
                              </Button>
                            ),
                            renderContent: (p) => (
                              <PgnInputBox
                                containerClassName="flex-1 h-full"
                                contentClassName="p-3 bg-slate-600 rounded-b-lg"
                                onChange={(inputType, nextInput) => {
                                  if (inputType === 'FEN') {
                                    dispatch({
                                      type: 'importFen',
                                      payload: nextInput,
                                    });
                                  } else if (inputType === 'PGN') {
                                    dispatch({
                                      type: 'importPgn',
                                      payload: nextInput,
                                    });
                                  }

                                  setEditMode((prev) => ({
                                    ...prev,
                                    isActive: false,
                                  }));
                                  p.focus(0);
                                }}
                              />
                            ),
                          }
                        : undefined,
                    ]}
                  />
                );
              }}
            />
          </div>
        </div>
      )}
    />
  );
};
