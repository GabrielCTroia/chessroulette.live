import { HistoryList } from './HistoryList';
import {
  ChessHistoryIndex_NEW,
  ChessHistoryRecursiveIndexes_NEW,
  ChessHistory_NEW,
} from '../history/types';
import { HistoryRowProps } from './HistoryRow';
import { invoke } from '@xmatter/util-kit';

type Props = {
  branchedHistories: ChessHistory_NEW[];
  historyIndex: ChessHistoryIndex_NEW;
  onFocus: (i: ChessHistoryIndex_NEW) => void;
  onDelete: (i: ChessHistoryIndex_NEW) => void;
  focusedRecursiveIndexes?: ChessHistoryRecursiveIndexes_NEW;
  rowClassName?: HistoryRowProps['className'];
  className?: string;
};

export const NestedHistories = ({
  branchedHistories,
  historyIndex,
  focusedRecursiveIndexes,
  className,
  rowClassName,
  onFocus,
  onDelete,
}: Props) => {
  const [turnIndex, movePosition] = historyIndex;

  const constructNestedIndex = (
    [nestedHistoryTurnIndex, nestedHistoryMovePosition]: ChessHistoryIndex_NEW,
    paralelBranchIndex: number
  ): ChessHistoryIndex_NEW => {
    return [
      turnIndex,
      movePosition,
      [
        // Substract the upper turnIndex from the nested one
        [nestedHistoryTurnIndex - turnIndex, nestedHistoryMovePosition],
        paralelBranchIndex,
      ],
    ];
  };

  // console.log(
  //   'Nested histories: focusedRecursiveIndexes',
  //   focusedRecursiveIndexes
  // );

  return (
    <>
      {branchedHistories.map((branchedHistory, branchIndex) => {
        const focusedIndex = invoke((): ChessHistoryIndex_NEW | undefined => {
          if (!focusedRecursiveIndexes) {
            return undefined;
          }

          const [recursiveHistoryIndex, paralelBranchesIndex] =
            focusedRecursiveIndexes;

          if (recursiveHistoryIndex === -1) {
            return undefined;
          }

          // If it's not on the branch index return
          if (paralelBranchesIndex !== branchIndex) {
            return undefined;
          }

          const [focusedTurnIndex, focuedMoveCount] = recursiveHistoryIndex;

          // if (focusedTurnIndex !== turnIndex) {
          //   return undefined;
          // }
          // TODO: Fix this!!!

          return [focusedTurnIndex + turnIndex, focuedMoveCount];
        });

        // console.log('Nested Histories: focused index', focusedIndex);

        return (
          <HistoryList
            key={`${turnIndex}-${movePosition}--${branchIndex}`}
            history={branchedHistory}
            onRefocus={(nestedIndex) => {
              onFocus(constructNestedIndex(nestedIndex, branchIndex));
            }}
            onDelete={(nestedIndex) => {
              onDelete(constructNestedIndex(nestedIndex, branchIndex));
            }}
            className={className}
            rowClassName={rowClassName}
            focusedIndex={focusedIndex}
            isNested
            historyRootTurnIndex={turnIndex}
          />
        );
      })}
    </>
  );
};
