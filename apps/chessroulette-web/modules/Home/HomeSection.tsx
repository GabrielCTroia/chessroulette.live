'use client';

import { Button } from 'apps/chessroulette-web/components/Button';
import movexConfig from 'apps/chessroulette-web/movex.config';
import {
  MovexBoundResource,
  // MovexConnection,
  useMovexResourceType,
} from 'movex-react';
import { initialRoomState } from '../room/reducer';
import { useRouter, useSearchParams } from 'next/navigation';
import { toRidAsStr } from 'movex';
import RoomParticipants from '../room/RoomParticipants';
import { RoomOnboarding } from 'apps/chessroulette-web/components/RoomOnboarding';
import { useState } from 'react';

import { objectKeys } from 'movex-core-util';
import { getRandomInt } from 'apps/chessroulette-web/util';
import Header from 'apps/chessroulette-web/components/Header';

export default () => {
  const roomResource = useMovexResourceType(movexConfig, 'room');
  const router = useRouter();

  // const  = searchParams;

  // const [userId] = useState(String(getRandomInt(0, 9999)));

  return (
    <>
      {/* <RoomOnboarding
        slots={Object.keys(initialRoomState.userSlots)}
        onSubmit={(slot) => {
          roomResource?.create(initialRoomState).map((s) => {
            // console.log('created', s);
            router.push(`room/${toRidAsStr(s.rid)}`);
          });
          // chatResource.create(initialChatState).map((item) => {
          //   router.push({
          //     pathname: `/chat/${toRidAsStr(item.rid)}`,
          //     query: { slot },
          //   });
          // });
        }}
      /> */}
      <main className='flex gap-6'>
        <Button
          onClick={() => {
            // console.log('works', roomResource);

            roomResource
              ?.create({ ...initialRoomState, activity: 'play' })
              .map((s) => {
                router.push(
                  `play/${toRidAsStr(s.rid)}?userId=${getRandomInt(0, 999)}`
                );
              });
          }}
        >
          Play
        </Button>
        <Button
          onClick={() => {
            // console.log('works', roomResource);

            roomResource
              ?.create({ ...initialRoomState, activity: 'learn' })
              .map((s) => {
                router.push(
                  `learn/${toRidAsStr(s.rid)}?userId=${getRandomInt(0, 999)}`
                );
              });
          }}
        >
          Learn
        </Button>
      </main>
    </>
  );
};
