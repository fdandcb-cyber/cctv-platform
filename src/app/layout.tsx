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
    default: "ConnectZ Sales & Services — Professional CCTV Security Solutions",
    template: "%s | ConnectZ CCTV",
  },
  description:
    "ConnectZ Sales & Services offers professional CCTV security camera systems for homes, businesses & industries. Browse Hikvision, Dahua, Ezviz products. Free site survey, expert installation, competitive pricing.",
  keywords: [
    "CCTV", "security cameras", "Hikvision", "Dahua", "Ezviz", "IP camera",
    "DVR", "NVR", "CCTV installation", "security systems", "surveillance",
    "ConnectZ", "CCTV India", "bullet camera", "dome camera", "PTZ camera",
    "WiFi camera", "4G camera", "CCTV builder", "security solutions",
  ],
  authors: [{ name: "ConnectZ Sales & Services", url: "https://cctv-platform-ten.vercel.app" }],
  creator: "ConnectZ Sales & Services",
  publisher: "ConnectZ Sales & Services",
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  openGraph: {
    title: "ConnectZ Sales & Services — Professional CCTV Security Solutions",
    description: "Browse, compare & buy CCTV security cameras. Expert installation across India.",
    url: "https://cctv-platform-ten.vercel.app",
    siteName: "ConnectZ CCTV",
    type: "website",
    locale: "en_IN",
    countryName: "India",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConnectZ Sales & Services — CCTV Security Solutions",
    description: "Professional CCTV cameras, installation & support. Hikvision, Dahua & more.",
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
    description: "Professional CCTV security camera systems for homes, businesses & industries",
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

