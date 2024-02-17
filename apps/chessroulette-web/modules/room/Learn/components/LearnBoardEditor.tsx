import { BoardEditorWithSize } from 'apps/chessroulette-web/components/Chessboard/BoardEditor';
import { EditModeState } from '../types';
import { swapColor } from '@xmatter/util-kit';

type Props = {
  state: EditModeState;
  onUpdate: (s: (prev: EditModeState) => EditModeState) => void;
  boardSizePx: number;
};

export const LearnBoardEditor = ({
  state: { fen, orientation, arrowsMap, circlesMap },
  boardSizePx,
  onUpdate,
}: Props) => {
  return (
    <BoardEditorWithSize
      fen={fen}
      // sizePx={desktopLayout.main.width.val}
      sizePx={boardSizePx}
      onUpdated={(fen) => onUpdate((prev) => ({ ...prev, fen }))}
      boardOrientation={orientation}
      onArrowsChange={(arrowsMap) =>
        onUpdate((prev) => ({ ...prev, arrowsMap }))
      }
      arrowsMap={arrowsMap}
      circlesMap={circlesMap}
      onCircleDraw={(circleTuple) => {
        onUpdate((prev) => {
          const [at] = circleTuple;
          const circleId = `${at}`;
          const { [circleId]: existent, ...restOfCirles } =
            prev.circlesMap || {};

          return {
            ...prev,
            circlesMap: {
              ...restOfCirles,
              ...(!!existent
                ? undefined // Set it to undefined if same
                : { [circleId]: circleTuple }),
            },
          };
        });
      }}
      onClearCircles={() => {
        onUpdate((prev) => ({
          ...prev,
          circlesMap: {},
        }));
      }}
      onFlipBoard={() => {
        onUpdate((prev) => ({
          ...prev,
          orientation: swapColor(prev.orientation),
        }));
      }}
    />
  );
};
