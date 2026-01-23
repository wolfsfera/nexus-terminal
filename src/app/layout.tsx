import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus Terminal | Pump.fun Scanner & Solana AI Auditor",
  description: "The #1 AI Intelligence Tool for Solana. Scan Pump.fun tokens, detect rug pulls in real-time, and audit contracts instantly. Detecta estafas meme y gemas en Solana con nuestra IA avanzada.",
  keywords: [
    "Pump.fun Scanner", "Solana AI Auditor", "Rug Pull Checker",
    "Memecoin Analysis", "Crypto Trading Bot", "Solana Token Safety",
    "Escáner Solana", "Detectar Estafas Cripto", "Auditoría Memecoins",
    "Nexus Terminal", "Inteligencia Artificial Cripto", "Pump.fun Bot",
    "Solana Contract Sniffer", "Anti-Rug Tool", "Meme Coin Hunter",
    "Herramienta Trading Solana", "Análisis de Contratos Blockchain"
  ],
  openGraph: {
    title: "Nexus Terminal | Solana AI Intelligence",
    description: "Scan Pump.fun tokens & Detect Rugs in seconds. Level up your trading with AI. Escanea tokens y evita estafas.",
    url: "https://scanner.wolfsfera.com",
    siteName: "Nexus Terminal",
    images: [
      {
        url: "/images/nexus/logo-retro.png", // Updated to new Retro Identity
        width: 1200,
        height: 630,
        alt: "Nexus Terminal - Advanced Solana Scanner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: 'https://scanner.wolfsfera.com',
    languages: {
      'es-ES': 'https://scanner.wolfsfera.com/?lang=es',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import { CreditsProvider } from '@/context/CreditsContext';
import { SolanaWalletProvider } from '@/context/SolanaWalletContext';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';


import Link from "next/link";
import Script from "next/script";

import { Suspense } from "react";
// ... (existing imports)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-purple-500/30`}
      >

        {/* EXTRACTED GA4 COMPONENT */}
        <Suspense fallback={null}>
          <GoogleAnalytics GA_MEASUREMENT_ID="G-FL5LCYTQF7" />
        </Suspense>

        {/* SEO SCHEMA.ORG */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Nexus Terminal",
              "softwareVersion": "1.0",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Advanced AI Intelligence for Solana Memecoins. Scan Pump.fun tokens, detect rug pulls, and audit contract safety.",
              "publisher": {
                "@type": "Organization",
                "name": "Wolfsfera Ecosystem",
                "logo": "https://scanner.wolfsfera.com/images/nexus/logo-retro.png"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1500"
              }
            })
          }}
        />

        <SolanaWalletProvider>
          <CreditsProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </CreditsProvider>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
