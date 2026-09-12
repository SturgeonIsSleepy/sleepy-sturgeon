import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sleepy Sturgeon",
  description: "Tools, tests, and quiet build logs from the deep.",
  other: {
    google: "notranslate",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark notranslate" translate="no">
      <body className="antialiased">{children}</body>
    </html>
  );
}
