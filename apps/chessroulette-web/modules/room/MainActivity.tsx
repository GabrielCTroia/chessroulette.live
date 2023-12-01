'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource } from 'movex-react';
import { ChessGame } from '../ChessGame/ChessGame';
import { NoSSR } from 'apps/chessroulette-web/components/NoSSR';
import { useSearchParams } from 'next/navigation';

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
            <div>
              <ChessGame sizePx={900} />
            </div>
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
