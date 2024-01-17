'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource } from 'movex-react';
import { ContainerWithDimensions } from 'apps/chessroulette-web/components/ContainerWithDimensions';
import { Freeboard } from 'apps/chessroulette-web/components/Chessboard/Freeboard';
import { LearnTemplate } from './LearnTemplate';
import { GameHistory } from 'apps/chessroulette-web/components/GameHistory';
import { ChessFEN, ChessPGN, getRandomInt } from '@xmatter/util-kit';
import { useUserId } from 'apps/chessroulette-web/hooks/useUserId/useUserId';
import { useMemo, useState } from 'react';
import Streaming from '../Streaming';
import { PgnInputBox } from 'apps/chessroulette-web/components/PgnInputBox';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Tabs } from 'apps/chessroulette-web/components/Tabs';
import { ClipboardCopyButton } from 'apps/chessroulette-web/components/ClipboardCopyButton';
import { useRouter, usePathname } from 'next/navigation';
import { useUrl } from 'nextjs-current-url';
import { Square } from 'react-chessboard/dist/chessboard/types';
import {
  decrementChessHistoryIndex,
  getMoveAtIndex,
} from 'apps/chessroulette-web/components/GameHistory/lib';

type ChessColor = 'white' | 'black';

type Props = {
  rid: ResourceIdentifier<'room'>;
  fen?: ChessFEN;
  playingColor?: ChessColor;
};

type Tabs = 'history' | 'import';

