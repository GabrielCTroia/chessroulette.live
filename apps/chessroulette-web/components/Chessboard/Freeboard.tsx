'use client';

import { ChessFENBoard } from '@xmatter/util-kit';
import {
  ChessboardContainer,
  ChessboardContainerProps,
} from './ChessboardContainer';

type Props = ChessboardContainerProps;

export const Freeboard = ({
  fen = ChessFENBoard.STARTING_FEN,
  ...props
}: Props) => {
  return <ChessboardContainer fen={fen} {...props} />;
};
