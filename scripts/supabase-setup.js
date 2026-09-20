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

const allowedCollectionIds = ["col_ground_spices", "col_pink_salt", "col_herbs_leaves"];

const initialCollections = [
  {
    id: "col_ground_spices",
    name: "Pure Ground Spices",
    slug: "pure-ground-spices",
    category: "Powder",
    description: "100% unadulterated ground spices slow-milled to retain rich natural aroma, deep authentic color, and essential volatile oils.",
    image_url: "/images/turmeric_mortar.png",
    is_featured: true
  },
  {
    id: "col_pink_salt",
    name: "Himalayan Pink Salt",
    slug: "himalayan-pink-salt",
    category: "Salt",
    description: "100% natural, unrefined mineral-rich edible rock salt directly from the Khewra Salt Range in Pakistan.",
    image_url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
    is_featured: true
  },
  {
    id: "col_herbs_leaves",
    name: "Herbs & Aromatic Leaves",
    slug: "herbs-aromatic-leaves",
    category: "Herbs",
    description: "Sun-shade dried fragrant Kasuri Methi cleaned and packaged to lock in authentic aroma.",
    image_url: "/images/Methi Featured Product Image.jpg",
    is_featured: true
  }
];

const allowedProductIds = [
  "p_kasuri_methi_02",
  "p_himalayan_salt_01",
  "p_red_chilli_05",
  "p_garlic_powder_04",
  "p_turmeric_haldi_03"
];

