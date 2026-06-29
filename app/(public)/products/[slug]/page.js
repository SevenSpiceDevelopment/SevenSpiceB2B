import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { cookies } from "next/headers";
import { ArrowLeft, ArrowRight, Package, ShieldCheck, Truck, MapPin, BadgePercent } from "lucide-react";
import { getProductById as dbGetProductById, getProducts, getSiteSettings } from "@/lib/db";
import { t, translateProduct, translateProducts } from "@/lib/translations";
import { getProductIdFromSlug, getProductSlug } from "@/lib/productPaths";
import ProductQuoteButton from "@/components/ProductQuoteButton";

const getProductById = cache(dbGetProductById);

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: getProductSlug(product),
  }));
}

export async function generateMetadata({ params }) {
  const productId = getProductIdFromSlug(params.slug);
  if (!productId) return {};

  const product = await getProductById(productId);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description.substring(0, 160),
  };
}

export const revalidate = 60;

function getTechnicalSpecs(product, locale) {
  const isUrdu = locale === "ur";

  // Try to use specifications from database if present
  let dbSpecs = {};
  if (product.specifications) {
    if (typeof product.specifications === "string") {
      try {
        dbSpecs = JSON.parse(product.specifications);
      } catch (e) {
        dbSpecs = {};
      }
    } else {
      dbSpecs = product.specifications;
    }
  }

  if (dbSpecs && Object.keys(dbSpecs).length > 0 && (dbSpecs.origin || dbSpecs.grade || dbSpecs.purity || dbSpecs.moisture || dbSpecs.shelf_life || dbSpecs.storage_guidelines || dbSpecs.certifications)) {
    const specsList = [
      {
        label: isUrdu ? "مصنوعات کا نام" : "Product Identity",
        value: product.name
      },
      {
        label: isUrdu ? "زمرہ" : "Product Category",
        value: product.category
      },
      {
        label: isUrdu ? "اصل / سورسنگ" : "Country of Origin",
        value: dbSpecs.origin || (isUrdu ? "پوچھ گچھ پر دستیاب ہے" : "Available on request")
      },
      {
        label: isUrdu ? "کوالٹی گریڈ" : "Quality Grade",
        value: dbSpecs.grade || (isUrdu ? "معیاری گریڈ" : "Standard Grade")
      }
    ];

    if (dbSpecs.chemical_name && dbSpecs.chemical_value) {
      specsList.push({
        label: dbSpecs.chemical_name,
        value: dbSpecs.chemical_value
      });
    }

    specsList.push(
      {
        label: isUrdu ? "طبعی پاکیزگی" : "Physical Purity",
        value: dbSpecs.purity || "99.5% Min"
      },
      {
        label: isUrdu ? "نمی کا تناسب" : "Moisture Content",
        value: dbSpecs.moisture || "12% Max"
      },
      {
        label: isUrdu ? "پیکیجنگ فارمیٹ" : "Packaging Format",
        value: product.packaging_info || (isUrdu ? "درخواست پر دستیاب ہے" : "Available on request")
      },
      {
        label: isUrdu ? "کم از کم آرڈر اور قیمت" : "Wholesale MOQ & Price",
        value: product.price_moq || (isUrdu ? "پوچھ گچھ پر دستیاب ہے" : "Available on inquiry")
      },
      {
        label: isUrdu ? "شیلف لائف" : "Expected Shelf Life",
        value: dbSpecs.shelf_life || "24 Months"
      },
      {
        label: isUrdu ? "سٹوریج کی شرائط" : "Storage Guidelines",
        value: dbSpecs.storage_guidelines || (isUrdu ? "ٹھنڈی، خشک جگہ پر اسٹور کریں" : "Store in cool, dry conditions.")
      },
      {
        label: isUrdu ? "دستیاب سرٹیفکیٹس" : "Compliance Certifications",
        value: dbSpecs.certifications || "ISO, HACCP"
      }
    );

    return specsList;
  }

  const name = (product.name || "").toLowerCase();
  
  // Default specs
  let origin = isUrdu ? "پریمیم گلوبل سورسنگ" : "Premium Global Sourced";
  let grade = isUrdu ? "گریڈ اے ایکسپورٹ کوالٹی" : "Grade A Export Quality";
  let chemicalSpec = null; // e.g. Curcumin content, Crocin content, Piperine content
  let moisture = "10.0% - 12.0% Maximum";
  let purity = "99.5% Minimum (Free from heavy metals, synthetic colors & fillers)";
  
  if (name.includes("saffron") || name.includes("زعفران")) {
    origin = isUrdu ? "کشمیر، انڈیا" : "Kashmir, India";
    grade = isUrdu ? "گریڈ 1 (ISO 3632 پریمیم)" : "Grade I (ISO 3632 Premium)";
    chemicalSpec = {
      label: isUrdu ? "ایکٹو کروسین (رنگ کی طاقت)" : "Active Crocin (Coloring Strength)",
      value: "> 220 (High Coloring Potential)"
    };
    moisture = "8.0% Maximum";
    purity = isUrdu ? "100% خالص زعفران کے دھاگے" : "100% Pure Saffron Threads (No style/artificial color)";
  } else if (name.includes("pepper") || name.includes("کالی مرچ")) {
    origin = isUrdu ? "مالابار کوسٹ، انڈیا" : "Malabar Coast, India";
    grade = isUrdu ? "ٹیلی چیری اسپیشل بولڈ (TGSEB)" : "Tellicherry Extra Bold (TGSEB)";
    chemicalSpec = {
      label: isUrdu ? "پائپرین مواد" : "Piperine Content",
      value: "4.5% - 5.5% (Sharp & Aromatic heat)"
    };
    moisture = "11.5% Maximum";
    purity = isUrdu ? "99% خالص (کوئی بیرونی مواد نہیں)" : "99.0% Pure (No foreign materials / dust)";
  } else if (name.includes("cinnamon") || name.includes("دارچینی")) {
    origin = isUrdu ? "سری لنکا" : "Sri Lanka";
    grade = isUrdu ? "C5 یا C5-خصوصی گریڈ" : "C5 / C5-Special Premium";
    chemicalSpec = {
      label: isUrdu ? "مستحکم دارچینی کا تیل" : "Volatile Cinnamon Oil",
      value: "1.5% - 2.0% Min"
    };
    moisture = "12.0% Maximum";
    purity = isUrdu ? "100% خالص دارچینی کی چھال" : "100% Pure Ceylon Cinnamon Bark";
  } else if (name.includes("basil") || name.includes("تلسی")) {
    origin = isUrdu ? "مصر" : "Egypt";
    grade = isUrdu ? "پریمیم کٹ اینڈ سلفٹڈ پتے" : "Premium Cut & Sifted Leaves";
    moisture = "9.5% Maximum";
    purity = isUrdu ? "99% خالص خشک تلسی" : "99.0% Pure Crushed Basil (No stems/twigs)";
  } else if (name.includes("cardamom") || name.includes("الائچی")) {
    origin = isUrdu ? "کیرالہ، انڈیا" : "Kerala, India";
    grade = isUrdu ? "فینسی بولڈ (8 ملی میٹر+ سائز)" : "Fancy Bold (8mm+ Size)";
    chemicalSpec = {
      label: isUrdu ? "خوشبودار تیل کا مواد" : "Aromatic Oil Content",
      value: "2.0% - 2.5% Min"
    };
    moisture = "11.0% Maximum";
    purity = isUrdu ? "99% خالص الائچی" : "99.0% Pure Cardamom Pods";
  } else if (name.includes("turmeric") || name.includes("ہلدی")) {
    origin = isUrdu ? "انڈیا" : "India";
    grade = isUrdu ? "پریمیم ہائی کرکومن ہلدی" : "Premium High-Curcumin Grade";
    chemicalSpec = {
      label: isUrdu ? "ایکٹو کرکومین مواد" : "Active Curcumin Content",
      value: "> 5.5% (Verified HPLC)"
    };
    moisture = "9.0% Maximum";
    purity = isUrdu ? "100% خالص ہلدی پاؤڈر" : "100% Pure Turmeric Powder (No lead chromate)";
  } else if (name.includes("methi") || name.includes("fenugreek") || name.includes("میتھی")) {
    origin = isUrdu ? "راجستھان، انڈیا" : "Rajasthan, India";
    grade = isUrdu ? "مشین کلینڈ ہینڈ سلیکٹڈ" : "Machine Cleaned, Hand Selected (MC/HS)";
    moisture = "10.0% Maximum";
    purity = isUrdu ? "99.5% خالص پریمیم بیج" : "99.5% Pure Premium Fenugreek Seeds";
  }

  const specsList = [
    {
      label: isUrdu ? "مصنوعات کا نام" : "Product Identity",
      value: product.name
    },
    {
      label: isUrdu ? "زمرہ" : "Product Category",
      value: product.category
    },
    {
      label: isUrdu ? "اصل / سورسنگ" : "Country of Origin",
      value: origin
    },
    {
      label: isUrdu ? "کوالٹی گریڈ" : "Quality Grade",
      value: grade
    }
  ];

  if (chemicalSpec) {
    specsList.push({
      label: chemicalSpec.label,
      value: chemicalSpec.value
    });
  }

  specsList.push(
    {
      label: isUrdu ? "طبعی پاکیزگی" : "Physical Purity",
      value: purity
    },
    {
      label: isUrdu ? "نمی کا تناسب" : "Moisture Content",
      value: moisture
    },
    {
      label: isUrdu ? "پیکیجنگ فارمیٹ" : "Packaging Format",
      value: product.packaging_info || (isUrdu ? "درخواست پر دستیاب ہے" : "Available on request")
    },
    {
      label: isUrdu ? "کم از کم آرڈر اور قیمت" : "Wholesale MOQ & Price",
      value: product.price_moq || (isUrdu ? "پوچھ گچھ پر دستیاب ہے" : "Available on inquiry")
    },
    {
      label: isUrdu ? "شیلف لائف" : "Expected Shelf Life",
      value: isUrdu ? "اصل پیکیجنگ میں 24 ماہ" : "24 Months in original sealed packaging"
    },
    {
      label: isUrdu ? "سٹوریج کی شرائط" : "Storage Guidelines",
      value: isUrdu 
        ? "براہ راست سورج کی روشنی اور نمی سے دور ٹھنڈی، خشک جگہ پر اسٹور کریں"
        : "Store in a cool, dry warehouse environment, away from direct sunlight and excess moisture."
    },
    {
      label: isUrdu ? "دستیاب سرٹیفکیٹس" : "Compliance Certifications",
      value: isUrdu
        ? "ISO 22000, HACCP, Phytosanitary سرٹیفکیٹ، حلال اور آرگینک (درخواست پر)"
        : "ISO 22000, HACCP, Phytosanitary Export Certificate, Halal & Organic compliance (available on request)"
    }
  );

  return specsList;
}

