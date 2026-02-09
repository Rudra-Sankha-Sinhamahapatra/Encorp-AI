import Script from "next/script";
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { metadata } from '@/lib/metadata';
import { Analytics } from "@vercel/analytics/react"
import DarkVeil from "@/components/backgrounds/DarkVeil";

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Encorp AI",
              url: "https://encorp.rudrasankha.com",
            }),
          }}
        />
      </head>
       <body className={`${inter.className} relative`}>
             <div className="fixed inset-0 -z-10 pointer-events-none">
          <DarkVeil
            hueShift={20}
            noiseIntensity={0.05}
            scanlineIntensity={0.1}
            speed={0.6}
            scanlineFrequency={2.0}
            warpAmount={0.05}
            resolutionScale={1}
          />
        </div>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
        <Analytics mode="production"/>
      </body>
    </html>
  );
}