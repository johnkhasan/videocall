import type { Metadata, Viewport } from "next";
import "@livekit/components-styles";
import "./globals.css";

export const metadata: Metadata = {
  title: "FaceTime - Modern Video Calls",
  description: "Next-generation 1-on-1 and Group video calling with Apple FaceTime aesthetics.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark">
      <body className="bg-black text-white antialiased min-h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
