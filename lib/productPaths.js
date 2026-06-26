export function slugifyProductName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

export function getProductSlug(product) {
  return `${slugifyProductName(product.name)}--${encodeURIComponent(product.id)}`;
}

export function getProductIdFromSlug(slug) {
  const separatorIndex = String(slug || "").lastIndexOf("--");
  if (separatorIndex === -1) return null;
  const encodedId = slug.slice(separatorIndex + 2);
  if (!encodedId) return null;
  try {
    return decodeURIComponent(encodedId);
  } catch {
    return null;
  }
}