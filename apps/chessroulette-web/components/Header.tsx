import Link from 'next/link';
import { Logo } from './Logo';
import ConnectionStatus from './ConnectionStatus';
import { config } from '../config';
import { OnboardingWidget } from '../modules/Onboarding';
import { Session } from 'next-auth';

type Props = {
  themeName?: string;
  showOnboarding?: boolean;
  session?: Session;
};

export default (props: Props) => {
  return (
    <header className="pt-4 pb-4 flex justify-between">
      <Link href="/">
        <Logo themeName={props.themeName} />
      </Link>
      <div className="flex gap-4">
        {config.DEV_MODE && <ConnectionStatus />}
        {props.showOnboarding && <OnboardingWidget session={props.session} />}
      </div>
    </header>
  );
};
