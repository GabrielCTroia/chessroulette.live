'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource } from 'movex-react';
import { ContainerWithDimensions } from 'apps/chessroulette-web/components/ContainerWithDimensions';
import { Freeboard } from 'apps/chessroulette-web/components/Chessboard/Freeboard';
import { LearnTemplate } from './LearnTemplate';
import { GameHistory } from 'apps/chessroulette-web/components/GameHistory';
import { getNewChessGame } from 'apps/chessroulette-web/lib/chess';
import { ChessFEN, ChessPGN } from '@xmatter/util-kit';
import { useUserId } from 'apps/chessroulette-web/hooks/useUserId/useUserId';
import { useMemo, useState } from 'react';
import Streaming from '../Streaming';
import { PgnInputBox } from 'apps/chessroulette-web/components/PgnInputBox';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Tabs } from 'apps/chessroulette-web/components/Tabs';

type ChessColor = 'white' | 'black';

type Props = {
  rid: ResourceIdentifier<'room'>;
  fen?: ChessFEN;
  playingColor?: ChessColor;
};

type Tabs = 'history' | 'import';

export default ({ playingColor = 'white', ...props }: Props) => {
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
              onResourceStateUpdated={(s) => {
                console.log('first component updated state', s);
              }}
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

                return (
                  <ContainerWithDimensions
                    className="h-full w-full"
                    render={(s) => (
                      <Freeboard
                        sizePx={s.height} // TODO: Here this fails when the height is super small! need to look into it
                        fen={activityState.fen}
                        onPieceDrop={(payload) =>
                          dispatch({ type: 'dropPiece', payload })
                        }
                      />
                    )}
                  />
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
                    tabs={[
                      {
                        renderHeader: (p) => (
                          <Button
                            onClick={p.focus}
                            className={
                              p.isFocused ? 'bg-red-500 hover:bg-red-700' : ''
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
                                    console.log('on refocus', index);
                                    dispatch({
                                      type: 'focusHistoryIndex',
                                      payload: { index },
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
                            className={
                              p.isFocused ? 'bg-red-500 hover:bg-red-700' : ''
                            }
                          >
                            Import
                          </Button>
                        ),
                        renderContent: (p) => {
                          return (
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
                          );
                        },
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
