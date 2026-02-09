import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://encorp.rudrasankha.com"),
  title: {
    default: "Encorp - AI Presentation Generator",
    template: "%s | Encorp AI",
  },
  description: "Create stunning presentations powered by AI",
  keywords: ["AI Presentation", "Encorp", "Presentation Generator", "AI Tools"],
  openGraph: {
    title: "Encorp - AI Presentation Generator",
    description: "Create stunning presentations powered by AI",
    url: "https://encorp.rudrasankha.com",
    siteName: "Encorp AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Encorp - AI Presentation Generator",
    description: "Create stunning presentations powered by AI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};