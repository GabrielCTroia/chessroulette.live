import Header from '../components/Header';
import { Avatar } from '../components/Avatar';
import { RoomSideMenu } from '../modules/room/Learn/RoomSideMenu';
import { toImgPath } from '../lib/misc';
import bkg_2 from 'apps/chessroulette-web/templates/bkg_2.svg';
import { CSSProperties } from 'react';

type Props = React.PropsWithChildren & {
  contentClassname?: string;
  themeName?: string;
};

export default function RoomTemplate(props: Props) {
  const style: CSSProperties | undefined =
    props.themeName === 'kids'
      ? {
          backgroundImage: `url(${toImgPath(bkg_2)})`,
          backgroundSize: 'cover',
          position: 'relative',
          overflow: 'hidden',
        }
      : undefined;

  return (
    <div className="flex h-screen" style={style}>
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
