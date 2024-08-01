import { createMatchState } from './operations';
import { reducer as matchReducer } from './reducer';
import { MatchActivityActions, MatchActivityState, MatchState } from './types';
import {
  Game,
  PlayActions,
  PlayState,
  createGame,
} from 'apps/chessroulette-web/modules/Play';

const wrapIntoActivityState = <M extends MatchState>(
  match: M
): MatchActivityState => ({
  activityType: 'match',
  activityState: match,
});

const wrapIntoPlay = <G extends Game>(game: G): PlayState => ({
  game,
});

test('match does NOT become "pending" if the game has NOT started yet', () => {});

describe('Match Status: Pending > Ongoing', () => {
  const matchCreateParams: Parameters<typeof createMatchState>[0] = {
    type: 'bestOf',
    rounds: 3,
    timeClass: 'blitz',
    challengeeId: 'gigi',
    challengerId: 'costel',
    startColor: 'b',
  };

  const pendingMatch = createMatchState(matchCreateParams);

  const idlingMatch = matchReducer(wrapIntoActivityState(pendingMatch), {
    type: 'play:startWhitePlayerIdlingTimer',
    payload: {
      at: 123,
    },
  });

  test('With first move action', () => {
    const action: PlayActions = {
      type: 'play:move',
      payload: { from: 'e2', to: 'e4', moveAt: 123 },
    };

    const actual = matchReducer(idlingMatch, action);

    const expectedMatch: MatchState = {
      status: 'pending',
      type: 'bestOf',
      rounds: 3,
      completedPlays: [],
      players: {
        white: {
          id: 'gigi',
          score: 0,
        },
        black: {
          id: 'costel',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'b',
        }),
        status: 'idling',
        startedAt: 123,
        winner: undefined,
        pgn: '1. e4',
        lastMoveAt: 123,
        lastMoveBy: 'white',
      }),
    };

    const expected: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatch,
    };

    expect(actual).toEqual(expected);

    const actionBlack: PlayActions = {
      type: 'play:move',
      payload: { from: 'e7', to: 'e6', moveAt: 123 },
    };

    const update = matchReducer(actual, actionBlack);

    const expectedUpdate: MatchState = {
      status: 'ongoing',
      type: 'bestOf',
      rounds: 3,
      completedPlays: [],
      players: {
        white: {
          id: 'gigi',
          score: 0,
        },
        black: {
          id: 'costel',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'b',
        }),
        status: 'ongoing',
        startedAt: 123,
        winner: undefined,
        pgn: '1. e4 e6',
        lastMoveAt: 123,
        lastMoveBy: 'black',
      }),
    };

    const expectedStateUpdate: MatchActivityState = {
      activityType: 'match',
      activityState: expectedUpdate,
    };

    expect(update).toEqual(expectedStateUpdate);
  });
});

describe('Match Status: Ongoing > Completed', () => {
  const matchCreateParams: Parameters<typeof createMatchState>[0] = {
    type: 'bestOf',
    rounds: 1,
    timeClass: 'blitz',
    challengeeId: 'maria',
    challengerId: 'john',
    startColor: 'w',
  };

  const pendingMatch = createMatchState(matchCreateParams);
  const idlingMatch = matchReducer(wrapIntoActivityState(pendingMatch), {
    type: 'play:startWhitePlayerIdlingTimer',
    payload: {
      at: 123,
    },
  });

  test('On check mate move', () => {
    const action: PlayActions = {
      type: 'play:move',
      payload: { from: 'g2', to: 'g4', moveAt: 123 },
    };
    const actual = matchReducer(idlingMatch, action);
    const expectedMatch: MatchState = {
      status: 'pending',
      type: 'bestOf',
      rounds: 1,
      completedPlays: [],
      players: {
        white: {
          id: 'john',
          score: 0,
        },
        black: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'w',
        }),
        status: 'idling',

        pgn: '1. g4',
        lastMoveAt: 123,
        lastMoveBy: 'white',
        startedAt: 123,
        winner: undefined,
      }),
    };
    const expected: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatch,
    };
    expect(actual).toEqual(expected);

    const actionBlack: PlayActions = {
      type: 'play:move',
      payload: { from: 'e7', to: 'e6', moveAt: 1234 },
    };
    const actualUpdate = matchReducer(actual, actionBlack);

    const actionWhite: PlayActions = {
      type: 'play:move',
      payload: { from: 'f2', to: 'f3', moveAt: 1234 },
    };

    const actualUpdateAgain = matchReducer(actualUpdate, actionWhite);

    const killerAction: PlayActions = {
      type: 'play:move',
      payload: { from: 'd8', to: 'h4', moveAt: 1234 },
    };

    const lastUpdate = matchReducer(actualUpdateAgain, killerAction);

    const expectedMatchState: MatchState = {
      status: 'complete',
      type: 'bestOf',
      rounds: 1,
      completedPlays: [
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'w',
            }),
            status: 'complete',
            pgn: '1. g4 e6 2. f3 Qh4#',
            lastMoveAt: 1234,
            lastMoveBy: 'black',
            winner: 'black',
            startedAt: 123,
          }),
        },
      ],
      players: {
        white: {
          id: 'john',
          score: 0,
        },
        black: {
          id: 'maria',
          score: 1,
        },
      },
      winner: 'maria',
      ongoingPlay: undefined,
    };

    const expectedResult: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatchState,
    };

    expect(lastUpdate).toEqual(expectedResult);
  });
});

