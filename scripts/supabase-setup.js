const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

console.log(`Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

const allowedCollectionIds = ["col_dried_herbs", "col_salts", "col_ground_spices"];

const initialCollections = [
  {
    id: "col_dried_herbs",
    name: "Dried Herbs",
    slug: "dried-herbs",
    category: "Herbs",
    description: "Sun-shade dried fragrant Kasuri Methi and botanical herbs cleaned and packaged to preserve authentic aroma.",
    image_url: "/images/Methi Featured Product Image.jpg",
    is_featured: true
  },
  {
    id: "col_salts",
    name: "Salts",
    slug: "salts",
    category: "Spices",
    description: "100% natural, unrefined mineral-rich edible rock salt directly from the ancient Khewra Salt Range in Pakistan.",
    image_url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
    is_featured: true
  },
  {
    id: "col_ground_spices",
    name: "Ground Spices",
    slug: "ground-spices",
    category: "Powder",
    description: "100% pure ground turmeric and garlic powders slow-milled to retain rich natural aroma, color, and volatile oils.",
    image_url: "/images/turmeric_mortar.png",
    is_featured: true
  }
];

const allowedProductIds = [
  "p_kasuri_methi_02",
  "p_himalayan_salt_01",
  "p_turmeric_haldi_03",
  "p_garlic_powder_04"
];

const initialProducts = [
  {
    id: "p_kasuri_methi_02",
    name: "Methi Leaves",
    category: "Herbs",
    collection: "Dried Herbs",
    description: `Seven Spice Methi Leaves are carefully selected fenugreek leaves valued for their distinctive aroma, earthy character, and traditional culinary appeal. Methi, also known as fenugreek, is widely used in South Asian, Middle Eastern, and international food applications where an authentic herbal aroma and characteristic flavor are required.

Our methi leaves are suitable for commercial food production, spice blending, seasoning formulations, restaurants, catering businesses, food service companies, wholesalers, and distributors. The product can be incorporated into a wide range of applications, including curry seasonings, ready-to-cook products, spice mixes, sauces, savory snacks, bakery applications, and traditional culinary preparations.

For B2B buyers, consistent product quality is an important part of reliable spice and herb sourcing. Seven Spice focuses on careful product selection and handling to help buyers maintain dependable quality across their supply requirements. Methi leaves can be supplied according to agreed commercial specifications, packaging requirements, and order quantities.`,
    price_moq: "Custom B2B Quotation (MOQ: 100 kg)",
    packaging_info: "10kg / 20kg moisture-lock corrugated master cartons with food-grade poly liner or customized packing",
    image_url: "/images/Methi Featured Product Image.jpg",
    is_visible: true,
    specifications: {
      "slug": "methi-leaves",
      "seo_title": "Premium Methi Leaves Supplier | Fenugreek Leaves for Bulk & B2B",
      "meta_description": "Source premium methi leaves and dried fenugreek leaves for food manufacturing, spice blending, restaurants, wholesalers, and bulk B2B requirements from Seven Spice.",
      "primary_keyword": "Methi Leaves",
      "secondary_keywords": "Fenugreek Leaves, Dried Methi Leaves, Kasuri Methi, Dried Fenugreek, Methi Supplier, Fenugreek Leaves Supplier, Bulk Methi Leaves, Methi Exporter, B2B Herbs Supplier"
    }
  },
  {
    id: "p_himalayan_salt_01",
    name: "Himalayan Pink Salt",
    category: "Spices",
    collection: "Salts",
    description: `Seven Spice Himalayan Pink Salt is a naturally distinctive salt recognized for its characteristic pink-to-rose color and crystalline appearance. It is widely used in food preparation, seasoning products, spice blends, food processing, restaurants, hospitality, and retail packaging.

Our Himalayan Pink Salt is a versatile ingredient for businesses looking for a reliable bulk salt supply. It can be used as a standalone seasoning or incorporated into customized seasoning blends, spice mixes, snack seasonings, processed food formulations, and other commercial food applications.

The natural color and recognizable appearance of pink salt have also made it a popular ingredient for specialty food products and consumer-facing packaged products. For commercial buyers, Seven Spice can work with customers on appropriate product specifications, quantities, and packaging requirements based on their intended application.

We understand that B2B buyers require more than a product name. Consistent sourcing, clear specifications, suitable packaging, dependable communication, and scalable supply are important considerations when selecting a spice and ingredient supplier. Seven Spice is positioned to support wholesalers, distributors, food processors, restaurants, seasoning manufacturers, and other commercial buyers looking for Himalayan pink salt.`,
    price_moq: "Custom B2B Quotation (MOQ: 500 kg)",
    packaging_info: "25kg / 50kg poly-woven moisture-barrier bags or 1 MT bulk jumbo bags",
    image_url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: {
      "slug": "himalayan-pink-salt",
      "seo_title": "Himalayan Pink Salt Supplier | Bulk Pink Salt for B2B Buyers",
      "meta_description": "Buy quality Himalayan Pink Salt in bulk from Seven Spice. Suitable for food manufacturers, seasoning companies, restaurants, wholesalers, distributors, and commercial applications.",
      "primary_keyword": "Himalayan Pink Salt",
      "secondary_keywords": "Pink Salt, Himalayan Salt Supplier, Pink Himalayan Salt, Bulk Pink Salt, Himalayan Pink Salt Supplier, Pink Salt Exporter, Wholesale Pink Salt, B2B Salt Supplier, Food Grade Pink Salt"
    }
  },
  {
    id: "p_turmeric_haldi_03",
    name: "Turmeric Powder (Haldi)",
    category: "Powder",
    collection: "Ground Spices",
    description: `Seven Spice Turmeric Powder is a finely ground spice made from carefully selected turmeric roots. Known for its vibrant golden-yellow appearance and characteristic earthy aroma, turmeric is one of the most widely used spices in South Asian cuisine and an important ingredient in commercial spice and food formulations.

Our turmeric powder, commonly known as haldi powder, is suitable for food manufacturers, spice companies, seasoning producers, restaurants, wholesalers, distributors, caterers, and commercial kitchens. It can be used as a standalone culinary spice or as an ingredient in customized spice blends and food formulations.

Turmeric is commonly incorporated into curry powders, seasoning mixes, sauces, marinades, ready-to-cook foods, savory products, and traditional culinary preparations. Its distinctive color and flavor make it an important component of many spice blends and food products.

For B2B buyers, sourcing consistency and product specifications are essential. Seven Spice provides turmeric powder for commercial requirements and can discuss appropriate specifications, packaging formats, order quantities, and supply arrangements according to the buyer's application.`,
    price_moq: "Custom B2B Quotation (MOQ: 200 kg)",
    packaging_info: "25kg multi-ply paper sacks with polyethylene food-grade inner barrier liner",
    image_url: "/images/turmeric_mortar.png",
    is_visible: true,
    specifications: {
      "slug": "turmeric-powder",
      "seo_title": "Turmeric Powder Supplier | Premium Haldi Powder in Bulk | Seven Spice",
      "meta_description": "Source premium turmeric powder (haldi) in bulk from Seven Spice for food manufacturers, spice blenders, restaurants, wholesalers, distributors, and B2B food applications.",
      "primary_keyword": "Turmeric Powder",
      "secondary_keywords": "Haldi Powder, Turmeric Supplier, Turmeric Powder Supplier, Bulk Turmeric Powder, Wholesale Turmeric Powder, Ground Turmeric, Turmeric Exporter, B2B Turmeric Supplier, Food Grade Turmeric"
    }
  },
  {
    id: "p_garlic_powder_04",
    name: "Garlic Powder",
    category: "Powder",
    collection: "Ground Spices",
    description: `Seven Spice Garlic Powder is a finely processed garlic ingredient designed for convenient use across a wide range of food and seasoning applications. With its characteristic savory garlic aroma and flavor, garlic powder provides food manufacturers and commercial kitchens with a practical way to incorporate garlic into consistent recipes and formulations.

Our garlic powder is suitable for food manufacturers, seasoning companies, spice blenders, restaurants, catering businesses, wholesalers, distributors, and food-service suppliers. It can be used as a standalone seasoning or combined with other ingredients to create customized spice blends and seasoning formulations.

Garlic powder is commonly used in snack seasonings, sauces, marinades, meat and poultry seasonings, soups, savory mixes, ready-to-cook foods, spice blends, and a variety of processed food products. Its powdered format makes it particularly convenient for applications where uniform distribution and easy handling are important.

For B2B customers, Seven Spice can support commercial sourcing requirements with product specifications and packaging arrangements based on the intended application and order volume. Buyers can discuss their requirements with our sales team to determine suitable specifications for their manufacturing, distribution, or food-service needs.`,
    price_moq: "Custom B2B Quotation (MOQ: 150 kg)",
    packaging_info: "20kg vacuum-sealed aluminum foil barrier liner inside export-grade master carton",
    image_url: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: {
      "slug": "garlic-powder",
      "seo_title": "Garlic Powder Supplier | Bulk Garlic Powder for Food Manufacturers",
      "meta_description": "Buy quality garlic powder in bulk from Seven Spice for seasoning, food manufacturing, sauces, snacks, restaurants, wholesalers, distributors, and commercial B2B applications.",
      "primary_keyword": "Garlic Powder",
      "secondary_keywords": "Garlic Powder Supplier, Bulk Garlic Powder, Wholesale Garlic Powder, Ground Garlic, Garlic Seasoning, Garlic Powder Exporter, B2B Garlic Supplier, Food Grade Garlic Powder, Commercial Garlic Powder"
    }
  }
];

