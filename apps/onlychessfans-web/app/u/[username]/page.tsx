import { Metadata } from 'next';
// import Header from './_components/Header';
// import { games } from './_data';
// import { Submit } from './_components/Submit';
// import { Feed } from '../components/Feed';

// import prisma from '../lib/prisma';
// import { DisplayablePost } from '../lib/types';
import Header from '../../_components/Header';
import prisma from 'apps/onlychessfans-web/lib/prisma';
import { DisplayablePost } from 'apps/onlychessfans-web/lib/types';
import { Feed } from 'apps/onlychessfans-web/components/Feed';

export const metadata: Metadata = {
  title: 'Only Chess Fans',
};

async function getData(username: string) {
  const posts = await prisma.post.findMany({
    where: { authorUsername: username },
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

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const data = await getData(username);

  return (
    <div className="gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
      <Header />
      <main className="mt-6 flex items-center justify-center">
        <div className="min-w-[25%]">
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
