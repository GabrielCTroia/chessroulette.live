import { Metadata } from 'next';
import Header from './_components/Header';
import { games } from './_data';
import { Submit } from './_components/Submit';
import { BoardList } from '../components/BoardList';

export const metadata: Metadata = {
  title: 'Only Chess Fans',
};

export default function Page() {
  return (
    <div className="gap-2 pl-[max(env(safe-area-inset-left),3.5rem)] pr-[max(env(safe-area-inset-right),3.5rem)]">
      <Header />
      <main className="mt-10 flex items-center justify-center">
        <div>
          <Submit
            // onSubmit={(input) => {
            //   console.log('pgn', input);
            // }}
          />
          <BoardList games={games} itemBoardSizePx={400} />
        </div>
      </main>
    </div>
  );
  // return works with movex as well</MovexProvider>;
}
