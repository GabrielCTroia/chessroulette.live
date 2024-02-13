import { ChessFEN, noop } from '@xmatter/util-kit';
import { FenPreview } from '../components/FenPreview';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Chapter, ChapterState } from '../../activity/reducer';
import { useEffect, useMemo, useState } from 'react';
import { objectKeys } from 'movex-core-util';
import { Text } from 'apps/chessroulette-web/components/Text';
import { ChapterItem } from './ChapterItem';

export type Props = {
  fen: ChessFEN;
  chaptersMap: Record<Chapter['id'], Chapter>;
  onCreate?: (name: string) => void;
  onUseChapter?: (id: Chapter['id']) => void;
  onDeleteChapter?: (id: Chapter['id']) => void;
  onUpdateChapter?: (id: Chapter['id'], state: Partial<ChapterState>) => void;
  className?: string;
  canEdit?: boolean;
};

export const ChaptersTab = ({
  fen,
  onCreate = noop,
  onUseChapter = noop,
  onDeleteChapter = noop,
  onUpdateChapter = noop,
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

  const [uncommitedChaptersMap, setUncommittedChaptersMap] = useState<
    Record<Chapter['id'], Partial<ChapterState>>
  >({});

  useEffect(() => {
    setNewChapterName(`New Chapter (${chaptersList.length})`);
  }, [chaptersList.length]);

  return (
    <div className={`flex flex-col spt-4 w-full ${className}`}>
      <div className="flexs flex-1 overflow-scroll">
        {chaptersList.map((chapter) => {
          return (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              canEdit={canEdit}
              onUse={() => onUseChapter(chapter.id)}
              onUpdate={(state) => onUpdateChapter(chapter.id, state)}
              onDelete={() => onDeleteChapter(chapter.id)}
            />
          );
          // return (
          //   <div
          //     key={chapter.id}
          //     className="hover:cursor-pointer hover:bg-slate-600 flex-1 bg-red-100s smb-1 py-2 border-b border-slate-400 flex"
          //   >
          //     <div
          //       className="flex-1 items-center flex"
          //       onClick={() => {
          //         onUseChapter(chapter.id);
          //       }}
          //     >
          //       <input
          //         className="bg-gray-50 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block bg-opacity-0 text-white block py-1 px-2"
          //         value={
          //           uncommitedChaptersMap[chapter.id]?.name || chapter.name
          //         }
          //         onChange={(e) => {
          //           // setNewChapterName(e.target.value);

          //           setUncommittedChaptersMap((prev) => ({
          //             ...prev,
          //             [chapter.id]: {
          //               ...prev[chapter.id],
          //               name: e.target.value,
          //             },
          //           }));
          //         }}
          //       />
          //       {/* <Text className='text-sm'>
          //       {chapter.name}
          //       </Text> */}
          //     </div>
          //     {canEdit && (
          //       <>
          //         {uncommitedChaptersMap[chapter.id] && (
          //           <Button
          //             size="sm"
          //             // type="clear"
          //             className="mr-2"
          //             onClick={() => {
          //               onUpdateChapter(
          //                 chapter.id,
          //                 uncommitedChaptersMap[chapter.id]
          //               );
          //             }}
          //           >
          //             Save
          //           </Button>
          //         )}
          //         <Button
          //           size="sm"
          //           type="clear"
          //           onClick={() => onDeleteChapter(chapter.id)}
          //         >
          //           Delete
          //         </Button>
          //       </>
          //     )}
          //   </div>
          // );
        })}
        {canEdit && (
          <div
            key={`new-chapter-${chaptersList.length}`}
            className="hover:cursor-pointer hover:bg-slate-600 flex-1 bg-red-100s smb-1 flex py-2"
          >
            <div className="flex-1 items-center  flex">
              <input
                className="text-sm rounded-md hover:border-slate-400 focus:border-slate-400 border border-transparent sfocus:ring-blue-200 block bg-transparent text-white block py-1 px-2"
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
              />
            </div>

            <Button
              size="xs"
              // type="clear"
              onClick={() => onCreate(newChapterName)}
              icon="PlusIcon"
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