export default ({ playingColor = 'white', ...props }: Props) => {
  const url = useUrl();

  const [nextUserId, setNextUserId] = useState(getRandomInt(0, 99999));
  const inviteUrl = useMemo(
    () => (url ? url.host + url.pathname + `?userId=${nextUserId}` : ''),
    [url, nextUserId]
  );

  // const ridAsStr = useMemo(
  //   () => toResourceIdentifierStr(props.rid),
  //   [props.rid]
  // );
  const userId = useUserId();

  const [showTab, setShowTab] = useState<Tabs>('history');
  // const peerUser = useMemo(() => {
  //   if (userId) {
  //     return {
  //       id: userId,
  //     };
  //   }

  //   return undefined;
  // }, [userId]);

  // if (!peerUser) {
  //   return (
  //     <div>No user id present. For now it needs to be given in the url</div>
  //   );
  // }

  return (
    <LearnTemplate
      mainComponent={
        <>
          {userId && (
            <MovexBoundResource
              movexDefinition={movexConfig}
              rid={props.rid}
              // onResourceStateUpdated={(s) => {
              //   console.log('first component updated state', s);
              // }}
              onReady={({ boundResource }) => {
                // const userId = searchParams.get('userId');
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
              // onPeerConnectionStatusChanged={() => {

              // }}
              render={({ boundResource: { state, dispatch } }) => {
                if (state.activity.activityType !== 'learn') {
                  return null;
                }

                const { activityState } = state.activity;

                console.log('activity state', activityState);

                const { history } = activityState;

                // const lastMove =   history.moves.slice(-1)[0];
                const lastMove = getMoveAtIndex(
                  history.moves,
                  history.focusedIndex
                );

                // const g

                return (
                  <>
                    <ContainerWithDimensions
                      className="h-full w-full"
                      render={(s) => (
                        <Freeboard
                          boardOrientation={activityState.boardOrientation}
                          sizePx={s.height} // TODO: Here this fails when the height is super small! need to look into it
                          fen={activityState.fen}
                          lastMove={lastMove}
                          inCheckSquare="e8"
                          onMove={(payload) => {
                            console.log('learn activity on move', payload);

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
                    />
                    <div className="text-right">
                      <button
                        onClick={() => {
                          dispatch({
                            type: 'changeBoardOrientation',
                            payload:
                              activityState.boardOrientation === 'black'
                                ? 'white'
                                : 'black',
                          });
                        }}
                      >
                        Flip
                      </button>
                    </div>
                  </>
                );
              }}
            />
          )}
        </>
      }
      rightSideComponent={
        <div className="flex flex-1s flex-col space-between w-full h-full relative min-h-0 min-w-0">
          <div className="flex-1 flex flex-col min-h-0 min-w-0 gap-4">
            <Streaming rid={props.rid} />

            <MovexBoundResource
              movexDefinition={movexConfig}
              rid={props.rid}
              render={({ boundResource: { state, dispatch } }) => {
                if (state.activity.activityType !== 'learn') {
                  return null;
                }

                const { activityState } = state.activity;

                return (
                  <Tabs
                    headerContainerClassName="flex gap-3 pb-3 border-b border-slate-500"
                    containerClassName="bg-slate-700 p-3 flex flex-col flex-1 min-h-0 min-w-0"
                    contentClassName="min-h-0 min-w-0 flex-1"
                    currentIndex={0}
                    renderContainerHeader={({ tabs, focus }) => (
                      <div
                        className={`flex flex-row gap-3 pb-3 border-b border-slate-500`}
                      >
                        {tabs.map((c) => c)}
                        <div className="flex-1" />
                        <ClipboardCopyButton
                          value={inviteUrl}
                          copiedlLabel="Invitation Copied"
                          className="bg-green-500 hover:bg-green-700"
                          onCopied={() => {
                            setNextUserId(getRandomInt(0, 9999));
                          }}
                          size="sm"
                          // onClick={p.focus}
                          // className={
                          // p.isFocused ? 'bg-blue-500 hover:bg-red-700' : ''
                          // }
                        >
                          Invite Friend
                        </ClipboardCopyButton>
                        <Button
                          className="bg-red-500"
                          onClick={() => {
                            dispatch({ type: 'importPgn', payload: '' });

                            focus(0);
                          }}
                          size="sm"
                        >
                          Reset Board
                        </Button>
                      </div>
                    )}
                    tabs={[
                      {
                        renderHeader: (p) => (
                          <Button
                            onClick={p.focus}
                            size="sm"
                            className={
                              p.isFocused ? 'bg-blue-500 hover:bg-red-700' : ''
                            }
                          >
                            History
                          </Button>
                        ),
                        renderContent: () => (
                          <>
                            <div className="flex flex-col flex-1 h-full relative gap-2 bg-slate-700">
                              <div
                                className="flex flex-col flex-1"
                                style={{
                                  overflowY: 'scroll',
                                  minHeight: 0,
                                  minWidth: 0,
                                }}
                              >
                                <GameHistory
                                  history={activityState.history.moves}
                                  containerClassName="overflow-y-scroll"
                                  focusedIndex={
                                    activityState.history.focusedIndex
                                  }
                                  onRefocus={(index) => {
                                    // console.log('on refocus', index);
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
                                  // containerClassName="px-1"
                                />
                                <div className="pt-3 overflow-x-scroll">
                                  FEN: {activityState.fen}
                                </div>
                              </div>
                            </div>
                          </>
                        ),
                      },
                      {
                        renderHeader: (p) => (
                          <Button
                            onClick={p.focus}
                            size="sm"
                            className={
                              p.isFocused ? 'bg-blue-500 hover:bg-red-700' : ''
                            }
                          >
                            Import
                          </Button>
                        ),
                        renderContent: (p) => (
                          <PgnInputBox
                            containerClassName="flex-1 h-full"
                            contentClassName="p-3 bg-slate-500"
                            onChange={(nextPgn) => {
                              dispatch({
                                type: 'importPgn',
                                payload: nextPgn,
                              });

                              p.focus(0);
                            }}
                          />
                        ),
                      },
                    ]}
                  />
                );

                // if (showTab === 'import') {
                //   return (
                //     <PgnInputBox
                //       onChange={(nextPgn) => {

                //         dispatch({
                //           type: 'importPgn',
                //           payload: nextPgn,
                //         });
                //       }}
                //     />
                //   );
                // }

                // return (

                // );
              }}
            />
          </div>
        </div>
      }
      // rightSideComponent={<RoomParticipants rid={rid} />}
    />

    // </PeerToPeerProvider>
  );
};
