import { notFound } from "next/navigation";
import { getProductById, getCollections } from "@/lib/db";
import ProductEditor from "@/components/admin/ProductEditor";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  if (!product) return { title: "Edit Product | Admin" };
  return {
    title: `Edit ${product.name} | Admin Dashboard`,
  };
}

export default async function EditProductPage({ params }) {
  const [product, collections] = await Promise.all([
    getProductById(params.id),
    getCollections(true),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductEditor initialProduct={product} initialCollections={collections} />;
}
