import { PendingGame, PlayState } from './types';

export const PENDING_UNTIMED_GAME: PendingGame = {
  status: 'pending',
  winner: null,
  startedAt: null,
  pgn: '',
  orientation: 'w',
  timeLeft: {
    lastUpdatedAt: null,
    white: 0,
    black: 0,
  },
  lastMoveBy: 'black',
  lastMoveAt: null,
  timeClass: 'untimed',
  gameOverReason: null,

  // TODO: This doesn't need to be an array and it doesn't need to be always defined
  offers: [],
};

export const initialPlayState: PlayState = {
  game: PENDING_UNTIMED_GAME,
};