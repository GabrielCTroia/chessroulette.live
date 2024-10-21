'use client';

import { type DispatchOf, noop } from '@xmatter/util-kit';
import type { IceServerRecord } from '@app/providers/PeerToPeerProvider';
import type { UserId, UsersMap } from '@app/modules/user';
import type { MatchActivityActions, MatchActivityState } from './movex';
import { MatchContainer } from '@app/modules/Match';
import { useMatchActivitySettings } from './useMatchActivitySettings';

export type Props = {
  roomId: string;
  userId: UserId;
  iceServers: IceServerRecord[];
  participants: UsersMap;
  remoteState: NonNullable<MatchActivityState['activityState']>;
  dispatch?: DispatchOf<MatchActivityActions>;
};

export const MatchActivity = ({ remoteState, dispatch, ...props }: Props) => {
  const { isBoardFlipped } = useMatchActivitySettings();

  return (
    <MatchContainer
      dispatch={dispatch || noop}
      state={remoteState}
      isBoardFlipped={isBoardFlipped}
      {...props}
    />
  );
};
