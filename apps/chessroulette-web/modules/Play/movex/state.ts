import { PENDING_UNTIMED_GAME } from '@app/modules/Game';
import { PlayState } from './types';

export const initialPlayState: PlayState = {
  game: PENDING_UNTIMED_GAME,
};
