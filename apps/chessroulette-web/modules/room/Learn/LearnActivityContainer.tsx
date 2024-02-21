'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource, useMovexBoundResourceFromRid } from 'movex-react';
import { useUserId } from 'apps/chessroulette-web/hooks/useUserId/useUserId';
import { useEffect, useState } from 'react';
import { IceServerRecord } from 'apps/chessroulette-web/providers/PeerToPeerProvider/type';
import { LearnActivity, LearnActivityProps } from './LearnActivity';
import { toRidAsObj } from 'movex';

type Props = {
  rid: ResourceIdentifier<'room'>;
  iceServers: IceServerRecord[];
};

export const LearnActivityContainer = ({ iceServers, ...props }: Props) => {
  const userId = useUserId();
  const movexResource = useMovexBoundResourceFromRid(movexConfig, props.rid);

  // const [inputState, setInputState] = useState<
  //   LearnActivityProps['inputState']
  // >({
  //   isActive: false,
  //   chapterState: undefined,
  //   isBoardEditorShown: false,
  // });

  useEffect(() => {
    if (!movexResource) {
      return;
    }

    console.group('Room State Updated');
    console.log(movexResource?.state.activity.activityType);
    console.log(movexResource?.state.activity.activityState);
    console.groupEnd();
  }, [movexResource?.state]);

  return (
    <>
      {/* TODO: remove this in favor of the hook once I figure out how to call onComponentWillUnmount */}
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
        render={() => null}
      />
      <LearnActivity
        dispatch={movexResource?.dispatch}
        roomId={toRidAsObj(props.rid).resourceId}
        userId={userId}
        participants={movexResource?.state.participants || {}}
        iceServers={iceServers}
        // inputState={inputState}
        // onUpdateInputState={setInputState}
        remoteState={
          movexResource?.state.activity.activityType === 'learn'
            ? movexResource?.state.activity.activityState
            : undefined
        }
      />
    </>
  );
};
