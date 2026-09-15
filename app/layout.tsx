import type { Metadata, Viewport } from "next";
import "./globals.css";
import { absoluteUrl, businessJsonLd, siteConfig } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Vaqueroil | Taller multimarca en Logroño",
    template: "%s | Vaqueroil",
  },
  description: siteConfig.description,
  keywords: [
    "taller Logroño",
    "taller multimarca La Rioja",
    "cambio de aceite Logroño",
    "frenos",
    "neumáticos",
    "diagnosis electrónica",
    "pre-ITV",
    "revisión coche",
    "Vaqueroil",
  ],
  authors: [{ name: "Vaqueroil" }],
  creator: "Vaqueroil",
  publisher: "Vaqueroil",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: "Vaqueroil | Taller multimarca en Logroño",
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl("/hero_background.jpg"),
        width: 1200,
        height: 630,
        alt: "Mecánico de Vaqueroil trabajando en el motor de un coche en Logroño",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaqueroil | Taller multimarca en Logroño",
    description: siteConfig.description,
    images: [absoluteUrl("/hero_background.jpg")],
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
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  category: "automotive",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased ">
      <body className="min-h-full flex flex-col bg-bg-dark">
        <JsonLd data={businessJsonLd()} />
        {children}
      </body>
    </html>
  );
}
