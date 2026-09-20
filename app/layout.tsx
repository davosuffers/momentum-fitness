import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Momentum | Paid Ads for Niche Fitness Clubs",
  description: "AI-assisted, human-led Meta and Google advertising for boutique gyms, Pilates and yoga studios, and specialist fitness clubs. Request a strategy call.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
