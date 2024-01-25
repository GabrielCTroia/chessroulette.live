'use client';

import { ClipboardCopyButton } from 'apps/chessroulette-web/components/ClipboardCopyButton';
import { PaperAirplaneIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { getRandomInt } from '@xmatter/util-kit';
import { useUrl } from 'nextjs-current-url';

export const RoomSideMenu = () => {
  const url = useUrl();
  const [nextUserId, setNextUserId] = useState(getRandomInt(0, 99999));
  const inviteUrl = useMemo(() => {
    if (!url) {
      return '';
    }

    url.searchParams.set('userId', String(nextUserId));
    url.searchParams.set('flipped', '1');

    return url.href;
  }, [url, nextUserId]);

  return (
    <div className="flex flex-col items-center">
      <ClipboardCopyButton
        value={inviteUrl}
        // copiedlLabel="Invitation Copied"
        className="bg-green-700 hover:bg-green-600 active:bg-green-700"
        onCopied={() => {
          setNextUserId(getRandomInt(0, 9999));
        }}
        type="custom"
        size="sm"
        render={(copied) =>
          copied ? (
            <CheckIcon title="Copied" className="w-5 h-5" />
          ) : (
            <PaperAirplaneIcon className="w-5 h-5" />
          )
        }
      ></ClipboardCopyButton>
    </div>
  );
};
