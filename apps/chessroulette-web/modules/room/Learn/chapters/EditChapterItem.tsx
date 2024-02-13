import { useEffect, useState } from 'react';
import { Button } from 'apps/chessroulette-web/components/Button';
import { Chapter, ChapterState } from '../../activity/reducer';
import { EditChapterState } from './EditChapterState';
import { ChessFEN, ChessFENBoard } from '@xmatter/util-kit';

export type EditChapterItemProps = {
  chapter: Chapter;
  boardState: Pick<ChapterState, 'fen' | 'arrowsMap' | 'circlesMap'>;
  onUse: () => void;
  onExpand: () => void;
  onCollapse: () => void;
  onDelete: () => void;
  onUpdate: (s: Partial<ChapterState>) => void;
  onUpdateFen: (fen: ChessFEN) => void;
  onClearArrowsAndCircles: () => void;
  expanded?: boolean;
  className?: string;
};

const toChapterState = (c: Chapter): ChapterState => ({
  name: c.name,
  fen: c.fen,
  arrowsMap: c.arrowsMap,
  circlesMap: c.circlesMap,
});

const areChapterStatesEqual = (a: ChapterState, b: ChapterState) =>
  a.fen === b.fen &&
  a.name === b.name &&
  a.arrowsMap === b.arrowsMap &&
  a.circlesMap === b.circlesMap;

const calcUncommited = ({
  chapter,
  uncommited,
  nextPartial,
}: {
  chapter: ChapterState;
  uncommited: ChapterState;
  nextPartial: Partial<ChapterState>;
}) => {
  const nextState = {
    ...uncommited,
    ...nextPartial,
  };

  return {
    isChanged: !areChapterStatesEqual(nextState, chapter),
    state: nextState,
  };
};

export const EditChapterItem = ({
  chapter,
  boardState,
  onUse,
  onUpdate,
  onExpand,
  onCollapse,
  onDelete,
  onClearArrowsAndCircles,
  onUpdateFen,
  expanded = false,
  className,
}: EditChapterItemProps) => {
  const [uncommited, setUncommited] = useState<{
    isChanged: boolean;
    state: ChapterState;
  }>({
    isChanged: false,
    state: toChapterState(chapter),
  });

  useEffect(() => {
    setUncommited((prev) => {
      if (areChapterStatesEqual(uncommited.state, chapter)) {
        return {
          isChanged: false,
          state: toChapterState(chapter),
        };
      }

      return prev;
    });
  }, [chapter]);

  // Update the uncommited based on the given Board State
  useEffect(() => {
    setUncommited((prev) =>
      calcUncommited({
        nextPartial: boardState,
        chapter,
        uncommited: prev.state,
      })
    );
  }, [chapter, boardState]);

  return (
    <div
      className={`flex flex-1 flex-col gap-2 hover:cursor-pointer hover:bg-slate-600 ${
        expanded ? 'bg-slate-600' : ''
      } ${className}`}
    >
      <div className="flex">
        <div
          className="flex-1 flex items-center"
          {...(!expanded && {
            onClick: onUse,
          })}
        >
          {chapter.name}
        </div>

        <div className="flex align-end justify-end gap-2">
          {!expanded && (
            <Button
              size="xs"
              icon="PencilIcon"
              onClick={() => {
                onExpand();
                onUse();
              }}
            >
              Edit
            </Button>
          )}

          <Button
            size="xs"
            type="clear"
            onClick={onDelete}
            icon="TrashIcon"
            iconKind="outline"
          >
            Delete
          </Button>
        </div>
      </div>

      {expanded && (
        <>
          <div className="spt-2 flex flex-col gap-3">
            <EditChapterState
              state={uncommited.state}
              onUpdate={(nextPartialState) => {
                setUncommited(
                  calcUncommited({
                    nextPartial: nextPartialState,
                    chapter,
                    uncommited: uncommited.state,
                  })
                );
              }}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              size="sm"
              type="secondary"
              onClick={() => {
                onUpdateFen(ChessFENBoard.ONLY_KINGS_FEN);

                onClearArrowsAndCircles();
              }}
              icon="TrashIcon"
              iconKind="outline"
            >
              Clear Board
            </Button>
            <Button
              size="sm"
              type="secondary"
              onClick={() => {
                onUpdateFen(ChessFENBoard.STARTING_FEN);
                onClearArrowsAndCircles();
              }}
              icon="ArrowPathIcon"
              iconKind="outline"
            >
              Starting Position
            </Button>

            <div className="flex-1" />

            <Button
              size="xs"
              type="clear"
              onClick={() => {
                setUncommited({
                  isChanged: false,
                  state: toChapterState(chapter),
                });

                onUse();

                onCollapse();
              }}
            >
              Cancel
            </Button>
            <Button
              size="xs"
              // type="clear"
              disabled={!uncommited.isChanged}
              onClick={() => {
                if (uncommited.isChanged) {
                  onUpdate(uncommited.state);
                }
                onCollapse();
              }}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
