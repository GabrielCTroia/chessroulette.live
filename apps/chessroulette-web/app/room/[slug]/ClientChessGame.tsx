'use client';

import {
  ChessGame,
  ChessPropsProps,
} from '../../../modules/ChessGame/ChessGame';

export const ClientChessGame = (props: ChessPropsProps) => {
  return <ChessGame {...props} />;
};
