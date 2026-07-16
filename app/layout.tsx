import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muonmechatronics.com"),
  title: "Muon Mechatronics | AI Software Solutions",
  description:
    "Muon Mechatronics designs AI software systems for operations, industrial workflows, and high-leverage automation.",
  applicationName: "Muon Mechatronics",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  keywords: [
    "Muon Mechatronics",
    "AI software solutions",
    "industrial AI",
    "automation systems",
    "machine intelligence",
  ],
  openGraph: {
    title: "Muon Mechatronics",
    description:
      "AI software solutions for industrial workflows, operations intelligence, and deployable automation.",
    url: "https://muonmechatronics.com",
    siteName: "Muon Mechatronics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muon Mechatronics",
    description:
      "AI software solutions for industrial workflows, operations intelligence, and deployable automation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}