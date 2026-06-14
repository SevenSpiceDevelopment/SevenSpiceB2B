import { getProducts } from "@/lib/db";
import ProductManager from "@/components/admin/ProductManager";

export const revalidate = 0; // Disable cache for admin routes

export default async function AdminProductsPage() {
  const products = await getProducts(true); // include hidden products

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline-md-mobile text-primary font-semibold">Products Wholesale Inventory</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Manage product catalog entries. You can add new spices, modify specification parameters, upload visual thumbnails, and control their public catalog visibility.
        </p>
      </div>

      <ProductManager initialProducts={products} />
    </div>
  );
}
