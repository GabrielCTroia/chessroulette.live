import { Metadata } from 'next';
import '../../styles.css';
import { Logo } from 'apps/chessroulette-web/components/Logo';

export const metadata: Metadata = {
  title: 'Room',
  description: 'Welcome to Chessroulette',
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="room-layout"
      className="gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]"
    >
      <header className="pt-4 pb-4">
        <Logo />
      </header>
      {children}
    </div>
  );
}
