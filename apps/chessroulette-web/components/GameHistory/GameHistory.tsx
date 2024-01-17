import React from 'react';
import { HistoryList, HistoryListProps } from './components/HistoryList';
import { ChessRecursiveHistory } from './types';
import { useKeysToRefocusHistory } from './hooks';

export type GameHistoryProps = {
  history: ChessRecursiveHistory;
  focusedIndex: HistoryListProps['focusedIndex'];
  onRefocus: HistoryListProps['onRefocus'];
  onDelete: HistoryListProps['onDelete'];

  emptyContent?: string | React.ReactNode;

  className?: string;
  containerClassName?: string;

  // @deprecated
  showRows?: number;
};

export const GameHistory: React.FC<GameHistoryProps> = ({
  history = [],

  emptyContent = 'Wow, so empty!',
  showRows = 4,
  focusedIndex = 0,
  onRefocus,
  onDelete,
  ...props
}) => {
  useKeysToRefocusHistory(history, focusedIndex, onRefocus);

  return (
    <div className={`flex flex-1 ${props.containerClassName}`}>
      <HistoryList
        history={history}
        focusedIndex={focusedIndex}
        onRefocus={onRefocus}
        onDelete={onDelete}
        className="flex flex-1 flex-col"
        rowClassName="pb-3 border-b border-slate-600"
      />
    </div>
  );
};
