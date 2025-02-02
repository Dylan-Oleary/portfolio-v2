import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ChatProvider } from '~/context';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'dylanolearydev',
  description: 'dylanolearydev portfolio v2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionId = crypto.randomUUID();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="flex flex-col flex-grow font-[family-name:var(--font-geist-sans)] items-center justify-between min-h-screen relative w-full">
          <h1 className="p-2 text-lg font-bold w-full">dylanoleary.dev</h1>
          <ChatProvider sessionId={sessionId}>{children}</ChatProvider>
        </main>
      </body>
    </html>
  );
}
