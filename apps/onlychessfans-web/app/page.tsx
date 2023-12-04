import { Metadata } from 'next';
import Header from './_components/Header';
import { games } from './_data';
import { Submit } from './_components/Submit';
import { Feed } from '../components/Feed';

import prisma from '../lib/prisma';
import { DisplayablePost } from '../lib/types';

export const metadata: Metadata = {
  title: 'Only Chess Fans',
};

async function getData() {
  const posts = await prisma.post.findMany({
    // where: { published: true },
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
    },
  });

  // console.log('posts again', posts[0]._count.);

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

export default async function Page() {
  const data = await getData();

  return (
    <div className="gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
      <Header />
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
          <Feed posts={data.props.posts} />
        </div>
      </main>
    </div>
  );
  // return works with movex as well</MovexProvider>;
}
