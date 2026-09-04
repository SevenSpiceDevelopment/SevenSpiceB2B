import { cookies } from "next/headers";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DealHeadlineBanner from "@/components/DealHeadlineBanner";
import MarqueeTicker from "@/components/MarqueeTicker";
import ScrollAnimationProvider from "@/components/ScrollAnimationProvider";
import { getSiteSettings, getProducts } from "@/lib/db";
import { translateProducts } from "@/lib/translations";
import { getProductSlug } from "@/lib/productPaths";

export const metadata = {
  title: {
    default: "TheSevenSpice - Premium B2B Global Spice Logistics & Export",
    template: "%s | TheSevenSpice"
  },
  description: "Direct-from-source bulk spices, custom blending, and international wholesale solutions for gourmet retailers, food manufacturers, and distributors.",
  metadataBase: new URL("https://thesevenspice-b2b.vercel.app"),
  openGraph: {
    title: "TheSevenSpice - Premium B2B Global Spice Logistics & Export",
    description: "Direct-from-source bulk spices, custom blending, and international wholesale solutions.",
    url: "/",
    siteName: "TheSevenSpice",
    images: [
      {
        url: "/images/logo/seven-spices-og.png",
        width: 1200,
        height: 630,
        alt: "Seven Spices"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=5", sizes: "any" },
      { url: "/favicon.png?v=5", type: "image/png", sizes: "512x512" },
      { url: "/android-chrome-192x192.png?v=5", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png?v=5", type: "image/png", sizes: "512x512" }
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=5", sizes: "180x180", type: "image/png" }
    ],
    shortcut: ["/favicon.ico?v=5"]
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  }
};

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const direction = locale === "ur" ? "rtl" : "ltr";

  const [settings, rawProducts] = await Promise.all([
    getSiteSettings(),
    getProducts(false)
  ]);

  const translatedProducts = translateProducts(rawProducts, locale);
  const searchProducts = translatedProducts
    .filter((p) => p.is_visible !== false)
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category || "Spices",
      description: p.description || "",
      price_moq: p.price_moq || "",
      image_url: p.image_url || "/images/turmeric_mortar.png",
      slug: getProductSlug(p)
    }));

  return (
    <html lang={locale} dir={direction} className="light scroll-smooth">
      <body className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col selection:bg-primary/10 selection:text-primary">
        <ScrollAnimationProvider />
        <DealHeadlineBanner settings={settings} />
        <Navbar locale={locale} initialProducts={searchProducts} />
        <MarqueeTicker settings={settings} />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer locale={locale} settings={settings} />
        <WhatsAppButton
          whatsappNumber={settings?.whatsapp_number}
          whatsappMessage={settings?.whatsapp_message}
          locale={locale}
        />
      </body>
    </html>
  );
}
