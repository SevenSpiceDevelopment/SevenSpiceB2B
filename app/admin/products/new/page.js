import { getCollections } from "@/lib/db";
import ProductEditor from "@/components/admin/ProductEditor";

export const revalidate = 0;

export const metadata = {
  title: "Add New Product | Admin Dashboard",
  description: "Create a new wholesale product entry in the catalog.",
};

export default async function NewProductPage() {
  const collections = await getCollections(true);

  return <ProductEditor initialProduct={null} initialCollections={collections} />;
}
