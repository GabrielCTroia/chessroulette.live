import { useMemo } from 'react';
import { DispatchOf } from '@xmatter/util-kit';
import {
  // GameProvider,
  PlayersBySide,
  // PlayContainer,
  // GameNotationContainer,
  // GameActionsContainer,
} from '@app/modules/Match/Play';
import * as PlayStore from '@app/modules/Match/Play/store';
import { UserId, UsersMap } from '@app/modules/User';
import { IceServerRecord } from '@app/providers/PeerToPeerProvider';
import { ResizableDesktopLayout } from '@app/templates/ResizableDesktopLayout';

import { PlayContainer } from './PlayContainer';
import { GameNotationContainer } from './Play/containers';
import { MatchActions, MatchState } from './movex';
import { MatchProvider } from './providers';
import {
  MatchStateDialogContainer,
  MatchStateDisplayContainer,
} from './containers';

// This should not be here
import { RIGHT_SIDE_SIZE_PX } from '../Room/CONSTANTS';
import { CameraPanel } from '../Room/components/CameraPanel';
import { useRoomLinkId } from '../Room/hooks/useRoomLinkId';
import { PlayControlsContainer } from './Play/containers';

type Props = {
  roomId: string;
  userId: UserId;
  iceServers: IceServerRecord[];
  match: NonNullable<MatchState>;
  dispatch: DispatchOf<MatchActions>;
  participants: UsersMap;

  // TODO: deprecate once I have a better system for determingin player colors
  isBoardFlipped?: boolean;
};

export const MatchContainer = ({
  match,
  dispatch,
  userId,
  iceServers,
  roomId,
  participants,
  isBoardFlipped,
}: Props) => {
  const { gameInPlay: ongoingGame, ...matchState } = match;

  // const game = useMemo(
  //   () =>
  //     ongoingGame?.game ||
  //     matchState.endedPlays.slice(-1)[0].game ||
  //     // Default to Initial Play State if no ongoing or completed
  //     PlayStore.initialPlayState.game,
  //   [ongoingPlay, matchState.endedPlays]
  // );

  // const game = useMemo(
  //   () =>
  //     ongoingGame ||
  //     matchState.endedGames.slice(-1)[0] ||
  //     // Default to Initial Play State if no ongoing or completed
  //     PlayStore.initialPlayState,
  //   [ongoingGame, matchState.endedGames]
  // );

  const { joinRoomLink } = useRoomLinkId('match');

  const playersBySide = useMemo((): PlayersBySide => {
    const whiteDisplayName = participants[matchState.players.white.id]
      ? participants[matchState.players.white.id].displayName
      : undefined;
    const blackDisplayName = participants[matchState.players.black.id]
      ? participants[matchState.players.black.id].displayName
      : undefined;

    if (userId === matchState.players.black.id) {
      return {
        home: {
          ...matchState.players.black,
          color: 'black',
          ...(blackDisplayName && { displayName: blackDisplayName }),
        },
        away: {
          ...matchState.players.white,
          color: 'white',
          ...(whiteDisplayName && { displayName: whiteDisplayName }),
        },
      };
    }

    return {
      home: {
        ...matchState.players.white,
        color: 'white',
        ...(whiteDisplayName && { displayName: whiteDisplayName }),
      },
      away: {
        ...matchState.players.black,
        color: 'black',
        ...(blackDisplayName && { displayName: blackDisplayName }),
      },
    };
  }, [userId, matchState.players, participants]);

  // const challengerColor = useMemo(() => {
  //   matchState.players.white.id
  // }, [match.challenger.id]);

  return (
    <MatchProvider match={match} userId={userId}>
      <ResizableDesktopLayout
        rightSideSize={RIGHT_SIDE_SIZE_PX}
        mainComponent={({ boardSize }) => (
          <PlayContainer
            // Add this in order to reset the PlayContainer on each new game
            key={playersBySide.away.color}
            boardSizePx={boardSize}
            isBoardFlipped={isBoardFlipped}
            overlayComponent={
              <MatchStateDialogContainer
                dispatch={dispatch}
                playerId={userId}
                joinRoomLink={joinRoomLink}
                playersBySide={playersBySide}
              />
            }
            challengerColor={'w'} // TODO: Fix this!!
            // TODO: All of these can be provided from the GamePovider
            // game={game}
            userId={userId}
            dispatch={dispatch}
            players={matchState.players}
          />
        )}
        rightComponent={
          <div className="flex flex-col flex-1 min-h-0 gap-4">
            {participants && participants[userId] && (
              <div className="overflow-hidden rounded-lg shadow-2xl">
                {/* // This needs to show only when the user is a players //
                  otherwise it's too soon and won't connect to the Peers */}
                {/* // TODO: Provide this so I don't have to pass in the iceServers each time */}
                <CameraPanel
                  participants={participants}
                  userId={userId}
                  peerGroupId={roomId}
                  iceServers={iceServers}
                  aspectRatio={16 / 9}
                />
              </div>
            )}
            <MatchStateDisplayContainer
              playersBySide={playersBySide}
              dispatch={dispatch}
            />
            <div className="bg-slate-700 p-3 flex flex-col gap-2 flex-1 min-h-0 rounded-lg shadow-2xl overflow-y-scroll">
              <GameNotationContainer />
              <div className="flex gap-2 bor">
                <PlayControlsContainer
                  // TODO: All of these can be provided from the GamePovider
                  dispatch={dispatch}
                  homeColor={playersBySide.home.color}
                  playerId={userId}
                />
              </div>
            </div>
          </div>
        }
      />
    </MatchProvider>
  );
};
