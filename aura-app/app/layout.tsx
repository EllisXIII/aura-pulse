import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from './rootProvider';

// КРИТИЧЕСКИЙ ФИКС: Принудительный динамический рендеринг.
// Это предотвращает ошибку MiniKit при сборке статичных страниц (например, 404).
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aura Pulse',
  description: 'Onchain Daily Resonance on Base',
  openGraph: {
    images: ['/api/og'], // По умолчанию
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}