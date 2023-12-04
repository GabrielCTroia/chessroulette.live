import { User } from '@prisma/client';
import { ChessFEN, ChessPGN } from './util';

export type DisplayableUser = Pick<User, 'firstName' | 'lastName' | 'username'>;

export type DisplayablePost = {
  id: string;
  author: DisplayableUser;
  // categories: string[];
} & (
  | {
      type: 'PGN';
      content: ChessPGN;
    }
  | {
      type: 'FEN';
      content: ChessFEN;
    }
);
