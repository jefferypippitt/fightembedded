import "./globals.css";
import type { Metadata, Viewport } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});


const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fightembedded.com"),
  manifest: "/manifest.json",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", fontSans.variable, fontMono.variable, "font-mono")}
    >
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
