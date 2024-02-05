import NextAuth from 'next-auth';

import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import Credentials from 'next-auth/providers/credentials';

import type { NextAuthConfig } from 'next-auth';
import { appConfig } from './appConfig';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  theme: {
    // logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
    logo: 'https://raw.githubusercontent.com/movesthatmatter/chessroulette-web/72553f4cdecb07e467d5b972a563192e5c8027ac/src/components/Logo/assets/Logo_light_full.svg',
  },
  secret: appConfig.JWT_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    // Credentials({
    //   credentials: {
    //     username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials, req) {
    //     // Add logic here to look up the user from the credentials supplied
    //     const user = { id: '1', name: 'J Smith', email: 'jsmith@example.com' };

    //     if (user) {
    //       // Any object returned will be saved in `user` property of the JWT
    //       return user;
    //     } else {
    //       // If you return null then an error will be displayed advising the user to check their details.
    //       return null;

    //       // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
    //     }
    //   },
    // }),
    EmailProvider,
    {
      id: 'Lichess',
      name: 'Lichess',
      type: 'oauth',
      authorization: {
        url: 'https://lichess.org/oauth',
        params: { scope: 'board:play email:read preference:read' },
      },
      token: 'https://lichess.org/api/token',
      userinfo: 'https://lichess.org/api/account/email', // TODO: This might need to be custom
      clientId: 'chessroulette',
      profile: (user, tokens) => {
        // Get the remaining profile information
        return fetch('https://lichess.org/api/account', {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        })
          .then((r) => r.json())
          .then((profile) => ({
            ...profile,
            ...user,
          }));
      },
      // clientSecret: 'client_secret',
      checks: ['pkce', 'state'],
      client: {
        token_endpoint_auth_method: 'none',
      },
    },
    GitHub,
  ],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
