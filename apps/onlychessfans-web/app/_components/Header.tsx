import Link from 'next/link';

export default () => {
  return (
    <header className="pt-4 pb-4 text-center">
      <Link href="/">
        <h1 className="font-bold text-4xl text-blue-400">
          Only<span className="text-white">Chess</span>
          <span className="text-blue-400">Fans</span>
        </h1>
      </Link>
    </header>
  );
};
