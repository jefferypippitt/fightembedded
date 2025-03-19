import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";


const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fightembedded.com"),
  title: {
    template: "%s | Fight Embedded",
    default: "Fight Embedded",
  },
  description:
    "Your Ultimate Source for UFC Fighter Stats and Analytics. Explore detailed profiles, fight statistics, and rankings of all UFC athletes in one place",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fightembedded.com",
    siteName: "Fight Embedded",
    title: "Fight Embedded - UFC Fighter Stats & Analytics",
    description:
      "Your Ultimate Source for UFC Fighter Stats and Analytics. Explore detailed profiles, fight statistics, and rankings of all UFC athletes in one place",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fight Embedded - UFC Fighter Stats & Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fight Embedded - UFC Fighter Stats & Analytics",
    description: "Your Ultimate Source for UFC Fighter Stats and Analytics",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${manrope.className} font-sans antialiased`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#ffffff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000000"
        />
      </head>
      <body className="min-h-screen font-sans antialiased ">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
