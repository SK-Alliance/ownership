import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import '@rainbow-me/rainbowkit/styles.css';


// Primary fonts - using Google Fonts for reliability
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// For headings, we'll use system fonts with fallbacks
// Custom fonts can be added later when files are available

export const metadata: Metadata = {
  title: "Auctor - Proof of Provenance & Digital Ownership",
  description: "Modern Web3 infrastructure for trust, provenance, and real-world proof with institutional-grade design",
  keywords: ["Web3", "NFT", "Provenance", "Digital Ownership", "Blockchain", "Verification"],
  authors: [{ name: "Auctor Team" }],
  creator: "Auctor",
  publisher: "Auctor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${inter.variable} font-dm-sans antialiased bg-main text-main overflow-x-hidden`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

