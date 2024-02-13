import { useEffect, useState } from 'react';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Chapter, ChapterState } from '../../activity/reducer';
import { noop } from '@xmatter/util-kit';

export type Props = {
  chapter: Chapter;
  canEdit?: boolean;
  onUse?: () => void;
  onDelete?: () => void;
  onUpdate?: (s: Partial<ChapterState>) => void;
};

export const ChapterItem = ({
  chapter,
  canEdit,
  onUpdate = noop,
  onUse = noop,
  onDelete = noop,
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
      className="flex flex-1 py-2 border-b border-slate-400 hover:cursor-pointer hover:bg-slate-600 "
    >
      <div className="flex-1 flex items-center" onClick={onUse}>
        <input
          className="w-fulls text-sm rounded-md hover:border-slate-400 focus:border-slate-400 border border-transparent block bg-transparent text-white block py-1 px-2"
          value={uncommitedState?.name ?? chapter.name}
          onChange={(e) => {
            setUncommitedState((prev) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
        />
      </div>
      {canEdit && (
        <div className="flex flex-1 align-end justify-end gap-2">
          {uncommitedState ? (
            <>
              <Button
                size="xs"
                // type="clear"
                disabled={uncommitedState?.name === ''}
                onClick={() => {
                  onUpdate(uncommitedState);
                }}
              >
                Save
              </Button>
              <Button
                size="xs"
                type="clear"
                onClick={() => {
                  setUncommitedState(undefined);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button size="xs" type="clear" onClick={onDelete} icon="TrashIcon" iconKind="outline">
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
