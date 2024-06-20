'use client';

import { ClipboardCopyButton } from 'apps/chessroulette-web/components/ClipboardCopyButton';
import { useUrl } from 'nextjs-current-url';
import { RoomActivityType, links } from '../links';
import Link from 'next/link';
import { Icon } from 'apps/chessroulette-web/components/Icon';
import { useMemo } from 'react';
import { useRoomSettings } from '../hooks/useRoomSettings';
import { roomSettingsIsPlay } from '../utils';
import { IconButton } from 'apps/chessroulette-web/components/Button';

type Props = {
  roomId: string;
  activity: RoomActivityType;
};

export const RoomSideMenu = ({ roomId, activity }: Props) => {
  const url = useUrl();
  const roomSettings = useRoomSettings(activity);

  const joinRoomLink = useMemo(() => {
    if (!(roomSettings.showJoinRoomLink && url)) {
      return undefined;
    }
    return links.getJoinRoomLink(
      {
        id: roomId,
        activity,
        ...(activity === 'play' &&
          roomSettingsIsPlay(roomSettings) && {
            gameTimeClass: roomSettings.gameTimeClass,
          }),
        theme: roomSettings.theme,
        ...roomSettings.joinRoomLinkParams,
      },
      {
        origin: url.origin,
      }
    );
  }, [roomSettings.showJoinRoomLink, activity, url?.origin]);

  return (
    <div className="flex flex-col items-center gap-4">
      {joinRoomLink && (
        <ClipboardCopyButton
          buttonComponentType="Button"
          value={joinRoomLink}
          render={(copied) => (
            <>
              {copied ? (
                <Link
                  href={joinRoomLink}
                  target="_blank"
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon name="CheckIcon" className="w-4 h-4" />
                </Link>
              ) : (
                <Icon name="PaperAirplaneIcon" className="w-4 h-4" />
              )}
            </>
          )}
          bgColor="green"
          type="custom"
          size="sm"
          tooltip={roomSettings.joinRoomLinkTooltip || 'Invite Opponent'}
        />
      )}

      <IconButton icon="BuildingLibraryIcon" size="sm" href="/learn/lessons" />
    </div>
  );
};
