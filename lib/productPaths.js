export function slugifyProductName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

export function getProductSlug(product) {
  if (!product) return "product";
  if (product.slug) {
    return String(product.slug).replace(/^\/products\//, "").replace(/^\//, "");
  }
  if (product.specifications?.slug) {
    return String(product.specifications.slug).replace(/^\/products\//, "").replace(/^\//, "");
  }
  return slugifyProductName(product.name);
}

export function getProductIdFromSlug(slug) {
  if (!slug) return null;
  const clean = String(slug).toLowerCase().trim();
  const separatorIndex = clean.lastIndexOf("--");
  if (separatorIndex !== -1) {
    const encodedId = clean.slice(separatorIndex + 2);
    if (encodedId) {
      try {
        return decodeURIComponent(encodedId);
      } catch {}
    }
  }
  return clean;
}