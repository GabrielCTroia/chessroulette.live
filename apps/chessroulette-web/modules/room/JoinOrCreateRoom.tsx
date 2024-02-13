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

import { useUpdateableSearchParams } from 'apps/chessroulette-web/hooks/useSearchParams';
import { getRandomInt } from 'apps/chessroulette-web/util';
import { links } from './links';

type Props = {
  id: string;
  activity: 'learn'; // To expand in the future
};

export const JoinOrCreateRoom: React.FC<Props> = ({ activity, id }: Props) => {
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
          router.replace(
            links.getRoomLink({
              ...updateableSearchParams.toObject(),
              id: toResourceIdentifierObj(r.rid).resourceId,
              activity: 'learn',
              userId:
                updateableSearchParams.get('userId') || getRandomInt(0, 999),
            })
          );
        });
    }
  }, [roomResource, activity, id]);

  return null;
};
