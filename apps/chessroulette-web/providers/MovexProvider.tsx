'use client';

import { MovexProvider } from 'movex-react';
import movexConfig from '../movex.config';
import { useUserId } from '../hooks/useUserId/useUserId';

export default (props: React.PropsWithChildren) => {
  const userId = useUserId();

  console.log('user id in movex proc', userId);
  if (!userId) {
    return null;
  }

  return (
    <MovexProvider
      movexDefinition={movexConfig}
      endpointUrl={'localhost:3333'}
      clientId={userId || undefined}
      // socketUrl={config.MOVEX_URL}
      onConnected={(instance) => {
        console.log('Movex Connected', instance.getClientId());

        // if (!counterRid) {
        //   instance
        //     .register('counter')
        //     .create(initialCounterState)
        //     .map((counterResource) => {
        //       window.location.href += `?rid=${toRidAsStr(counterResource.rid)}`;
        //     });
        // }
      }}
    >
      {props.children}
    </MovexProvider>
  );
};
