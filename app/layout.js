import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light scroll-smooth">
      <body className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col selection:bg-primary/10 selection:text-primary">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        {/* @ts-expect-error Async Server Component */}
        <Footer />
      </body>
    </html>
  );
}
