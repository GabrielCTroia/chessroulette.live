'use client';

import { Button } from 'apps/chessroulette-web/components/Button';
import movexConfig from 'apps/chessroulette-web/movex.config';
import {
  MovexBoundResource,
  // MovexConnection,
  useMovexResourceType,
} from 'movex-react';
import { initialRoomState } from '../room/movex/reducer';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toRidAsStr } from 'movex';
import RoomParticipants from '../room/RoomParticipants';
import { RoomOnboarding } from 'apps/chessroulette-web/components/RoomOnboarding';
import { useEffect, useState } from 'react';

import { objectKeys } from 'movex-core-util';
import { getRandomInt } from 'apps/chessroulette-web/util';
import Header from 'apps/chessroulette-web/components/Header';
import { ChessFENBoard } from '@xmatter/util-kit';
import { initialLearnActivityState } from '../room/activity/reducer';
import { useUpdateableSearchParams } from 'apps/chessroulette-web/hooks/useSearchParams';
// import { formatURL } from 'apps/chessroulette-web/lib/util';

export default () => {
  const roomResource = useMovexResourceType(movexConfig, 'room');
  const router = useRouter();
  const path = usePathname();

  const updateableSearchParams = useUpdateableSearchParams();
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
      <main className="flex gap-6">
        {/* <Button
          onClick={() => {
            // console.log('works', roomResource);

            roomResource
              ?.create({
                ...initialRoomState,
                activity: {
                  activityType: 'play',
                  activityState: {},
                },
              })
              .map((s) => {
                router.push(
                  `play/${toRidAsStr(s.rid)}?userId=${getRandomInt(0, 999)}`
                );
              });
          }}
        >
          Play
        </Button> */}
        <Button
          onClick={() => {
            // console.log('works', roomResource);

            roomResource
              ?.create({
                ...initialRoomState,
                activity: initialLearnActivityState,
              })
              .map((s) => {
                const pathname = `learn/${toRidAsStr(s.rid)}`;

                router.push(
                  `${pathname}?` +
                    updateableSearchParams.set((prev) => ({
                      ...prev,
                      userId: prev.userId || getRandomInt(0, 999),
                      theme: 'outpost',
                      instructor: 1,
                    }))
                );
              });
          }}
        >
          Start Class As Outpost Instructor
        </Button>
        <Button
          onClick={() => {
            // console.log('works', roomResource);

            roomResource
              ?.create({
                ...initialRoomState,
                activity: initialLearnActivityState,
              })
              .map((s) => {
                const pathname = `learn/${toRidAsStr(s.rid)}`;

                router.push(
                  `${pathname}?` +
                    updateableSearchParams.set((prev) => ({
                      ...prev,
                      userId: prev.userId || getRandomInt(0, 999),
                      instructor: 1,
                      theme: 'kids',
                    }))
                );
              });
          }}
          type="custom"
          className="bg-green-600 font-bold hover:bg-green-500"
        >
          Start Class as Kids Instructor
        </Button>
      </main>
    </>
  );
};
