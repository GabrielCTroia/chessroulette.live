import React from 'react';
import { HistoryList, HistoryListProps } from './components_NEW/HistoryList';
import { useKeysToRefocusHistory } from './hooks';
import { ChessRecursiveHistory_NEW } from './history/types';
import { getStartingHistoryIndex } from './history/util';

export type GameHistoryProps = {
  history: ChessRecursiveHistory_NEW;
  focusedIndex: HistoryListProps['focusedIndex'];
  onRefocus: HistoryListProps['onRefocus'];
  onDelete: HistoryListProps['onDelete'];

  emptyContent?: string | React.ReactNode;

  className?: string;
  containerClassName?: string;
};

export const GameHistory: React.FC<GameHistoryProps> = ({
  history = [],

  emptyContent = 'Wow, so empty!',
  focusedIndex = getStartingHistoryIndex(),
  onRefocus,
  onDelete,
  ...props
}) => {
  useKeysToRefocusHistory(history, focusedIndex, onRefocus);

  return (
    <>
      <div className={`flex flex-1 ${props.containerClassName}`}>
        <HistoryList
          history={history}
          focusedIndex={focusedIndex}
          onRefocus={onRefocus}
          onDelete={onDelete}
          className="flex flex-1 flex-col"
          rowClassName="border-b border-slate-600"
        />
      </div>
      {/* focusedIndex: {focusedIndex} */}
    </>
  );
};
