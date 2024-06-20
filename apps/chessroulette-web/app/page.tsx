import { Metadata } from 'next';
import Header from '../components/Header';
import { MainHomeSection } from '../modules/Home/MainHomeSection';
import { authOptions } from '../services/Auth';
import { getCustomServerSession } from '../services/Auth/lib';

export const metadata: Metadata = {
  title: 'Chessroulette',
  description: 'Moves That Matter Lessons That Last',
};

export default async function Home() {
  const session = await getCustomServerSession(authOptions);

  return (
    <div>
      <Header showOnboarding session={session} />
      <MainHomeSection session={session} />
    </div>
  );
  // return works with movex as well</MovexProvider>;
}
