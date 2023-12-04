import { Metadata } from 'next';
import Header from './_components/Header';
import { games } from './_data';
import { Chessboard } from 'react-chessboard';
import { NoSSR } from 'apps/chessroulette-web/components/NoSSR';
import { BoardList } from 'apps/chessroulette-web/components/BoardList';

export const metadata: Metadata = {
  title: 'Only Chess Fans',
};

export default function Page() {
  return (
    <div className="gap-2 pl-[max(env(safe-area-inset-left),3.5rem)] pr-[max(env(safe-area-inset-right),3.5rem)]">
      <Header />
      <main className="mt-10 flex items-center justify-center">
        <BoardList games={games} itemBoardSizePx={400}/>
      </main>
    </div>
  );
  // return works with movex as well</MovexProvider>;
}
