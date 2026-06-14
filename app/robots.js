export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://thesevenspice-b2b.vercel.app/sitemap.xml",
  };
}
