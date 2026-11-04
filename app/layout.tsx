import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Debbie · The Portfolio Depot", description: "A vibe coder's portfolio, packed in shipping containers." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap" />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
