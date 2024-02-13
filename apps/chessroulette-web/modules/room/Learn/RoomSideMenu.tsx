'use client';

import { ClipboardCopyButton } from 'apps/chessroulette-web/components/ClipboardCopyButton';
import { PaperAirplaneIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { getRandomInt } from '@xmatter/util-kit';
import { useUrl } from 'nextjs-current-url';
import { useLearnActivitySettings } from './useLearnActivitySettings';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Icon } from 'apps/chessroulette-web/components/Icon';
import { useRouter, usePathname } from 'next/navigation';
import { useUpdateableSearchParams } from 'apps/chessroulette-web/hooks/useSearchParams';
// import { Router } from 'next/router';
// import {} from 'ne'

export const RoomSideMenu = () => {
  const router = useRouter();
  const pathName = usePathname();

  const url = useUrl();
  const [nextUserId, setNextUserId] = useState(getRandomInt(0, 99999));
  const inviteUrl = useMemo(() => {
    if (!url) {
      return '';
    }

    // TODO: All of these should be somewhere else
    url.searchParams.set('userId', String(nextUserId));
    url.searchParams.delete('instructor');
    url.searchParams.delete('edit');

    return url.href;
  }, [url, nextUserId]);

  const settings = useLearnActivitySettings();

  const searchParams = useUpdateableSearchParams();

  return (
    <div className="flex flex-col items-center gap-4">
      {settings.isInstructor && (
        <>
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
            title="Invite Student"
          />
          <Button
            className="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-800 font-bold"
            title="Edit Lesson"
            onClick={() => {
              const nextSearchParams = searchParams.set((prev) => ({
                ...prev,
                edit: '1',
              }));

              // console.log('searchParams', searchParams.toObject());

              router.push(`${pathName}?${nextSearchParams}`);
              // setEditMode({
              //   isActive: true,
              //   fen: activityState.fen,
              //   circlesMap: {},
              //   arrowsMap: {},
              //   orientation: activityState.boardOrientation,
              // });
            }}
            type="custom"
            size="sm"
            // icon="PencilSquareIcon"
          >
            <Icon name="PencilSquareIcon" className="w-5 h-5" />
            {/* Edit */}
          </Button>
        </>
      )}
    </div>
  );
};
