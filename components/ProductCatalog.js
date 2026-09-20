"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import QuoteModal from "./QuoteModal";
import {
  Tag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Layers,
  Search,
  X,
  FolderOpen,
  Package,
  Boxes
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

  // Top-level Section Switcher: "products" | "collections"
  const [activeTab, setActiveTab] = useState("products");

  // Products Tab Filter states
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Collections Tab Selected Collection (null for all collections list)
  const [selectedCollection, setSelectedCollection] = useState(null);

  // State for quote modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState({ name: "", id: "" });

  // Process and enrich Collections with counts and fallback images
  const processedCollections = useMemo(() => {
    const list = [...initialCollections];
    const existingNames = new Set(list.map(c => (c.name || "").toLowerCase()));

    // Also include any collections mentioned on products that aren't in collections table
    initialProducts.forEach(p => {
      if (p.collection && !existingNames.has(p.collection.toLowerCase())) {
        list.push({
          id: "col_" + p.collection.toLowerCase().replace(/[^a-z0-9]/g, "_"),
          name: p.collection,
          category: p.category || "Spices",
          description: `Curated assortment of ${p.collection} wholesale spices and ingredients.`,
          image_url: p.image_url || null,
          is_featured: true,
        });
        existingNames.add(p.collection.toLowerCase());
      }
    });

    return list.map(c => {
      const matchingProducts = initialProducts.filter(
        p => (p.collection || "").toLowerCase() === (c.name || "").toLowerCase()
      );
      const fallbackImage =
        matchingProducts[0]?.image_url ||
        (c.name?.toLowerCase().includes("salt")
          ? "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&q=80&w=800"
          : "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800");

      return {
        ...c,
        productCount: matchingProducts.length,
        displayImage: c.image_url || fallbackImage,
        products: matchingProducts
      };
    });
  }, [initialCollections, initialProducts]);

  // Handle URL search parameters on mount / change
  useEffect(() => {
    const quoteProduct = searchParams.get("quoteProduct");
    const productId = searchParams.get("productId");
    const catParam = searchParams.get("category");
    const colParam = searchParams.get("collection");
    const tabParam = searchParams.get("tab");

    if (quoteProduct) {
      setModalProduct({ name: quoteProduct, id: productId || "" });
      setModalOpen(true);
    }
    if (colParam) {
      setActiveTab("collections");
      setSelectedCollection(colParam);
    } else if (tabParam === "collections") {
      setActiveTab("collections");
      setSelectedCollection(null);
    } else if (tabParam === "products") {
      setActiveTab("products");
    }

    if (catParam) {
      setActiveCategory(catParam);
    }
  }, [searchParams]);

  // Extract unique categories for Products tab
  const categories = useMemo(() => {
    const list = new Set();
    initialProducts.forEach(p => { if (p.category) list.add(p.category); });
    return ["All", ...Array.from(list)];
  }, [initialProducts]);

  // Filter products for the Products Tab
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      // Category filter
      if (activeCategory !== "All" && product.category?.toLowerCase() !== activeCategory.toLowerCase()) {
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
  }, [initialProducts, activeCategory, searchQuery]);

  // Products belonging to the currently selected collection in Collections Tab
  const currentCollectionObj = useMemo(() => {
    if (!selectedCollection) return null;
    return processedCollections.find(
      c => (c.name || "").toLowerCase() === selectedCollection.toLowerCase()
    ) || null;
  }, [processedCollections, selectedCollection]);

  const collectionProducts = useMemo(() => {
    if (!selectedCollection) return [];
    return initialProducts.filter(
      p => (p.collection || "").toLowerCase() === selectedCollection.toLowerCase()
    );
  }, [initialProducts, selectedCollection]);

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "products") {
      setSelectedCollection(null);
      const params = new URLSearchParams(window.location.search);
      params.delete("tab");
      params.delete("collection");
      const qs = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("tab", "collections");
      if (selectedCollection) {
        params.set("collection", selectedCollection);
      }
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    }
  };

  const handleSelectCollection = (colName) => {
    setSelectedCollection(colName);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", "collections");
    params.set("collection", colName);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", "collections");
    params.delete("collection");
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  const openQuote = (product) => {
    setModalProduct({ name: product.name, id: product.id });
    setModalOpen(true);
  };

  const openProductDetails = (product) => {
    router.push(`/products/${getProductSlug(product)}`);
  };

  // Helper renderer for a single Product Card
  const renderProductCard = (product) => {
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
        className="reveal-on-scroll w-[78vw] max-w-[78vw] min-w-[78vw] xs:w-[260px] xs:max-w-[260px] xs:min-w-[260px] sm:w-[280px] sm:max-w-[280px] sm:min-w-[280px] md:w-full md:max-w-none md:min-w-0 snap-start shrink-0 bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-[0_16px_36px_rgba(87,0,19,0.08)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-left rtl:text-right outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 select-none h-full shadow-sm border border-on-surface/10 p-3.5 sm:p-4"
      >
        <div className="flex flex-col flex-grow">
          {/* Product Image Canvas */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center bg-[#f7f5f2] p-2">
            <div className="absolute top-2 inset-x-2 z-10 flex items-start justify-between gap-1.5 pointer-events-none">
              <div className="flex flex-col gap-1 items-start min-w-0 max-w-[65%]">
                {product.category && (
                  <span className="inline-flex items-center gap-1 bg-black/65 backdrop-blur-md text-secondary-fixed text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs max-w-full truncate">
                    <Tag size={9} className="text-secondary-fixed shrink-0" />
                    <span className="truncate">{product.category}</span>
                  </span>
                )}
              </div>

              <span className="shrink-0 inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-primary text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full shadow-xs border border-slate-100">
                <ShieldCheck size={10} className="text-secondary shrink-0" />
                <span className="uppercase">{locale === "ur" ? "خالص" : "Grade A"}</span>
              </span>
            </div>

            <Image
              src={product.image_url || "/images/turmeric_mortar.png"}
              alt={product.name || "Product"}
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 280px, 320px"
              quality={90}
              className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out p-2"
            />
          </div>

          {/* Product Info (No Prices shown) */}
          <div className="pt-3 pb-1 flex-grow flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-slate-900 font-bold text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                {product.name}
              </h3>
              {previewDescription && (
                <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2">
                  {previewDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Compact Action Buttons */}
        <div className="pt-2 mt-auto flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openQuote(product);
            }}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-3 rounded-full text-center text-xs sm:text-[13px] transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98]"
          >
            {locale === "ur" ? "کوٹیشن طلب کریں" : "Request Quote"}
          </button>

          <div
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full text-center text-xs transition-all duration-200 cursor-pointer shrink-0"
          >
            <span>{locale === "ur" ? "تفصیلات" : "Details"}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-stack-md animate-fadeIn">
      {/* 1. DISTINCT SECTION TABS: PRODUCTS vs COLLECTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-on-surface/10">
        <div className="inline-flex p-1.5 bg-surface-container-low border border-on-surface/10 rounded-2xl shadow-xs self-start">
          {/* Products Tab Button */}
          <button
            type="button"
            onClick={() => handleTabChange("products")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "products"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60"
            }`}
          >
            <Package size={17} />
            <span>{t("tab_products", locale)}</span>
            <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold ${
              activeTab === "products" ? "bg-white/20 text-white" : "bg-on-surface/10 text-on-surface-variant"
            }`}>
              {initialProducts.length}
            </span>
          </button>

          {/* Collections Tab Button */}
          <button
            type="button"
            onClick={() => handleTabChange("collections")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "collections"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60"
            }`}
          >
            <Layers size={17} />
            <span>{t("tab_collections", locale)}</span>
            <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold ${
              activeTab === "collections" ? "bg-white/20 text-white" : "bg-on-surface/10 text-on-surface-variant"
            }`}>
              {processedCollections.length}
            </span>
          </button>
        </div>

        {/* Status indicator on desktop */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant font-medium">
          {activeTab === "products" ? (
            <span>Showing wholesale catalog specifications & individual ingredients</span>
          ) : (
            <span>Curated themed selections & regional harvest collections</span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION A: PRODUCTS SECTION                                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "products" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Products Filter & Search Toolbar */}
          <div className="bg-surface-container-lowest border border-on-surface/10 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const count = cat === "All"
                  ? initialProducts.length
                  : initialProducts.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-primary text-on-primary shadow-sm scale-100"
                        : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary border border-on-surface/5"
                    }`}
                  >
                    <span>{cat === "All" ? t("all_categories", locale) : cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-on-surface/10 text-on-surface-variant"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Bar */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("catalog_search_placeholder", locale) || "Search products..."}
                className="w-full bg-surface-container-low border border-on-surface/10 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-0.5"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <MobileCardCarousel count={filteredProducts.length} className="md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => renderProductCard(product))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-surface-container-low border border-on-surface/10 rounded-2xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-on-surface-variant">
                  <FolderOpen size={24} />
                </div>
                <h4 className="font-semibold text-primary text-base">
                  {t("catalog_no_products", locale)}
                </h4>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
                  {searchQuery
                    ? `No products matched "${searchQuery}". Try a different keyword or reset filters.`
                    : `No products found under the "${activeCategory}" category.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-2 bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                >
                  {t("catalog_reset_filters", locale)}
                </button>
              </div>
            )}
          </MobileCardCarousel>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION B: COLLECTIONS SECTION                                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "collections" && (
        <div className="space-y-6 animate-fadeIn">
          {/* CASE 1: Specific Collection Selected -> Showcase and its Products */}
          {selectedCollection ? (
            <div className="space-y-6">
              {/* Collection Header Banner */}
              <div className="bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-lowest border border-secondary/25 rounded-3xl p-6 sm:p-8 shadow-sm">
                <button
                  type="button"
                  onClick={handleBackToCollections}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-secondary mb-4 transition-colors cursor-pointer group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>{t("back_to_collections", locale)}</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-secondary/15 text-primary text-[11px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                        <Layers size={13} className="text-secondary" />
                        <span>{currentCollectionObj?.category || "Curated Collection"}</span>
                      </span>
                      <span className="bg-surface-container text-on-surface-variant text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {collectionProducts.length} {collectionProducts.length === 1 ? "Product" : "Products"}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                      {selectedCollection}
                    </h2>

                    {currentCollectionObj?.description && (
                      <p className="text-xs sm:text-sm md:text-base text-on-surface-variant leading-relaxed">
                        {currentCollectionObj.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleBackToCollections}
                    className="self-start md:self-center px-4 py-2 bg-surface-container-low hover:bg-surface-container border border-on-surface/10 rounded-xl text-xs font-semibold text-primary transition-all cursor-pointer shrink-0"
                  >
                    View All {processedCollections.length} Collections
                  </button>
                </div>
              </div>

              {/* Products within this Collection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-primary">
                    Products in {selectedCollection}
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    {collectionProducts.length} Available
                  </span>
                </div>

                <MobileCardCarousel count={collectionProducts.length} className="md:grid-cols-2 lg:grid-cols-3">
                  {collectionProducts.length > 0 ? (
                    collectionProducts.map(product => renderProductCard(product))
                  ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-surface-container-low border border-on-surface/10 rounded-2xl space-y-3">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-on-surface-variant">
                        <FolderOpen size={24} />
                      </div>
                      <h4 className="font-semibold text-primary text-base">
                        No Products in this Collection Yet
                      </h4>
                      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
                        New products for the {selectedCollection} collection are currently being sourced and packaged.
                      </p>
                      <button
                        type="button"
                        onClick={handleBackToCollections}
                        className="mt-2 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                      >
                        Explore Other Collections
                      </button>
                    </div>
                  )}
                </MobileCardCarousel>
              </div>
            </div>
          ) : (
            /* CASE 2: All Collections Showcase Grid */
            <div className="space-y-6">
              {/* Showcase Banner Header */}
              <div className="text-center md:text-left max-w-2xl">
                <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                  {t("all_collections_title", locale)}
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  {t("all_collections_subtitle", locale)}
                </p>
              </div>

              {/* Collections Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {processedCollections.map((col) => (
                  <div
                    key={col.id || col.name}
                    onClick={() => handleSelectCollection(col.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectCollection(col.name);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View collection ${col.name}`}
                    className="group bg-surface-container-lowest border border-on-surface/10 hover:border-secondary/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer outline-none focus:outline-none focus:ring-0"
                  >
                    <div>
                      {/* Collection Image Cover */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container-high/40">
                        <Image
                          src={col.displayImage}
                          alt={col.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={90}
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                          <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-secondary-fixed text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            <Tag size={10} className="text-secondary-fixed shrink-0" />
                            <span>{col.category || "Collection"}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-primary text-[10px] sm:text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            <Package size={11} className="text-secondary shrink-0" />
                            <span>
                              {col.productCount} {col.productCount === 1 ? "Product" : "Products"}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Collection Content */}
                      <div className="p-5 sm:p-6 space-y-2">
                        <h3 className="text-slate-900 font-bold text-lg sm:text-xl group-hover:text-primary transition-colors tracking-tight">
                          {col.name}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed line-clamp-3">
                          {col.description || `Specialized assortment of ${col.name} wholesale spices and ingredients.`}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="p-5 sm:p-6 pt-0">
                      <div className="w-full bg-surface-container-low group-hover:bg-primary group-hover:text-white text-primary border border-on-surface/10 group-hover:border-primary font-semibold py-2.5 sm:py-3 rounded-xl text-center text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2">
                        <span>{t("explore_collection", locale)}</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quote Overlay Modal */}
      <QuoteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          const params = new URLSearchParams(window.location.search);
          params.delete("quoteProduct");
          params.delete("productId");
          const qs = params.toString();
          window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
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
