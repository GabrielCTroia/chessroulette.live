'use client';

import { Button } from 'apps/chessroulette-web/components/Button';
import movexConfig from 'apps/chessroulette-web/movex.config';
import { useMovexResourceType } from 'movex-react';
import { initialRoomState } from '../room/movex/reducer';
import { useRouter } from 'next/navigation';
import { toRidAsObj } from 'movex';
import { generateUserId, getRandomInt } from 'apps/chessroulette-web/util';
import { initialLearnActivityState } from '../room/activity/reducer';
import { useUpdateableSearchParams } from 'apps/chessroulette-web/hooks/useSearchParams';
import { Session } from 'next-auth';
import React from 'react';
import { links } from '../room/links';

type Props = {
  session?: Session;
};

export const MainHomeSection: React.FC<Props> = ({ session }) => {
  const roomResource = useMovexResourceType(movexConfig, 'room');
  const router = useRouter();
  const updateableSearchParams = useUpdateableSearchParams();

  return (
    <main className="flex flex-1 justify-center mt-32">
      <div className="flex gap-3 flex-col">
        <Button
          type="custom"
          className="bg-blue-500 hover:bg-blue-400 font-bold"
          onClick={() => {
            roomResource
              ?.create({
                ...initialRoomState,
                activity: initialLearnActivityState,
              })
              .map((s) => {
                router.push(
                  links.getRoomLink({
                    ...updateableSearchParams.toObject(),
                    id: toRidAsObj(s.rid).resourceId,
                    activity: 'learn',
                    instructor: true,
                    userId:
                      updateableSearchParams.get('userId') || generateUserId(),
                  })
                );
              });
          }}
        >
          Start Class as Instructor
        </Button>
        <Button
          onClick={() => {
            roomResource
              ?.create({
                ...initialRoomState,
                activity: initialLearnActivityState,
              })
              .map((s) => {
                router.push(
                  links.getRoomLink({
                    ...updateableSearchParams.toObject(),
                    id: toRidAsObj(s.rid).resourceId,
                    activity: 'learn',
                    instructor: true,
                    theme: 'op',
                    userId:
                      updateableSearchParams.get('userId') || generateUserId(),
                  })
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
                router.push(
                  links.getRoomLink({
                    ...updateableSearchParams.toObject(),
                    id: toRidAsObj(s.rid).resourceId,
                    activity: 'learn',
                    instructor: true,
                    theme: 'kids',
                    userId:
                      updateableSearchParams.get('userId') || generateUserId(),
                  })
                );
              });
          }}
          type="custom"
          className="bg-green-600 font-bold hover:bg-green-500"
        >
          Start Class as Kids Instructor
        </Button>
      </div>
    </main>
  );
};
