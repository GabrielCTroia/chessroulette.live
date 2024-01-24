import Header from '../components/Header';
import { Avatar } from '../components/Avatar';
import { ClipboardCopyButton } from '../components/ClipboardCopyButton';
import { RoomSideMenu } from '../modules/room/Learn/RoomSideMenu';

type Props = React.PropsWithChildren & {
  contentClassname?: string;
  themeName?: string;
};

export default function RoomTemplate(props: Props) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)] pb-10">
        <Header themeName={props.themeName} />

        <div className={`w-full h-full ${props.contentClassname}`}>
          {props.children}
        </div>
      </div>
      <menu className="bg-slate-700 flex-0 flex flex-col p-2">
        <Avatar />
        <div className="pb-6 border-b border-slate-500 mb-4" />
        <RoomSideMenu />
      </menu>
    </div>
  );
}
