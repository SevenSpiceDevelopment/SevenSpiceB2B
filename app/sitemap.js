import { getBlogPosts } from "@/lib/db";

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

  // Fetch dynamic blog posts
  try {
    const posts = await getBlogPosts();
    const blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published_at || post.created_at).toISOString(),
      changeFrequency: "monthly",
      priority: 0.6
    }));

    return [...routes, ...blogRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
