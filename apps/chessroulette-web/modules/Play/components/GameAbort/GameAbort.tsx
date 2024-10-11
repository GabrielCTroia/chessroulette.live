import { GameAbortView, GameAbortViewProps } from './GameAbortView';
import { IdlingGame, PlayActions } from '../../store';
import { DispatchOf, LongChessColor } from '@xmatter/util-kit';
import { MatchState } from '../../../room/activities/Match/movex';
import { useMemo, useState } from 'react';
import { now } from 'apps/chessroulette-web/lib/time';

type Props = Pick<GameAbortViewProps, 'className'> & {
  // // Not sure if here what we need is the match players
  players: MatchState['players'];
  dispatch: DispatchOf<PlayActions>;
  timeToAbortMs: number;
  game: IdlingGame;
  turn: LongChessColor;
  completedPlaysCount: number;
  playerId?: string;
};

export const GameAbort = ({
  players,
  dispatch,
  timeToAbortMs,
  game,
  completedPlaysCount,
  playerId,
  turn,
  ...gameAbortViewProps
}: Props) => {
  const isMyTurn = useMemo(() => {
    if (!players) {
      return false;
    }

    return (
      (players.black.id === playerId && turn === 'black') ||
      (players.white.id === playerId && turn === 'white')
    );
  }, [turn, players]);

  const firstRound = useMemo(
    () => completedPlaysCount < 1,
    [completedPlaysCount]
  );

  const calculateTimeLeft = () => {
    // If it's white's turn there is no lastMoveAt so it needs to use game.startedAt
    const lastGameActionAt = game.lastMoveAt || game.startedAt;

    return timeToAbortMs - (now() - lastGameActionAt);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  return (
    <GameAbortView
      {...gameAbortViewProps}
      onRefreshTimeLeft={() => {
        setTimeLeft(calculateTimeLeft());
      }}
      onAbort={() => {
        dispatch({
          type: 'play:abortGame',
          payload: {
            color: turn,
          },
        });
      }}
      confirmContent={
        <div className="flex flex-row justify-center">
          <div>
            {firstRound
              ? 'If you abort, this match will be canceled and invalid!'
              : 'Be careful. If you Abort, you will lose the whole match!'}
          </div>
        </div>
      }
      canAbortOnDemand={isMyTurn}
      timeLeft={timeLeft}
    />
  );
};