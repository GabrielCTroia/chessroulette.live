import { AuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

// import type { NextAuthConfig } from 'next-auth';
// import { appConfig } from '.';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { serverConfig } from '../config/config.server';

const prisma = new PrismaClient();

const emailConfig = {
  EMAIL_SERVER_HOST: serverConfig.auth.EMAIL_SERVER_HOST,
  EMAIL_SERVER_USER: serverConfig.auth.EMAIL_SERVER_HOST,
  EMAIL_SERVER_PASSWORD: serverConfig.auth.EMAIL_SERVER_PASSWORD,
  EMAIL_SERVER_PORT: serverConfig.auth.EMAIL_SERVER_PORT,
  EMAIL_FROM: serverConfig.auth.EMAIL_FROM,
};

export const authOptions: AuthOptions = {
  theme: {
    // logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
    // TODO: how to make this dark mode?
    logo: 'https://raw.githubusercontent.com/movesthatmatter/chessroulette-web/72553f4cdecb07e467d5b972a563192e5c8027ac/src/components/Logo/assets/Logo_light_full.svg',
  },
  secret: serverConfig.auth.JWT_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: emailConfig.EMAIL_SERVER_HOST,
        port: emailConfig.EMAIL_SERVER_PORT,
        auth: {
          user: emailConfig.EMAIL_SERVER_USER,
          pass: emailConfig.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
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
  ],
  callbacks: {
    // TODO: here we can get more info for the user from the database
    // session(...args) {
    //   return args;
    // }
  },
  debug: true,
} as AuthOptions;
