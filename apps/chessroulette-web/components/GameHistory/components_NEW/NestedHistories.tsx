import { ChessMove } from '@xmatter/util-kit';
import { isChessRecursiveHistoryIndex } from '../lib';
import {
  ChessHistoryIndex,
  ChessRecursiveBlackMove,
  ChessRecursiveHistory,
  ChessRecursiveWhiteMove,
  PairedMove,
} from '../types';
import { HistoryList } from './HistoryList';
import { Text } from '../../Text';
import { isPartialBlackMove } from '../util';
import {
  ChessHistoryIndex_NEW,
  ChessHistoryTurn_NEW,
  ChessHistory_NEW,
} from '../history/types';

type Props = {
  branchedHistories: ChessHistory_NEW[];

  // startingLinearIndex: number;
  // historyTurn: ChessHistoryTurn_NEW;
  historyIndex: ChessHistoryIndex_NEW;
  // pairedMove: PairedMove;
  onFocus: (i: ChessHistoryIndex_NEW) => void;
  onDelete: (i: ChessHistoryIndex_NEW) => void;
  focusedIndex?: ChessHistoryIndex_NEW;
  // whiteMove?: ChessRecursiveWhiteMove;
  // blackMove?: ChessRecursiveBlackMove;
  className?: string;
};

export const NestedHistories = ({
  branchedHistories,
  historyIndex,
  className,
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

  return (
    <>
      {branchedHistories.map((branchedHistory, branchIndex) => (
        <HistoryList
          key={`${turnIndex}-${movePosition}--${branchIndex}`}
          history={branchedHistory}
          rootTurnIndex={turnIndex}
          onRefocus={(nestedIndex) => {
            onFocus(constructNestedIndex(nestedIndex, branchIndex));
          }}
          onDelete={(nestedIndex) => {
            onDelete(constructNestedIndex(nestedIndex, branchIndex));
          }}
          className={className}
          isNested={true}
        />
      ))}
    </>
  );
};
