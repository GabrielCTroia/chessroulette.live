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
import { useMemo } from 'react';
import Streaming from '../Streaming';

type ChessColor = 'white' | 'black';

type Props = {
  rid: ResourceIdentifier<'room'>;
  fen?: ChessFEN;
  playingColor?: ChessColor;
};

export const pgnToHistory = (pgn: ChessPGN) =>
  getNewChessGame({ pgn }).history({ verbose: true });

export default ({ playingColor = 'white', ...props }: Props) => {
  // const ridAsStr = useMemo(
  //   () => toResourceIdentifierStr(props.rid),
  //   [props.rid]
  // );
  const userId = useUserId();
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
        <div className="flex flex-1s flex-col space-between gap-6 w-full h-full relative min-h-0 min-w-0">
          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            <Streaming rid={props.rid}  />

            <MovexBoundResource
              movexDefinition={movexConfig}
              rid={props.rid}
              onResourceStateUpdated={(s) => {
                console.log('second component updated state', s);
              }}
              render={({ boundResource: { state } }) => {
                if (state.activity.activityType !== 'learn') {
                  return null;
                }

                console.log('rebdering right side history movex bound', state);

                const { activityState } = state.activity;

                return (
                  <>
                    <div
                      className="flex flex-col flex-1 relative h-full gap-2 bg-slate-700 px-4 mt-6 mb-3"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        overflow: 'scroll',
                        alignItems: 'stretch',
                      }}
                    >
                      <GameHistory
                        history={state.activity.activityState.history.moves}
                        focusedIndex={
                          state.activity.activityState.history.focusedIndex
                        }
                        onRefocus={() => {
                          console.log('on refocus');
                        }}
                        // containerClassName="px-1"
                      />
                    </div>
                    <div className="bg-slate-700 p-4 overflow-x-scroll">
                      FEN: {activityState.fen}
                    </div>
                  </>
                );
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
