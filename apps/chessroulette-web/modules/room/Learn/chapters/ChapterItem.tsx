import { useEffect, useState } from 'react';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Chapter, ChapterState } from '../../activity/reducer';
import { noop } from '@xmatter/util-kit';
import { FenPreview } from '../components/FenPreview';

import { PgnInputBox } from 'apps/chessroulette-web/components/PgnInputBox';
import { DragAndDrop } from 'apps/chessroulette-web/components/DragAndDrop';
import { Text } from 'apps/chessroulette-web/components/Text';

export type Props = {
  chapter: Chapter;
  canEdit?: boolean;
  onUse?: () => void;
  onDelete?: () => void;
  onUpdate?: (s: Partial<ChapterState>) => void;
  expanded?: boolean;
};

export const ChapterItem = ({
  chapter,
  canEdit,
  onUpdate = noop,
  onUse = noop,
  onDelete = noop,
  expanded = true,
}: Props) => {
  const [uncommitedState, setUncommitedState] =
    useState<Partial<ChapterState>>();

  useEffect(() => {
    // Here others then the name can come
    if (uncommitedState?.name === chapter.name) {
      setUncommitedState(undefined);
    }
  }, [uncommitedState, chapter]);

  return (
    <div
      key={chapter.id}
      className="flex flex-1 flex-col gap-2 pt-2 hover:cursor-pointer hover:bg-slate-600 p-2 py-3 border-b border-slate-400"
      onClick={onUse}
    >
        {chapter.name}
    </div>
  );
};