describe('Start New Match => ', () => {
  const matchCreateParams: Parameters<typeof createMatchState>[0] = {
    type: 'bestOf',
    rounds: 3,
    timeClass: 'blitz',
    challengeeId: 'maria',
    challengerId: 'john',
    startColor: 'w',
  };

  const pendingMatch = createMatchState(matchCreateParams);
  const idlingMatch = matchReducer(wrapIntoActivityState(pendingMatch), {
    type: 'play:startWhitePlayerIdlingTimer',
    payload: {
      at: 123,
    },
  });

  test('Swap players colors when starting new game if not the first of the series', () => {
    const action: PlayActions = {
      type: 'play:move',
      payload: { from: 'e2', to: 'e4', moveAt: 123 },
    };

    const actual = matchReducer(idlingMatch, action);

    const expectedMatch: MatchState = {
      status: 'pending',
      type: 'bestOf',
      rounds: 3,
      completedPlays: [],
      players: {
        white: {
          id: 'john',
          score: 0,
        },
        black: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'w',
        }),
        status: 'idling',
        pgn: '1. e4',
        lastMoveAt: 123,
        lastMoveBy: 'white',
        startedAt: 123,
        winner: undefined,
      }),
    };

    const newMatchState: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatch,
    };

    expect(actual).toEqual(newMatchState);

    const actual2 = matchReducer(actual, {
      type: 'play:move',
      payload: { from: 'e7', to: 'e6', moveAt: 123 },
    });

    const resignAction: PlayActions = {
      type: 'play:resignGame',
      payload: {
        color: 'white',
      },
    };

    const update = matchReducer(actual2, resignAction);

    const startNewMatch: MatchActivityActions = {
      type: 'match:startNewGame',
    };

    const actualNewMatch = matchReducer(update, startNewMatch);

    const expectedMatchUpdate: MatchState = {
      status: 'ongoing',
      type: 'bestOf',
      rounds: 3,
      completedPlays: [
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'w',
            }),
            status: 'complete',
            pgn: '1. e4 e6',
            lastMoveAt: 123,
            lastMoveBy: 'black',
            winner: 'black',
            startedAt: 123,
          }),
        },
      ],
      winner: undefined,
      players: {
        white: {
          id: 'maria',
          score: 1,
        },
        black: {
          id: 'john',
          score: 0,
        },
      },
      ongoingPlay: {
        game: createGame({
          timeClass: 'blitz',
          color: 'black',
        }),
      },
    };

    const finalMatchState: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatchUpdate,
    };

    expect(actualNewMatch).toEqual(finalMatchState);
  });
});

