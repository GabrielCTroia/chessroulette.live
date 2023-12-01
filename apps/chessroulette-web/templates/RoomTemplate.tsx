import Header from '../components/Header';
import { Avatar } from '../components/Avatar';
import { AspectRatio } from '../components/AspectRatio';

type Props = React.PropsWithChildren;

export default function RoomTemplate(props: Props) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)] pb-10">
        <Header />

        {/* TODO: This needs to be dynamic per page based on the width but also height!!! */}
        {/* <div className="w-full h-full flex flex-1"> */}
        <AspectRatio aspectRatio={16 / 8.5}>{props.children}</AspectRatio>
        {/* <div className='pb-10' /> */}
        {/* {props.children} */}
        {/* </div> */}
      </div>
      <menu className="bg-slate-700 flex-0 p-2">
        <Avatar />
      </menu>
    </div>
  );
  // return works with movex as well</MovexProvider>;
}
