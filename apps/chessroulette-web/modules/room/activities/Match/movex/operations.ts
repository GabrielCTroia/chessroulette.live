import {
  DistributiveOmit,
  getRandomColor,
  invoke,
  isWhiteColor,
} from '@xmatter/util-kit';
import { MatchState } from './types';
import { createGame } from 'apps/chessroulette-web/modules/Play/store';
import { MatchActivityParamsSchema } from '../activityParamsSchema';

export const createMatchState = (
  params: DistributiveOmit<MatchActivityParamsSchema, 'activity'>
): MatchState => {
  const challengerColor = params.startColor || getRandomColor();
  const players = invoke((): MatchState['players'] => {
    if (isWhiteColor(challengerColor)) {
      return {
        white: { id: params.challengerId, score: 0 },
        black: { id: params.challengeeId, score: 0 },
      };
    }

    return {
      white: { id: params.challengeeId, score: 0 },
      black: { id: params.challengerId, score: 0 },
    };
  });

  return {
    status: 'pending',
    ...(params.type === 'bestOf'
      ? {
          type: params.type,
          rounds: params.rounds || 1, // Default to one round if not specified
        }
      : {
          type: params.type,
        }),
    players,
    winner: undefined,
    // ...(params.timeClass && {
    //   // timeClass: params.timeClass,
    // }),
    completedPlays: [],
    ongoingPlay: {
      game: createGame({
        timeClass: params.timeClass || 'untimed',
        color: challengerColor,
      }),
    },
  };
};