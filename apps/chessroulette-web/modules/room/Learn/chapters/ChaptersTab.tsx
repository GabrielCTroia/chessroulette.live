import { ChessFEN, noop } from '@xmatter/util-kit';
import { FenPreview } from '../components/FenPreview';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Chapter } from '../../activity/reducer';
import { useEffect, useMemo, useState } from 'react';
import { objectKeys } from 'movex-core-util';

export type Props = {
  fen: ChessFEN;
  chaptersMap: Record<Chapter['id'], Chapter>;
  onCreate: (name: string) => void;
  onUseChapter?: (id: Chapter['id']) => void;
  onDeleteChapter?: (id: Chapter['id']) => void;
  className?: string;
  canEdit?: boolean;
};

export const ChaptersTab = ({
  fen,
  onCreate,
  onUseChapter = noop,
  onDeleteChapter = noop,
  chaptersMap,
  className,
  canEdit = false,
}: Props) => {
  const chaptersList = useMemo(
    () => objectKeys(chaptersMap).map((id) => chaptersMap[id]),
    [chaptersMap]
  );

  const [newChapterName, setNewChapterName] = useState(
    `New Chapter (${chaptersList.length})`
  );

  useEffect(() => {
    setNewChapterName(`New Chapter (${chaptersList.length})`);
  }, [chaptersList.length]);

  return (
    <div className={`flex flex-col spt-4 w-full ${className}`}>
      <div className="flexs flex-1 overflow-scroll">
        {chaptersList.map((chapter) => {
          return (
            <div
              key={chapter.id}
              className="hover:cursor-pointer hover:bg-slate-600 flex-1 bg-red-100s smb-1 py-2 border-b border-slate-400 flex"
            >
              <div
                className="flex-1"
                onClick={() => {
                  onUseChapter(chapter.id);
                }}
              >
                {chapter.name}
              </div>
              {canEdit && (
                <Button
                  size="sm"
                  type="clear"
                  onClick={() => onDeleteChapter(chapter.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          );
        })}
        {canEdit && (
          <div
            key={`new-chapter-${chaptersList.length}`}
            className="hover:cursor-pointer hover:bg-slate-600 flex-1 bg-red-100s smb-1 py-2 border-b border-slate-400 flex"
          >
            <div className="flex-1">
              <input
                value={newChapterName}
                onChange={(e) => {
                  setNewChapterName(e.target.value);
                }}
                className="bg-gray-50 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block bg-opacity-0 text-white block p-2.5"
              />
            </div>

            <Button
              size="sm"
              // type="clear"
              onClick={() => onCreate(newChapterName)}
            >
              Create
            </Button>
          </div>
        )}
      </div>
      <div className="w-full flex gap-4">
        <FenPreview fen={fen} className="flex-1" />
      </div>
    </div>
  );
};
