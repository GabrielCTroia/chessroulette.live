'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource } from 'movex-react';
import { LearnTemplate } from './LearnTemplate';
import {
  ChessColor,
  ChessFEN,
  ChessFENBoard,
  FreeBoardHistory as FBH,
  getNewChessGame,
  invoke,
  swapColor,
  toDictIndexedBy,
} from '@xmatter/util-kit';
import { useUserId } from 'apps/chessroulette-web/hooks/useUserId/useUserId';
import { useCallback, useEffect, useState } from 'react';
import Streaming from '../Streaming';
import { PgnInputBox } from 'apps/chessroulette-web/components/PgnInputBox';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Tabs } from 'apps/chessroulette-web/components/Tabs';
import { Square } from 'react-chessboard/dist/chessboard/types';
import { SquareMap, ArrowsMap, CirclesMap } from '../activity/reducer';
import { IceServerRecord } from 'apps/chessroulette-web/providers/PeerToPeerProvider/type';
import { ArrowsUpDownIcon } from '@heroicons/react/16/solid';
import { BoardEditor } from 'apps/chessroulette-web/components/Chessboard/BoardEditor';
import { FreeBoardNotation } from 'apps/chessroulette-web/components/FreeBoardNotation';
import { useLearnActivitySettings } from './useLearnActivitySettings';
import { Freeboard } from 'apps/chessroulette-web/components/Chessboard/Freeboard';
import { Playboard } from 'apps/chessroulette-web/components/Chessboard/Playboard';
import { FenPreview } from './components/FenPreview';
import { ChaptersTab } from './chapters/ChaptersTab';
import { Icon } from 'apps/chessroulette-web/components/Icon';
import { useSearchParams } from 'next/navigation';

