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
  description: "Advanced AI Intelligence for Solana Memecoins. Scan Pump.fun tokens, detect rug pulls, and audit contract safety in real-time. Detectar estafas y gemas en Solana con IA.",
  keywords: [
    "Pump.fun Scanner", "Solana AI Auditor", "Rug Pull Checker",
    "Memecoin Analysis", "Crypto Trading Bot", "Solana Token Safety",
    "Escáner Solana", "Detectar Estafas Cripto", "Auditoría Memecoins",
    "Nexus Terminal", "Inteligencia Artificial Cripto", "Pump.fun Bot"
  ],
  openGraph: {
    title: "Nexus Terminal | Solana AI Intelligence",
    description: "Scan Pump.fun tokens & Detect Rugs in seconds. Level up your trading with AI. Escanea tokens y evita estafas.",
    url: "https://scanner.wolfsfera.com",
    siteName: "Nexus Terminal",
    images: [
      {
        url: "/images/nexus/logo-3d.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    languages: {
      'es-ES': 'https://scanner.wolfsfera.com/?lang=es',
    },
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import { CreditsProvider } from '@/context/CreditsContext';
import { SolanaWalletProvider } from '@/context/SolanaWalletContext';

import Link from "next/link";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FL5LCYTQF7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-FL5LCYTQF7');
          `}
        </Script>

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
