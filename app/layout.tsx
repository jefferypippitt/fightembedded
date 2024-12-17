import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
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
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Fight Embedded Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fight Embedded - UFC Fighter Stats & Analytics",
    description: "Your Ultimate Source for UFC Fighter Stats and Analytics",
    images: ["/icon.png"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
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
      <body
        className={cn(
          manrope.variable,
          "font-sans antialiased",
          "min-h-screen min-w-[320px]",
          "flex flex-col"
        )}
      >
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
