import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({
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
      { url: "/icon1.png", type: "image/png" },
      { url: "/icon0.svg", type: "image/svg+xml" },
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
  },
  twitter: {
    card: "summary",
    title: "Fight Embedded - UFC Fighter Stats & Analytics",
    description: "Your Ultimate Source for UFC Fighter Stats and Analytics",
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

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon.png"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/icon0.svg"
        />
        <link
          rel="icon"
          type="image/png"
          href="/icon1.png"
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
          <NuqsAdapter>
            {children}
            <Toaster position="bottom-right" />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
