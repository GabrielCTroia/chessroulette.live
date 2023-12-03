import { Metadata } from 'next';
import Template from './LearnTemplate';
import { NoSSR } from 'apps/chessroulette-web/components/NoSSR';
import { PlayerBox } from 'apps/chessroulette-web/components/PlayerBox';
import { ChessGame } from 'apps/chessroulette-web/modules/ChessGame/ChessGame';
import { MovexBoundResource } from 'movex-react';
import movexConfig from 'apps/chessroulette-web/movex.config';
import MainActivity from 'apps/chessroulette-web/modules/room/PlayActivity';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ResourceIdentifier,
  isResourceIdentifierOfType,
  toResourceIdentifierObj,
} from 'movex-core-util';
import RoomParticipants from 'apps/chessroulette-web/modules/room/RoomParticipants';
import LearnActivity from 'apps/chessroulette-web/modules/room/LearnActivity';

export const metadata: Metadata = {
  title: 'Chessroulette | Room',
};

export default function Page({ params }: { params: { slug: string } }) {
  // console.log('params', decodeURIComponent(params.slug));
  // const { rid, slot } = searchParams;

  // If the given "rid" query param isn't an actual rid of type "chat"
  // if (!isRidOfType('chat', rid)) {
  //   return <div>Error - Rid not valid</div>;
  // }

  // console.log('searchParams', searchParams);

  const slug = decodeURIComponent(params.slug);

  if (!isResourceIdentifierOfType('room', slug)) {
    return null;
  }

  const rid: ResourceIdentifier<'room'> = `room:${
    toResourceIdentifierObj(slug).resourceId
  }`;

  return (
    // <MovexBoundResource
    //   movexDefinition={movexConfig}
    //   rid={'room:23'}
    //   render={({ boundResource: { state, dispatch } }) => {
    //     return (

    //     );
    //   }}
    // If there is a given slot just show the ChatBox
    // Otherwise allow the User to pick one

    //   if (slot) {
    //     return (
    //       <ChatBoxContainer
    //         userSlot={slot as UserSlot}
    //         state={state}
    //         dispatch={dispatch}
    //       />
    //     );
    //   }

    //   // Filter out the taken User Slots
    //   const availableUserSlots = objectKeys(state.userSlots).reduce(
    //     (accum, nextSlot) =>
    //       state.userSlots[nextSlot] ? [...accum, nextSlot] : accum,
    //     [] as UserSlot[]
    //   );

    //   return (
    //     <ChatOnboarding
    //       slots={availableUserSlots}
    //       onSubmit={(slot) => {
    //         // Redirect to the same page with the selected  userSlot
    //         router.push({
    //           pathname: router.asPath,
    //           query: { slot },
    //         });
    //       }}
    //     />
    //   );
    // }}
    // />
    <Template
      rightSideComponent={
        <div className="flex space-between flex-col gap-6 h-full">
          <div className="flex-1 flex">
            <PlayerBox />
          </div>
        </div>
      }
      // mainContainerClass="flex items-center"
      mainComponent={
        <NoSSR>
          <LearnActivity rid={rid} playingColor='black' fen='rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w KQkq - 0 1'/>
        </NoSSR>
      }
      // rightSideComponent={<RoomParticipants rid={rid} />}
    />
  );
}
