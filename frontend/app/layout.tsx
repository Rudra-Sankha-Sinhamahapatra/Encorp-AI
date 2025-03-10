import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { metadata } from '@/lib/metadata';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}