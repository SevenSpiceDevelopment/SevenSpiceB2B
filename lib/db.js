import { createClient } from "@supabase/supabase-js";

// Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Key is missing in environment variables.");
}

// Global Supabase client instance
export let supabase = null;
if (supabaseUrl && supabaseKey) {
  if (!globalThis.supabaseClient) {
    globalThis.supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      global: { headers: { "x-application-name": "SevenSpiceB2B" } },
    });
  }
  supabase = globalThis.supabaseClient;
}

// Upload file to Supabase Storage (media bucket)
export async function uploadMediaFile(file, folder = "uploads") {
  if (!file || !(file instanceof File) || file.size === 0) return null;
  if (!supabase) return null;

  try {
    const ext = file.name ? file.name.split('.').pop() : 'jpg';
    const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'jpg';
    const filename = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${cleanExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from("media")
      .upload(filename, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true
      });

    if (error) {
      console.warn("Supabase storage upload error:", error.message);
      return null;
    }

    const { data: publicData } = supabase.storage.from("media").getPublicUrl(filename);
    return publicData.publicUrl;
  } catch (err) {
    console.warn("Storage upload exception:", err.message);
    return null;
  }
}

// In-Memory Fast Cache for ultra-fast page transitions (<1ms)
const memCache = {
  products: null,
  productsTime: 0,
  collections: null,
  collectionsTime: 0,
  blogPosts: null,
  blogPostsTime: 0,
  siteSettings: null,
  siteSettingsTime: 0,
};

const CACHE_TTL_MS = 2500; // 2.5s short TTL - ensures all admin edits appear immediately across all serverless instances

export function invalidateMemCache(key) {
  if (key) {
    memCache[key] = null;
    memCache[`${key}Time`] = 0;
  } else {
    memCache.products = null;
    memCache.collections = null;
    memCache.blogPosts = null;
    memCache.siteSettings = null;
  }
}

// Default fallback settings template (only if DB table is completely empty)
const defaultSettings = {
  id: "default",
  hero_title: "Premium Pakistani Spices for Global Food Manufacturers & Importers",
  hero_subtitle: "Export-quality spices, herbs, and seasoning ingredients supplied in bulk with consistent quality, competitive pricing, and worldwide container shipments.",
  hero_bg_image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=2000",
  hero_cta_text: "Request Wholesale Quote",
  hero_cta_link: "/contact",
  hero_secondary_cta_text: "Explore Our Products",
  hero_secondary_cta_link: "/products",
  business_phone: "+92 3286828006",
  business_email: "sales@thesevenspice.com",
  business_address: "Plot 42, Port Qasim Industrial Area, Karachi, Pakistan",
  whatsapp_number: "+923286828006",
  whatsapp_message: "Hello TheSevenSpice, I would like to inquire about wholesale bulk spices.",
  deal_headline_enabled: false,
  deal_headline_badge: "Special Wholesale Rate",
  deal_headline_text: "Special volume discounts available on bulk whole cumin and Himalayan pink salt orders over 1,000kg.",
  deal_headline_link: "/contact",
  deal_headline_link_text: "Inquire Now",
  marquee_ticker_enabled: true,
  marquee_ticker_items: JSON.stringify([
    "🌿 100% Pure & Unadulterated Spices",
    "🌶️ Kunri Red Chilli & Kasuri Methi Sourced Directly from Farms",
    "🏔️ Pure Edible Himalayan Pink Salt from Khewra",
    "🔬 Machine Cleaned & Lab Tested for Purity",
    "📦 Food-Grade Moisture-Barrier Packaging",
    "🚚 Fast Delivery Across Pakistan & International Export"
  ]),
  social_linkedin: "https://linkedin.com/company/thesevenspice",
  social_instagram: "https://instagram.com/thesevenspice",
  social_facebook: "https://facebook.com/thesevenspice",
  social_twitter: "https://twitter.com/thesevenspice",
  social_youtube: ""
};

const KNOWN_SITE_SETTINGS_COLS = new Set([
  "id",
  "hero_title",
  "hero_subtitle",
  "hero_bg_image",
  "hero_cta_text",
  "hero_cta_link",
  "hero_secondary_cta_text",
  "hero_secondary_cta_link",
  "business_phone",
  "business_email",
  "business_address",
  "whatsapp_number",
  "whatsapp_message",
  "deal_headline_enabled",
  "deal_headline_badge",
  "deal_headline_text",
  "deal_headline_link",
  "deal_headline_link_text",
  "updated_at"
]);

