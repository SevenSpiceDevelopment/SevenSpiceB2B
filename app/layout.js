import { cookies } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSiteSettings } from "@/lib/db";

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
    icon: [{ url: "/favicon.png?v=2", type: "image/png", sizes: "512x512" }],
    apple: "/apple-touch-icon.png"
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const direction = locale === "ur" ? "rtl" : "ltr";
  const settings = await getSiteSettings();

  return (
    <html lang={locale} dir={direction} className="light scroll-smooth">
      <body className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col selection:bg-primary/10 selection:text-primary">
        <Navbar locale={locale} />
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
