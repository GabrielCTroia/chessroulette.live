import { Metadata } from 'next';
import RoomTemplate from 'apps/chessroulette-web/templates/RoomTemplate';

export const metadata: Metadata = {
  title: 'Class Room',
  description: 'Welcome to Chessroulette',
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoomTemplate>{children}</RoomTemplate>;
}
