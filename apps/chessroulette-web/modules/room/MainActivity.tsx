'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource } from 'movex-react';
import { ChessGame } from '../ChessGame/ChessGame';
import { NoSSR } from 'apps/chessroulette-web/components/NoSSR';
import { useSearchParams } from 'next/navigation';
import { ContainerWithDimensions } from 'apps/chessroulette-web/components/ContainerWithDimensions';

type Props = {
  rid: ResourceIdentifier<'room'>;
};

export default (props: Props) => {
  return (
    <>
      <MovexBoundResource
        movexDefinition={movexConfig}
        rid={props.rid}
        render={({ boundResource: { state, dispatch } }) => {
          return (
            <ContainerWithDimensions
              className="h-full w-full"
              render={(s) => (
                // <div
                //   className="h-full bg-blue-100 w-full flex justify-center content-center items-center"
                //   style={{
                //     height: s.height,
                //     width: s.width,
                //     background: 'green',
                //   }}
                // >

                <ChessGame sizePx={s.height} />
                // </div>
              )}
            />
          );
        }}
        // If there is a given slot just show the ChatBox
        // Otherwise allow the User to pick one

        //   if (slot) {
        //     return (
        //       <ChatBoxContainer
        //         userSlot={slot as UserSlot}
        //         state={state}
        //         dispatch={dispatch}‰
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
      />
    </>
  );
};
