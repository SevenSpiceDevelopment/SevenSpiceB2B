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

const initialProducts = [
  {
    id: "p_saffron_01",
    name: "Premium Grade Kashmiri Saffron",
    category: "Spices",
    collection: "Signature Kashmir Harvest",
    description: "Hand-harvested Grade A Kashmiri Mongra Saffron, known for deep crimson threads, potent aroma, and high safranal content.",
    price_moq: "$8.50 / gram (MOQ: 500g)",
    packaging_info: "Glass vials or 10g/50g/100g tin caddies",
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: { "Crocin Content": ">240 (ISO Category I)", "Moisture": "<10%", "Origin": "Pampore, Kashmir" }
  },
  {
    id: "p_peppercorn_02",
    name: "Whole Tellicherry Black Peppercorns",
    category: "Spices",
    collection: "Tellicherry & Kerala Estates",
    description: "Sun-cured TGSEB (Tellicherry Garbled Special Extra Bold) peppercorns, rich in piperine with robust pungent warmth.",
    price_moq: "$4.20 / kg (MOQ: 200kg)",
    packaging_info: "Double-walled kraft paper sacks (25kg)",
    image_url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: { "Density": "580+ g/L", "Piperine": ">5.5%", "Origin": "Malabar Coast, India" }
  },
  {
    id: "p_cinnamon_03",
    name: "Organic Ceylon Cinnamon Quills",
    category: "Spices",
    collection: "Ceylon Pure Botanicals",
    description: "Authentic true Ceylon cinnamon sticks (Grade C5 Special) with sweet delicate fragrance and ultra-low coumarin.",
    price_moq: "$11.00 / kg (MOQ: 100kg)",
    packaging_info: "Vacuum-sealed inner, export grade master cartons (20kg)",
    image_url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: { "Coumarin": "<0.004%", "Volatile Oil": ">2.5%", "Origin": "Matara, Sri Lanka" }
  },
  {
    id: "p_basil_04",
    name: "Sun-Dried Egyptian Sweet Basil",
    category: "Herbs",
    collection: "Mediterranean & Nile Herbs",
    description: "Crushed Egyptian sweet basil leaves, shade-cured to preserve essential oils and vivid green pigmentation.",
    price_moq: "$5.80 / kg (MOQ: 150kg)",
    packaging_info: "Compressed PP woven bags with PE liner (15kg)",
    image_url: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: { "Essential Oil": ">0.8%", "Moisture": "<8%", "Origin": "Beni Suef, Egypt" }
  },
  {
    id: "p_cardamom_05",
    name: "Premium Whole Green Cardamom Pods",
    category: "Spices",
    collection: "Tellicherry & Kerala Estates",
    description: "Plump 8mm+ jumbo green cardamom pods with intense camphor-citrus aromatics, sourced directly from Idukki high-ranges.",
    price_moq: "$18.50 / kg (MOQ: 100kg)",
    packaging_info: "Vacuum packed foil bags inside master cartons (20kg)",
    image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: { "Pod Size": "8mm+ Bold", "Volatile Oil": ">7.0%", "Origin": "Idukki, Kerala" }
  },
  {
    id: "p_turmeric_06",
    name: "Organic Ground Turmeric (High Curcumin)",
    category: "Powder",
    collection: "High-Curcumin Ground Roots",
    description: "Pure ground turmeric root standardized to >5.5% curcumin content, micro-pulverized for optimal industrial dispersion.",
    price_moq: "$3.90 / kg (MOQ: 250kg)",
    packaging_info: "Multi-ply poly-lined paper sacks (25kg)",
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    specifications: { "Curcumin": ">5.5%", "Mesh Size": "80-100 Mesh", "Origin": "Alleppey, India" }
  }
];

