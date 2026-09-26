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
    id: "p_garlic_powder_04",
    name: "Garlic Powder",
    category: "Powder",
    collection: "Ground Spices",
    price_moq: "Custom B2B Quotation (MOQ: 150 kg)",
    packaging_info: "20kg / 25kg vacuum-sealed aluminum foil barrier liner inside export-grade master carton",
    image_url: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    description: `Seven Spice Garlic Powder is a finely processed, premium-grade dehydrated garlic ingredient engineered for reliable performance across high-volume food processing and commercial seasoning applications. Produced from freshly harvested, sorted garlic cloves, it delivers the pungent aroma and rich savory profile of fresh garlic in a shelf-stable, free-flowing format.

Our garlic powder provides industrial kitchens, spice blenders, and food manufacturers with a practical, cost-effective method to achieve uniform garlic distribution without the moisture variability or labor overhead of fresh bulbs. It blends seamlessly with dry seasonings, marinades, batters, and liquid emulsions.

## Commercial Applications
Garlic powder is widely utilized across commercial food sectors, including:
- Dry rubs, seasoning blends, and artisan spice mixes
- Extruded snack seasonings and savory chip coatings
- Prepared sauces, dressings, gravies, and marinades
- Processed meat formulations, sausages, and poultry brines
- Soups, bouillon cubes, and instant noodle seasonings
- Ready-to-cook meals, frozen foods, and bakery doughs
- Commercial catering, restaurant chains, and central commissary kitchens
- Wholesale ingredient repackaging and food service distribution

## Why Choose Seven Spice Garlic Powder?
- 100% pure dehydrated garlic with zero fillers, starches, or artificial flavorings
- Controlled low-temperature dehydration preserves natural allicin and volatile aroma compounds
- Uniform granulation (80–100 Mesh) prevents dusting while ensuring rapid dissolution
- Low moisture content (< 6.0%) prevents caking and extends commercial shelf life to 24 months
- Stringent Sortex optical cleaning and magnetic separation prior to pulverization
- Full export batch documentation: Certificate of Analysis (COA), Phytosanitary, and Halal certification
- Heavy-duty export packaging with multi-layer moisture-barrier foil protection
- Flexible supply terms supporting palletized orders up to full 20ft / 40ft container loads

## Commercial Sourcing & Wholesale Orders
Seven Spice accommodates tailored commercial sourcing requirements based on buyer volume and target application. Standard export packaging is supplied in 20 kg or 25 kg multi-wall cartons with heat-sealed vacuum foil inner liners. Private labeling, custom bag sizes, and container palletization can be coordinated upon request.`,
    specifications: {
      slug: "garlic-powder",
      seo_title: "Garlic Powder Supplier | Bulk Garlic Powder for Food Manufacturers",
      meta_description: "Buy premium export-grade garlic powder in bulk from Seven Spice. 100% pure dehydrated garlic for food manufacturing, seasoning blends, sauces, and wholesale distribution.",
      primary_keyword: "Garlic Powder",
      secondary_keywords: "Garlic Powder Supplier, Bulk Garlic Powder, Wholesale Garlic Powder, Ground Garlic, Garlic Seasoning, Garlic Powder Exporter, B2B Garlic Supplier, Food Grade Garlic Powder, Commercial Garlic Powder",
      botanical_name: "Allium sativum",
      origin: "Pakistan",
      form: "Fine Free-Flowing Dehydrated Powder",
      mesh_size: "80 – 100 Mesh",
      moisture: "Max 6.0%",
      color: "Off-White to Cream / Light Tan",
      flavor_aroma: "Characteristic pungent, sharp, savory garlic",
      foreign_matter: "Nil (Optical Sortex & Magnet Cleaned)",
      shelf_life: "24 Months (dry, cool, sealed storage)",
      packaging: "20kg / 25kg vacuum-sealed aluminum foil barrier liner inside export-grade master carton",
      lead_time: "7 – 14 Business Days",
      certifications: "100% Halal, HACCP & ISO 22000 compliant"
    }
  },
  {
    id: "p_turmeric_haldi_03",
    name: "Turmeric Powder (Haldi)",
    category: "Powder",
    collection: "Ground Spices",
    price_moq: "Custom B2B Quotation (MOQ: 200 kg)",
    packaging_info: "25kg multi-ply paper sacks with polyethylene food-grade inner barrier liner",
    image_url: "/images/turmeric_mortar.png",
    is_visible: true,
    description: `Seven Spice Turmeric Powder is a premium golden spice produced from select, mature turmeric rhizomes (Curcuma longa). Celebrated for its brilliant natural coloration, earthy warmth, and distinctive aromatic pungency, our turmeric is slow-milled under strict temperature controls to prevent the thermal evaporation of delicate curcuminoids and essential volatile oils.

Our turmeric powder is an indispensable ingredient for global food manufacturers, curry blend producers, snack processors, and commercial kitchens. It functions both as an authentic aromatic spice and as a natural coloring agent, adding rich depth and golden vibrancy to prepared food formulations.

Seven Spice guarantees 100% botanical purity. Our turmeric is rigorously tested and free from synthetic colorants (such as Metanil yellow or Sudan dyes), lead chromate, chalk, or foreign starches, making it fully compliant with stringent international food safety standards.

## Commercial Applications
Our turmeric powder is formulated for demanding commercial uses:
- Authentic curry powder manufacturing and custom masala blending
- Ready-to-cook gravies, simmer sauces, and culinary marinades
- Savory snack coatings, extruded snacks, and puffed crisp seasonings
- Pickling brines, relishes, chutneys, and mustard preparations
- Institutional catering, industrial kitchens, and hospitality supply
- Private-label retail spice packaging and brand distribution
- Health and functional food preparations, golden latte blends, and dietary botanicals
- Industrial food manufacturing and global bulk commodity export

## Why Choose Seven Spice Turmeric Powder?
- Milled exclusively from hand-sorted, unadulterated dried whole turmeric fingers
- Naturally elevated curcumin content (3.0% – 4.5%) ensuring deep color and authentic flavor
- Low-temperature mechanical milling prevents heat degradation of natural oils
- Standardized fine powder (80–100 Mesh) for consistent solubility and sauce suspension
- Multi-stage Sortex cleaning and de-stoning prior to grinding removes foreign debris
- Completely free from chemical colorants, preservatives, or artificial bulking agents
- Packed in food-grade, multi-wall Kraft paper sacks with high-density poly liners
- Accompanied by batch-specific Certificate of Analysis (COA) verifying purity and microbiology

## Commercial Sourcing & Export Arrangements
Seven Spice supports worldwide bulk shipments with transparent FOB or CIF pricing. Whether you require trial pallet quantities or multi-container seasonal contracts, our export team coordinates product specifications, laboratory testing, and freight logistics to your destination port.`,
    specifications: {
      slug: "turmeric-powder",
      seo_title: "Turmeric Powder Supplier | Premium Haldi Powder in Bulk | Seven Spice",
      meta_description: "Source premium turmeric powder (haldi) in bulk from Seven Spice. 100% pure ground turmeric with high natural curcumin for food manufacturers, spice blenders, and export.",
      primary_keyword: "Turmeric Powder",
      secondary_keywords: "Haldi Powder, Turmeric Supplier, Turmeric Powder Supplier, Bulk Turmeric Powder, Wholesale Turmeric Powder, Ground Turmeric, Turmeric Exporter, B2B Turmeric Supplier, Food Grade Turmeric",
      botanical_name: "Curcuma longa",
      origin: "Pakistan",
      form: "Fine Pulverized Powder",
      mesh_size: "80 – 100 Mesh",
      moisture: "Max 8.0%",
      curcumin_content: "3.0% – 4.5% (natural)",
      color: "Vibrant Deep Golden-Yellow",
      flavor_aroma: "Warm, earthy, slightly peppery natural turmeric",
      foreign_matter: "Nil (Sortex Cleaned & Magnetically Filtered)",
      shelf_life: "24 Months (cool, dry, dark storage)",
      packaging: "25kg multi-ply paper sacks with polyethylene food-grade inner barrier liner",
      lead_time: "7 – 14 Business Days",
      certifications: "100% Halal, HACCP & ISO 22000 compliant"
    }
  },
  {
    id: "p_himalayan_salt_01",
    name: "Himalayan Pink Salt",
    category: "Spices",
    collection: "Salts",
    price_moq: "Custom B2B Quotation (MOQ: 500 kg)",
    packaging_info: "25kg / 50kg poly-woven moisture-barrier bags or 1 MT bulk jumbo bags",
    image_url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
    is_visible: true,
    description: `Seven Spice Himalayan Pink Salt is an ancient, unrefined mineral rock salt extracted directly from the renowned Khewra Salt Mines in Punjab, Pakistan. Mined from subterranean deposits protected from modern environmental contaminants for millions of years, it is prized internationally for its natural crystalline structure, distinctive rose-pink color, and wholesome mineral composition.

Unlike conventional processed table salts that undergo heavy chemical bleaching and require artificial anti-caking additives, our Himalayan Pink Salt is 100% raw, unrefined, and chemical-free. It retains over 80 natural trace minerals, including iron, calcium, magnesium, and potassium, which give the salt its signature blush hue and balanced, rounded savory taste.

Seven Spice supplies Himalayan Pink Salt in multiple precisely calibrated granulations—from ultra-fine food-grade table salt to medium granular and coarse crystals—serving industrial food processors, snack manufacturers, gourmet packaging brands, and spa product companies worldwide.

## Commercial Applications
Himalayan Pink Salt is a versatile ingredient across diverse commercial sectors:
- Commercial food processing, baking, and cured meat manufacturing
- Specialty dry rubs, barbecue seasonings, and gourmet spice blends
- Extruded snack seasoning, salted chips, and confectionery salted caramel recipes
- Pickling brines, fermentation preparations, and cured provisions
- Fine dining, hospitality, restaurant chains, and culinary commissary kitchens
- Premium retail salt packaging, refill pouches, and grinder jars
- Bulk wholesale distribution and international commodity trade
- Bath salts, body scrubs, and wellness salt formulations

## Why Source Himalayan Pink Salt from Seven Spice?
- Authentic geographic origin: direct from Khewra Salt Mine, Pakistan
- Completely unrefined, additive-free, and non-bleached (zero synthetic chemicals)
- Available in standardized grain sizes: Extra Fine (0.2–0.5 mm), Fine (0.5–1.0 mm), and Coarse (2–5 mm)
- Natural mineral purity with sodium chloride content typically exceeding 98.5%
- Thoroughly optical-sorted, machine-cleaned, and metal-detected
- High-capacity export scalability: capable of fulfilling recurring container load contracts
- Robust packaging options: 25 kg / 50 kg moisture-barrier woven bags or 1 MT bulk jumbo totes
- Complete export documentation: Phytosanitary, Certificate of Origin, and COA

## Packaging & Export Logistics
Bulk Himalayan Pink Salt is exported through Port Qasim and Karachi Port on flexible Incoterms (FOB, CFR, CIF). Custom retail-ready packaging, private labeling, and palletized container stuffing are available to match buyer specifications.`,
    specifications: {
      slug: "himalayan-pink-salt",
      seo_title: "Himalayan Pink Salt Supplier | Bulk Pink Salt for B2B Buyers",
      meta_description: "Buy authentic Himalayan Pink Salt in bulk directly from Seven Spice. 100% pure mineral edible rock salt from Khewra for food manufacturers, seasoning companies, and export.",
      primary_keyword: "Himalayan Pink Salt",
      secondary_keywords: "Pink Salt, Himalayan Salt Supplier, Pink Himalayan Salt, Bulk Pink Salt, Himalayan Pink Salt Supplier, Pink Salt Exporter, Wholesale Pink Salt, B2B Salt Supplier, Food Grade Pink Salt",
      botanical_name: "Halite (Sodium Chloride + Trace Minerals)",
      origin: "Khewra Salt Mine, Punjab, Pakistan",
      form: "Fine Ground & Coarse Granular Crystals",
      grain_size: "Fine: 0.2–0.8 mm | Coarse: 2.0–5.0 mm",
      purity_nacl: "98.5% – 99.2% NaCl",
      moisture: "Max 0.2%",
      color: "Natural Rose Pink to Coral Red",
      flavor_aroma: "Crisp, clean, balanced mineral saltiness",
      foreign_matter: "Nil (Optical Sorted & Magnet Cleaned)",
      shelf_life: "Indefinite / 36+ Months in dry conditions",
      packaging: "25kg / 50kg poly-woven moisture-barrier bags or 1 MT bulk jumbo bags",
      lead_time: "7 – 10 Business Days",
      certifications: "Food Grade, 100% Halal, ISO 22000 compliant"
    }
  },
  {
    id: "p_kasuri_methi_02",
    name: "Methi Leaves",
    category: "Herbs",
    collection: "Dried Herbs",
    price_moq: "Custom B2B Quotation (MOQ: 100 kg)",
    packaging_info: "10kg / 20kg moisture-lock corrugated master cartons with food-grade poly liner or customized packing",
    image_url: "/images/Methi Featured Product Image.jpg",
    is_visible: true,
    description: `Seven Spice Methi Leaves (Kasuri Methi) are premium-grade dried fenugreek leaves cultivated in the fertile agricultural belts of Kasur, Punjab, Pakistan. Renowned globally for their intense botanical aroma, deep emerald color, and complex bittersweet flavor profile, our methi leaves are shade-dried immediately after harvesting to retain their fragile volatile oils and culinary vitality.

Unlike lower-grade commercial fenugreek that contains heavy stalk debris, yellowed foliage, and field sand, Seven Spice Kasuri Methi undergoes rigorous multi-stage mechanical screening and de-stoning. The result is a clean, uniform leaf product that yields immediate, powerful aroma upon crushing into sauces, gravies, and bakery doughs.

Our dried methi leaves are favored by commercial curry producers, restaurant franchises, seasoning blenders, and export spice brands looking for authentic aroma that stands up to industrial food cooking and retort processing.

## Commercial Applications
Kasuri Methi is an essential aromatic herb across numerous food applications:
- Commercial curry pastes, simmer gravies (Butter Chicken, Tikka Masala, Dal Makhani)
- Dry seasoning rubs, artisan herb blends, and barbecue coatings
- Bakery formulations: authentic methi parathas, herb naans, savory biscuits, and crackers
- Savory snack seasonings, extruded snacks, and potato chip seasonings
- Commercial catering operations, restaurant franchises, and hotel kitchen commissaries
- Ready-to-eat (RTE) and ready-to-cook (RTC) meal kit manufacturing
- Retail-ready tin packaging, vacuum pouches, and private label boxes
- Global bulk wholesale distribution and international spice import trade

## Why Choose Seven Spice Methi Leaves?
- Authentic Kasuri harvest from prime Punjab farmlands with optimal soil and climate
- Traditional shade-drying technique protects delicate chlorophyll and aromatic terpenes
- Multi-tier machine cleaning removes stalks, stems, dust, and foreign botanical matter
- Low moisture content (< 7.0%) prevents microbial spoilage and eliminates mold risk
- Exceptionally aromatic: high potency ensures lower usage rate per formulation kilogram
- 100% natural dried herb: free from artificial green dyes, additives, or irradiation
- Master export cartons with heavy-gauge moisture-lock inner poly liners
- Complete laboratory batch testing and phytosanitary clearance provided

## Sourcing & Wholesale Inquiries
Seven Spice provides dried methi leaves in standard 10 kg and 20 kg export cartons or customized vacuum packs. Contact our commercial sales desk to request sample lots, specification sheets, and competitive bulk quotations.`,
    specifications: {
      slug: "methi-leaves",
      seo_title: "Premium Methi Leaves Supplier | Fenugreek Leaves for Bulk & B2B",
      meta_description: "Source premium Kasuri Methi leaves (dried fenugreek leaves) in bulk from Seven Spice. Authentic shade-dried, machine-cleaned, export-grade herbs for food manufacturing and retail.",
      primary_keyword: "Methi Leaves",
      secondary_keywords: "Fenugreek Leaves, Dried Methi Leaves, Kasuri Methi, Dried Fenugreek, Methi Supplier, Fenugreek Leaves Supplier, Bulk Methi Leaves, Methi Exporter, B2B Herbs Supplier",
      botanical_name: "Trigonella foenum-graecum",
      origin: "Kasur, Punjab, Pakistan",
      form: "Sun-Shade Dried Whole & Crushed Leaves",
      moisture: "Max 7.0%",
      color: "Natural Olive-to-Emerald Green",
      flavor_aroma: "Distinctive pungent herbal aroma with characteristic bittersweet taste",
      foreign_matter: "< 0.5% (Multi-stage Sortex & Air-screened)",
      shelf_life: "18 Months (cool, dry, dark storage)",
      packaging: "10kg / 20kg moisture-lock corrugated master cartons with food-grade poly liner",
      lead_time: "7 – 14 Business Days",
      certifications: "100% Halal, Farm Traceable, HACCP compliant"
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
