import { getProducts, getCollections, getSiteSettings } from "@/lib/db";
import ProductCatalog from "@/components/ProductCatalog";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { t, translateProducts } from "@/lib/translations";

export const metadata = {
  title: "B2B Products Catalog - Direct Wholesale Spices & Herbs",
  description: "Browse our dynamic B2B catalog of premium spices, herbs, powders, and customized blends. Secure packaging specs, laboratory audits, and request instant commercial margin quotes."
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage() {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  const [rawProducts, rawCollections, settings] = await Promise.all([
    getProducts(),
    getCollections(),
    getSiteSettings()
  ]);
  const businessPhone = settings?.business_phone || "+1 (800) 555-SPICE";
  const businessEmail = settings?.business_email || "sales@thesevenspice.com";

  // Translate database products if Urdu is active
  const products = translateProducts(rawProducts, locale);
  const collections = rawCollections || [];

  return (
    <div className="flex-grow flex flex-col pt-stack-lg pb-stack-lg w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop gap-stack-lg animate-fadeIn">
      {/* Header Section */}
      <header className="text-center md:text-left max-w-3xl">
        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded">
          {t("products_span", locale)}
        </span>
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mt-4 mb-stack-sm">
          {t("products_title", locale)}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {t("products_desc", locale)}
        </p>
      </header>

      {/* Main interactive catalog with Suspense fallback */}
      <Suspense fallback={
        <div className="text-center py-20 text-on-surface-variant font-semibold text-sm">
          {t("catalog_retrieving", locale)}
        </div>
      }>
        <ProductCatalog 
          initialProducts={products} 
          initialCollections={collections}
          businessPhone={businessPhone}
          businessEmail={businessEmail}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