describe('End Match when rounds number reached', () => {
  const matchCreateParams: Parameters<typeof createMatchState>[0] = {
    type: 'bestOf',
    rounds: 1,
    timeClass: 'blitz',
    challengeeId: 'maria',
    challengerId: 'john',
    startColor: 'w',
  };

  const pendingMatch = createMatchState(matchCreateParams);
  const idlingMatch = matchReducer(wrapIntoActivityState(pendingMatch), {
    type: 'play:startWhitePlayerIdlingTimer',
    payload: {
      at: 123,
    },
  });

  test('ending last game should end the series', () => {
    const action: PlayActions = {
      type: 'play:move',
      payload: { from: 'e2', to: 'e4', moveAt: 123 },
    };

    const actual = matchReducer(idlingMatch, action);

    const expectedMatch: MatchState = {
      status: 'pending',
      type: 'bestOf',
      rounds: 1,
      completedPlays: [],
      players: {
        white: {
          id: 'john',
          score: 0,
        },
        black: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'w',
        }),
        status: 'idling',
        pgn: '1. e4',
        lastMoveAt: 123,
        lastMoveBy: 'white',
        startedAt: 123,
        winner: undefined,
      }),
    };

    const newMatchState: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatch,
    };

    expect(actual).toEqual(newMatchState);

    const actual2 = matchReducer(actual, {
      type: 'play:move',
      payload: { from: 'e7', to: 'e6', moveAt: 123 },
    });

    const actionResign: PlayActions = {
      type: 'play:resignGame',
      payload: {
        color: 'black',
      },
    };

    const update = matchReducer(actual2, actionResign);

    const expectedMatchUpdate: MatchState = {
      status: 'complete',
      type: 'bestOf',
      rounds: 1,
      completedPlays: [
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'w',
            }),
            status: 'complete',
            pgn: '1. e4 e6',
            lastMoveAt: 123,
            lastMoveBy: 'black',
            winner: 'white',
            startedAt: 123,
          }),
        },
      ],
      players: {
        white: {
          id: 'john',
          score: 1,
        },
        black: {
          id: 'maria',
          score: 0,
        },
      },
      winner: 'john',
      ongoingPlay: undefined,
    };

    const finalMatchState: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatchUpdate,
    };

    expect(update).toEqual(finalMatchState);
  });

  test('draw game doesnt impact score', () => {
    const action: PlayActions = {
      type: 'play:move',
      payload: { from: 'e2', to: 'e4', moveAt: 123 },
    };

    const actual = matchReducer(idlingMatch, action);

    const expectedMatch: MatchState = {
      status: 'pending',
      type: 'bestOf',
      rounds: 1,
      completedPlays: [],
      players: {
        white: {
          id: 'john',
          score: 0,
        },
        black: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'w',
        }),
        status: 'idling',
        pgn: '1. e4',
        lastMoveAt: 123,
        lastMoveBy: 'white',
        startedAt: 123,
        winner: undefined,
      }),
    };

    const newMatchState: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatch,
    };

    expect(actual).toEqual(newMatchState);

    const actual2 = matchReducer(actual, {
      type: 'play:move',
      payload: { from: 'e7', to: 'e6', moveAt: 123 },
    });

    const actionDrawInvite: PlayActions = {
      type: 'play:sendOffer',
      payload: {
        byPlayer: 'john',
        offerType: 'draw',
      },
    };

    const drawOffer = matchReducer(actual2, actionDrawInvite);

    const acceptDraw: PlayActions = {
      type: 'play:acceptOfferDraw',
    };

    const update = matchReducer(drawOffer, acceptDraw);

    const expectedUpdate: MatchState = {
      status: 'ongoing',
      type: 'bestOf',
      rounds: 1,
      completedPlays: [
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'w',
            }),
            offers: [{ byPlayer: 'john', status: 'accepted', type: 'draw' }],
            status: 'complete',
            pgn: '1. e4 e6',
            lastMoveAt: 123,
            lastMoveBy: 'black',
            winner: '1/2',
            startedAt: 123,
          }),
        },
      ],
      players: {
        white: {
          id: 'john',
          score: 0,
        },
        black: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: undefined,
    };

    const updateMatchState: MatchActivityState = {
      activityType: 'match',
      activityState: expectedUpdate,
    };

    expect(update).toEqual(updateMatchState);
  });
});

