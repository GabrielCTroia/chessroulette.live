import { HistoryList } from './HistoryList';
import {
  ChessHistoryIndex_NEW,
  ChessHistoryRecursiveIndexes_NEW,
  ChessHistory_NEW,
} from '../history/types';
import { HistoryRowProps } from './HistoryRow';
import { invoke } from '@xmatter/util-kit';
import { renderHistoryIndex } from '../history/util';
import { useMemo } from 'react';

type Props = {
  branchedHistories: ChessHistory_NEW[];
  rootHistoryIndex: ChessHistoryIndex_NEW;
  onFocus: (i: ChessHistoryIndex_NEW) => void;
  onDelete: (i: ChessHistoryIndex_NEW) => void;
  focusedRecursiveIndexes?: ChessHistoryRecursiveIndexes_NEW;
  rowClassName?: HistoryRowProps['className'];
  className?: string;
};

export const NestedHistories = ({
  branchedHistories,
  rootHistoryIndex,
  focusedRecursiveIndexes,
  className,
  rowClassName,
  onFocus,
  onDelete,
}: Props) => {
  const rootHistoryIndexWithoutNested = useMemo(
    () =>
      [
        rootHistoryIndex[0],
        rootHistoryIndex[1],
      ] satisfies ChessHistoryIndex_NEW,
    [rootHistoryIndex]
  );
  const [rootTurnIndex, rootMovePosition] = rootHistoryIndexWithoutNested;

  const constructNestedIndex = (
    [nestedHistoryTurnIndex, nestedHistoryMovePosition]: ChessHistoryIndex_NEW,
    paralelBranchIndex: number
  ): ChessHistoryIndex_NEW => {
    return [
      rootTurnIndex,
      rootMovePosition,
      [
        // Substract the upper turnIndex from the nested one
        // [nestedHistoryTurnIndex - turnIndex, nestedHistoryMovePosition],
        [nestedHistoryTurnIndex, nestedHistoryMovePosition],
        paralelBranchIndex,
      ],
    ];
  };

  return (
    <>
      <span
        className=""
        style={{
          fontSize: 9,
        }}
      >
        NHI: {renderHistoryIndex(rootHistoryIndex)}
      </span>
      {branchedHistories.map((branchedHistory, branchIndex) => {
        return (
          <HistoryList
            key={`${rootTurnIndex}-${rootMovePosition}--${branchIndex}`}
            history={branchedHistory}
            onRefocus={(nestedIndex) => {
              onFocus(constructNestedIndex(nestedIndex, branchIndex));
            }}
            onDelete={(nestedIndex) => {
              onDelete(constructNestedIndex(nestedIndex, branchIndex));
            }}
            className={className}
            rowClassName={rowClassName}
            isNested
            rootHistoryIndex={rootHistoryIndexWithoutNested}
            focusedIndex={
              focusedRecursiveIndexes?.[0] !== -1 &&
              focusedRecursiveIndexes?.[1] === branchIndex
                ? focusedRecursiveIndexes[0]
                : undefined
            }
          />
        );
      })}
    </>
  );
};
