import Link from 'next/link';
import { MovexConnection } from 'movex-react';


// cockroach user:pass: gabriel:Wm1T_qvsIONiPSFFbmev-w
// postgresql://gabriel:Wm1T_qvsIONiPSFFbmev-w@pithy-grivet-6459.g8z.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full

export default () => {
  return (
    <header className="pt-4 pb-4 text-center">
      <Link href="/">
        <h1 className="font-bold text-4xl text-blue-400">
          Only<span className='text-white'>Chess</span><span className='text-blue-400'>Fans</span>
        </h1>
      </Link>
    </header>
  );
};
