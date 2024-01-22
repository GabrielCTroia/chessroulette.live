import React, { useEffect, useRef, useState } from 'react';
import debounce from 'debounce';
import useDebouncedEffect from 'use-debounced-effect';
import { HistoryRow } from './HistoryRow';
import {
  ChessHistoryIndex,
  ChessRecursiveHistory,
  PairedHistory,
} from '../types';
import {
  isPartialBlackMove,
  pairedToLinearIndex,
  toPairedHistory,
} from '../util';
// import { getChessHistoryMoveIndex } from './util';
import {
  ChessHistoryIndex_NEW,
  ChessRecursiveHistory_NEW,
} from '../history/types';

export type HistoryListProps = {
  history: ChessRecursiveHistory_NEW;
  onRefocus: (atIndex: ChessHistoryIndex_NEW) => void;
  onDelete: (atIndex: ChessHistoryIndex_NEW) => void;
  focusedIndex?: ChessHistoryIndex_NEW;
  isNested?: boolean;
  rootTurnIndex?: number;
  // rootPairedIndex?: number;
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
  // const [pairedHistory, setPairedHistory] = useState<PairedHistory>(
  //   toPairedHistory(history)
  // );

  // useEffect(() => {
  //   setPairedHistory(toPairedHistory(history));
  // }, [history]);

  useDebouncedEffect(
    () => {
      if (isNested) {
        return;
      }

      if (history.length === 0) {
        return;
      }

      // TODO: Add this back
      // const moveIndex = Math.floor(getChessHistoryMoveIndex(focusedIndex) / 2);
      // const elm = rowElementRefs.current[moveIndex];

      // if (elm) {
      // scrollIntoView(elm);
      // }
    },
    100,
    [history, focusedIndex, isNested]
  );

  useEffect(() => {
    if (containerElementRef.current) {
      console.log('here');
      containerElementRef.current.scrollTo(0, -99099);
    }
  }, []);

  return (
    <div className={className} ref={(e) => (containerElementRef.current = e)}>
      {history.map((historyTurn, historyTurnIndex) => (
        <HistoryRow
          key={`${historyTurn[0].san}-${
            historyTurn[1]?.san || ''
          }-${historyTurnIndex}`}
          ref={(r) => (rowElementRefs.current[historyTurnIndex] = r)}
          historyTurn={historyTurn}
          historyTurnIndex={rootTurnIndex + historyTurnIndex}
          // startingLinearIndex={
          //   isPartialBlackMove(pairedHistory[0])
          //     ? // If the history starts with a black move the index needs to be altered
          //       //  but have no idea how come it needs to be substracted not added
          //       pairedToLinearIndex([index, 0]) - 1
          //     : pairedToLinearIndex([index, 0])
          // }
          // focusedColor={focusedIndex}
          // onFocus={onRefocus}
          // onDelete={onDelete}
          onFocus={(p) => {
            onRefocus(p)
            // onRefocus([historyTurnIndex, p === 'w' : ])
            // console.log('on focus', p);
          }}
          onDelete={(p) => {
            onDelete(p);
            // console.log('on delete', p);
          }}
          containerClassName={rowClassName}
          isNested={isNested}
        />
      ))}
    </div>
  );
};
