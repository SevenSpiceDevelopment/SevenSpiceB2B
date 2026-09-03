"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuoteModal from "./QuoteModal";
import {
  Tag,
  ArrowRight,
  ShieldCheck,
  Layers,
  Search,
  X,
  Sparkles,
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";
import { t } from "@/lib/translations";
import { getProductSlug } from "@/lib/productPaths";
import MobileCardCarousel from "./MobileCardCarousel";

export default function ProductCatalog({
  initialProducts = [],
  initialCollections = [],
  businessPhone,
  businessEmail,
  locale = "en"
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for search and filters
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCollection, setActiveCollection] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // State for quote modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState({ name: "", id: "" });

  // Auto-trigger modal if search params are present (e.g. redirected from Home page)
  useEffect(() => {
    const quoteProduct = searchParams.get("quoteProduct");
    const productId = searchParams.get("productId");
    const catParam = searchParams.get("category");
    const colParam = searchParams.get("collection");

    if (quoteProduct) {
      setModalProduct({ name: quoteProduct, id: productId || "" });
      setModalOpen(true);
    }
    if (catParam) {
      setActiveCategory(catParam);
    }
    if (colParam) {
      setActiveCollection(colParam);
    }
  }, [searchParams]);

  // Extract unique categories from products and collections
  const categories = useMemo(() => {
    const list = new Set();
    initialProducts.forEach(p => { if (p.category) list.add(p.category); });
    initialCollections.forEach(c => { if (c.category) list.add(c.category); });
    return ["All", ...Array.from(list)];
  }, [initialProducts, initialCollections]);

  // Extract collections relevant to the selected category
  const availableCollections = useMemo(() => {
    let filtered = initialCollections;
    if (activeCategory !== "All") {
      filtered = initialCollections.filter(c => c.category?.toLowerCase() === activeCategory.toLowerCase());
    }
    // Also include any distinct product collection names that might not be in collections table
    const colNames = new Set(filtered.map(c => c.name));
    initialProducts.forEach(p => {
      if (p.collection && (activeCategory === "All" || p.category?.toLowerCase() === activeCategory.toLowerCase())) {
        colNames.add(p.collection);
      }
    });

    return Array.from(colNames);
  }, [initialCollections, initialProducts, activeCategory]);

  // When category changes, reset collection if it's no longer in available collections
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setActiveCollection("All");
  };

  // Filter products by Category, Collection, and Search Query
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      // Category filter
      if (activeCategory !== "All" && product.category?.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }
      // Collection filter
      if (activeCollection !== "All" && product.collection?.toLowerCase() !== activeCollection.toLowerCase()) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = product.name?.toLowerCase().includes(q);
        const catMatch = product.category?.toLowerCase().includes(q);
        const colMatch = (product.collection || "").toLowerCase().includes(q);
        const descMatch = product.description?.toLowerCase().includes(q);
        return nameMatch || catMatch || colMatch || descMatch;
      }
      return true;
    });
  }, [initialProducts, activeCategory, activeCollection, searchQuery]);

  // Selected collection details (if activeCollection !== "All")
  const selectedCollectionObj = useMemo(() => {
    if (activeCollection === "All") return null;
    return initialCollections.find(c => c.name.toLowerCase() === activeCollection.toLowerCase()) || null;
  }, [initialCollections, activeCollection]);

  const openQuote = (product) => {
    setModalProduct({ name: product.name, id: product.id });
    setModalOpen(true);
  };

  const openProductDetails = (product) => {
    router.push(`/products/${getProductSlug(product)}`);
  };

  return (
    <div className="space-y-stack-md animate-fadeIn">
      {/* 1. FILTER & SEARCH CONTROLS */}
      <div className="bg-surface-container-lowest border border-on-surface/10 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
        {/* Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
            <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-bold shrink-0 hidden sm:inline-block mr-1">
              Category:
            </span>
            {categories.map((cat) => {
              const count = cat === "All"
                ? initialProducts.length
                : initialProducts.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 ${isActive
                      ? "bg-primary text-on-primary shadow-sm scale-100"
                      : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary border border-on-surface/5"
                    }`}
                >
                  <span>{cat === "All" ? t("all_categories", locale) : cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-on-surface/10 text-on-surface-variant"
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Keyword Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in catalog..."
              className="w-full bg-surface-container-low border border-on-surface/10 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Collection Filter Pills (Multi-product grouping) */}
        {availableCollections.length > 0 && (
          <div className="pt-3 border-t border-on-surface/5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-secondary font-bold shrink-0 mr-1">
              <Layers size={13} className="text-secondary" />
              <span>Collections:</span>
            </div>

            {/* "All Collections" Pill */}
            <button
              onClick={() => setActiveCollection("All")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${activeCollection === "All"
                  ? "bg-secondary text-on-secondary shadow-xs"
                  : "bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-primary"
                }`}
            >
              <span>{t("all_collections", locale)}</span>
            </button>

            {/* Specific Collection Pills */}
            {availableCollections.map((colName) => {
              const isColActive = activeCollection.toLowerCase() === colName.toLowerCase();
              const colCount = initialProducts.filter(p => {
                const matchesCol = p.collection?.toLowerCase() === colName.toLowerCase();
                const matchesCat = activeCategory === "All" || p.category?.toLowerCase() === activeCategory.toLowerCase();
                return matchesCol && matchesCat;
              }).length;

              return (
                <button
                  key={colName}
                  onClick={() => setActiveCollection(isColActive ? "All" : colName)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${isColActive
                      ? "bg-secondary text-on-secondary shadow-xs scale-100 ring-1 ring-secondary/40"
                      : "bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-primary"
                    }`}
                >
                  <Sparkles size={11} className={isColActive ? "text-white" : "text-secondary"} />
                  <span>{colName}</span>
                  {colCount > 0 && (
                    <span className={`text-[10px] px-1 py-0.2 rounded-full ${isColActive ? "bg-black/20 text-white" : "bg-on-surface/10 text-on-surface-variant"
                      }`}>
                      {colCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. ACTIVE COLLECTION SHOWCASE BANNER (When a specific collection is selected) */}
      {selectedCollectionObj && (
        <div className="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low border border-secondary/20 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-secondary/15 text-primary text-[11px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
              <Layers size={12} className="text-secondary" />
              <span>{selectedCollectionObj.category} Collection</span>
            </div>
            <h2 className="font-title-lg text-xl sm:text-2xl font-bold text-primary">
              {selectedCollectionObj.name}
            </h2>
            {selectedCollectionObj.description && (
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                {selectedCollectionObj.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setActiveCollection("All")}
            className="self-start sm:self-center text-xs font-semibold text-secondary hover:text-primary underline flex items-center gap-1 shrink-0"
          >
            <span>View All Collections</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* 3. PRODUCTS GRID / CAROUSEL */}
      <MobileCardCarousel count={filteredProducts.length} className="md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const cleanDescription = String(product.description || "")
              .replace(/\s+/g, " ")
              .trim();
            const previewDescription = cleanDescription.length > 110
              ? `${cleanDescription.slice(0, 110).trim()}...`
              : cleanDescription;

            return (
              <div
                key={product.id}
                onClick={() => openProductDetails(product)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProductDetails(product);
                  }
                }}
                role="link"
                tabIndex={0}
                aria-label={`Open details for ${product.name}`}
                className="w-[85vw] max-w-[85vw] min-w-[85vw] xs:w-[280px] xs:max-w-[280px] xs:min-w-[280px] sm:w-[320px] sm:max-w-[320px] sm:min-w-[320px] md:w-full md:max-w-none md:min-w-0 snap-start shrink-0 bg-surface-container-lowest rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_45px_rgba(87,0,19,0.08)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer text-left outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 select-none h-full shadow-sm border border-on-surface/5"
              >
                <div className="flex flex-col flex-grow">
                  {/* 1. PRODUCT SHOWCASE CANVAS (Proportional responsive aspect ratio) */}
                  <div className="relative p-3.5 sm:p-4 pb-2">
                    <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center bg-surface-container-high/40">
                      {/* Top Bar Badges: Non-colliding layout */}
                      <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 z-10 flex items-start justify-between gap-2 pointer-events-none">
                        <div className="flex flex-col gap-1 items-start min-w-0 max-w-[65%]">
                          {product.category && (
                            <span className="inline-flex items-center gap-1 bg-black/65 backdrop-blur-md text-secondary-fixed text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs max-w-full truncate">
                              <Tag size={10} className="text-secondary-fixed shrink-0" />
                              <span className="truncate">{product.category}</span>
                            </span>
                          )}

                          {/* Collection Badge Pill */}
                          {product.collection && (
                            <span className="inline-flex items-center gap-1 bg-secondary-container/95 backdrop-blur-md text-on-secondary-container text-[9px] sm:text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full shadow-xs border border-secondary/20 max-w-full truncate">
                              <Layers size={9} className="text-secondary shrink-0" />
                              <span className="truncate">{product.collection}</span>
                            </span>
                          )}
                        </div>

                        {/* Top Right Premium Quality Badge */}
                        <span className="shrink-0 inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-primary text-[9px] sm:text-[10px] font-bold tracking-wider px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">
                          <ShieldCheck size={11} className="text-secondary shrink-0" />
                          <span className="uppercase">{locale === "ur" ? "پریمیئم" : "Grade A"}</span>
                        </span>
                      </div>

                      {/* Clean Main Product Image */}
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                  </div>

                  {/* 2. PRODUCT INFO & DETAILS */}
                  <div className="p-4 sm:p-5 pt-2 flex-grow flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <h3 className="text-slate-900 font-bold text-base sm:text-lg md:text-xl leading-snug line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                        {product.name}
                      </h3>
                      {previewDescription && (
                        <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed line-clamp-2">
                          {previewDescription}
                        </p>
                      )}
                    </div>

                    {product.price_moq && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          {product.price_moq}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {locale === "ur" ? "تھوک سپلائی" : "Wholesale"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. DUAL PILL ACTION BUTTONS */}
                <div className="p-4 sm:p-5 pt-0 flex flex-col gap-2.5">
                  {/* Primary "Request Commercial Quote" Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuote(product);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 sm:py-3.5 rounded-full text-center text-sm sm:text-[15px] transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98]"
                  >
                    {locale === "ur" ? "کمرشل کوٹیشن طلب کریں" : "Request Commercial Quote"}
                  </button>

                  {/* Secondary "View Product" Button */}
                  <div
                    className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-medium py-3 sm:py-3.5 rounded-full text-center text-sm sm:text-[15px] transition-all duration-200 cursor-pointer block active:scale-[0.98]"
                  >
                    <span>{locale === "ur" ? "مصنوعات دیکھیں" : "View Product"}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-surface-container-low border border-on-surface/10 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-on-surface-variant">
              <FolderOpen size={24} />
            </div>
            <h4 className="font-semibold text-primary text-base">No Products Found</h4>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
              {searchQuery
                ? `No products matched "${searchQuery}". Try a different keyword or reset filters.`
                : `No products found under the "${activeCollection !== "All" ? activeCollection : activeCategory}" filter.`}
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setActiveCollection("All");
                setSearchQuery("");
              }}
              className="mt-2 bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-primary/90 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </MobileCardCarousel>

      {/* Quote Overlay Modal */}
      <QuoteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // Clean search query params after closing modal
          window.history.replaceState(null, "", window.location.pathname);
        }}
        productName={modalProduct.name}
        productId={modalProduct.id}
        businessPhone={businessPhone}
        businessEmail={businessEmail}
        locale={locale}
      />
    </div>
  );
}
