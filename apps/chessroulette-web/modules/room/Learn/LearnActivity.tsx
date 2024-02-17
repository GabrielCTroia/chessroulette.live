'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource } from 'movex-react';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import Streaming from '../Streaming';
import { PgnInputBox } from 'apps/chessroulette-web/components/PgnInputBox';
import { Button, IconButton } from 'apps/chessroulette-web/components/Button';
import { Tabs } from 'apps/chessroulette-web/components/Tabs';
import { Square } from 'react-chessboard/dist/chessboard/types';
import { SquareMap, ChapterState } from '../activity/reducer';
import { IceServerRecord } from 'apps/chessroulette-web/providers/PeerToPeerProvider/type';
import { BoardEditorWithSize } from 'apps/chessroulette-web/components/Chessboard/BoardEditor';
import { FreeBoardNotation } from 'apps/chessroulette-web/components/FreeBoardNotation';
import { useLearnActivitySettings } from './useLearnActivitySettings';
import { Freeboard } from 'apps/chessroulette-web/components/Chessboard/Freeboard';
import { Playboard } from 'apps/chessroulette-web/components/Chessboard/Playboard';
import { FenPreview } from './components/FenPreview';
import { ChaptersTab } from './chapters/ChaptersTab';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useUpdateableSearchParams } from 'apps/chessroulette-web/hooks/useSearchParams';
import { EditChaptersWidget } from './chapters/EditChaptersWidget';
import { useDesktopRoomLayout } from './useDesktopRoomLayout';

type Props = {
  rid: ResourceIdentifier<'room'>;
  fen?: ChessFEN;
  playingColor?: ChessColor;
  iceServers: IceServerRecord[];
};

type Tabs = 'history' | 'import';

