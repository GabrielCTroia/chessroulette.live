import React from 'react';
import { HistoryList, HistoryListProps } from './components/HistoryList';
import { ChessRecursiveHistory } from './types';

export type GameHistoryProps = {
  history: ChessRecursiveHistory;
  focusedIndex: HistoryListProps['focusedIndex'];
  onRefocus: HistoryListProps['onRefocus'];

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
  focusedIndex,
  onRefocus,
  ...props
}) => (
  <div className={`flex flex-1 ${props.containerClassName}`}>
    <HistoryList
      history={history}
      focusedIndex={focusedIndex}
      onRefocus={onRefocus}
      className="flex flex-1 flex-col"
      rowClassName="pb-3 border-b border-slate-600"
    />
  </div>
);
