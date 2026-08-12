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
  title: "Christian Mueth's Blog",
  description:
    "Personal essays and working notes by Christian Mueth on technology, learning, and creativity.",
  applicationName: "Christian Mueth's Blog",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  keywords: ["Christian Mueth", "blog", "technology", "learning", "creativity"],
  openGraph: {
    title: "Christian Mueth's Blog",
    description:
      "Personal essays and working notes by Christian Mueth.",
    siteName: "Christian Mueth's Blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Mueth's Blog",
    description:
      "Personal essays and working notes by Christian Mueth.",
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