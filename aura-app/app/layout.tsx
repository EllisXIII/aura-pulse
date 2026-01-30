import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from './rootProvider';

export const dynamic = 'force-dynamic';
const inter = Inter({ subsets: ['latin'] });

// Updated metadata object to include Base Mini App verification
export const metadata: Metadata = {
  title: 'Aura Pulse',
  description: 'Onchain Daily Resonance on Base',
  other: {
    // This is the correct way to add the verification meta tag in Next.js
    "base:app_id": "6979312d9266edba958ff38f",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* The <head> tag is now managed by Next.js through the metadata object */}
      <body className={inter.className}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}