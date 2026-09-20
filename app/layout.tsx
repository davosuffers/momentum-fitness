import type { Metadata, Viewport } from "next";
import { siteDescription, siteName, siteTagline, siteUrl, structuredData } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | ${siteTagline}`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "fitness marketing agency",
    "paid ads for gyms",
    "gym advertising agency",
    "Meta ads for fitness studios",
    "Google Ads for gyms",
    "boutique gym marketing",
    "Pilates studio marketing",
    "yoga studio advertising",
    "boxing gym marketing",
    "fitness lead generation",
  ],
  category: "Marketing",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} | ${siteTagline}`,
    description: siteDescription,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Momentum — we run the ads, you run the club.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | ${siteTagline}`,
    description: siteDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#080e14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
