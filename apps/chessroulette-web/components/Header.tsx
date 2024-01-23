import Link from 'next/link';
import { Logo } from './Logo';
import ConnectionStatus from './ConnectionStatus';
import { config } from '../config';

export default () => {
  return (
    <header className="pt-4 pb-4 flex justify-between">
      <Link href="/">
        <Logo />
      </Link>
      {config.DEV_MODE && <ConnectionStatus />}
    </header>
  );
};
