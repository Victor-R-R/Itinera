import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import SileoProvider from "@/components/SileoProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Itinera · Gestor de itinerarios",
  description: "Organiza el día a día de cada viaje: vuelos, hoteles, visitas, frases y ayuda.",
};

export const viewport: Viewport = {
  themeColor: "#e7dcd6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <SileoProvider />
      </body>
    </html>
  );
}
