import React, { useEffect, useRef, useState } from 'react';
import debounce from 'debounce';
import useDebouncedEffect from 'use-debounced-effect';
import { HistoryRow } from './HistoryRow';
import {
  ChessHistoryIndex_NEW,
  ChessRecursiveHistory_NEW,
} from '../history/types';
import { findMoveAtIndex, findTurnAtIndex } from '../history/util';

export type HistoryListProps = {
  history: ChessRecursiveHistory_NEW;
  onRefocus: (atIndex: ChessHistoryIndex_NEW) => void;
  onDelete: (atIndex: ChessHistoryIndex_NEW) => void;
  rootTurnIndex?: number;
  focusedIndex?: ChessHistoryIndex_NEW;
  isNested?: boolean;
  className?: string;
  rowClassName?: string;
};

const scrollIntoView = debounce((elm: HTMLDivElement) => {
  elm.scrollIntoView({ block: 'end', behavior: 'smooth' });
}, 5);

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  focusedIndex,
  onRefocus,
  onDelete,
  className,
  rootTurnIndex = 0,
  rowClassName,
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

      // TODO: Add this back
      // const moveIndex = Math.floor(getChessHistoryMoveIndex(focusedIndex) / 2);
      const [focusedTurnIndex] = focusedIndex;

      if (!focusedTurnIndex) {
        return;
      }

      const elm = rowElementRefs.current[focusedTurnIndex];

      if (elm) {
        scrollIntoView(elm);
      }
    },
    100,
    [history, focusedIndex, isNested]
  );

  useEffect(() => {
    if (containerElementRef.current) {
      containerElementRef.current.scrollTo(0, 99999);
    }
  }, []);

  // console.group('History list', isNested ? 'nested' : 'root', findTurnAtIndex(history, [rootTurnIndex, 0])?.[0].san);
  // console.log('focused index', focusedIndex)
  // console.log('history', history.map((s, i) => [`${i}:`, s[0].san, s[1]?.san]).join(' '))
  // // console.log('branched?', history.map((s) => [s[0].san, s[1]?.san]).join(' '))
  // console.groupEnd();

  // const [focusedHistoryTurnIndex, focusedMovePosition] = focusedIndex || [];

  return (
    <div className={className} ref={(e) => (containerElementRef.current = e)}>
      {history.map((historyTurn, historyTurnIndex) => {
        const rowId = `${rootTurnIndex + historyTurnIndex}.${
          historyTurn[0].san
        }-${historyTurn[1]?.san || ''}`;

        return (
          <HistoryRow
            key={rowId}
            rowId={rowId}
            ref={(r) => (rowElementRefs.current[historyTurnIndex] = r)}
            historyTurn={historyTurn}
            historyTurnIndex={rootTurnIndex + historyTurnIndex}
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
