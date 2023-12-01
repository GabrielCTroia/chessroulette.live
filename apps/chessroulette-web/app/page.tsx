import { Metadata } from 'next';
import MovexProvider from '../providers/MovexProvider';
import { Button } from '../components/Button';
import HomePage from '../modules/Home/HomeSection';
import Header from '../components/Header';
import MainHomeSection from '../modules/Home/HomeSection';

export const metadata: Metadata = {
  title: 'Chessroulette',
};

export default function Page() {
  return (
    <div className="gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
      <Header />
      <MainHomeSection />
    </div>
  );
  // return works with movex as well</MovexProvider>;
}
