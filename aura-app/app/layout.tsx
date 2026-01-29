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
  
  // 1. ФИКС ИКОНКИ: Это убирает логотип Vercel из превью
  icons: {
    icon: [
      { url: '/icon.png', size: '32x32' },
      { url: '/icon.png', size: '192x192' },
      { url: '/icon.png', size: '512x512' },
    ],
    apple: '/icon.png',
  },

  // 2. Оптимизация для соцсетей (Warpcast/Telegram)
  openGraph: {
    title: 'Aura Pulse',
    description: 'Establish your onchain frequency',
    url: baseUrl,
    siteName: 'Aura Pulse',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Aura Pulse Resonance Preview',
      },
    ],
  },
  
  // 3. Twitter/X Card (Base часто берет данные отсюда)
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Pulse',
    description: 'Onchain Daily Resonance',
    images: ['/api/og'],
  },

  other: {
    "base:app_id": "6979312d9266edba958ff38f",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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