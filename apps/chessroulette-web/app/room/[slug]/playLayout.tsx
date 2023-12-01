import { Metadata } from 'next';
import { metadata as roomMetadata } from '../layout';

export const metadata: Metadata = {
  title: `${roomMetadata.title} | Play`,
};

export type Props = {
  main: React.ReactNode;
  leftSideComponent?: React.ReactNode;
  rightSideComponent?: React.ReactNode;
  containerClassName?: string;
};

export function PlayLayout({
  leftSideComponent,
  main,
  rightSideComponent,
  containerClassName,
}: Props) {
  return (
    <section className={`flex gap-6 ${containerClassName}`}>
      {leftSideComponent && (
        <aside
          id="left-side"
          className=""
          style={{
            flex: 2.5,
          }}
        >
          {leftSideComponent}
        </aside>
      )}
      <main id="main" className="grow">
        {main}
      </main>
      {rightSideComponent && (
        <aside id="right-side" className="grow">
          {rightSideComponent}
        </aside>
      )}
    </section>
    // <div className="bg-indigo-500 p-2 font-mono">{props.children}</div>
  );
}
