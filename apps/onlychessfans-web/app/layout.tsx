import { SessionProvider } from 'next-auth/react';
import Header from './_components/Header';
import './global.css';
import { StyledJsxRegistry } from './registry';
import prisma from '../lib/prisma';
import { LOGGEDIN_USER } from '../config';
import { getAuthenticatedUser } from '../lib/user';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticatedUser = await getAuthenticatedUser();

  return (
    <html>
      <body>
        {/* <SessionProvider session={pageProps.session}> */}
        <div
          className="fixed w-full z-50"
          style={{
            background: '#161a2b',
            borderBottom: '1px solid #21263b'
          }}
        >
          <Header className="" />
        </div>
        <div className="p-20">
          <StyledJsxRegistry>{children}</StyledJsxRegistry>
        </div>
      </body>
    </html>
  );
}
