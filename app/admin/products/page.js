import { getProducts, getCollections } from "@/lib/db";
import ProductManager from "@/components/admin/ProductManager";

export const revalidate = 0; // Disable cache for admin routes

export default async function AdminProductsPage() {
  const [products, collections] = await Promise.all([
    getProducts(true), // include hidden products
    getCollections(true), // include all collections
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline-md-mobile text-primary font-semibold">Products Wholesale Inventory</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Manage product catalog entries and collections. Group multiple products under collections in the same category, batch add products easily, upload images, and control public catalog visibility.
        </p>
      </div>

      <ProductManager initialProducts={products} initialCollections={collections} />
    </div>
  );
}
