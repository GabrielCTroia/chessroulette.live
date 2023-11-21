import { Metadata } from 'next';
import { PlayLayout } from './playLayout';
import { ClientChessGame } from './ClientChessGame';
import { NoSSR } from 'apps/chessroulette-web/components/NoSSR';
import { PlayerBox } from 'apps/chessroulette-web/components/PlayerBox';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { CameraView } from 'apps/chessroulette-web/components/CameraView';

export const metadata: Metadata = {
  title: 'Chessroulette | Room',
};

export default function Page() {
  return (
    <PlayLayout
      leftSideComponent={
        <div className="flex space-between flex-col gap-6 h-full nbg-red-100">
          <div className="flex-1 flex items-end justify-end">
            <PlayerBox />
          </div>
          <div className="flex-1">
            <PlayerBox />
          </div>
        </div>
      }
      main={
        // <div className="bg-indigo-500 p-2 font-mono">
        // <NoSSR>
        <>
          <NoSSR>
            <ClientChessGame sizePx={900} />
          </NoSSR>
        </>
        // </div>
      }
      rightSideComponent={
        <div style={{
          width: '100%',
          height: '500px',
          background: 'red'
        }}>
          <CameraView />
        </div>
      }
    />
  );
}
