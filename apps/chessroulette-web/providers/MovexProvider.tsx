'use client';

import { MovexProvider } from 'movex-react';
import movexConfig from '../movex.config';

export default (props: React.PropsWithChildren) => {
  return (
    <MovexProvider
      movexDefinition={movexConfig}
      endpointUrl={'localhost:3333'}
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