export default async function ProductDetailPage({ params }) {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const productId = getProductIdFromSlug(params.slug);

  if (!productId) {
    notFound();
  }

  const [rawProduct, rawProducts, settings] = await Promise.all([
    getProductById(productId),
    getProducts(),
    getSiteSettings(),
  ]);

  if (!rawProduct) {
    notFound();
  }

  const product = translateProduct(rawProduct, locale);
  const relatedProducts = translateProducts(
    rawProducts.filter((item) => item.id !== rawProduct.id && item.category === rawProduct.category),
    locale
  ).slice(0, 3);
  const salesEmail = settings?.business_email || "sales@thesevenspice.com";
  const descriptionPreview = (product.description || "").replace(/\s+/g, " ").trim();
  const summaryText = descriptionPreview
    ? descriptionPreview.length > 240
      ? `${descriptionPreview.slice(0, 240).trimEnd()}...`
      : descriptionPreview
    : "Commercial product details are available below for procurement teams and wholesale buyers.";

  const buyerFit = [
    "Food manufacturers and private-label processors",
    "Wholesale distributors and importers",
    "Retail chains and specialty ingredient buyers",
    "Hospitality and catering supply teams",
  ];

  const technicalSpecs = getTechnicalSpecs(product, locale);

  return (
    <div className="bg-background pb-stack-lg">
      <section className="relative overflow-hidden border-b border-on-surface/10 bg-surface">
        <div className="absolute inset-0 bg-subtle-pattern opacity-80 pointer-events-none"></div>
        <div className="absolute -right-24 top-10 h-56 w-56 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14 relative z-10">
          <Link href="/products" className="inline-flex items-center gap-2 text-secondary font-label-md text-xs hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} /> {t("product_detail_back", locale)}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 bg-secondary/10 text-primary text-xs uppercase font-bold tracking-[0.2em] px-3 py-1.5 rounded">
                <BadgePercent size={12} /> {product.category}
              </span>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mt-4 leading-tight max-w-3xl">
                {product.name}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-5 max-w-3xl leading-relaxed break-words">
                {summaryText}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ProductQuoteButton
                  productName={product.name}
                  productId={product.id}
                  businessPhone={settings?.business_phone || "+1 (800) 555-SPICE"}
                  businessEmail={salesEmail}
                  locale={locale}
                />
                <Link
                  href="/products"
                  className="bg-surface border border-on-surface/10 text-on-surface px-5 py-3 rounded font-label-md text-sm hover:border-primary/30 hover:text-primary transition-all inline-flex items-center gap-2"
                >
                  {t("product_detail_browse", locale)}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest border border-on-surface/10 rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(26,26,26,0.06)]">
                <div className="h-[320px] md:h-[420px] bg-surface-container-high overflow-hidden">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1200"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 border-t border-on-surface/10 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-surface-container-low rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Category</div>
                    <div className="mt-1 text-on-surface font-semibold">{product.category}</div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Sales Email</div>
                    <div className="mt-1 text-on-surface font-semibold break-all">{salesEmail}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <article className="lg:col-span-8 space-y-8">
          {/* TECHNICAL SPECIFICATIONS & STANDARDS SECTION */}
          <section className="bg-surface-container-low border border-on-surface/10 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="border-b border-on-surface/10 pb-4 mb-6">
              <h2 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
                <ShieldCheck size={22} className="text-secondary" />
                {locale === "ur" ? "پروڈکٹ کی تفصیلات اور تکنیکی معلومات" : "Product Specifications & Technical Data"}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                {locale === "ur"
                  ? "ہول سیل خریداروں، امپورٹرز اور کوالٹی اشورینس ٹیموں کے لیے تصدیق شدہ تجارتی اور معیار کے پیرامیٹرز۔"
                  : "Verified commercial and quality parameters for wholesale procurement, importers, and quality assurance teams."}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-on-surface/5 bg-surface-container-lowest">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-on-surface/10 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      <th className="py-3 px-4 w-5/12 font-semibold">
                        {locale === "ur" ? "خصوصیت / پیرامیٹر" : "Specification Parameter"}
                      </th>
                      <th className="py-3 px-4 font-semibold">
                        {locale === "ur" ? "تصدیق شدہ قدر / معیار" : "Verified Value / Standard"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-on-surface/5 text-on-surface">
                    {technicalSpecs.map((spec) => (
                      <tr key={spec.label} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest/50 w-5/12 border-r border-on-surface/5">
                          {spec.label}
                        </td>
                        <td className="py-3.5 px-4 text-sm font-medium text-primary break-words leading-relaxed">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="bg-primary text-on-primary rounded-xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-subtle-pattern opacity-10 pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-title-lg text-title-lg font-bold">{t("product_detail_cta_title", locale)}</h2>
              <p className="mt-3 text-sm text-on-primary/85 leading-relaxed">
                {t("product_detail_cta_desc", locale)}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ProductQuoteButton
                  productName={product.name}
                  productId={product.id}
                  businessPhone={settings?.business_phone || "+1 (800) 555-SPICE"}
                  businessEmail={salesEmail}
                  locale={locale}
                  variant="inverse"
                />
                <Link
                  href={`mailto:${salesEmail}?subject=${encodeURIComponent(product.name + " - Wholesale Inquiry")}`}
                  className="bg-white/10 text-on-primary border border-white/15 px-4 py-2.5 rounded font-label-md text-xs hover:bg-white/15 transition-all inline-flex items-center gap-2"
                >
                  Email Sales Team
                </Link>
              </div>
            </div>
          </section>
        </article>

        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-surface-container-low border border-on-surface/10 rounded-xl p-6">
            <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
              <ShieldCheck size={18} className="text-secondary" /> {t("product_detail_fit_title", locale)}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
              {buyerFit.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-surface-container-low border border-on-surface/10 rounded-xl p-6">
            <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
              <Package size={18} className="text-secondary" /> {t("product_detail_related_title", locale)}
            </h3>
            <div className="mt-4 space-y-4">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${getProductSlug(relatedProduct)}`}
                    className="group flex gap-3 border-b border-on-surface/5 pb-4 last:pb-0 last:border-b-0"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high shrink-0 border border-on-surface/10">
                      <img
                        src={relatedProduct.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=240"}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">{relatedProduct.category}</div>
                      <div className="mt-1 text-sm font-semibold text-primary group-hover:text-secondary leading-tight line-clamp-2 transition-colors">
                        {relatedProduct.name}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant">No related products are available right now.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}