const initialBlogPosts = [
  {
    id: "b_spice_purity",
    title: "How Commercial Kitchens Test Spice Purity",
    slug: "how-commercial-kitchens-test-spice-purity",
    content: "<p>In commercial food production, spice adulteration poses severe risks to flavor consistency and brand reputation. Artificial colors in red chilli and synthetic fillers in turmeric can ruin recipes.</p><h2>The Simple Warm Water Test for Turmeric</h2><p>Place a teaspoon of turmeric powder into a glass of warm water without stirring. Pure turmeric will settle to the bottom and leave the water clear and faintly yellow. If the water instantly turns cloudy bright yellow or orange, chemical dyes have likely been added.</p><h2>Checking Red Chilli for Added Dye</h2><p>Sprinkle a pinch of red chilli powder across a cup of water. Pure chilli floats and gradually sinks without leaving color streaks. Adulterated chilli with artificial water-soluble dye will instantly leave bright red trails in the water.</p>",
    featured_image: "/images/turmeric_mortar.png",
    category: "Quality & Testing",
    tags: ["Purity", "Quality Control", "Turmeric", "Red Chilli"],
    author: "TheSevenSpice Quality Assurance Desk",
    is_published: true,
    published_at: new Date().toISOString()
  },
  {
    id: "b_sourcing_pakistan",
    title: "From Kunri to Khewra: Sourcing Pakistan's Finest Spices",
    slug: "from-kunri-to-khewra-sourcing-pakistans-finest-spices",
    content: "<p>Pakistan is blessed with some of the world's most fertile spice cultivation regions. Kunri in Sindh produces some of Asia's most sought-after red chillies, while Kasur in Punjab yields uniquely sweet, intensely aromatic fenugreek leaves.</p><h2>Why Direct Farm Partnerships Matter</h2><p>When B2B suppliers skip intermediary trading brokers and work directly with agricultural farming cooperatives, crops are delivered immediately following harvest. This guarantees maximum volatile oil retention, lower moisture, and genuine unadulterated quality for food processors.</p>",
    featured_image: "/images/Methi Featured Product Image.jpg",
    category: "Sourcing & Logistics",
    tags: ["Sourcing", "Pakistan", "Kasuri Methi", "Kunri Chilli"],
    author: "Sourcing Director, TheSevenSpice",
    is_published: true,
    published_at: new Date().toISOString()
  }
];

