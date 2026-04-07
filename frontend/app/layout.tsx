import type { Metadata } from 'next';
import '../styles/globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'VideoHub - Learn Better',
  description: 'A modern platform for organizing and learning from videos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
