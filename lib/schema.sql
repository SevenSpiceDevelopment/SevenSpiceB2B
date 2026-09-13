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
  social_facebook TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  social_linkedin TEXT,
  social_youtube TEXT,
  marquee_ticker_enabled BOOLEAN DEFAULT TRUE,
  marquee_ticker_items TEXT,
  admin_password TEXT,
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

-- DISABLE RLS OR ALLOW FULL ACCESS FOR SEAMLESS OPERATION
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read on collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Allow public read on blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);

-- Allow public insert on inquiries and quote requests
CREATE POLICY "Allow public insert on inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on quote_requests" ON quote_requests FOR INSERT WITH CHECK (true);

-- Allow service role / admin full access on all tables
CREATE POLICY "Allow full access for service role on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow full access for service role on collections" ON collections FOR ALL USING (true);
CREATE POLICY "Allow full access for service role on blog_posts" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Allow full access for service role on inquiries" ON inquiries FOR ALL USING (true);
CREATE POLICY "Allow full access for service role on quote_requests" ON quote_requests FOR ALL USING (true);
CREATE POLICY "Allow full access for service role on site_settings" ON site_settings FOR ALL USING (true);
