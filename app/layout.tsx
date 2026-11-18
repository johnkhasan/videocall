import type { Metadata, Viewport } from "next";
import "@livekit/components-styles";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import PWAInstaller from "@/components/pwa/PWAInstaller";

export const metadata: Metadata = {
  title: "FaceTime - Modern Video Calls",
  description: "Next-generation 1-on-1 and Group video calling with Apple FaceTime aesthetics.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FaceTime",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="bg-black text-white antialiased min-h-screen w-screen overflow-hidden">
        <LanguageProvider>
          {children}
          <PWAInstaller />
        </LanguageProvider>
      </body>
    </html>
  );
}