export default ({ playingColor = 'white', iceServers, ...props }: Props) => {
  const router = useRouter();
  const currentPathName = usePathname();
  const updatedableSearchParams = useUpdateableSearchParams();
  const userId = useUserId();
  const settings = useLearnActivitySettings();
  const searchParams = useSearchParams();
  const isEditParamsSet = searchParams.get('edit') === '1';

  const [editMode, setEditMode] = useState<{
    isActive: boolean;
    state: Pick<ChapterState, 'fen' | 'arrowsMap' | 'circlesMap'> & {
      orientation: ChessColor;
    };
  }>({
    isActive: isEditParamsSet,
    state: {
      fen: ChessFENBoard.STARTING_FEN,
      orientation: playingColor,
    },
  });

  const Board = settings.canMakeInvalidMoves ? Freeboard : Playboard;

  const updateEditedFen = useCallback((nextFen: ChessFEN) => {
    setEditMode((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        fen: nextFen,
      },
    }));
  }, []);

  useEffect(() => {
    // console.log('Edit Mode State Updated', editMode);
    setEditMode((prev) => ({
      ...prev,
      isActive: isEditParamsSet,
    }));
  }, [isEditParamsSet]);

  const containerRef = useRef(null);
  const desktopLayout = useDesktopRoomLayout(containerRef, undefined, {
    sideMinWidth: 420,
  });

  if (true) {
    return (
      <div
        className="flex w-full h-full sbg-green-500 absolute inset-0 salign-center sspace-between sjustify-between align-center justify-center"
        ref={containerRef}
      >
        <main
          className="smr-8"
          style={{
            flex: desktopLayout.updated ? undefined : 3,
            width: `calc(${desktopLayout.main.asString.width} + 2rem)`,
            height: desktopLayout.main.asString.height,
          }}
        >
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

              return (
                <div className="flex border-slate-900">
                  {editMode.isActive ? (
                    <BoardEditorWithSize
                      fen={editMode.state.fen}
                      sizePx={desktopLayout.main.width.val}
                      onUpdated={updateEditedFen}
                      boardOrientation={editMode.state.orientation}
                      onArrowsChange={(arrowsMap) => {
                        setEditMode((prev) => ({
                          ...prev,
                          state: {
                            ...prev.state,
                            arrowsMap,
                          },
                        }));
                      }}
                      arrowsMap={editMode.state.arrowsMap}
                      circlesMap={editMode.state.circlesMap}
                      onCircleDraw={(circleTuple) => {
                        setEditMode((prev) => {
                          const [at] = circleTuple;

                          const circleId = `${at}`;

                          const { [circleId]: existent, ...restOfCirles } =
                            prev.state.circlesMap || {};

                          return {
                            ...prev,
                            state: {
                              ...prev.state,
                              circlesMap: {
                                ...restOfCirles,
                                ...(!!existent
                                  ? undefined // Set it to undefined if same
                                  : { [circleId]: circleTuple }),
                              },
                            },
                          };
                        });
                      }}
                      onClearCircles={() => {
                        setEditMode((prev) => ({
                          ...prev,
                          state: {
                            ...prev.state,
                            circlesMap: {},
                          },
                        }));
                      }}
                      onFlipBoard={() => {
                        setEditMode((prev) => ({
                          ...prev,
                          state: {
                            ...prev.state,
                            orientation: swapColor(prev.state.orientation),
                          }
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
                    <>
                      <Board
                        containerClassName="shadow-2xl"
                        boardOrientation={playingColor}
                        playingColor={playingColor}
                        sizePx={desktopLayout.main.width.val}
                        fen={activityState.fen}
                        lastMove={lastMove}
                        inCheckSquares={inCheckSquaresMap}
                        onMove={(payload) => {
                          dispatch({ type: 'dropPiece', payload });

                          // TODO: This can be returned from a more internal component
                          return true;
                        }}
                        onArrowsChange={(payload) => {
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
                      <div className="flex flex-col pt-0 pb-0">
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
                      </div>
                    </>
                  )}
                </div>
              );
            }}
          />
        </main>

        <aside
          className="sbg-purple-400"
          style={{
            flex: desktopLayout.updated ? undefined : 2,
            width: desktopLayout.side.asString.width,
            maxWidth: 520, // This can be CSS only with media queries
          }}
        >
          <div className="flex flex-col space-between w-full relative sbg-red-100 h-full">
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
                      <EditChaptersWidget
                        boardState={editMode.state}
                        chaptersMap={activityState.chaptersMap}
                        onCreate={(s) => {
                          dispatch({
                            type: 'createChapter',
                            payload: {
                              name: s.name,
                              fen: s.fen,
                              arrowsMap: editMode.state.arrowsMap,
                              circlesMap: editMode.state.circlesMap,
                            },
                          });
                        }}
                        onDeleteChapter={(id) => {
                          dispatch({
                            type: 'deleteChapter',
                            payload: { id },
                          });
                        }}
                        onUpdateChapter={(id, state) => {
                          dispatch({
                            type: 'updateChapter',
                            payload: { id, state },
                          });
                        }}
                        onUpdateFen={(fen) => {
                          setEditMode((prev) => ({
                            ...prev,
                            state: {
                              ...prev.state,
                              fen,
                            },
                          }));
                        }}
                        onExitEditMode={() => {
                          router.push(
                            `${currentPathName}?${updatedableSearchParams.set(
                              (prev) => ({
                                ...prev,
                                edit: undefined,
                              })
                            )}`
                          );
                        }}
                        onUseChapter={(id) => {
                          const nextChapter = activityState.chaptersMap[id];

                          setEditMode((prev) => ({
                            ...prev,
                            state: {
                              ...prev.state,
                              fen: nextChapter.fen,
                              arrowsMap: nextChapter.arrowsMap,
                              circlesMap: nextChapter.circlesMap,
                            },
                          }));
                        }}
                        onUseCurrentBoard={() => {
                          dispatch({
                            type: 'importFen',
                            payload: editMode.state.fen,
                          });

                          router.push(
                            `${currentPathName}?${updatedableSearchParams.set(
                              (prev) => ({
                                ...prev,
                                edit: undefined,
                              })
                            )}`
                          );
                        }}
                        onClearArrowsAndCircles={() => {
                          setEditMode((prev) => ({
                            ...prev,
                            state: {
                              ...prev.state,
                              arrowsMap: undefined,
                              circlesMap: undefined,
                            },
                          }));
                        }}
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
                                focusedIndex={
                                  activityState.history.focusedIndex
                                }
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
                                  {
                                    Object.keys(activityState.chaptersMap)
                                      .length
                                  }
                                  )
                                </Button>
                              ),
                              renderContent: () => (
                                <ChaptersTab
                                  boardFen={editMode.state.fen}
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
                                      state: {
                                        ...prev.state,
                                        fen: ChessFENBoard.STARTING_FEN,
                                      },
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
        </aside>
      </div>
    );
  }
};
