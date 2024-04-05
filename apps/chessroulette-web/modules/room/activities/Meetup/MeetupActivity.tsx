import movexConfig from 'apps/chessroulette-web/movex.config';
import { MovexBoundResourceFromConfig } from 'movex-react';
import { noop, pgnToFen, swapColor } from '@xmatter/util-kit';
import { IceServerRecord } from 'apps/chessroulette-web/providers/PeerToPeerProvider/type';
import { MeetupActivityState } from './movex';
import { UserId, UsersMap } from 'apps/chessroulette-web/modules/user/type';
import { DesktopRoomLayout } from '../../components/DesktopRoomLayout';
import { RIGHT_SIDE_SIZE_PX } from '../Learn/components/LearnBoard';
import { Playboard } from 'apps/chessroulette-web/components/Chessboard/Playboard';
import { CameraPanel } from '../../components/CameraPanel';
import { useMemo, useState } from 'react';
import { useMeetupActivitySettings } from './useMeetupActivitySettings';
import { PanelResizeHandle } from 'react-resizable-panels';
import { GameDisplayView } from './components/GameDisplayView';
import { GameNotation } from './components/GameNotation';
import { StartPositionIconButton } from 'apps/chessroulette-web/components/Chessboard';

export type Props = {
  roomId: string;
  userId: UserId;
  iceServers: IceServerRecord[];
  participants?: UsersMap;
  remoteState: MeetupActivityState['activityState'];
  dispatch?: MovexBoundResourceFromConfig<
    (typeof movexConfig)['resources'],
    'room'
  >['dispatch'];
};

export const MeetupActivity = ({
  remoteState,
  userId,
  participants,
  roomId,
  iceServers,
  dispatch: optionalDispatch,
}: Props) => {
  const activitySettings = useMeetupActivitySettings();
  const dispatch = optionalDispatch || noop;
  const { game } = remoteState;

  const [fen, setFen] = useState(pgnToFen(game.pgn));
  const orientation = useMemo(
    () =>
      activitySettings.isBoardFlipped
        ? swapColor(game.orientation)
        : game.orientation,
    [activitySettings.isBoardFlipped, game.orientation]
  );

  return (
    <DesktopRoomLayout
      rightSideSize={RIGHT_SIDE_SIZE_PX}
      mainComponent={({ boardSize }) => (
        <Playboard
          sizePx={boardSize}
          fen={fen}
          boardOrientation={orientation}
          playingColor={orientation}
          onMove={(payload) => {
            dispatch({
              type: 'meetup:move',
              payload,
            });

            // TODO: This can be returned from a more internal component
            return true;
          }}
          rightSideSizePx={RIGHT_SIDE_SIZE_PX}
          rightSideClassName="flex flex-col"
          rightSideComponent={
            <>
              <div className="flex-1">
                <StartPositionIconButton
                  className="mb-2"
                  onClick={() => {
                    dispatch({ type: 'meetup:startNewGame' });
                  }}
                />
              </div>

              <div className="relative flex flex-col items-center justify-center">
                <PanelResizeHandle
                  className="w-1 h-20 rounded-lg bg-slate-600"
                  title="Resize"
                />
              </div>
              <div className="flex-1" />
            </>
          }
        />
      )}
      rightComponent={
        <div className="flex flex-col flex-1 min-h-0 gap-4">
          {participants && participants[userId] && (
            <div className="overflow-hidden rounded-lg shadow-2xl">
              {/* // This needs to show only when the user is a participants //
                  otherwise it's too soon and won't connect to the Peers */}
              {/* // TODO: Is this still the case with the new movex subscribers updates? */}
              <CameraPanel
                participants={participants}
                userId={userId}
                peerGroupId={roomId}
                iceServers={iceServers}
                aspectRatio={16 / 9}
              />
            </div>
          )}
          <GameDisplayView game={game} />
          <div className="bg-slate-700 p-3 flex flex-col flex-1 min-h-0 rounded-lg shadow-2xl">
            <GameNotation pgn={game.pgn} onUpdateFen={setFen} />
          </div>
        </div>
      }
    />
  );
};
