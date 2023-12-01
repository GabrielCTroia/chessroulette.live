import Link from 'next/link';
import { Logo } from './Logo';
import { MovexConnection } from 'movex-react';
import ConnectionStatus from './ConnectionStatus';

export default () => {
  return (
    <header className="pt-4 pb-4 flex justify-between">
      <Link href="/">
        <Logo />
      </Link>
      <ConnectionStatus />
    </header>
  );
};
