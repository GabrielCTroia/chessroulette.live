import React, { useEffect, useRef, useState } from 'react';
import debounce from 'debounce';
import useDebouncedEffect from 'use-debounced-effect';
import { HistoryRow } from './HistoryRow';
import {
  ChessHistoryIndex_NEW,
  ChessRecursiveHistory_NEW,
} from '../history/types';

export type HistoryListProps = {
  history: ChessRecursiveHistory_NEW;
  onRefocus: (atIndex: ChessHistoryIndex_NEW) => void;
  onDelete: (atIndex: ChessHistoryIndex_NEW) => void;
  focusedIndex?: ChessHistoryIndex_NEW;
  className?: string;
  rowClassName?: string;
} & (
  | {
      isNested: true;
      historyRootTurnIndex: number;
    }
  | {
      isNested?: boolean;
      historyRootTurnIndex?: undefined;
    }
);

const scrollIntoView = debounce((elm: HTMLDivElement) => {
  elm.scrollIntoView({ block: 'end', behavior: 'auto' });
}, 5);

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  focusedIndex,
  onRefocus,
  onDelete,
  className,
  rowClassName,
  historyRootTurnIndex = 0,
  isNested = false,
}) => {
  const rowElementRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const containerElementRef = useRef<HTMLDivElement | null>();

  useDebouncedEffect(
    () => {
      if (isNested) {
        return;
      }

      if (history.length === 0) {
        return;
      }

      if (!focusedIndex) {
        return;
      }

      const [focusedTurnIndex] = focusedIndex;

      if (!focusedTurnIndex) {
        return;
      }

      const elm = rowElementRefs.current[focusedTurnIndex];

      console.log('focus into view?', elm);

      if (elm) {
        scrollIntoView(elm);
      }
    },
    100,
    [history, focusedIndex, isNested]
  );

  useEffect(() => {
    setTimeout(() => {
      if (containerElementRef.current) {
        containerElementRef.current.scrollTo(0, 9999);
      }
    }, 100);
  }, []);

  return (
    <div className={className} ref={(e) => (containerElementRef.current = e)}>
      {history.map((historyTurn, historyTurnIndex) => {
        const rowId = `${historyRootTurnIndex + historyTurnIndex}.${
          historyTurn[0].san
        }-${historyTurn[1]?.san || ''}`;

        return (
          <HistoryRow
            key={rowId}
            rowId={rowId}
            ref={(r) => (rowElementRefs.current[historyTurnIndex] = r)}
            historyTurn={historyTurn}
            historyTurnIndex={historyTurnIndex}
            moveCount={historyRootTurnIndex + 1 + historyTurnIndex}
            onFocus={onRefocus}
            onDelete={onDelete}
            containerClassName={rowClassName}
            isNested={isNested}
            focusedIndex={focusedIndex}
          />
        );
      })}
    </div>
  );
};