describe('timer only starts after black moves', () => {
  const matchCreateParams: Parameters<typeof createMatchState>[0] = {
    type: 'openEnded',
    timeClass: 'blitz',
    challengeeId: 'maria',
    challengerId: 'john',
    startColor: 'w',
  };

  const pendingMatch = createMatchState(matchCreateParams);
  const idlingMatch = matchReducer(wrapIntoActivityState(pendingMatch), {
    type: 'play:startWhitePlayerIdlingTimer',
    payload: {
      at: 123,
    },
  });

  test('timer shouldnt start after white move, only after black', () => {
    const moveWhiteTime = new Date().getTime();
    const action: PlayActions = {
      type: 'play:move',
      payload: { from: 'e2', to: 'e4', moveAt: moveWhiteTime },
    };

    const actual = matchReducer(idlingMatch, action);

    const expectedMatch: MatchState = {
      // TODO: This should still be "pending" with the new Ideas
      status: 'pending',
      type: 'openEnded',
      completedPlays: [],
      players: {
        white: {
          id: 'john',
          score: 0,
        },
        black: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'w',
        }),
        timeLeft: { white: 300000, black: 300000 },
        status: 'idling',
        pgn: '1. e4',
        lastMoveAt: moveWhiteTime,
        lastMoveBy: 'white',
        startedAt: 123,
        winner: undefined,
      }),
    };
    const newMatchState: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatch,
    };
    expect(actual).toEqual(newMatchState);

    const moveBlackTime = new Date().getTime();
    const action2: PlayActions = {
      type: 'play:move',
      payload: { from: 'e7', to: 'e6', moveAt: moveBlackTime },
    };

    const update = matchReducer(actual, action2);

    const expectedMatchUpdate: MatchState = {
      status: 'ongoing',
      type: 'openEnded',
      completedPlays: [],
      players: {
        white: {
          id: 'john',
          score: 0,
        },
        black: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'w',
        }),
        timeLeft: { white: 300000, black: 300000 },
        status: 'ongoing',
        pgn: '1. e4 e6',
        lastMoveAt: moveBlackTime,
        lastMoveBy: 'black',
        startedAt: 123,
        winner: undefined,
      }),
    };
    const newMatchStateUpdate: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatchUpdate,
    };
    expect(update).toEqual(newMatchStateUpdate);

    const lastMoveTime = new Date().getTime() + 1;
    const lastMoveAction: PlayActions = {
      type: 'play:move',
      payload: { from: 'c2', to: 'c4', moveAt: lastMoveTime },
    };

    const final = matchReducer(update, lastMoveAction);
    if (final.activityType !== 'match') {
      return;
    }
    if (!final.activityState?.ongoingPlay) {
      return;
    }
    const { timeLeft } = final.activityState.ongoingPlay.game;

    expect(timeLeft.black).toEqual(300000);
    expect(timeLeft.white).not.toEqual(30000);
  });
});

