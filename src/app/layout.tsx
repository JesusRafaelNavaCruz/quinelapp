import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Cancha 26 | Mundial 2026",
  description: "Pronostica los partidos del Mundial 2026 y compite con tus amigos.",
  manifest: "/manifest.json",
  themeColor: "#052e16",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="bg-pitch-950 text-white font-body min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