// --- DB INTERFACE METHODS ---

// 1. PRODUCTS
async function getProductsRaw(includeHidden = false) {
  const now = Date.now();
  if (memCache.products && now - memCache.productsTime < CACHE_TTL_MS) {
    return memCache.products.filter(p => includeHidden || p.is_visible);
  }

  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase products fetch error:", error.message);
      return memCache.products || [];
    }

    const allProducts = (data || []).map(row => ({
      ...row,
      collection: row.collection || "",
      is_visible: Boolean(row.is_visible),
      specifications: typeof row.specifications === "string"
        ? JSON.parse(row.specifications || "{}")
        : (row.specifications || {})
    }));

    memCache.products = allProducts;
    memCache.productsTime = now;
    return allProducts.filter(p => includeHidden || p.is_visible);
  } catch (err) {
    console.error("Supabase products unexpected error:", err.message);
    return memCache.products || [];
  }
}

export async function getProducts(includeHidden = false) {
  return getProductsRaw(includeHidden);
}

export async function getProductById(id) {
  const products = await getProductsRaw(true);
  const found = products.find(p => p.id === id);
  if (found) return found;

  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;

    return {
      ...data,
      collection: data.collection || "",
      is_visible: Boolean(data.is_visible),
      specifications: typeof data.specifications === "string"
        ? JSON.parse(data.specifications || "{}")
        : (data.specifications || {})
    };
  } catch (err) {
    console.error("Supabase product by id error:", err.message);
    return null;
  }
}

export async function saveProduct(product) {
  invalidateMemCache("products");

  const prodToSave = {
    ...product,
    id: product.id || "p_" + Math.random().toString(36).substr(2, 9),
    collection: product.collection || "",
    is_visible: product.is_visible !== false,
    specifications: typeof product.specifications === "object"
      ? product.specifications
      : JSON.parse(product.specifications || "{}"),
    created_at: product.created_at || new Date().toISOString()
  };

  if (supabase) {
    const { error } = await supabase.from("products").upsert(prodToSave);
    if (error) {
      console.error("Supabase product save error:", error.message);
      throw new Error(`Failed to save product in database: ${error.message}`);
    }
  }

  return prodToSave;
}

export async function deleteProduct(id) {
  invalidateMemCache("products");

  if (supabase) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Supabase product delete error:", error.message);
      throw new Error(`Failed to delete product from database: ${error.message}`);
    }
    return !error;
  }
  return true;
}

export async function batchSaveProducts({ category, collection, products = [] }) {
  invalidateMemCache("products");

  if (!Array.isArray(products) || products.length === 0) {
    return { success: false, error: "No products provided in batch." };
  }

  const savedProducts = [];
  for (const item of products) {
    if (!item.name || !item.name.trim()) continue;
    const prod = {
      name: item.name.trim(),
      category: category || "Spices",
      collection: collection || "",
      description: item.description || "Premium wholesale grade spices and botanicals sourced directly from origin estates.",
      price_moq: item.price_moq || "Available on inquiry",
      packaging_info: item.packaging_info || "Bulk export packaging available on request",
      image_url: item.image_url || null,
      is_visible: item.is_visible !== false,
      specifications: typeof item.specifications === "object" ? item.specifications : {}
    };
    const saved = await saveProduct(prod);
    savedProducts.push(saved);
  }

  return { success: true, count: savedProducts.length, products: savedProducts };
}

// 1B. COLLECTIONS
async function getCollectionsRaw(includeHidden = false) {
  const now = Date.now();
  if (memCache.collections && now - memCache.collectionsTime < CACHE_TTL_MS) {
    return memCache.collections.filter(c => includeHidden || c.is_featured !== false);
  }

  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase collections fetch error:", error.message);
      return memCache.collections || [];
    }

    const allCols = (data || []).map(row => ({
      ...row,
      is_featured: Boolean(row.is_featured)
    }));

    memCache.collections = allCols;
    memCache.collectionsTime = now;
    return allCols.filter(c => includeHidden || c.is_featured !== false);
  } catch (err) {
    console.error("Supabase collections unexpected error:", err.message);
    return memCache.collections || [];
  }
}

