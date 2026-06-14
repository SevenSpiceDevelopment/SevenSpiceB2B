import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

// Turso environment variables
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

// Check if we should use Turso
const useTurso = !!(tursoUrl && tursoUrl !== "placeholder");

let turso = null;
if (useTurso) {
  turso = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });
}

// Local mock database path
const mockDbPath = path.join(process.cwd(), "lib", "mockDb.json");

// Initial mock seed data
const initialMockData = {
  products: [
    {
      id: "p1",
      name: "Premium Grade Kashmiri Saffron",
      category: "Spices",
      description: "Hand-harvested Grade A Kashmiri Saffron, famous for its deep red threads, strong aroma, and high safranal content.",
      price_moq: "$8.50/gram (MOQ: 500g)",
      packaging_info: "Glass vials or metal tins of 10g/50g/100g",
      image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
      is_visible: true,
      created_at: new Date().toISOString()
    },
    {
      id: "p2",
      name: "Whole Tellicherry Black Peppercorns",
      category: "Spices",
      description: "Sun-dried premium Tellicherry peppercorns. Rich in piperine, providing a sharp and aromatic heat profile.",
      price_moq: "$4.20/kg (MOQ: 200kg)",
      packaging_info: "Double-layer Kraft paper bags (25kg)",
      image_url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800",
      is_visible: true,
      created_at: new Date().toISOString()
    },
    {
      id: "p3",
      name: "Organic Ceylon Cinnamon Quills",
      category: "Spices",
      description: "Authentic Ceylon cinnamon quills (C5 grade) from Sri Lanka. Delivers a sweet, subtle, and warm fragrance.",
      price_moq: "$11.00/kg (MOQ: 100kg)",
      packaging_info: "Vacuum-sealed inner pack, export-grade cartons (20kg)",
      image_url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800",
      is_visible: true,
      created_at: new Date().toISOString()
    },
    {
      id: "p4",
      name: "Sun-Dried Egyptian Sweet Basil",
      category: "Herbs",
      description: "Crushed Egyptian Sweet Basil leaves. Hand-selected, dried slowly in shade to retain rich essential oils and green color.",
      price_moq: "$5.80/kg (MOQ: 150kg)",
      packaging_info: "Compressed PP woven bags (15kg)",
      image_url: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&q=80&w=800",
      is_visible: true,
      created_at: new Date().toISOString()
    },
    {
      id: "p5",
      name: "Premium Whole Green Cardamom Pods",
      category: "Spices",
      description: "Fancy bold 8mm+ green cardamom pods. Intense aroma, citrus-mint flavor notes, sourced directly from Kerala.",
      price_moq: "$18.50/kg (MOQ: 100kg)",
      packaging_info: "Vacuum-packed aluminum bags in master cartons (20kg)",
      image_url: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
      is_visible: true,
      created_at: new Date().toISOString()
    },
    {
      id: "p6",
      name: "Organic Ground Turmeric (High Curcumin)",
      category: "Powder",
      description: "Pure ground turmeric containing over 5.5% curcumin. Sourced from organic co-ops in India.",
      price_moq: "$3.90/kg (MOQ: 250kg)",
      packaging_info: "Polylined paper bags (25kg)",
      image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
      is_visible: true,
      created_at: new Date().toISOString()
    }
  ],
  blog_posts: [
    {
      id: "b1",
      title: "Sourcing Grade A Saffron: A B2B Buyer's Guide",
      slug: "sourcing-grade-a-saffron-b2b-buyers-guide",
      content: "<p>Saffron is the world's most expensive spice, and navigating its complex global trade can be daunting. In this guide, we break down color grading, chemical testing standards (ISO 3632), and direct origin sourcing verification models to protect your enterprise supply chains.</p><h2>Understanding ISO 3632 Standards</h2><p>ISO 3632 specifies testing guidelines for saffron quality. It measures three key parameters:</p><ul><li>Crocin (coloring strength)</li><li>Picrocrocin (flavor profile)</li><li>Safranal (aromatic profile)</li></ul><p>Grade I represents crocin levels higher than 200, which defines the intense coloration potential for gourmet food processing and pharmaceuticals.</p>",
      featured_image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
      category: "Industry Insights",
      tags: ["sourcing", "saffron", "quality-control"],
      author: "Imran Al-Habib, Sourcing Director",
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: "b2",
      title: "The Spice Logistics Playbook: Reducing Transit Spoilage",
      slug: "spice-logistics-playbook-reducing-transit-spoilage",
      content: "<p>Spice volatile oils are fragile. Humidity and temperature fluctuations during ocean cargo shipping can cause mold, flavor dissipation, or severe color loss. Learn the exact packing standards and container dehumidification controls required for transit safety.</p><h2>Key Logistics Checkpoints</h2><p>1. Moisture barrier packaging: Using multi-wall paper bags with interior polyethylene liners is vital.<br>2. Temperature stability: Storing containers below deck during maritime voyages protects delicate herbs from high tropical heat.</p>",
      featured_image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800",
      category: "Logistics",
      tags: ["shipping", "storage", "best-practices"],
      author: "Elena Rostova, Chief of Supply Chain",
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ],
  inquiries: [],
  quote_requests: [],
  site_settings: {
    hero_title: "Exquisite Spices sourced globally, delivered reliably.",
    hero_subtitle: "Partner with TheSevenSpice for premium bulk imports, custom formulations, and seamless international logistics.",
    hero_cta_text: "Submit Wholesale Inquiry",
    hero_cta_link: "/contact",
    business_address: "1200 Silk Road Plaza, Suite 400, Trade District, NY 10001, United States",
    business_phone: "+1 (800) 555-SPICE",
    business_email: "sales@thesevenspice.com",
    social_facebook: "https://facebook.com/thesevenspice",
    social_twitter: "https://twitter.com/thesevenspice",
    social_instagram: "https://instagram.com/thesevenspice",
    social_linkedin: "https://linkedin.com/company/thesevenspice"
  }
};

// SQLite database initial schemas and seeds routine
async function setupTursoTables() {
  if (!useTurso) return;
  try {
    // 1. PRODUCTS TABLE
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

    // 2. BLOG POSTS TABLE
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
        updated_at TEXT NOT NULL
      )
    `);

    // Seed default site settings if empty
    const settingsCheck = await turso.execute("SELECT id FROM site_settings WHERE id = 'default'");
    if (settingsCheck.rows.length === 0) {
      await turso.execute({
        sql: `INSERT INTO site_settings (
          id, hero_title, hero_subtitle, hero_cta_text, hero_cta_link, 
          business_address, business_phone, business_email, 
          social_facebook, social_twitter, social_instagram, social_linkedin, updated_at
        ) VALUES (
          'default', 
          'Exquisite Spices sourced globally, delivered reliably.', 
          'Partner with TheSevenSpice for premium bulk imports, custom formulations, and seamless international logistics.',
          'Submit Wholesale Inquiry',
          '/contact',
          '1200 Silk Road Plaza, Suite 400, Trade District, NY 10001, United States',
          '+1 (800) 555-SPICE',
          'sales@thesevenspice.com',
          'https://facebook.com/thesevenspice',
          'https://twitter.com/thesevenspice',
          'https://instagram.com/thesevenspice',
          'https://linkedin.com/company/thesevenspice',
          ?
        )`,
        args: [new Date().toISOString()]
      });
    }

    // Seed products if empty
    const productsCheck = await turso.execute("SELECT id FROM products LIMIT 1");
    if (productsCheck.rows.length === 0) {
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
    }

    // Seed blog posts if empty
    const blogCheck = await turso.execute("SELECT id FROM blog_posts LIMIT 1");
    if (blogCheck.rows.length === 0) {
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
  } catch (error) {
    console.error("Error setting up Turso tables:", error);
  }
}

// Invoke setup if Turso is active — store the promise so queries can await it
let setupPromise = null;
if (useTurso) {
  setupPromise = setupTursoTables();
}

// Helper: ensures Turso tables are ready before any query runs
async function ensureTursoReady() {
  if (setupPromise) {
    await setupPromise;
  }
}

// Helper function to read/write JSON file
function readMockDb() {
  try {
    if (!fs.existsSync(mockDbPath)) {
      // Ensure folder exists
      const dir = path.dirname(mockDbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(mockDbPath, JSON.stringify(initialMockData, null, 2), "utf-8");
      return initialMockData;
    }
    const data = fs.readFileSync(mockDbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading mock DB:", error);
    return initialMockData;
  }
}

function writeMockDb(data) {
  try {
    const dir = path.dirname(mockDbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(mockDbPath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing mock DB:", error);
    return false;
  }
}

// --- DB INTERFACE METHODS ---

// 1. PRODUCTS
export async function getProducts(includeHidden = false) {
  if (useTurso) {
    await ensureTursoReady();
    const sql = includeHidden
      ? "SELECT * FROM products ORDER BY created_at DESC"
      : "SELECT * FROM products WHERE is_visible = 1 ORDER BY created_at DESC";
    const result = await turso.execute(sql);
    return result.rows.map(row => ({
      ...row,
      is_visible: Boolean(row.is_visible)
    }));
  } else {
    const db = readMockDb();
    return db.products.filter(p => includeHidden || p.is_visible);
  }
}

export async function getProductById(id) {
  if (useTurso) {
    await ensureTursoReady();
    const result = await turso.execute({
      sql: "SELECT * FROM products WHERE id = ?",
      args: [id]
    });
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      ...row,
      is_visible: Boolean(row.is_visible)
    };
  } else {
    const db = readMockDb();
    return db.products.find(p => p.id === id) || null;
  }
}

export async function saveProduct(product) {
  if (useTurso) {
    await ensureTursoReady();
    if (product.id) {
      await turso.execute({
        sql: `UPDATE products SET 
              name = ?, category = ?, description = ?, price_moq = ?, 
              packaging_info = ?, image_url = ?, is_visible = ?
              WHERE id = ?`,
        args: [
          product.name,
          product.category,
          product.description,
          product.price_moq,
          product.packaging_info,
          product.image_url || null,
          product.is_visible ? 1 : 0,
          product.id
        ]
      });
      return product;
    } else {
      const newProduct = {
        ...product,
        id: "p_" + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      await turso.execute({
        sql: `INSERT INTO products (id, name, category, description, price_moq, packaging_info, image_url, is_visible, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          newProduct.id,
          newProduct.name,
          newProduct.category,
          newProduct.description,
          newProduct.price_moq,
          newProduct.packaging_info,
          newProduct.image_url || null,
          newProduct.is_visible ? 1 : 0,
          newProduct.created_at
        ]
      });
      return newProduct;
    }
  } else {
    const db = readMockDb();
    if (product.id) {
      const index = db.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        db.products[index] = { ...db.products[index], ...product };
      }
    } else {
      const newProduct = {
        ...product,
        id: "p_" + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      db.products.push(newProduct);
      product = newProduct;
    }
    writeMockDb(db);
    return product;
  }
}