// type ChessColor = 'white' | 'black';

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

  const searchParams = useSearchParams();

  const isEditParamsSet = searchParams.get('edit') === '1';

  const [editMode, setEditMode] = useState<{
    isActive: boolean;
    fen: ChessFEN;
    arrowsMap?: ArrowsMap;
    circlesMap?: CirclesMap;
    orientation: ChessColor;
  }>({
    isActive: isEditParamsSet,
    fen: ChessFENBoard.STARTING_FEN,
    orientation: playingColor,
  }); // TODO: Set it so it's coming from the state (url)

  const Board = settings.canMakeInvalidMoves ? Freeboard : Playboard;

  const updateEditedFen = useCallback((nextFen: ChessFEN) => {
    setEditMode((prev) => ({
      ...prev,
      fen: nextFen,
    }));
  }, []);

  useEffect(() => {
    // console.log('Edit Mode State Updated', editMode);
    setEditMode((prev) => ({
      ...prev,
      isActive: isEditParamsSet,
    }))
  }, [isEditParamsSet]);

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
                  FBH.renderIndex(activityState.history.focusedIndex)
                );
                console.groupEnd();

                const { history } = activityState;

                const lm = FBH.findMoveAtIndex(
                  history.moves,
                  history.focusedIndex
                );
                const lastMove = lm?.isNonMove ? undefined : lm;

                // Don't leave this here as it's not optimal
                const inCheckSquaresMap = invoke((): SquareMap => {
                  let result: Square[] = [];

                  const fenBoardInstance = new ChessFENBoard(activityState.fen);

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
                });

                const playingColor = settings.isBoardFlipped
                  ? swapColor(activityState.boardOrientation)
                  : activityState.boardOrientation;

                console.log('playing color', playingColor);

                return (
                  <div className="flex border-slate-900">
                    {editMode.isActive ? (
                      <BoardEditor
                        fen={editMode.fen}
                        sizePx={p.center.width}
                        onUpdated={updateEditedFen}
                        boardOrientation={editMode.orientation || playingColor}
                        onArrowsChange={(arrowsMap) => {
                          // console.log('on arrow change?');
                          // dispatch({ type: 'arrowChange', payload });
                          setEditMode((prev) => ({
                            ...prev,
                            arrowsMap,
                          }));
                        }}
                        arrowsMap={editMode.arrowsMap}
                        circlesMap={editMode.circlesMap}
                        onCircleDraw={(circleTuple) => {
                          setEditMode((prev) => {
                            const [at, hex] = circleTuple;

                            const circleId = `${at}`;

                            const { [circleId]: existent, ...restOfCirles } =
                              prev.circlesMap || {};

                            return {
                              ...prev,
                              circlesMap: {
                                ...restOfCirles,
                                ...(!!existent
                                  ? undefined // Set it to undefined if same
                                  : { [circleId]: circleTuple }),
                              },
                            };
                          });
                        }}
                        onClearCircles={() => {
                          setEditMode((prev) => ({
                            ...prev,
                            circlesMap: {},
                          }));
                        }}
                        onFlipBoard={() => {
                          setEditMode((prev) => ({
                            ...prev,
                            orientation: swapColor(prev.orientation),
                          }));
                          // dispatch({
                          //   type: 'changeBoardOrientation',
                          //   payload:
                          //     activityState.boardOrientation === 'black'
                          //       ? 'white'
                          //       : 'black',
                          // });
                        }}
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
                      />
                    )}

                    <div className="flex flex-col p-1 pt-0 pb-0">
                      {!editMode.isActive && settings.canFlipBoard && (
                        <div className="mb-2">
                          <Icon
                            name="ArrowsUpDownIcon"
                            kind="outline"
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
                            <>
                              {editMode.isActive ? (
                                <>
                                  <Button
                                    // className="bg-red-400 hover:bg-red-600 active:bg-red-800 font-bold"
                                    onClick={() => {
                                      setEditMode((prev) => ({
                                        ...prev,
                                        isActive: false,
                                      }));
                                    }}
                                    // type="custom"
                                    type="secondary"
                                    size="sm"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    className="bg-green-400 hover:bg-green-600 active:bg-green-800 font-bold"
                                    onClick={() => {
                                      dispatch({
                                        type: 'importFen',
                                        payload: editMode.fen,
                                      });

                                      setEditMode((prev) => ({
                                        ...prev,
                                        isActive: false,
                                      }));
                                    }}
                                    type="custom"
                                    size="sm"
                                  >
                                    Use Board
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  className="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-800 font-bold"
                                  onClick={() => {
                                    setEditMode(() => ({
                                      isActive: true,
                                      fen: activityState.fen,
                                      circlesMap: {},
                                      arrowsMap: {},
                                      orientation:
                                        activityState.boardOrientation,
                                    }));
                                  }}
                                  type="custom"
                                  size="sm"
                                  icon="PencilSquareIcon"
                                >
                                  Edit Lesson
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      tabs={[
                        {
                          renderHeader: (p) => (
                            <Button
                              onClick={p.focus}
                              size="sm"
                              type="secondary"
                              isActive={p.isFocused}
                            >
                              Edit Chapters
                            </Button>
                          ),
                          renderContent: () => {
                            return (
                              <ChaptersTab
                                canEdit
                                fen={editMode.fen}
                                chaptersMap={activityState.chaptersMap}
                                className="min-h-0"
                                onUseChapter={(id) => {
                                  const nextChapter =
                                    activityState.chaptersMap[id];

                                  setEditMode((prev) => ({
                                    ...prev,
                                    fen: nextChapter.fen,
                                    arrowsMap: nextChapter.arrowsMap || {},
                                    circlesMap: nextChapter.circlesMap || {},
                                    orientation: nextChapter.orientation,
                                  }));
                                }}
                                onDeleteChapter={(id) => {
                                  dispatch({
                                    type: 'deleteChapter',
                                    payload: { id },
                                  });
                                }}
                                onCreate={(name) => {
                                  dispatch({
                                    type: 'createChapter',
                                    payload: {
                                      name,
                                      fen: editMode.fen,
                                      arrowsMap: editMode.arrowsMap,
                                      circlesMap: editMode.circlesMap,
                                      orientation:
                                        activityState.boardOrientation,
                                    },
                                  });
                                }}
                                onUpdateChapter={(id, state) => {
                                  // console.log('on dpate chapter', id, state);
                                  dispatch({
                                    type: 'updateChapter',
                                    payload: { id, state },
                                  });
                                }}
                              />
                            );
                          },
                        },
                        {
                          renderHeader: (p) => (
                            <Button
                              onClick={p.focus}
                              size="sm"
                              type="secondary"
                              isActive={p.isFocused}
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

                                // setTimeout(() => {
                                // setEditMode((prev) => ({
                                //   ...prev,
                                //   fen: ChessFENBoard.STARTING_FEN,
                                // }));
                                // }, 1000);
                                p.focus(0);
                              }}
                            />
                          ),
                        },
                      ]}
                    />
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
                          <>
                            {editMode.isActive ? (
                              <>
                                <Button
                                  // className="bg-red-400 hover:bg-red-600 active:bg-red-800 font-bold"
                                  onClick={() => {
                                    setEditMode((prev) => ({
                                      ...prev,
                                      isActive: false,
                                    }));
                                  }}
                                  // type="custom"
                                  type="secondary"
                                  size="sm"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="bg-green-400 hover:bg-green-600 active:bg-green-800 font-bold"
                                  onClick={() => {
                                    dispatch({
                                      type: 'importFen',
                                      payload: editMode.fen,
                                    });

                                    setEditMode((prev) => ({
                                      ...prev,
                                      isActive: false,
                                    }));
                                  }}
                                  type="custom"
                                  size="sm"
                                >
                                  Use Board
                                </Button>
                              </>
                            ) : (
                              <Button
                                className="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-800 font-bold"
                                onClick={() => {
                                  setEditMode({
                                    isActive: true,
                                    fen: activityState.fen,
                                    circlesMap: {},
                                    arrowsMap: {},
                                    orientation: activityState.boardOrientation,
                                  });
                                }}
                                type="custom"
                                size="sm"
                                icon="PencilSquareIcon"
                              >
                                Edit
                              </Button>
                            )}
                          </>
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
                            <FreeBoardNotation
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
                            <FenPreview fen={activityState.fen} />
                          </div>
                        ),
                      },
                      settings.isInstructor
                        ? {
                            renderHeader: (p) => (
                              <Button
                                onClick={p.focus}
                                size="sm"
                                className={`bg-slate-600 font-bold hover:bg-slate-800 ${
                                  p.isFocused && 'bg-slate-800'
                                }`}
                              >
                                Chapters (
                                {Object.keys(activityState.chaptersMap).length})
                              </Button>
                            ),
                            renderContent: () => (
                              <ChaptersTab
                                fen={editMode.fen}
                                chaptersMap={activityState.chaptersMap}
                                className="min-h-0"
                                onUseChapter={(id) => {
                                  dispatch({
                                    type: 'playChapter',
                                    payload: { id },
                                  });
                                }}
                              />
                            ),
                          }
                        : undefined,
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

                                  // setTimeout(() => {
                                  setEditMode((prev) => ({
                                    ...prev,
                                    fen: ChessFENBoard.STARTING_FEN,
                                  }));
                                  // }, 1000);
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
