import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";
import { translateProducts } from "@/lib/translations";
import { getProductSlug } from "@/lib/productPaths";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    const rawProducts = await getProducts(false);
    const translated = translateProducts(rawProducts, locale);

    const products = translated
      .filter((p) => p.is_visible !== false)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category || "Spices",
        collection: p.collection || "",
        description: p.description || "",
        price_moq: p.price_moq || "",
        image_url: p.image_url || "/images/turmeric_mortar.png",
        slug: getProductSlug(p),
      }));

    if (!q) {
      return NextResponse.json({ products });
    }

    const filtered = products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const catMatch = p.category.toLowerCase().includes(q);
      const colMatch = (p.collection || "").toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      return nameMatch || catMatch || colMatch || descMatch;
    });

    return NextResponse.json({ products: filtered });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to search products", products: [] }, { status: 500 });
  }
}
