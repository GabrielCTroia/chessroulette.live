import { Metadata } from 'next';
import Header from './_components/Header';
import { games } from './_data';
import { Submit } from './_components/Submit';
import { Feed } from '../components/Feed';

import prisma from '../lib/prisma';
import { DisplayablePost } from '../lib/types';
import { getAuthenticatedUser } from '../lib/user';
import { User } from '@prisma/client';
import { useOptimistic } from 'react';
import { getPosts, likePost, dislikePost } from './actions';

export const metadata: Metadata = {
  title: 'Only Chess Fans',
};

export default async function Page() {
  const authenticatedUser = await getAuthenticatedUser();
  const {
    props: { posts },
  } = await getPosts();

  // const [optimisticMessages, addOptimisticMessage] = useOptimistic<DisplayablePost[]>(
  //   data.props.posts,
  //   (state: DisplayablePost[], newMessage: string) => [
  //     ...state,
  //     { message: newMessage },
  //   ]
  // )

  return (
    <div className="gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
      <main className="mt-6 flex items-center justify-center">
        <div className="min-w-[25%]">
          <Submit
          // onSubmit={(input) => {
          //   console.log('pgn', input);
          // }}
          />
          {/* {data.props.posts.map((p) => {
            return <div>{m.author.firstName}</div>;
          })} */}
          {/* {authenticatedUser.props.user?.username} */}
          <Feed
            posts={posts}
            seenByUsername={authenticatedUser.props.user?.username}
            onPostLiked={async ({ id }) => {
              'use server';

              if (authenticatedUser.props.user) {
                likePost({
                  user: authenticatedUser.props.user,
                  postId: id,
                });
              }
            }}
            onPostDisliked={async ({ id }) => {
              'use server';

              if (authenticatedUser.props.user) {
                dislikePost({
                  user: authenticatedUser.props.user,
                  postId: id,
                });
              }
            }}
          />
        </div>
      </main>
    </div>
  );
  // return works with movex as well</MovexProvider>;
}
