'use client';

import React, { useEffect, useState } from 'react';
import movexConfig from 'apps/chessroulette-web/movex.config';
import { useMovexResourceType } from 'movex-react';
import { useRouter } from 'next/navigation';
import { RoomState, initialRoomState } from '../movex/reducer';
import {
  toResourceIdentifierObj,
  toResourceIdentifierStr,
} from 'movex-core-util';
import { useUpdateableSearchParams } from 'apps/chessroulette-web/hooks/useSearchParams';
import { generateUserId, getRandomStr } from 'apps/chessroulette-web/util';
import { links } from '../links';
import { AsyncErr } from 'ts-async-results';
import { invoke, objectPick } from '@xmatter/util-kit';
import { initialActivityStatesByActivityType } from '../activities/movex';
import { GameTimeClass, chessGameTimeLimitMsMap } from '../../Play/types';
import { ActivityParamsSchema } from '../io/paramsSchema';
import { createMatchState } from '../activities/Match/movex';
import { logsy } from 'apps/chessroulette-web/lib/Logsy';

type Props = {
  activityParams: ActivityParamsSchema;
} & (
  | {
      mode: 'join';
      roomId: string;
    }
  | {
      mode: 'joinOrCreate';
      roomId?: string;
    }
  | {
      mode: 'create';
      roomId?: undefined;
    }
);

type ErrorType = 'RoomInexistent';

/**
 * This should happen on the server once Movex has an API, and all of these can be called via fetch
 *
 * @param param0
 * @returns
 */
export const JoinOrCreateRoom: React.FC<Props> = ({
  activityParams,
  roomId,
  mode,
}: Props) => {
  const roomResource = useMovexResourceType(movexConfig, 'room');
  const router = useRouter();
  const updateableSearchParams = useUpdateableSearchParams();

  const [error, setError] = useState<ErrorType>();

  useEffect(() => {
    if (!roomResource) {
      return;
    }

    invoke(() => {
      const createRoomInput: RoomState = invoke(() => {
        if (activityParams.activity === 'play') {
          const defaultGame =
            initialActivityStatesByActivityType['play'].activityState.game;

          const timeClass: GameTimeClass =
            activityParams.timeClass || defaultGame.timeClass;

          const createGameInput = {
            ...defaultGame,
            timeClass,
            timeLeft: {
              white: chessGameTimeLimitMsMap[timeClass],
              black: chessGameTimeLimitMsMap[timeClass],
            },
          };

          return {
            ...initialRoomState,
            activity: {
              activityType: 'play',
              activityState: {
                ...initialActivityStatesByActivityType['play'].activityState,
                game: createGameInput,
              },
            },
          };
        }

        if (activityParams.activity === 'match') {
          return {
            ...initialRoomState,
            activity: {
              activityType: 'match',
              activityState: createMatchState(activityParams),
            },
          };
        }

        return {
          ...initialRoomState,
          activity:
            initialActivityStatesByActivityType[activityParams.activity],
        };
      });

      if (mode === 'create') {
        return roomResource.create(createRoomInput, getRandomStr(7));
      }

      return (
        roomId
          ? roomResource.get(
              toResourceIdentifierStr({
                resourceId: roomId,
                resourceType: 'room',
              })
            )
          : new AsyncErr('RoomInexistent')
      ) // Fail in order to create a new room
        .flatMapErr((e) => {
          // if the mode is "join" continue to throw
          if (mode === 'join') {
            return new AsyncErr(e);
          }

          return roomResource.create(createRoomInput, roomId);
        });
    })
      .map((r) => {
        router // console.log('here', updateableSearchParams.toObject());
          .replace(
            links.getRoomLink({
              // TODO: This needs to be done in a better, more generic way
              // But right now the most important thing is that the match doesn't get extra params
              ...(r.state.activity.activityType === 'match'
                ? objectPick(updateableSearchParams.toObject(), [
                    // Room settings
                    'theme',

                    //activity settings
                    'flipped',
                  ])
                : updateableSearchParams.toObject()),
              id: toResourceIdentifierObj(r.rid).resourceId,
              activity: activityParams.activity,
              userId: updateableSearchParams.get('userId') || generateUserId(),
              // activity,
              // TODO: This was removed when I introduced the Auth (May 4th)
              // Don't think it's needed but need to ensure, especially around user given from outpost or guests
              // userId: updateableSearchParams.get('userId') || generateUserId(),
            })
          );
      })
      .mapErr((e) => {
        // TODO: support the other reasons it might fail
        setError('RoomInexistent');
        logsy.error('JoinOrCreateRoom Error', e);
      });
  }, [roomResource, activityParams, roomId]);

  // TODO: Use the built in error page˝
  if (error === 'RoomInexistent') {
    return (
      <div className="flex flex-1 items-center justify-center h-screen w-screen text-lg  divide-x">
        <h1 className="text-2xl pr-2">404</h1>
        <h1 className="pl-2">Room not found.</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen w-screen text-lg  divide-x">
        <h1 className="text-2xl pr-2">An Error Occured</h1>
        <h1 className="pl-2">{error}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center h-screen w-screen text-lg  divide-x animate-pulse">
      <span className="text-2xl pr-2">Loading...</span>
    </div>
  );
};
