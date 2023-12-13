// import React, { useEffect } from 'react';
// import {
//   ChessGameHistoryContext,
//   ChessGameHistoryContextProps,
// } from './ChessGameHistoryContext';
// import { useChessGameHistory } from './useChessGameHistory';
// import { noop } from '@xmatter/util-kit';

// type Props = {
//   render: (c: ChessGameHistoryContextProps) => React.ReactNode;
//   onUpdated?: (c: ChessGameHistoryContextProps) => void;
// };

// export const ChessGameHistoryConsumer: React.FC<Props> = ({
//   render,
//   onUpdated = noop,
// }) => {
//   const context = useChessGameHistory();

//   useEffect(() => {
//     onUpdated(context);
//   }, [context.displayed.fen, context.cachedHistoryFen]); // Optimized around the fen only not whole history object!

//   return <ChessGameHistoryContext.Consumer children={render} />;
// };
