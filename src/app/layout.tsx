import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flam Tunes - AI-Driven Online Radio",
  description: "Listen to Flam Tunes, your AI-driven online radio station",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

