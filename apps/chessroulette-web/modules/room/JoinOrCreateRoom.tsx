'use client';

import React, { useEffect } from 'react';
import movexConfig from 'apps/chessroulette-web/movex.config';
import { useMovexResourceType } from 'movex-react';
import { useRouter } from 'next/navigation';
import { initialRoomState } from './movex/reducer';
import { initialLearnActivityState } from './activity/reducer';
import {
  toResourceIdentifierObj,
  toResourceIdentifierStr,
} from 'movex-core-util';
import { Ok } from 'ts-results';
import { useUpdateableSearchParams } from 'apps/chessroulette-web/hooks/useSearchParams';
import { getRandomInt } from 'apps/chessroulette-web/util';

type Props = {
  // rid: ResourceIdentifier<'room'>;
  id: string;
  activity: 'learn'; // To expand in the future
  forwardSearchParamsString?: string; // These are the search Params
};

export const JoinOrCreateRoom: React.FC<Props> = ({
  activity,
  id,
  forwardSearchParamsString = '',
}: Props) => {
  const roomResource = useMovexResourceType(movexConfig, 'room');
  const router = useRouter();
  const updateableSearchParams = useUpdateableSearchParams();

  useEffect(() => {
    if (roomResource && activity === 'learn') {
      const rid = toResourceIdentifierStr({
        resourceId: id,
        resourceType: 'room',
      });

      roomResource
        .get(rid)
        .flatMapErr(() =>
          roomResource.create(
            {
              ...initialRoomState,
              activity: initialLearnActivityState,
            },
            id
          )
        )
        .map((r) => {
          // `${pathname}?` +
          //           updateableSearchParams.set((prev) => ({
          //             ...prev,
          //             userId: prev.userId || getRandomInt(0, 999),
          //             theme: 'outpost',
          //             instructor: 1,
          //           }))

          router.replace(
            `/r/learn/${
              toResourceIdentifierObj(r.rid).resourceId
            }?${forwardSearchParamsString}` +
              updateableSearchParams.set((prev) => ({
                userId: prev.userId || getRandomInt(0, 999),
              }))
            // `/r/learn/${
            //   toResourceIdentifierObj(r.rid).resourceId
            // }?${forwardSearchParamsString}`
          );
        });
    }
  }, [roomResource, activity, id]);

  return null;
};
