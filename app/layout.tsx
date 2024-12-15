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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  description: "UFC athletes' stats, performance analytics, and more!",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fightembedded.com",
    siteName: "Fight Embedded",
    images: [
      {
        url: "https://fightembedded.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fight Embedded - UFC Athletes' Stats and Performance Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@fightembedded",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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