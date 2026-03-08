import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Daily Ads — KI-generierte Ad Creatives fuer DACH",
  description:
    "Generiere hochkonvertierende Ad Creatives mit KI. 10 Marketing-Skills, Brand Voice Analyse, und taegliche Werbetexte fuer den DACH-Markt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-zinc-950 text-zinc-100 antialiased min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
