-- SQL Schema for TheSevenSpice B2B Platform
-- You can run this directly in the Supabase SQL Editor.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price_moq VARCHAR(100) NOT NULL, -- e.g., "$12.50/kg (MOQ: 100kg)"
    packaging_info VARCHAR(255) NOT NULL, -- e.g., "25kg multi-layer paper bags"
    image_url TEXT,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}'::text[],
    author VARCHAR(150) NOT NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INQUIRIES TABLE (Contact Form)
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    product_interest VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    quantity VARCHAR(100) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SITE SETTINGS TABLE (Single row)
CREATE TABLE IF NOT EXISTS site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    hero_cta_text VARCHAR(100) NOT NULL,
    hero_cta_link VARCHAR(255) NOT NULL,
    business_address TEXT NOT NULL,
    business_phone VARCHAR(50) NOT NULL,
    business_email VARCHAR(255) NOT NULL,
    social_facebook VARCHAR(255),
    social_twitter VARCHAR(255),
    social_instagram VARCHAR(255),
    social_linkedin VARCHAR(255),
    social_youtube VARCHAR(255),
    whatsapp_number VARCHAR(50),
    whatsapp_message TEXT,
    admin_password TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SEED DATA

-- Insert default site settings
INSERT INTO site_settings (
    id, hero_title, hero_subtitle, hero_cta_text, hero_cta_link, 
    business_address, business_phone, business_email, 
    social_facebook, social_twitter, social_instagram, social_linkedin, social_youtube,
    whatsapp_number, whatsapp_message
) VALUES (
    'default', 
    'Experience the Finest Fenugreek (Methi)', 
    'TheSevenSpice offers premium Fenugreek (Methi) seeds and powder, expertly sourced for exceptional freshness, rich aroma, and consistent quality—trusted by customers across local and global markets.',
    'Submit Wholesale Inquiry',
    '/contact',
    '1200 Silk Road Plaza, Suite 400, Trade District, NY 10001, United States',
    '+1 (800) 555-SPICE',
    'sales@thesevenspice.com',
    'https://facebook.com/thesevenspice',
    'https://twitter.com/thesevenspice',
    'https://instagram.com/thesevenspice',
    'https://linkedin.com/company/thesevenspice',
    'https://youtube.com/@thesevenspice',
    '+15550000000',
    'Hello TheSevenSpice, I would like to inquire about wholesale spice sourcing.'
) ON CONFLICT (id) DO NOTHING;

-- Insert initial products
INSERT INTO products (name, category, description, price_moq, packaging_info, image_url, is_visible) VALUES 
('Premium Grade Kashmiri Saffron', 'Spices', 'Hand-harvested Grade A Kashmiri Saffron, famous for its deep red threads, strong aroma, and high safranal content.', '$8.50/gram (MOQ: 500g)', 'Glass vials or metal tins of 10g/50g/100g', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800', true),
('Whole Tellicherry Black Peppercorns', 'Spices', 'Sun-dried premium Tellicherry peppercorns. Rich in piperine, providing a sharp and aromatic heat profile.', '$4.20/kg (MOQ: 200kg)', 'Double-layer Kraft paper bags (25kg)', 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800', true),
('Organic Ceylon Cinnamon Quills', 'Spices', 'Authentic Ceylon cinnamon quills (C5 grade) from Sri Lanka. Delivers a sweet, subtle, and warm fragrance.', '$11.00/kg (MOQ: 100kg)', 'Vacuum-sealed inner pack, export-grade cartons (20kg)', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800', true),
('Sun-Dried Egyptian Sweet Basil', 'Herbs', 'Crushed Egyptian Sweet Basil leaves. Hand-selected, dried slowly in shade to retain rich essential oils and green color.', '$5.80/kg (MOQ: 150kg)', 'Compressed PP woven bags (15kg)', 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&q=80&w=800', true),
('Premium Whole Green Cardamom Pods', 'Spices', 'Fancy bold 8mm+ green cardamom pods. Intense aroma, citrus-mint flavor notes, sourced directly from Kerala.', '$18.50/kg (MOQ: 100kg)', 'Vacuum-packed aluminum bags in master cartons (20kg)', 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800', true),
('Organic Ground Turmeric (High Curcumin)', 'Powder', 'Pure ground turmeric containing over 5.5% curcumin. Sourced from organic co-ops in India.', '$3.90/kg (MOQ: 250kg)', 'Polylined paper bags (25kg)', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800', true);

-- Insert initial blog posts
INSERT INTO blog_posts (title, slug, content, featured_image, category, tags, author, is_published, published_at) VALUES 
(
 'Sourcing Grade A Saffron: A B2B Buyer''s Guide', 
 'sourcing-grade-a-saffron-b2b-buyers-guide',
 '<p>Saffron is the world''s most expensive spice, and navigations through its complex global trade can be daunting. In this guide, we break down color grading, chemical testing standards (ISO 3632), and direct origin sourcing verification models to protect your enterprise supply chains.</p><h2>Understanding ISO 3632 Standards</h2><p>ISO 3632 specifies testing guidelines for saffron quality. It measures three key parameters:</p><ul><li>Crocin (coloring strength)</li><li>Picrocrocin (flavor profile)</li><li>Safranal (aromatic profile)</li></ul><p>Grade I represents crocin levels higher than 200, which defines the intense coloration potential for gourmet food processing and pharmaceuticals.</p>',
 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
 'Industry Insights',
 '{"sourcing", "saffron", "quality-control"}',
 'Imran Al-Habib, Sourcing Director',
 true,
 NOW()
),
(
 'The Spice Logistics Playbook: Reducing Transit Spoilage', 
 'spice-logistics-playbook-reducing-transit-spoilage',
 '<p>Spice volatile oils are fragile. Humidity and temperature fluctuations during ocean cargo shipping can cause mold, flavor dissipation, or severe color loss. Learn the exact packing standards and container dehumidification controls required for transit safety.</p><h2>Key Logistics Checkpoints</h2><p>1. Moisture barrier packaging: Using multi-wall paper bags with interior polyethylene liners is vital.<br>2. Temperature stability: Storing containers below deck during maritime voyages protects delicate herbs from high tropical heat.</p>',
 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800',
 'Logistics',
 '{"shipping", "storage", "best-practices"}',
 'Elena Rostova, Chief of Supply Chain',
 true,
 NOW()
);
