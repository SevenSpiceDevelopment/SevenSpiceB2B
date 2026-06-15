import { getProducts, getSiteSettings } from "@/lib/db";
import ProductCatalog from "@/components/ProductCatalog";
import { Suspense } from "react";

export const metadata = {
  title: "B2B Products Catalog - Direct Wholesale Spices & Herbs",
  description: "Browse our dynamic B2B catalog of premium spices, herbs, powders, and customized blends. Secure packaging specs, laboratory audits, and request instant commercial margin quotes."
};

// Revalidate this page every 60 seconds (Incremental Static Regeneration)
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts();
  const settings = await getSiteSettings();
  const businessPhone = settings?.business_phone || "+1 (800) 555-SPICE";
  const businessEmail = settings?.business_email || "sales@thesevenspice.com";

  return (
    <div className="flex-grow flex flex-col pt-stack-lg pb-stack-lg w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop gap-stack-lg">
      {/* Header Section */}
      <header className="text-center md:text-left max-w-3xl">
        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded">
          Product Catalog
        </span>
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mt-4 mb-stack-sm">
          Bulk Ingredients & Custom Formulations
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          We maintain rigorous grading practices for moisture levels, volatile oil profiles, and insect residue controls. Tap any product card below to request customized freight pricing, packing forms, and lab specification sheets.
        </p>
      </header>

      {/* Main interactive catalog with Suspense fallback */}
      <Suspense fallback={
        <div className="text-center py-20 text-on-surface-variant font-mono text-sm">
          Retrieving wholesale specifications...
        </div>
      }>
        <ProductCatalog 
          initialProducts={products} 
          businessPhone={businessPhone}
          businessEmail={businessEmail}
        />
      </Suspense>
    </div>
  );
}
