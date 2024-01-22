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

export const BRANCHED_HISTORY_1: ChessHistory_NEW = [
  [
    {
      from: 'a2',
      to: 'a3',
      color: 'w',
    },
    {
      from: 'a7',
      to: 'a5',
      color: 'b',
    },
  ],
  [
    {
      from: 'a3',
      to: 'a4',
      color: 'w',
    },
  ],
];
export const BRANCHED_HISTORY_2: ChessHistory_NEW = [
  [
    {
      from: 'b2',
      to: 'b4',
      color: 'w',
    },
    {
      from: 'b7',
      to: 'b5',
      color: 'b',
    },
  ],
];
export const BRANCHED_HISTORY_3: ChessHistory_NEW = [
  [
    {
      from: 'c2',
      to: 'c4',
      color: 'w',
    },
  ],
];
export const PARALEL_BRANCHED_HISTORIES = [
  BRANCHED_HISTORY_1,
  BRANCHED_HISTORY_2,
  BRANCHED_HISTORY_3,
];
export const LONG_HISTORY_WITH_PARALEL_HISTORIES = [
  ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(0, 1),
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
      branchedHistories: PARALEL_BRANCHED_HISTORIES,
    },
  ],
  ...LONG_HISTORY_WITH_FULL_LAST_TURN.slice(2),
] as ChessHistory_NEW;
