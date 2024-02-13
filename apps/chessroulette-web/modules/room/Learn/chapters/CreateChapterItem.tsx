import { useEffect, useState } from 'react';
import { Button } from 'apps/chessroulette-web/components/Button';
import { ChapterState } from '../../activity/reducer';
import { ChessFEN, ChessFENBoard, noop } from '@xmatter/util-kit';
import { EditChapterState } from './EditChapterState';

export type Props = {
  boardFen: ChessFEN;
  defaultChapterName: string;

  onCreate: (state: ChapterState) => void;
  onUpdateFen: (fen: ChessFEN) => void;
  onClearArrowsAndCircles: () => void;
};

export const CreateChapterItem = ({
  boardFen,
  defaultChapterName,
  onCreate,
  onUpdateFen,
  onClearArrowsAndCircles,
}: Props) => {
  const [state, setState] = useState({
    fen: boardFen,
    name: defaultChapterName,
  });

  useEffect(() => {
    setState({
      name: defaultChapterName,
      fen: boardFen,
    });
  }, [boardFen, defaultChapterName]);

  return (
    <div className="flex flex-1 flex-col gap-3 pt-2 sborder-b border-slate-400 shover:cursor-pointer shover:bg-slate-600 overflow-scroll">
      <EditChapterState
        state={state}
        onUpdate={(s) => {
          if (s.fen) {
            onUpdateFen(s.fen);
          } else if (s.name) {
            const { name } = s;
            setState((prev) => ({
              ...prev,
              name,
            }));
          }
        }}
      />
      <div className="flex justify-end gap-2">
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
          size="sm"
          onClick={() => {
            onCreate(state);
            onClearArrowsAndCircles();
          }}
          icon="PlusIcon"
        >
          Create Chapter
        </Button>
      </div>
    </div>
  );
};
