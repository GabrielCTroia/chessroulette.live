'use client';

import { MovexConnection } from 'movex-react';

export default () => {
  return (
    <MovexConnection
      render={({ connected, clientId }) => (
        <div>
          <div>{connected ? 'Connected' : 'Not Connected'}</div>
          <div>Client Id: {clientId}</div>
        </div>
      )}
    />
  );
};
