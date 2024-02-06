'use client';

import { Button } from 'apps/chessroulette-web/components/Button';
import movexConfig from 'apps/chessroulette-web/movex.config';
import { useMovexResourceType } from 'movex-react';
import { initialRoomState } from '../room/movex/reducer';
import { useRouter } from 'next/navigation';
import { toRidAsStr } from 'movex';
import { getRandomInt } from 'apps/chessroulette-web/util';
import { initialLearnActivityState } from '../room/activity/reducer';
import { useUpdateableSearchParams } from 'apps/chessroulette-web/hooks/useSearchParams';
import { Session } from 'next-auth';
import React from 'react';

type Props = {
  session?: Session;
};

export const MainHomeSection: React.FC<Props> = ({ session }) => {
  const roomResource = useMovexResourceType(movexConfig, 'room');
  const router = useRouter();
  const updateableSearchParams = useUpdateableSearchParams();

  return (
    <main className="flex gap-6">
      <Button
        onClick={() => {
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
  );
};
