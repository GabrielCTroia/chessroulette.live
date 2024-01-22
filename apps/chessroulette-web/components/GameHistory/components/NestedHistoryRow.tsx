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

type Props = {
  startingLinearIndex: number;
  pairedIndex: number;
  pairedMove: PairedMove;
  onFocus: (i: ChessHistoryIndex) => void;
  onDelete: (i: ChessHistoryIndex) => void;
  focusedIndex?: ChessHistoryIndex;
  // whiteMove?: ChessRecursiveWhiteMove;
  // blackMove?: ChessRecursiveBlackMove;
  className?: string;
};

export const NestedHistoryRow = ({
  focusedIndex,
  // whiteMove,
  // blackMove,
  pairedMove,
  startingLinearIndex,
  pairedIndex,
  className,
  onFocus,
  onDelete,
}: Props) => {
  // TODO: Should all these be recalculated here or given from outside?

  const [whiteMove, blackMove] = isPartialBlackMove(pairedMove)
      ? [undefined, pairedMove[0]] // if it's a partial black move treat it as a full move with white as undefined
      : pairedMove;

  const [focusedMoveIndex, focusedBranchIndex, focusedNestedIndex] =
    isChessRecursiveHistoryIndex(focusedIndex)
      ? focusedIndex
      : [focusedIndex, undefined, undefined];

  const whiteMoveLinearIndex = startingLinearIndex;
  const blackMoveLinearIndex = whiteMoveLinearIndex + 1;

  const moveCount = pairedIndex + 1;

  return (
    <>
      {whiteMove?.branchedHistories && (
        <>
          {whiteMove.branchedHistories.map((branchedHistory, branchIndex) => {
            const focusedIndexPerBranch =
              focusedMoveIndex === whiteMoveLinearIndex &&
              focusedBranchIndex === branchIndex
                ? focusedNestedIndex
                : undefined;

            return (
              <HistoryList
                key={`${whiteMove.san}-branch-${branchIndex}`}
                history={branchedHistory}
                onRefocus={(nestedIndex) =>
                  onFocus([whiteMoveLinearIndex, branchIndex, nestedIndex])
                }
                onDelete={(nestedIndex) =>
                  onDelete([whiteMoveLinearIndex, branchIndex, nestedIndex])
                }
                // className={cls.nestedHistory}
                className="pl-2"
                rootPairedIndex={pairedIndex} // continue this move
                focusedIndex={focusedIndexPerBranch}
                isNested={true}
              />
            );
          })}
          {blackMove && (
            <div
              // className={cx(cls.row, cls.rowBelowNested, className)}
              className={`flex pt-1 pt-1 ${className}`}
            >
              <Text
              // className={cx(cls.text, cls.rowIndex)}
              >{`${moveCount}.`}</Text>
              <Text
                // className={cx(cls.text, cls.move, cls.blackMove)}
                className="flex-1 cursor-pointer nfont-bold"
              >
                ...
              </Text>
              <Text
                // className={cx(cls.text, cls.move, cls.blackMove, {
                //   [cls.activeMove]: blackMoveLinearIndex === focusedIndex,
                // })}
                className={`flex-1 cursor-pointer mfont-bold ${
                  blackMoveLinearIndex === focusedIndex ? 'font-black' : ''
                }`}
                onClick={() => onFocus(blackMoveLinearIndex)}
              >
                {blackMove.san}
              </Text>
            </div>
          )}
        </>
      )}
      {blackMove?.branchedHistories?.map((branchedHistory, branchIndex) => {
        const focusedIndexPerBranch =
          focusedMoveIndex === blackMoveLinearIndex &&
          focusedBranchIndex === branchIndex
            ? focusedNestedIndex
            : undefined;

        return (
          <HistoryList
            history={branchedHistory}
            onRefocus={(nestedIndex) =>
              onFocus([blackMoveLinearIndex, branchIndex, nestedIndex])
            }
            onDelete={(nestedIndex) =>
              onDelete([blackMoveLinearIndex, branchIndex, nestedIndex])
            }
            key={`${blackMove.san}-branch-${branchIndex}`}
            // className={cls.nestedHistory}
            className="pl-2"
            rootPairedIndex={pairedIndex + 1} // start a new move
            focusedIndex={focusedIndexPerBranch}
            isNested={true}
          />
        );
      })}
    </>
  );
};
