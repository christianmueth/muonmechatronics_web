import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "SmartMove Studio",
  description: "AI-enabled video production workspace for transcript ingestion, planning, and export.",
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <Suspense fallback={null}>
          <NavBar />
        </Suspense>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
