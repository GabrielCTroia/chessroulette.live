import Header from '../components/Header';
import { Avatar } from '../components/Avatar';

type Props = React.PropsWithChildren & {
  contentClassname?: string;
};

export default function RoomTemplate(props: Props) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)] pb-10">
        <Header />

        <div className={`w-full h-full ${props.contentClassname}`}>
          {props.children}
        </div>
      </div>
      <menu className="bg-slate-700 flex-0 p-2">
        <Avatar />
      </menu>
    </div>
  );
}
