-- Supabase PostgreSQL Schema for SevenSpice B2B Platform

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  collection TEXT DEFAULT '',
  description TEXT,
  price_moq TEXT,
  packaging_info TEXT,
  image_url TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  featured_image TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  author TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  product_interest TEXT,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  product_name TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  quantity TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_bg_image TEXT,
  hero_cta_text TEXT,
  hero_cta_link TEXT,
  hero_secondary_cta_text TEXT,
  hero_secondary_cta_link TEXT,
  business_phone TEXT,
  business_email TEXT,
  business_address TEXT,
  whatsapp_number TEXT,
  whatsapp_message TEXT,
  deal_headline_enabled BOOLEAN DEFAULT FALSE,
  deal_headline_badge TEXT,
  deal_headline_text TEXT,
  deal_headline_link TEXT,
  deal_headline_link_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INSERT DEFAULT SETTINGS
INSERT INTO site_settings (id, business_phone, business_email, hero_title, hero_subtitle)
VALUES (
  'default',
  '+92 3286828006',
  'sales@thesevenspice.com',
  'Direct-from-Origin Premium B2B Wholesale Spices & Logistics',
  'Supplying high-grade wholesale whole seeds, ground spices, and single-origin botanicals directly to commercial food manufacturers.'
) ON CONFLICT (id) DO NOTHING;
