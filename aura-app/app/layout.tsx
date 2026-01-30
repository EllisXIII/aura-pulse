import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from './rootProvider';

export const dynamic = 'force-dynamic';
const inter = Inter({ subsets: ['latin'] });

// We keep the standard metadata for title and description
export const metadata: Metadata = {
  title: 'Aura Pulse',
  description: 'Onchain Daily Resonance on Base',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Forcefully injecting the verification meta tag for the Base crawler */}
        <meta name="base:app_id" content="6979312d9266edba958ff38f" />
      </head>
      <body className={inter.className}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}