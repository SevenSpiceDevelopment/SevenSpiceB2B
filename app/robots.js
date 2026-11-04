export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thesevenspice-b2b.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