describe('abort game -> match', () => {
  const matchCreateParams: Parameters<typeof createMatchState>[0] = {
    type: 'bestOf',
    rounds: 3,
    timeClass: 'blitz',
    challengeeId: 'maria',
    challengerId: 'john',
    startColor: 'w',
  };

  const pendingMatch = createMatchState(matchCreateParams);
  const idlingMatch = matchReducer(wrapIntoActivityState(pendingMatch), {
    type: 'play:startWhitePlayerIdlingTimer',
    payload: {
      at: 123,
    },
  });
  test('aborting first game will abort the whole match', () => {
    const action: PlayActions = {
      type: 'play:abortGame',
      payload: {
        color: 'white',
      },
    };

    const actual = matchReducer(idlingMatch, action);

    const expectedMatch: MatchState = {
      status: 'aborted',
      type: 'bestOf',
      rounds: 3,
      completedPlays: [
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'w',
            }),
            offers: [],
            status: 'aborted',
            pgn: '',
            lastMoveAt: undefined,
            lastMoveBy: 'black',
            winner: undefined,
            startedAt: 123,
          }),
        },
      ],
      players: {
        white: {
          id: 'john',
          score: 0,
        },
        black: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: undefined,
    };
    const expected: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatch,
    };
    expect(expected).toEqual(actual);
  });
  test('aborting second game will complete the match and have a winner - abort with white', () => {
    const matchUpdateWhiteMove = matchReducer(idlingMatch, {
      type: 'play:move',
      payload: { from: 'e2', to: 'e4', moveAt: 123 },
    });
    const matchUpdateBlackMove = matchReducer(matchUpdateWhiteMove, {
      type: 'play:move',
      payload: { from: 'e7', to: 'e6', moveAt: 123 },
    });
    const matchUpdateResign = matchReducer(matchUpdateBlackMove, {
      type: 'play:resignGame',
      payload: {
        color: 'black',
      },
    });

    const newMatch = matchReducer(matchUpdateResign, {
      type: 'match:startNewGame',
    });

    const expectedNewMatchState: MatchState = {
      status: 'ongoing',
      type: 'bestOf',
      rounds: 3,
      completedPlays: [
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'w',
            }),
            offers: [],
            status: 'complete',
            pgn: '1. e4 e6',
            lastMoveAt: 123,
            lastMoveBy: 'black',
            winner: 'white',
            startedAt: 123,
          }),
        },
      ],
      players: {
        black: {
          id: 'john',
          score: 1,
        },
        white: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'black',
        }),
      }),
    };
    const expectedNewMatch: MatchActivityState = {
      activityType: 'match',
      activityState: expectedNewMatchState,
    };

    expect(newMatch).toEqual(expectedNewMatch);

    const idleMatch = matchReducer(newMatch, {
      type: 'play:startWhitePlayerIdlingTimer',
      payload: { at: 123 },
    });

    const actual = matchReducer(idleMatch, {
      type: 'play:abortGame',
      payload: {
        color: 'white',
      },
    });

    const expectedMatch: MatchState = {
      status: 'complete',
      type: 'bestOf',
      rounds: 3,
      completedPlays: [
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'w',
            }),
            offers: [],
            status: 'complete',
            pgn: '1. e4 e6',
            lastMoveAt: 123,
            lastMoveBy: 'black',
            winner: 'white',
            startedAt: 123,
          }),
        },
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'black',
            }),
            offers: [],
            status: 'aborted',
            pgn: '',
            lastMoveAt: undefined,
            lastMoveBy: 'black',
            winner: undefined,
            startedAt: 123,
          }),
        },
      ],
      players: {
        black: {
          id: 'john',
          score: 1,
        },
        white: {
          id: 'maria',
          score: 0,
        },
      },
      winner: 'john',
      ongoingPlay: undefined,
    };

    const expected: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatch,
    };

    expect(actual).toEqual(expected);
  });

  test('aborting second game will complete the match and have a winner - abort with black', () => {
    const matchUpdateWhiteMove = matchReducer(idlingMatch, {
      type: 'play:move',
      payload: { from: 'e2', to: 'e4', moveAt: 123 },
    });
    const matchUpdateBlackMove = matchReducer(matchUpdateWhiteMove, {
      type: 'play:move',
      payload: { from: 'e7', to: 'e6', moveAt: 123 },
    });
    const matchUpdateResign = matchReducer(matchUpdateBlackMove, {
      type: 'play:resignGame',
      payload: {
        color: 'black',
      },
    });

    const newMatch = matchReducer(matchUpdateResign, {
      type: 'match:startNewGame',
    });

    const expectedNewMatchState: MatchState = {
      status: 'ongoing',
      type: 'bestOf',
      rounds: 3,
      completedPlays: [
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'w',
            }),
            offers: [],
            status: 'complete',
            pgn: '1. e4 e6',
            lastMoveAt: 123,
            lastMoveBy: 'black',
            winner: 'white',
            startedAt: 123,
          }),
        },
      ],
      players: {
        black: {
          id: 'john',
          score: 1,
        },
        white: {
          id: 'maria',
          score: 0,
        },
      },
      winner: undefined,
      ongoingPlay: wrapIntoPlay({
        ...createGame({
          timeClass: 'blitz',
          color: 'black',
        }),
      }),
    };
    const expectedNewMatch: MatchActivityState = {
      activityType: 'match',
      activityState: expectedNewMatchState,
    };

    expect(newMatch).toEqual(expectedNewMatch);

    const idleMatch = matchReducer(newMatch, {
      type: 'play:startWhitePlayerIdlingTimer',
      payload: { at: 123 },
    });

    const moveWhite = matchReducer(idleMatch, {
      type: 'play:move',
      payload: { from: 'e2', to: 'e4', moveAt: 123 },
    });

    const actual = matchReducer(moveWhite, {
      type: 'play:abortGame',
      payload: {
        color: 'black',
      },
    });

    const expectedMatch: MatchState = {
      status: 'complete',
      type: 'bestOf',
      rounds: 3,
      completedPlays: [
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'w',
            }),
            offers: [],
            status: 'complete',
            pgn: '1. e4 e6',
            lastMoveAt: 123,
            lastMoveBy: 'black',
            winner: 'white',
            startedAt: 123,
          }),
        },
        {
          ...wrapIntoPlay({
            ...createGame({
              timeClass: 'blitz',
              color: 'black',
            }),
            offers: [],
            status: 'aborted',
            pgn: '1. e4',
            lastMoveAt: 123,
            lastMoveBy: 'white',
            winner: undefined,
            startedAt: 123,
          }),
        },
      ],
      players: {
        black: {
          id: 'john',
          score: 1,
        },
        white: {
          id: 'maria',
          score: 0,
        },
      },
      winner: 'maria',
      ongoingPlay: undefined,
    };

    const expected: MatchActivityState = {
      activityType: 'match',
      activityState: expectedMatch,
    };

    expect(actual).toEqual(expected);
  });
});