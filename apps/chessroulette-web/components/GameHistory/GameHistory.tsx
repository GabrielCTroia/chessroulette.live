import React from 'react';
// import { createUseStyles } from 'src/lib/jss';
// import cx from 'classnames';
// import { spacers } from 'src/theme/spacers';
import { HistoryList, HistoryListProps } from './components/HistoryList';
// import { ChessRecursiveHistory } from 'chessroulette-io';
import { Text } from '../Text';
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
}) => {
  // const cls = useStyles();

  return (
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
};

// const useStyles = createUseStyles({
//   container: {
//     display: 'flex',
//     height: '100%',
//   },
//   main: {
//     display: 'flex',
//     height: '100%',
//     flexDirection: 'column',
//     flex: 1,
//   },
//   spacer: {
//     height: spacers.default,
//   },
//   content: {
//     display: 'flex',
//     flex: 1,
//     flexDirection: 'column',
//     overflowY: 'auto',
//   },
//   row: {
//     '&:last-child': {
//       paddingBottom: 0,
//     },
//   },
// });
