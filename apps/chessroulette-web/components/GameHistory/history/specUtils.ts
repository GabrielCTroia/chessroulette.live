import { ChessHistory_NEW } from './types';

export const HISTORY_WITH_FULL_LAST_TURN: ChessHistory_NEW = [
  [
    {
      from: 'e2',
      to: 'e4',
      color: 'w',
    },
    {
      from: 'e7',
      to: 'e6',
      color: 'b',
    },
  ],
];
export const HISTORY_WITH_HALF_LAST_TURN: ChessHistory_NEW = [
  ...HISTORY_WITH_FULL_LAST_TURN,
  [
    {
      from: 'a2',
      to: 'a3',
      color: 'w',
    },
  ],
];

export const LONG_HISTORY_WITH_FULL_LAST_TURN: ChessHistory_NEW = [
  [
    {
      from: 'e2',
      to: 'e4',
      color: 'w',
    },
    {
      from: 'e7',
      to: 'e6',
      color: 'b',
    },
  ],
  [
    {
      from: 'd2',
      to: 'd4',
      color: 'w',
    },
    {
      from: 'd7',
      to: 'd5',
      color: 'b',
    },
  ],
  [
    {
      from: 'a2',
      to: 'a3',
      color: 'w',
    },
    {
      from: 'b7',
      to: 'b5',
      color: 'b',
    },
  ],
];

export const LONG_HISTORY_WITH_HALF_LAST_TURN: ChessHistory_NEW = [
  ...LONG_HISTORY_WITH_FULL_LAST_TURN,
  [
    {
      from: 'h2',
      to: 'h3',
      color: 'w',
    },
  ],
];
