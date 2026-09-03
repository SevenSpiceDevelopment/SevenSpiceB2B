import { getBlogPosts, getProducts } from "@/lib/db";
import { getProductSlug } from "@/lib/productPaths";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = "https://thesevenspice-b2b.vercel.app";

  // Public static pages
  const routes = [
    "",
    "/products",
    "/about",
    "/contact",
    "/blog"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8
  }));

  // Fetch dynamic blog posts and products with quick safety
  try {
    const [posts, products] = await Promise.all([
      getBlogPosts(),
      getProducts(false)
    ]);

    const blogRoutes = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published_at || post.created_at).toISOString(),
      changeFrequency: "monthly",
      priority: 0.7
    }));

    const productRoutes = (products || []).map((product) => ({
      url: `${baseUrl}/products/${getProductSlug(product)}`,
      lastModified: new Date(product.created_at || Date.now()).toISOString(),
      changeFrequency: "weekly",
      priority: 0.8
    }));

    return [...routes, ...productRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
