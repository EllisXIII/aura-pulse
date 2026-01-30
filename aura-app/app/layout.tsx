import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from './rootProvider';

export const dynamic = 'force-dynamic';
const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
  : `https://aura-pulse.vercel.app`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Aura Pulse',
  description: 'Onchain Daily Resonance on Base',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32' },
      { url: '/icon.png', sizes: '192x192' },
      { url: '/icon.png', sizes: '512x512' },
    ],
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Aura Pulse',
    description: 'Establish your onchain frequency',
    url: baseUrl,
    siteName: 'Aura Pulse',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  // ВЕРИФИКАЦИЯ BASE MINI APP
  other: {
    "base:app_id": "6979312d9266edba958ff38f",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}