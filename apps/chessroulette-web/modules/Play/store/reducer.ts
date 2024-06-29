import {
  getNewChessGame,
  invoke,
  localChessMoveToChessLibraryMove,
  swapColor,
  toLongColor,
} from '@xmatter/util-kit';
import { initialPlayState } from './state';
import { GameOffer, PlayActions, PlayState } from './types';
import { chessGameTimeLimitMsMap } from '../types';
import { createGame } from './operations';
import { getMovesDetailsFromPGN } from '../../room/activities/Match/utils';

export const reducer = (
  prev: PlayState = initialPlayState,
  action: PlayActions
): PlayState => {
  if (action.type === 'play:move') {
    const { lastMoveAt, lastMoveBy, timeLeft, pgn } = prev.game;
    const { moveAt } = action.payload;

    const movesHistory = getMovesDetailsFromPGN(pgn);
    //if black hasn't moved yet, don't update the timeLeft
    const nextTimeLeft = invoke(() => {
      if (movesHistory.totalMoves > 1 || lastMoveBy === 'black') {
        const movedAtAsDate = new Date(moveAt);
        const lastMoveAtAsDate =
          prev.game.status === 'pending' ? movedAtAsDate : new Date(lastMoveAt);

        const elapsedTime =
          movedAtAsDate.getTime() - lastMoveAtAsDate.getTime();
        return timeLeft[lastMoveBy] - elapsedTime;
      }
      return timeLeft[lastMoveBy];
    });
    const instance = getNewChessGame({ pgn });
    try {
      instance.move(localChessMoveToChessLibraryMove(action.payload));
    } catch (e) {
      console.error(
        'Action Error:',
        action.type,
        'Move Invalid:',
        action.payload,
        prev,
        e
      );
      return prev;
    }

    const isCheckMate = instance.isCheckmate();

    const nextGameState =
      prev.game.status === 'pending' && pgn.length === 0
        ? 'ongoing'
        : (prev.game.timeClass !== 'untimed' &&
            prev.game.status !== 'pending' &&
            (nextTimeLeft < 0 || isCheckMate)) ||
          (prev.game.timeClass === 'untimed' &&
            prev.game.status === 'ongoing' &&
            isCheckMate)
        ? 'complete'
        : 'ongoing';
    const turn = toLongColor(swapColor(lastMoveBy));

    return {
      ...prev,
      game: {
        ...prev.game,
        pgn: instance.pgn(),
        timeLeft: {
          ...prev.game.timeLeft,
          [turn]: nextTimeLeft,
        },
        lastMoveBy: turn,
        lastMoveAt: moveAt,
        status: nextGameState,
        ...(isCheckMate && {
          winner: turn,
        }),
      },
    };
  }

  if (action.type === 'play:setGameTimeClass') {
    const timeLeft = chessGameTimeLimitMsMap[action.payload];

    return {
      ...prev,
      game: {
        ...prev.game,
        timeClass: action.payload,
        timeLeft: {
          white: timeLeft,
          black: timeLeft,
        },
      },
    };
  }

  if (action.type === 'play:timeout') {
    if (prev.game.status !== 'ongoing') {
      return prev;
    }
    //clear any pending offer leftover
    const lastOffer =
      prev.game.offers.length > 0 &&
      (prev.game.offers[prev.game.offers.length - 1] as GameOffer).status ===
        'pending'
        ? ({
            ...prev.game.offers[prev.game.offers.length - 1],
            status: 'cancelled',
          } as GameOffer)
        : undefined;

    return {
      ...prev,
      game: {
        ...prev.game,
        status: 'complete',
        winner: prev.game.lastMoveBy,
        timeLeft: {
          ...prev.game.timeLeft,
          [swapColor(prev.game.lastMoveBy)]: 0,
        },
      },
      ...(lastOffer && {
        gameOffers: [...prev.game.offers.slice(0, -1), lastOffer],
      }),
    };
  }

  if (action.type === 'play:resignGame') {
    return {
      ...prev,
      game: {
        ...prev.game,
        status: 'complete',
        winner: toLongColor(swapColor(action.payload.color)),
      },
    };
  }

  if (action.type === 'play:sendOffer') {
    const { byPlayer, offerType } = action.payload;
    const nextOffers: GameOffer[] = [
      ...prev.game.offers,
      {
        byPlayer,
        type: offerType,
        status: 'pending',
        ...(action.payload.timestamp && {
          timestamp: action.payload.timestamp,
        }),
      },
    ];

    return {
      ...prev,
      game: {
        ...prev.game,
        offers: nextOffers,
      },
    };
  }

  if (action.type === 'play:acceptOfferRematch') {
    const lastOffer: GameOffer = {
      ...prev.game.offers[prev.game.offers.length - 1],
      status: 'accepted',
    };

    const newGame = createGame({
      timeClass: prev.game.timeClass,
      color: swapColor(prev.game.orientation),
    });

    return {
      ...prev,
      // gameOffers: [...prev.gameOffers.slice(0, -1), lastOffer],
      game: newGame,
    };
  }

  if (action.type === 'play:acceptOfferDraw') {
    const lastOffer: GameOffer = {
      ...prev.game.offers[prev.game.offers.length - 1],
      status: 'accepted',
    };

    const nextOffers = [...prev.game.offers.slice(0, -1), lastOffer];

    return {
      ...prev,
      game: {
        ...prev.game,
        status: 'complete',
        winner: '1/2',
        offers: nextOffers,
      },
    };
  }

  if (action.type === 'play:acceptTakeBack') {
    const lastOffer: GameOffer = {
      ...prev.game.offers[prev.game.offers.length - 1],
      status: 'accepted',
    };

    const newGame = getNewChessGame({
      pgn: prev.game.pgn.slice(0, prev.game.pgn.length - 1),
    });

    const takebackAt =
      prev.game.offers[prev.game.offers.length - 1].timestamp ||
      new Date().getTime();

    const elapsedTime = takebackAt - prev.game.lastMoveAt;
    const nextTimeLeft = prev.game.timeLeft[prev.game.lastMoveBy] - elapsedTime;
    const turn = toLongColor(swapColor(prev.game.lastMoveBy));

    const nextOffers = [...prev.game.offers.slice(0, -1), lastOffer];

    return {
      ...prev,
      game: {
        ...prev.game,
        pgn: newGame.pgn(),
        lastMoveBy: turn,
        timeLeft: {
          ...prev.game.timeLeft,
          [prev.game.lastMoveBy]: nextTimeLeft,
        },
        offers: nextOffers,
      },
    };
  }

  if (action.type === 'play:denyOffer') {
    const lastOffer: GameOffer = {
      ...prev.game.offers[prev.game.offers.length - 1],
      status: 'denied',
    };

    const nextOffers = [...prev.game.offers.slice(0, -1), lastOffer];

    return {
      ...prev,
      game: {
        ...prev.game,
        offers: nextOffers,
      },
    };
  }

  if (action.type === 'play:cancelOffer') {
    const lastOffer: GameOffer = {
      ...prev.game.offers[prev.game.offers.length - 1],
      status: 'cancelled',
    };

    const nextOffers = [...prev.game.offers.slice(0, -1), lastOffer];

    return {
      ...prev,
      game: {
        ...prev.game,
        offers: nextOffers,
      },
    };
  }

  return prev;
};