const initialProducts = [
  {
    id: "p_kasuri_methi_02",
    name: "Premium Kasuri Methi (Dried Fenugreek Leaves)",
    category: "Herbs",
    collection: "Herbs & Aromatic Leaves",
    description: "Authentic, sun-shade dried Kasuri Methi grown in the fertile agricultural fields of Kasur, Punjab. Known worldwide for its distinctive aromatic sweetness and vivid natural green color. Destoned, Sortex machine-cleaned, and 100% free from dust, sand, or stem debris.",
    price_moq: "PKR 850 / kg (MOQ: 100kg)",
    packaging_info: "10kg / 20kg moisture-lock corrugated master cartons with inner poly-barrier liner",
    image_url: "/images/Methi Featured Product Image.jpg",
    is_visible: true,
    specifications: {
      "Origin": "Kasur, Punjab, Pakistan",
      "Purity": "Sortex Cleaned (99.5%)",
      "Moisture": "<7.0%",
      "Extraneous Matter": "<0.5%",
      "Aroma": "Intense Sweet Botanical"
    }
  },
  {
    id: "p_himalayan_salt_01",
    name: "Pure Himalayan Pink Salt (Fine Grain & Coarse Crystal)",
    category: "Salt",
    collection: "Himalayan Pink Salt",
    description: "100% natural, unrefined mineral-rich pink rock salt extracted directly from the ancient Khewra Salt Range in Pakistan. Contains 84+ natural trace minerals with zero anti-caking chemicals, artificial additives, or bleaching agents. Ideal for food manufacturers, commercial hospitality, and private-label retail.",
    price_moq: "PKR 120 / kg (MOQ: 500kg)",
    packaging_info: "25kg / 50kg poly-woven moisture-barrier bags or 1 MT bulk jumbo bags",
    image_url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: {
      "Origin": "Khewra Salt Mines, Pakistan",
      "Purity (NaCl)": ">98.5%",
      "Moisture": "<0.2%",
      "Grind Grades": "Fine Table & Coarse Crystal",
      "Additives": "0% (Zero Chemicals)"
    }
  },
  {
    id: "p_red_chilli_05",
    name: "Kunri Red Chilli Powder (Stemless Lal Mirch)",
    category: "Powder",
    collection: "Pure Ground Spices",
    description: "Vibrant crimson red chilli ground from select stemless sun-dried chillies sourced directly from Kunri, Sindh—the red chilli hub of Asia. Delivers balanced culinary heat, deep natural color, and zero artificial dyes, added oil, or brick dust adulterants.",
    price_moq: "PKR 800 / kg (MOQ: 200kg)",
    packaging_info: "25kg double-walled poly-woven bags with food-grade moisture-barrier liner",
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: {
      "Origin": "Kunri, Sindh, Pakistan",
      "Heat Level": "35,000 - 45,000 SHU",
      "Color Value": "100 - 120 ASTA",
      "Moisture": "<8.5%",
      "Purity": "100% Pure (No Dyes)"
    }
  },
  {
    id: "p_garlic_powder_04",
    name: "Pure Dehydrated Garlic Powder & Granules (Lehsan)",
    category: "Powder",
    collection: "Pure Ground Spices",
    description: "100% pure dehydrated garlic powder ground from sound, peeled cloves with no added starches, anti-caking chemicals, or preservatives. Delivers sharp, pungent aroma and high natural allicin flavor for seasoning blends, marinades, sauces, and snack coating.",
    price_moq: "PKR 750 / kg (MOQ: 150kg)",
    packaging_info: "20kg vacuum-sealed aluminum foil barrier liner inside export-grade master carton",
    image_url: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: {
      "Origin": "Pakistan",
      "Moisture": "<6.0%",
      "Allicin Potential": ">0.3%",
      "Mesh Size": "60-80 Mesh / Granules",
      "Additives": "None (100% Pure)"
    }
  },
  {
    id: "p_turmeric_haldi_03",
    name: "Pure Ground Turmeric Powder (Haldi)",
    category: "Powder",
    collection: "Pure Ground Spices",
    description: "Bright, rich golden-yellow turmeric powder slow-milled from select cured finger rhizomes. Naturally high curcumin content delivers intense authentic color and warm earthy aroma. Certified 100% free from lead chromate, metanil yellow, or starch fillers.",
    price_moq: "PKR 650 / kg (MOQ: 200kg)",
    packaging_info: "25kg multi-ply paper sacks with polyethylene food-grade inner barrier liner",
    image_url: "/images/turmeric_mortar.png",
    is_visible: true,
    specifications: {
      "Origin": "Punjab, Pakistan",
      "Curcumin Content": ">3.8%",
      "Mesh Size": "80-100 Mesh",
      "Moisture": "<9.0%",
      "Purity": "100% Pure Turmeric"
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
  await supabase.from("site_settings").upsert({
    id: "default",
    business_phone: "+92 3286828006",
    business_email: "sales@thesevenspice.com",
    business_address: "Plot 42, Port Qasim Industrial Area, Karachi, Pakistan",
    whatsapp_number: "+923286828006",
    whatsapp_message: "Hello TheSevenSpice, I would like to inquire about wholesale bulk spices.",
    hero_title: "Premium Pakistani Spices for Global Food Manufacturers & Importers",
    hero_subtitle: "Export-quality spices, herbs, and seasoning ingredients supplied in bulk with consistent quality, competitive pricing, and worldwide container shipments.",
    hero_cta_text: "Request Wholesale Quote",
    hero_cta_link: "/contact",
    hero_secondary_cta_text: "Explore Our Products",
    hero_secondary_cta_link: "/products",
    deal_headline_enabled: false,
    deal_headline_badge: "Special Wholesale Rate",
    deal_headline_text: "Special volume discounts available on bulk wholesale orders over 1,000kg.",
    deal_headline_link: "/contact",
    deal_headline_link_text: "Inquire Now",
    updated_at: new Date().toISOString()
  });

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

  // 3. Products Cleanup & Upsert (Methi, Pink Salt, Red Chilli, Garlic, Haldi ONLY)
  console.log("Cleaning up and upserting the 5 correct products...");
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

  console.log("✅ Supabase sync completed successfully with the 5 exact products!");
}

seed().catch(err => {
  console.error("Supabase sync error:", err);
  process.exit(1);
});
