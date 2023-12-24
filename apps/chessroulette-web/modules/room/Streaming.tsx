'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import {
  ResourceIdentifier,
  objectKeys,
  toResourceIdentifierStr,
} from 'movex-core-util';
import { MovexBoundResource, useMovexBoundResourceFromRid } from 'movex-react';
import { NoSSR } from 'apps/chessroulette-web/components/NoSSR';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button } from 'apps/chessroulette-web/components/Button';
import { useUserId } from 'apps/chessroulette-web/hooks/useUserId/useUserId';
import { PeerStreamingGroup } from '../PeerStreaming';
import { MultiFaceTimeCompact } from 'apps/chessroulette-web/components/FaceTime/MultiFaceTimeCompact';
import { PeerUserIdsMap } from 'apps/chessroulette-web/providers/PeerToPeerProvider/type';

type Props = {
  rid: ResourceIdentifier<'room'>;
};

export default (props: Props) => {
  const userId = useUserId();
  const peerUser = useMemo(() => {
    if (userId) {
      return {
        id: userId,
      };
    }

    return undefined;
  }, [userId]);

  const ridAsStr = useMemo(
    () => toResourceIdentifierStr(props.rid),
    [props.rid]
  );

  // console.log('render streaming');

  if (!peerUser) {
    return (
      <div>No user id present. For now it needs to be given in the url</div>
    );
  }

  return (
    <MovexBoundResource
      movexDefinition={movexConfig}
      rid={props.rid}
      // onResourceStateUpdated={(r) => {
      //   console.log('next state', r);
      // }}
      render={({ boundResource: { state, dispatch } }) => {
        // console.log('state', state);
        // const userId = searchParams.get('userId');
        const { [userId]: removedMe, ...peerUserIdsMap } = objectKeys(
          state.participants
        ).reduce((prev, nextUserId) => {
          return {
            ...prev,
            [nextUserId]: nextUserId,
          };
        }, {} as PeerUserIdsMap);

        return (
          <PeerStreamingGroup
            groupId={ridAsStr}
            clientUserId={peerUser.id}
            p2pCommunicationType="audioVideo"
            peerUserIdsMap={peerUserIdsMap}
            render={({ reel }) => (
              <MultiFaceTimeCompact
                reel={reel}
                onFocus={() => {
                  console.log('on focus');
                }}
              />
            )}
          ></PeerStreamingGroup>
        );
      }}
      // If there is a given slot just show the ChatBox
      // Otherwise allow the User to pick one

      //   if (slot) {
      //     return (
      //       <ChatBoxContainer
      //         userSlot={slot as UserSlot}
      //         state={state}
      //         dispatch={dispatch}‰
      //       />
      //     );
      //   }

      //   // Filter out the taken User Slots
      //   const availableUserSlots = objectKeys(state.userSlots).reduce(
      //     (accum, nextSlot) =>
      //       state.userSlots[nextSlot] ? [...accum, nextSlot] : accum,
      //     [] as UserSlot[]
      //   );

      //   return (
      //     <ChatOnboarding
      //       slots={availableUserSlots}
      //       onSubmit={(slot) => {
      //         // Redirect to the same page with the selected  userSlot
      //         router.push({
      //           pathname: router.asPath,
      //           query: { slot },
      //         });
      //       }}
      //     />
      //   );
      // }}
    />
  );
};
