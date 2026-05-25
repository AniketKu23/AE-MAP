import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "AE-MAP",
  description: "AutoEncoder Multi-omics Analytics Pipeline dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