const initialCollections = [
  {
    id: "c1",
    name: "Signature Kashmir Harvest",
    slug: "signature-kashmir-harvest",
    category: "Spices",
    description: "Prestigious single-origin Himalayan and Kashmir valley spices with high essential volatile content.",
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
    is_featured: true
  },
  {
    id: "c2",
    name: "Tellicherry & Kerala Estates",
    slug: "tellicherry-kerala-estates",
    category: "Spices",
    description: "Sun-cured whole peppercorns and bold green cardamom directly from southern mountain estates.",
    image_url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800",
    is_featured: true
  },
  {
    id: "c3",
    name: "Ceylon Pure Botanicals",
    slug: "ceylon-pure-botanicals",
    category: "Spices",
    description: "Certified true Ceylon cinnamon quills and aromatic tree barks sourced from sustainable plantations.",
    image_url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800",
    is_featured: true
  },
  {
    id: "c4",
    name: "Mediterranean & Nile Herbs",
    slug: "mediterranean-nile-herbs",
    category: "Herbs",
    description: "Shade-dried sweet basil, oregano, and fragrant leafy herbs preserving vivid color and natural aroma.",
    image_url: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&q=80&w=800",
    is_featured: true
  },
  {
    id: "c5",
    name: "High-Curcumin Ground Roots",
    slug: "high-curcumin-ground-roots",
    category: "Powder",
    description: "Micro-pulverized turmeric and botanical root powders tested for maximum curcumin and bioavailability.",
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
    is_featured: true
  }
];

const initialBlogPosts = [
  {
    id: "b1",
    title: "Sourcing Grade A Saffron: A B2B Buyer's Guide",
    slug: "sourcing-grade-a-saffron-b2b-buyers-guide",
    content: "<p>Saffron is the world's most valuable culinary spice, and navigating the complexities of its global trade requires rigorous quality verification standards.</p><h2>Understanding ISO 3632 Standards</h2><p>ISO 3632 specifies chemical testing methods for three key qualities: Crocin (coloring strength), Picrocrocin (flavor), and Safranal (aroma). Category I requires Crocin > 200.</p>",
    featured_image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
    category: "Industry Insights",
    tags: ["Sourcing", "Quality Control", "Saffron"],
    author: "Imran Al-Habib, Sourcing Director",
    is_published: true,
    published_at: new Date().toISOString()
  },
  {
    id: "b2",
    title: "The Spice Logistics Playbook: Reducing Transit Spoilage",
    slug: "spice-logistics-playbook-reducing-transit-spoilage",
    content: "<p>Essential volatile oils in spices degrade rapidly when exposed to humidity and temperature swings during ocean freight transit.</p><h2>Key Control Measures</h2><p>1. Moisture barrier packaging with multi-wall polyethylene liners.<br>2. Active desiccants inside shipping containers.</p>",
    featured_image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    category: "Logistics",
    tags: ["Supply Chain", "Export Logistics", "Quality"],
    author: "Elena Rostova, VP Supply Chain",
    is_published: true,
    published_at: new Date().toISOString()
  }
];

async function seed() {
  console.log("Checking and seeding Supabase tables...");

  // Seed Site Settings
  const { data: settingsData } = await supabase.from("site_settings").select("id").eq("id", "default");
  if (!settingsData || settingsData.length === 0) {
    console.log("Seeding default site settings...");
    await supabase.from("site_settings").insert({
      id: "default",
      business_phone: "+92 3286828006",
      business_email: "sales@thesevenspice.com",
      business_address: "Plot 42, Port Qasim Industrial Area, Karachi, Pakistan",
      whatsapp_number: "+923286828006",
      whatsapp_message: "Hello Seven Spices, I would like to inquire about wholesale bulk spices.",
      hero_title: "Direct-from-Origin Premium B2B Wholesale Spices & Logistics",
      hero_subtitle: "Supplying high-grade wholesale whole seeds, ground spices, and single-origin botanicals directly to commercial food manufacturers."
    });
  }

  // Seed Collections
  const { data: colData } = await supabase.from("collections").select("id");
  if (!colData || colData.length === 0) {
    console.log("Seeding collections...");
    await supabase.from("collections").insert(initialCollections);
  }

  // Seed Products
  const { data: prodData } = await supabase.from("products").select("id");
  if (!prodData || prodData.length === 0) {
    console.log("Seeding products...");
    await supabase.from("products").insert(initialProducts);
  }

  // Seed Blog Posts
  const { data: blogData } = await supabase.from("blog_posts").select("id");
  if (!blogData || blogData.length === 0) {
    console.log("Seeding blog posts...");
    await supabase.from("blog_posts").insert(initialBlogPosts);
  }

  console.log("Supabase setup and verification complete!");
}

seed().catch(err => {
  console.error("Supabase seed error:", err.message);
});
