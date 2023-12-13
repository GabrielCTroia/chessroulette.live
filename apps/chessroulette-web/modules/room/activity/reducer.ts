import {
  ChessFEN,
  ChessMove,
} from 'apps/chessroulette-web/components/Chessboard/type';
import ChessFENBoard from 'apps/chessroulette-web/lib/ChessFENBoard/ChessFENBoard';
import { Action } from 'movex-core-util';

type ParticipantId = string;

export type LearnActivityState = {
  activityType: 'learn';
  activityState: {
    fen: ChessFEN;
  };
};

export type OtherActivities = {
  activityType: 'play' | 'meetup' | 'none';
  activityState: {};
};

export type ActivityState = LearnActivityState | OtherActivities;

export const initialActivtityState: ActivityState = {
  activityType: 'none',
  activityState: {},
};

// PART 2: Action Types

export type ActivityActions = Action<'dropPiece', ChessMove>;

// PART 3: The Reducer – This is where all the logic happens

export default (
  prev: ActivityState = initialActivtityState,
  action: ActivityActions
): ActivityState => {
  if (prev.activityType === 'learn') {
    // TODO: Should this be split?

    console.log('action', action);
    if (action.type === 'dropPiece') {
      try {
        const instance = new ChessFENBoard(prev.activityState.fen);
        instance.move(action.payload.from, action.payload.to);

        const next = {
          ...prev,
          activityState: {
            ...prev.activityState,
            fen: instance.fen,
          },
        };

        console.log('worked', next)

        return next;
      } catch (e) {
        console.warn('failed', e)

        return prev;
      }
    }
  }

  return prev;
};
