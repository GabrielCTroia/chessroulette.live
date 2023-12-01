import { Action } from 'movex-core-util';

// export const userSlots = {
//   pink: true,
//   red: true,
//   blue: true,
//   purple: true,
//   green: true,
//   orange: true,
// };

// export type UserSlot = keyof typeof userSlots;

// export type ChatMsg = {
//   content: string;
//   atTimestamp: number;
//   userSlot: UserSlot;
// };

type ParticipantId = string;

export type RoomState = {
  // userSlots: {
  //   [slot in UserSlot]: boolean;
  // };
  participants: Record<ParticipantId, unknown>;
  activity: 'play' | 'analysis' | 'meetup' | 'none';
  counter: number;
  // messages: ChatMsg[];
};

export const initialRoomState: RoomState = {
  participants: {},
  activity: 'none',
  counter: 0,
  // messages: [],
};

// PART 2: Action Types

export type RoomActions =
  | Action<
      'join',
      {
        participantId: ParticipantId;
      }
    >
  | Action<
      'leave',
      {
        participantId: ParticipantId;
      }
    >
  | Action<'inc'>;
// | Action<
//     'submit',
//     {
//       userSlot: UserSlot;
//       content: string;
//       atTimestamp: number;
//     }
//   >;

// PART 3: The Reducer – This is where all the logic happens

export default (state = initialRoomState, action: RoomActions): RoomState => {
  // User Joins
  if (action.type === 'join') {
    return {
      ...state,
      participants: {
        ...state.participants,
        [action.payload.participantId]: null,
      },
    };
  }
  // User Leaves
  else if (action.type === 'leave') {
    const { [action.payload.participantId]: _, ...nextParticipants } =
      state.participants;

    return {
      ...state,
      participants: nextParticipants,
    };
  } else if (action.type === 'inc') {
    return {
      ...state,
      counter: state.counter + 1,
    };
  }

  // // Message gets submitted
  // else if (action.type === 'submit') {
  //   const nextMsg = action.payload;

  //   return {
  //     ...state,
  //     messages: [...state.messages, nextMsg],
  //   };
  // }

  return state;
};