async function seed() {
  console.log("Starting Supabase database sync...");

  // 1. Site Settings
  console.log("Upserting site settings...");
  const { data: existingSettings } = await supabase.from("site_settings").select("id").limit(1);
  if (!existingSettings || existingSettings.length === 0) {
    await supabase.from("site_settings").insert({
      id: "default",
      hero_title: "Premium Pakistani Spices for Global Food Manufacturers & Importers",
      hero_subtitle: "Export-quality spices, herbs, and seasoning ingredients supplied in bulk with consistent quality, competitive pricing, and worldwide container shipments.",
      business_phone: "+92 3286828006",
      business_email: "sales@thesevenspice.com",
      business_address: "Plot 42, Port Qasim Industrial Area, Karachi, Pakistan",
      whatsapp_number: "+923286828006",
      whatsapp_message: "Hello TheSevenSpice, I would like to inquire about wholesale bulk spices.",
      deal_headline_enabled: false,
      marquee_ticker_enabled: true
    });
  }

  // 2. Collections Cleanup & Upsert
  console.log("Cleaning up and upserting collections...");
  const { data: existingCollections } = await supabase.from("collections").select("id");
  if (existingCollections && existingCollections.length > 0) {
    const toDeleteCollections = existingCollections
      .map(c => c.id)
      .filter(id => !allowedCollectionIds.includes(id));
    if (toDeleteCollections.length > 0) {
      console.log(`Removing ${toDeleteCollections.length} old collections:`, toDeleteCollections);
      await supabase.from("collections").delete().in("id", toDeleteCollections);
    }
  }

  for (const col of initialCollections) {
    await supabase.from("collections").upsert(col);
  }

  // 3. Products Cleanup & Upsert
  console.log("Cleaning up and upserting the 4 exact products...");
  const { data: existingProducts } = await supabase.from("products").select("id");
  if (existingProducts && existingProducts.length > 0) {
    const toDeleteProducts = existingProducts
      .map(p => p.id)
      .filter(id => !allowedProductIds.includes(id));
    if (toDeleteProducts.length > 0) {
      console.log(`Removing ${toDeleteProducts.length} extraneous products:`, toDeleteProducts);
      await supabase.from("products").delete().in("id", toDeleteProducts);
    }
  }

  for (const prod of initialProducts) {
    await supabase.from("products").upsert(prod);
  }

  // 4. Blog Posts
  console.log("Upserting blog posts...");
  for (const blog of initialBlogPosts) {
    await supabase.from("blog_posts").upsert(blog);
  }

  console.log("✅ Supabase sync completed successfully with the 4 exact products!");
}

seed().catch(err => {
  console.error("Supabase sync error:", err);
  process.exit(1);
});
