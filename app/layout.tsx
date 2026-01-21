import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./context/WalletContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Dictionary - Decentralized Lexicographic Analysis",
  description: "An expert lexicographer powered by GenLayer's decentralized AI consensus for comprehensive word and phrase analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme='dark'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-mona-sans bg-bg-dark text-text-main`}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
