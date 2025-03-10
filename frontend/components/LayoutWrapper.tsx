'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPresentationPage = pathname?.startsWith('/presentation/');
  const isDashboard = pathname === '/dashboard';

  return (
    <div className="flex flex-col min-h-screen">
      {!isPresentationPage && <Header />}
      <main className={`flex-grow ${isDashboard ? 'flex flex-col overflow-hidden' : 'flex flex-col'}`}>
        {children}
      </main>
      {!isPresentationPage && <Footer className={isDashboard ? "fixed bottom-0 w-full z-10" : ""} />}
    </div>
  );
}