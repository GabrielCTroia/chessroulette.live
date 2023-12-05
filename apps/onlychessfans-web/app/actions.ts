'use server';

import { revalidateTag } from 'next/cache';
import prisma from '../lib/prisma';
import { Post, User } from '@prisma/client';
import { DisplayablePost } from '../lib/types';

export async function getPosts(props?: {
  queriedByUsername?: User['username'];
  filterBy?: {
    username: User['username'];
  };
}) {
  const posts = await prisma.post.findMany({
    // where: { published: true },
    ...(props?.filterBy?.username && {
      where: { authorUsername: props.filterBy.username },
    }),
    include: {
      author: {
        select: { firstName: true, lastName: true, username: true },
      },
      likedBy: {
        select: { username: true },
      },
      _count: {
        select: { likedBy: true },
      },
      // TODO: Add ability to create a boolean value on wether the queriedByUsername liked it
    },
  });

  return {
    props: {
      posts: posts.map((p) => ({
        ...p,
        likedBy: p.likedBy,
        likes: p._count.likedBy,
      })) as DisplayablePost[],
    },
    revalidate: 10,
  };

  // return feed;

  // const res = await fetch('https://api.example.com/...');
  // // The return value is *not* serialized
  // // You can return Date, Map, Set, etc.

  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error('Failed to fetch data');
  // }

  // return res.json();
}

// export default async function submit() {
//   await getPos()
//   revalidateTag('posts')
// }

export async function likePost(props: { user: User; postId: Post['id'] }) {
  'use server';

  return await prisma.post.update({
    where: {
      id: props.postId,
    },
    include: {
      likedBy: {
        select: { username: true },
      },
    },
    data: {
      likedBy: {
        connect: [props.user],
      },
      // likedBy: authenticatedUser.props.user.username,
    },
  });

  // mutate data
  // revalidate cache
}

export async function dislikePost(props: { user: User; postId: Post['id'] }) {
  'use server';

  return await prisma.post.update({
    where: {
      id: props.postId,
    },
    include: {
      likedBy: {
        select: { username: true },
      },
    },
    data: {
      likedBy: {
        disconnect: [props.user],
      },
      // likedBy: authenticatedUser.props.user.username,
    },
  });

  // mutate data
  // revalidate cache
}
