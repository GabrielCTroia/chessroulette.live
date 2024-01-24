import Link from 'next/link';
import { Logo } from './Logo';
import ConnectionStatus from './ConnectionStatus';
import { config } from '../config';

type Props = {
  themeName?: string;
};

export default (props: Props) => {
  return (
    <header className="pt-4 pb-4 flex justify-between">
      <Link href="/">
        <Logo themeName={props.themeName} />
      </Link>
      {config.DEV_MODE && <ConnectionStatus />}
    </header>
  );
};
