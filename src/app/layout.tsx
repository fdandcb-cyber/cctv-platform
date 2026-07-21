import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ConnectZ — Buy CCTV Security Cameras, Compare & Build Your Setup",
    template: "%s | ConnectZ CCTV",
  },
  description:
    "ConnectZ is your one-stop shop for genuine CCTV security cameras and accessories. Browse Hikvision, Dahua, Ezviz, Imou products. Compare cameras, use our CCTV Builder, and learn from our guides.",
  keywords: [
    "CCTV", "security cameras", "Hikvision", "Dahua", "Ezviz", "IP camera",
    "DVR", "NVR", "security systems", "surveillance",
    "ConnectZ", "CCTV India", "bullet camera", "dome camera", "PTZ camera",
    "WiFi camera", "4G camera", "CCTV builder", "compare CCTV",
    "CCTV buying guide", "CCTV learning center",
  ],
  authors: [{ name: "ConnectZ Sales & Services", url: "https://cctv-platform-ten.vercel.app" }],
  creator: "ConnectZ Sales & Services",
  publisher: "ConnectZ Sales & Services",
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  openGraph: {
    title: "ConnectZ — Buy CCTV Security Cameras & Accessories",
    description: "Browse, compare & buy genuine CCTV security cameras. Use our Builder tool & Learning Center.",
    url: "https://cctv-platform-ten.vercel.app",
    siteName: "ConnectZ CCTV",
    type: "website",
    locale: "en_IN",
    countryName: "India",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConnectZ — CCTV Security Cameras & Accessories",
    description: "Genuine CCTV cameras, recorders & accessories. Hikvision, Dahua, Ezviz & more.",
  },
  robots: { index: true, follow: true },
  verification: { google: "your-google-verification-code" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "ConnectZ Sales & Services",
    description: "Genuine CCTV security cameras, recorders, and accessories for homes, businesses & industries",
    url: "https://cctv-platform-ten.vercel.app",
    telephone: "+917809465102",
    email: "connectzsalesandservices@gmail.com",
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    priceRange: "₹₹",
    image: "/logo.svg",
    sameAs: [],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://cctv-platform-ten.vercel.app/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased bg-background text-foreground"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

