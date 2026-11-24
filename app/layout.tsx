import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/components/context/ui-context";
import { ToastContainer } from "@/components/ui/toast";
import { BackButtonProvider } from "@/components/providers/back-button-provider";
import { ErrorNotificationWrapper } from "@/components/error-notifications-wrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";
const ogImagePath = "/opengraph/og-design-app.jpg";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Brand Design Studio | Professional AI Graphic Design",
    template: "%s | AI Brand Design Studio",
  },
  description: "Create on-brand AI-generated designs for your business in seconds. Professional graphic design, ads, banners, and social media posts powered by AI.",
  keywords: ["AI Graphic Design", "Brand Studio", "AI Image Generation", "Marketing Assets", "Business Ads", "Design App"],
  authors: [{ name: "AI Design Studio" }],
  creator: "AI Design Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "AI Brand Design Studio | Professional AI Graphic Design",
    description: "Create on-brand AI-generated designs for your business in seconds. Professional graphic design, ads, and banners powered by AI.",
    siteName: "AI Brand Design Studio",
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 1200,
        alt: "Yaung Sone AI - Professional design in 30 seconds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Brand Design Studio",
    description: "Professional graphic design and marketing assets powered by AI.",
    images: [ogImagePath],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased h-screen overflow-hidden flex flex-col bg-background text-foreground`}
      >
        <UIProvider>
          <BackButtonProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <ToastContainer />
            <ErrorNotificationWrapper />
          </BackButtonProvider>
        </UIProvider>
      </body>
    </html>
  );
}
