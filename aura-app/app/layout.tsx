import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from './rootProvider';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

// Определяем базовый URL для генерации абсолютных ссылок
const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
  : `https://aura-pulse.vercel.app`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl), // КРИТИЧЕСКИЙ ФИКС ДЛЯ ПРЕВЬЮ
  title: 'Aura Pulse',
  description: 'Onchain Daily Resonance on Base',
  openGraph: {
    title: 'Aura Pulse',
    description: 'Establish your onchain frequency',
    images: [
      {
        url: '/api/og', // Теперь Next.js сам превратит это в https://.../api/og
        width: 1200,
        height: 630,
        alt: 'Aura Pulse Preview',
      },
    ],
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
        {/* Оставляем для верификации Base */}
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