export async function deleteProduct(id) {
  if (useTurso) {
    await ensureTursoReady();
    await turso.execute({
      sql: "DELETE FROM products WHERE id = ?",
      args: [id]
    });
    return true;
  } else {
    const db = readMockDb();
    db.products = db.products.filter(p => p.id !== id);
    writeMockDb(db);
    return true;
  }
}

// 2. BLOG POSTS
export async function getBlogPosts(includeDrafts = false) {
  if (useTurso) {
    await ensureTursoReady();
    const sql = includeDrafts
      ? "SELECT * FROM blog_posts ORDER BY created_at DESC"
      : "SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY created_at DESC";
    const result = await turso.execute(sql);
    return result.rows.map(row => ({
      ...row,
      is_published: Boolean(row.is_published),
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
  } else {
    const db = readMockDb();
    return db.blog_posts.filter(b => includeDrafts || b.is_published);
  }
}

export async function getBlogPostBySlug(slug) {
  if (useTurso) {
    await ensureTursoReady();
    const result = await turso.execute({
      sql: "SELECT * FROM blog_posts WHERE slug = ?",
      args: [slug]
    });
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      ...row,
      is_published: Boolean(row.is_published),
      tags: row.tags ? JSON.parse(row.tags) : []
    };
  } else {
    const db = readMockDb();
    return db.blog_posts.find(b => b.slug === slug) || null;
  }
}

export async function saveBlogPost(post) {
  if (useTurso) {
    await ensureTursoReady();
    const tagsJson = post.tags ? JSON.stringify(post.tags) : "[]";
    if (post.id) {
      await turso.execute({
        sql: `UPDATE blog_posts SET 
              title = ?, slug = ?, content = ?, featured_image = ?, 
              category = ?, tags = ?, author = ?, is_published = ?, published_at = ?
              WHERE id = ?`,
        args: [
          post.title,
          post.slug,
          post.content,
          post.featured_image || null,
          post.category,
          tagsJson,
          post.author,
          post.is_published ? 1 : 0,
          post.published_at || (post.is_published ? new Date().toISOString() : null),
          post.id
        ]
      });
      return post;
    } else {
      const newPost = {
        ...post,
        id: "b_" + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      await turso.execute({
        sql: `INSERT INTO blog_posts (id, title, slug, content, featured_image, category, tags, author, is_published, published_at, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          newPost.id,
          newPost.title,
          newPost.slug,
          newPost.content,
          newPost.featured_image || null,
          newPost.category,
          tagsJson,
          newPost.author,
          newPost.is_published ? 1 : 0,
          newPost.published_at || (newPost.is_published ? new Date().toISOString() : null),
          newPost.created_at
        ]
      });
      return newPost;
    }
  } else {
    const db = readMockDb();
    if (post.id) {
      const index = db.blog_posts.findIndex(b => b.id === post.id);
      if (index !== -1) {
        db.blog_posts[index] = { ...db.blog_posts[index], ...post };
      }
    } else {
      const newPost = {
        ...post,
        id: "b_" + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      db.blog_posts.push(newPost);
      post = newPost;
    }
    writeMockDb(db);
    return post;
  }
}

export async function deleteBlogPost(id) {
  if (useTurso) {
    await ensureTursoReady();
    await turso.execute({
      sql: "DELETE FROM blog_posts WHERE id = ?",
      args: [id]
    });
    return true;
  } else {
    const db = readMockDb();
    db.blog_posts = db.blog_posts.filter(b => b.id !== id);
    writeMockDb(db);
    return true;
  }
}

// 3. INQUIRIES (Contact)
export async function getInquiries() {
  if (useTurso) {
    await ensureTursoReady();
    const result = await turso.execute("SELECT * FROM inquiries ORDER BY created_at DESC");
    return result.rows;
  } else {
    const db = readMockDb();
    return [...db.inquiries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export async function saveInquiry(inquiry) {
  if (useTurso) {
    await ensureTursoReady();
    const newInquiry = {
      ...inquiry,
      id: "i_" + Math.random().toString(36).substr(2, 9),
      status: "unread",
      created_at: new Date().toISOString()
    };
    await turso.execute({
      sql: `INSERT INTO inquiries (id, name, company, email, phone, message, product_interest, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newInquiry.id,
        newInquiry.name,
        newInquiry.company,
        newInquiry.email,
        newInquiry.phone || null,
        newInquiry.message,
        newInquiry.product_interest,
        newInquiry.status,
        newInquiry.created_at
      ]
    });
    return newInquiry;
  } else {
    const db = readMockDb();
    const newInquiry = {
      ...inquiry,
      id: "i_" + Math.random().toString(36).substr(2, 9),
      status: "unread",
      created_at: new Date().toISOString()
    };
    db.inquiries.push(newInquiry);
    writeMockDb(db);
    return newInquiry;
  }
}

export async function updateInquiryStatus(id, status) {
  if (useTurso) {
    await ensureTursoReady();
    await turso.execute({
      sql: "UPDATE inquiries SET status = ? WHERE id = ?",
      args: [status, id]
    });
    const result = await turso.execute({
      sql: "SELECT * FROM inquiries WHERE id = ?",
      args: [id]
    });
    return result.rows[0] || null;
  } else {
    const db = readMockDb();
    const index = db.inquiries.findIndex(i => i.id === id);
    if (index !== -1) {
      db.inquiries[index].status = status;
      writeMockDb(db);
      return db.inquiries[index];
    }
    return null;
  }
}

// 4. QUOTE REQUESTS
export async function getQuoteRequests() {
  if (useTurso) {
    await ensureTursoReady();
    const result = await turso.execute("SELECT * FROM quote_requests ORDER BY created_at DESC");
    return result.rows;
  } else {
    const db = readMockDb();
    return [...db.quote_requests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export async function saveQuoteRequest(request) {
  if (useTurso) {
    await ensureTursoReady();
    const newRequest = {
      ...request,
      id: "q_" + Math.random().toString(36).substr(2, 9),
      status: "pending",
      created_at: new Date().toISOString()
    };
    await turso.execute({
      sql: `INSERT INTO quote_requests (id, product_id, product_name, name, company, email, phone, quantity, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newRequest.id,
        newRequest.product_id || null,
        newRequest.product_name,
        newRequest.name,
        newRequest.company,
        newRequest.email,
        newRequest.phone || null,
        newRequest.quantity,
        newRequest.message || null,
        newRequest.status,
        newRequest.created_at
      ]
    });
    return newRequest;
  } else {
    const db = readMockDb();
    const newRequest = {
      ...request,
      id: "q_" + Math.random().toString(36).substr(2, 9),
      status: "pending",
      created_at: new Date().toISOString()
    };
    db.quote_requests.push(newRequest);
    writeMockDb(db);
    return newRequest;
  }
}

export async function updateQuoteRequestStatus(id, status) {
  if (useTurso) {
    await ensureTursoReady();
    await turso.execute({
      sql: "UPDATE quote_requests SET status = ? WHERE id = ?",
      args: [status, id]
    });
    const result = await turso.execute({
      sql: "SELECT * FROM quote_requests WHERE id = ?",
      args: [id]
    });
    return result.rows[0] || null;
  } else {
    const db = readMockDb();
    const index = db.quote_requests.findIndex(q => q.id === id);
    if (index !== -1) {
      db.quote_requests[index].status = status;
      writeMockDb(db);
      return db.quote_requests[index];
    }
    return null;
  }
}

// 5. SITE SETTINGS
export async function getSiteSettings() {
  if (useTurso) {
    await ensureTursoReady();
    const result = await turso.execute("SELECT * FROM site_settings WHERE id = 'default'");
    if (result.rows.length === 0) {
      return initialMockData.site_settings;
    }
    return result.rows[0];
  } else {
    const db = readMockDb();
    return db.site_settings || initialMockData.site_settings;
  }
}

export async function saveSiteSettings(settings) {
  if (useTurso) {
    await ensureTursoReady();
    const currentSettings = await getSiteSettings();
    const newSettings = { ...currentSettings, ...settings };
    await turso.execute({
      sql: `INSERT OR REPLACE INTO site_settings (
            id, hero_title, hero_subtitle, hero_cta_text, hero_cta_link, 
            business_address, business_phone, business_email, 
            social_facebook, social_twitter, social_instagram, social_linkedin, updated_at
          ) VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newSettings.hero_title,
        newSettings.hero_subtitle,
        newSettings.hero_cta_text,
        newSettings.hero_cta_link,
        newSettings.business_address,
        newSettings.business_phone,
        newSettings.business_email,
        newSettings.social_facebook || null,
        newSettings.social_twitter || null,
        newSettings.social_instagram || null,
        newSettings.social_linkedin || null,
        new Date().toISOString()
      ]
    });
    return newSettings;
  } else {
    const db = readMockDb();
    db.site_settings = { ...db.site_settings, ...settings };
    writeMockDb(db);
    return db.site_settings;
  }
}

export function isUsingTurso() {
  return useTurso;
}