export async function getCollections(includeHidden = false) {
  return getCollectionsRaw(includeHidden);
}

export async function getCollectionById(id) {
  const cols = await getCollectionsRaw(true);
  const found = cols.find(c => c.id === id);
  if (found) return found;

  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;

    return {
      ...data,
      is_featured: Boolean(data.is_featured)
    };
  } catch (err) {
    console.error("Supabase collection by id error:", err.message);
    return null;
  }
}

export async function getCollectionBySlug(slug) {
  const cols = await getCollectionsRaw(true);
  const found = cols.find(c => c.slug === slug);
  if (found) return found;

  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;

    return {
      ...data,
      is_featured: Boolean(data.is_featured)
    };
  } catch (err) {
    console.error("Supabase collection by slug error:", err.message);
    return null;
  }
}

export async function saveCollection(collection) {
  invalidateMemCache("collections");
  const slug = collection.slug || collection.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const colToSave = {
    ...collection,
    id: collection.id || "c_" + Math.random().toString(36).substr(2, 9),
    slug,
    is_featured: collection.is_featured !== false,
    created_at: collection.created_at || new Date().toISOString()
  };

  if (supabase) {
    const { error } = await supabase.from("collections").upsert(colToSave);
    if (error) {
      console.error("Supabase collection save error:", error.message);
      throw new Error(`Failed to save collection in database: ${error.message}`);
    }
  }

  return colToSave;
}

export async function deleteCollection(id) {
  invalidateMemCache("collections");

  if (supabase) {
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) {
      console.error("Supabase collection delete error:", error.message);
      throw new Error(`Failed to delete collection from database: ${error.message}`);
    }
    return !error;
  }
  return true;
}

// 2. BLOG POSTS
async function getBlogPostsRaw(includeDrafts = false) {
  const now = Date.now();
  if (memCache.blogPosts && now - memCache.blogPostsTime < CACHE_TTL_MS) {
    return memCache.blogPosts.filter(b => includeDrafts || b.is_published);
  }

  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase blog posts fetch error:", error.message);
      return memCache.blogPosts || [];
    }

    const allPosts = (data || []).map(row => ({
      ...row,
      is_published: Boolean(row.is_published),
      tags: Array.isArray(row.tags) ? row.tags : (typeof row.tags === "string" ? JSON.parse(row.tags || "[]") : [])
    }));

    memCache.blogPosts = allPosts;
    memCache.blogPostsTime = now;
    return allPosts.filter(b => includeDrafts || b.is_published);
  } catch (err) {
    console.error("Supabase blog posts unexpected error:", err.message);
    return memCache.blogPosts || [];
  }
}

export async function getBlogPosts(includeDrafts = false) {
  return getBlogPostsRaw(includeDrafts);
}

export async function getBlogPostBySlug(slug) {
  const posts = await getBlogPostsRaw(true);
  const found = posts.find(b => b.slug === slug);
  if (found) return found;

  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;

    return {
      ...data,
      is_published: Boolean(data.is_published),
      tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === "string" ? JSON.parse(data.tags || "[]") : [])
    };
  } catch (err) {
    console.error("Supabase blog post by slug error:", err.message);
    return null;
  }
}

export async function saveBlogPost(post) {
  invalidateMemCache("blogPosts");

  const postToSave = {
    ...post,
    id: post.id || "b_" + Math.random().toString(36).substr(2, 9),
    tags: Array.isArray(post.tags) ? post.tags : (typeof post.tags === "string" ? JSON.parse(post.tags || "[]") : []),
    is_published: post.is_published !== false,
    published_at: post.published_at || new Date().toISOString(),
    created_at: post.created_at || new Date().toISOString()
  };

  if (supabase) {
    const { error } = await supabase.from("blog_posts").upsert(postToSave);
    if (error) {
      console.error("Supabase blog post save error:", error.message);
      throw new Error(`Failed to save blog post in database: ${error.message}`);
    }
  }

  return postToSave;
}

export async function deleteBlogPost(id) {
  invalidateMemCache("blogPosts");

  if (supabase) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.error("Supabase blog post delete error:", error.message);
      throw new Error(`Failed to delete blog post from database: ${error.message}`);
    }
    return !error;
  }
  return true;
}

