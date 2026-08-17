const { loadEnvConfig } = require('@next/env');
// Load environment variables from .env.local
loadEnvConfig(process.cwd());

const { createClient } = require("@libsql/client");

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

const useTurso = !!(tursoUrl && tursoUrl !== "placeholder");

if (!useTurso) {
  console.log("Turso database is not configured. Using local JSON mock database.");
  process.exit(0);
}

console.log(`Connecting to Turso Database at: ${tursoUrl}`);
const turso = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

async function main() {
  try {
    console.log("Setting up Turso tables...");
    
    // Check if database is already initialized and seeded
    let hasDefaultSettings = false;
    try {
      const settingsCheck = await turso.execute("SELECT id FROM site_settings WHERE id = 'default'");
      hasDefaultSettings = settingsCheck.rows.length > 0;
    } catch (e) {
      // Table doesn't exist, proceed with setup
    }

    // 1. PRODUCTS TABLE
    console.log("Ensuring 'products' table exists...");
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        price_moq TEXT NOT NULL,
        packaging_info TEXT NOT NULL,
        image_url TEXT,
        is_visible INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
      )
    `);

    // Ensure specifications column exists
    try {
      await turso.execute(`ALTER TABLE products ADD COLUMN specifications TEXT`);
    } catch (e) {
      // Column already exists
    }

    // 2. BLOG POSTS TABLE
    console.log("Ensuring 'blog_posts' table exists...");
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        featured_image TEXT,
        category TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        author TEXT NOT NULL,
        is_published INTEGER DEFAULT 0,
        published_at TEXT,
        created_at TEXT NOT NULL
      )
    `);

    // 3. INQUIRIES TABLE
    console.log("Ensuring 'inquiries' table exists...");
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        product_interest TEXT NOT NULL,
        status TEXT DEFAULT 'unread',
        created_at TEXT NOT NULL
      )
    `);

    // 4. QUOTE REQUESTS TABLE
    console.log("Ensuring 'quote_requests' table exists...");
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS quote_requests (
        id TEXT PRIMARY KEY,
        product_id TEXT,
        product_name TEXT NOT NULL,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        quantity TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT NOT NULL
      )
    `);

    // 5. SITE SETTINGS TABLE
    console.log("Ensuring 'site_settings' table exists...");
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id TEXT PRIMARY KEY DEFAULT 'default',
        hero_title TEXT NOT NULL,
        hero_subtitle TEXT NOT NULL,
        hero_cta_text TEXT NOT NULL,
        hero_cta_link TEXT NOT NULL,
        business_address TEXT NOT NULL,
        business_phone TEXT NOT NULL,
        business_email TEXT NOT NULL,
        social_facebook TEXT,
        social_twitter TEXT,
        social_instagram TEXT,
        social_linkedin TEXT,
        social_youtube TEXT,
        whatsapp_number TEXT,
        whatsapp_message TEXT,
        admin_password TEXT,
        updated_at TEXT NOT NULL
      )
    `);

    // Ensure admin_password column exists
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN admin_password TEXT`);
    } catch (e) {}

    // Ensure whatsapp_number column exists
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN whatsapp_number TEXT`);
    } catch (e) {}

    // Ensure whatsapp_message column exists
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN whatsapp_message TEXT`);
    } catch (e) {}

    // Ensure social_youtube column exists
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN social_youtube TEXT`);
    } catch (e) {}

    // Ensure deal headline columns exist
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN deal_headline_enabled INTEGER DEFAULT 0`);
    } catch (e) {}
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN deal_headline_badge TEXT`);
    } catch (e) {}
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN deal_headline_text TEXT`);
    } catch (e) {}
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN deal_headline_link TEXT`);
    } catch (e) {}
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN deal_headline_link_text TEXT`);
    } catch (e) {}

    // Ensure marquee ticker columns exist
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN marquee_ticker_enabled INTEGER DEFAULT 1`);
    } catch (e) {}
    try {
      await turso.execute(`ALTER TABLE site_settings ADD COLUMN marquee_ticker_items TEXT`);
    } catch (e) {}

    // Seed default site settings, initial products, and initial blog posts if it's a new database
    if (!hasDefaultSettings) {
      console.log("Seeding default database data...");
      await turso.execute({
        sql: `INSERT INTO site_settings (
          id, hero_title, hero_subtitle, hero_cta_text, hero_cta_link, 
          business_address, business_phone, business_email, 
          social_facebook, social_twitter, social_instagram, social_linkedin, social_youtube,
          whatsapp_number, whatsapp_message, updated_at
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
          'Hello TheSevenSpice, I would like to inquire about wholesale spice sourcing.',
          ?
        )`,
        args: [new Date().toISOString()]
      });

      // Seed products
      const initialProducts = [
        ['p1', 'Premium Grade Kashmiri Saffron', 'Spices', 'Hand-harvested Grade A Kashmiri Saffron, famous for its deep red threads, strong aroma, and high safranal content.', '$8.50/gram (MOQ: 500g)', 'Glass vials or metal tins of 10g/50g/100g', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800', 1, new Date().toISOString()],
        ['p2', 'Whole Tellicherry Black Peppercorns', 'Spices', 'Sun-dried premium Tellicherry peppercorns. Rich in piperine, providing a sharp and aromatic heat profile.', '$4.20/kg (MOQ: 200kg)', 'Double-layer Kraft paper bags (25kg)', 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800', 1, new Date().toISOString()],
        ['p3', 'Organic Ceylon Cinnamon Quills', 'Spices', 'Authentic Ceylon cinnamon quills (C5 grade) from Sri Lanka. Delivers a sweet, subtle, and warm fragrance.', '$11.00/kg (MOQ: 100kg)', 'Vacuum-sealed inner pack, export-grade cartons (20kg)', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800', 1, new Date().toISOString()],
        ['p4', 'Sun-Dried Egyptian Sweet Basil', 'Herbs', 'Crushed Egyptian Sweet Basil leaves. Hand-selected, dried slowly in shade to retain rich essential oils and green color.', '$5.80/kg (MOQ: 150kg)', 'Compressed PP woven bags (15kg)', 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&q=80&w=800', 1, new Date().toISOString()],
        ['p5', 'Premium Whole Green Cardamom Pods', 'Spices', 'Fancy bold 8mm+ green cardamom pods. Intense aroma, citrus-mint flavor notes, sourced directly from Kerala.', '$18.50/kg (MOQ: 100kg)', 'Vacuum-packed aluminum bags in master cartons (20kg)', 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800', 1, new Date().toISOString()],
        ['p6', 'Organic Ground Turmeric (High Curcumin)', 'Powder', 'Pure ground turmeric containing over 5.5% curcumin. Sourced from organic co-ops in India.', '$3.90/kg (MOQ: 250kg)', 'Polylined paper bags (25kg)', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800', 1, new Date().toISOString()]
      ];

      for (const prod of initialProducts) {
        await turso.execute({
          sql: `INSERT INTO products (id, name, category, description, price_moq, packaging_info, image_url, is_visible, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: prod
        });
      }

      // Seed blog posts
      const initialBlogs = [
        [
          'b1',
          "Sourcing Grade A Saffron: A B2B Buyer's Guide",
          'sourcing-grade-a-saffron-b2b-buyers-guide',
          "<p>Saffron is the world's most expensive spice, and navigating its complex global trade can be daunting. In this guide, we break down color grading, chemical testing standards (ISO 3632), and direct origin sourcing verification models to protect your enterprise supply chains.</p><h2>Understanding ISO 3632 Standards</h2><p>ISO 3632 specifies testing guidelines for saffron quality. It measures three key parameters:</p><ul><li>Crocin (coloring strength)</li><li>Picrocrocin (flavor profile)</li><li>Safranal (aromatic profile)</li></ul><p>Grade I represents crocin levels higher than 200, which defines the intense coloration potential for gourmet food processing and pharmaceuticals.</p>",
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
          'Industry Insights',
          JSON.stringify(['sourcing', 'saffron', 'quality-control']),
          'Imran Al-Habib, Sourcing Director',
          1,
          new Date().toISOString(),
          new Date().toISOString()
        ],
        [
          'b2',
          'The Spice Logistics Playbook: Reducing Transit Spoilage',
          'spice-logistics-playbook-reducing-transit-spoilage',
          "<p>Spice volatile oils are fragile. Humidity and temperature fluctuations during ocean cargo shipping can cause mold, flavor dissipation, or severe color loss. Learn the exact packing standards and container dehumidification controls required for transit safety.</p><h2>Key Logistics Checkpoints</h2><p>1. Moisture barrier packaging: Using multi-wall paper bags with interior polyethylene liners is vital.<br>2. Temperature stability: Storing containers below deck during maritime voyages protects delicate herbs from high tropical heat.</p>",
          'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800',
          'Logistics',
          JSON.stringify(['shipping', 'storage', 'best-practices']),
          'Elena Rostova, Chief of Supply Chain',
          1,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      ];

      for (const post of initialBlogs) {
        await turso.execute({
          sql: `INSERT INTO blog_posts (id, title, slug, content, featured_image, category, tags, author, is_published, published_at, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: post
        });
      }
    }
    
    console.log("Database tables verified and setup successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

main();