// 3. INQUIRIES
export async function getInquiries() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase inquiries fetch error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Supabase inquiries unexpected error:", err.message);
    return [];
  }
}

export async function saveInquiry(inquiry) {
  const newInquiry = {
    ...inquiry,
    id: "inq_" + Math.random().toString(36).substr(2, 9),
    status: inquiry.status || "unread",
    created_at: new Date().toISOString()
  };

  if (supabase) {
    const { error } = await supabase.from("inquiries").insert(newInquiry);
    if (error) console.error("Supabase inquiry save error:", error.message);
  }

  return newInquiry;
}

export async function updateInquiryStatus(id, status) {
  if (supabase) {
    const { data, error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (!error && data) return data;
  }
  return null;
}

// 4. QUOTE REQUESTS
export async function getQuoteRequests() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase quote requests fetch error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Supabase quote requests unexpected error:", err.message);
    return [];
  }
}

export async function saveQuoteRequest(quote) {
  const newQuote = {
    ...quote,
    id: "qr_" + Math.random().toString(36).substr(2, 9),
    status: quote.status || "pending",
    created_at: new Date().toISOString()
  };

  if (supabase) {
    const { error } = await supabase.from("quote_requests").insert(newQuote);
    if (error) console.error("Supabase quote request save error:", error.message);
  }

  return newQuote;
}

export async function updateQuoteRequestStatus(id, status) {
  if (supabase) {
    const { data, error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (!error && data) return data;
  }
  return null;
}

// 5. SITE SETTINGS
async function getSiteSettingsRaw() {
  const now = Date.now();
  if (memCache.siteSettings && now - memCache.siteSettingsTime < CACHE_TTL_MS) {
    return memCache.siteSettings;
  }

  if (!supabase) return defaultSettings;

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");

    if (error) {
      console.error("Supabase site settings fetch error:", error.message);
      return memCache.siteSettings || defaultSettings;
    }

    const defaultRow = (data || []).find(r => r.id === "default") || {};
    const extendedRow = (data || []).find(r => r.id === "extended_config");

    let extendedFields = {};
    if (extendedRow && extendedRow.hero_subtitle) {
      try {
        extendedFields = JSON.parse(extendedRow.hero_subtitle);
      } catch (e) {
        console.error("Failed to parse extended_config:", e.message);
      }
    }

    const settings = {
      ...defaultSettings,
      ...defaultRow,
      ...extendedFields
    };

    memCache.siteSettings = settings;
    memCache.siteSettingsTime = now;
    return settings;
  } catch (err) {
    console.error("Supabase site settings unexpected error:", err.message);
    return memCache.siteSettings || defaultSettings;
  }
}

export async function getSiteSettings() {
  return getSiteSettingsRaw();
}

export async function getSiteSettingsFresh() {
  invalidateMemCache("siteSettings");
  return getSiteSettingsRaw();
}

export async function saveSiteSettings(settings) {
  invalidateMemCache("siteSettings");

  const fullSettings = {
    ...defaultSettings,
    ...settings,
    id: "default",
    updated_at: new Date().toISOString()
  };

  if (supabase) {
    const defaultRow = { id: "default", updated_at: fullSettings.updated_at };
    const extendedFields = {};

    for (const [key, val] of Object.entries(fullSettings)) {
      if (KNOWN_SITE_SETTINGS_COLS.has(key)) {
        defaultRow[key] = val;
      } else {
        extendedFields[key] = val;
      }
    }

    // 1. Upsert default columns
    const { error: err1 } = await supabase.from("site_settings").upsert(defaultRow);
    if (err1) {
      console.error("Supabase site settings save error:", err1.message);
      throw new Error(`Failed to save site settings: ${err1.message}`);
    }

    // 2. Upsert extended fields into companion row
    if (Object.keys(extendedFields).length > 0) {
      const { error: err2 } = await supabase.from("site_settings").upsert({
        id: "extended_config",
        hero_subtitle: JSON.stringify(extendedFields),
        updated_at: fullSettings.updated_at
      });
      if (err2) {
        console.error("Supabase extended settings save error:", err2.message);
      }
    }
  }

  memCache.siteSettings = fullSettings;
  memCache.siteSettingsTime = Date.now();
  return fullSettings;
}
