"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, Sparkles, Tag } from "lucide-react";
import { t } from "@/lib/translations";

export default function ProductSearchModal({
  isOpen,
  onClose,
  locale = "en",
  initialProducts = [],
}) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [productsList, setProductsList] = useState(initialProducts || []);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch products on open if not already loaded
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveCategory("All");
      return;
    }

    // Auto-focus input on open
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 60);

    // Fetch products to ensure fresh and complete catalog
    fetch(`/api/products/search?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch((err) => {
        console.error("Search fetch error:", err);
      });

    return () => clearTimeout(timer);
  }, [isOpen, locale]);

  // Sync if initialProducts changes
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0 && productsList.length === 0) {
      setProductsList(initialProducts);
    }
  }, [initialProducts, productsList.length]);

  // Extract unique categories from products
  const categories = [
    "All",
    ...Array.from(new Set((productsList || []).map((p) => p.category).filter(Boolean))),
  ];

  // Filter products based on search query and category pill
  const filteredProducts = (productsList || []).filter((p) => {
    const q = query.toLowerCase().trim();
    const categoryMatch =
      activeCategory === "All" ||
      (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());

    if (!categoryMatch) return false;
    if (!q) return true;

    const nameMatch = p.name?.toLowerCase().includes(q);
    const catMatch = p.category?.toLowerCase().includes(q);
    const descMatch = p.description?.toLowerCase().includes(q);
    return Boolean(nameMatch || catMatch || descMatch);
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        if (filteredProducts[selectedIndex]) {
          e.preventDefault();
          navigateToProduct(filteredProducts[selectedIndex].slug);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredProducts, selectedIndex]);

  const navigateToProduct = (slug) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  if (!isOpen) return null;

  const isUrdu = locale === "ur";
  const hasQuery = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 md:p-6 pt-16 sm:pt-20">
      {/* Solid Dark Backdrop (No blur) */}
      <div
        className="fixed inset-0 bg-black/75 transition-opacity"
        onClick={onClose}
      />

      {/* Solid Clean Modal Container (No glossy blur/transparency) */}
      <div
        className={`relative w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[82vh] ${
          isUrdu ? "font-urdu text-right" : "text-left"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Product Search"
      >
        {/* Solid Search Header */}
        <div className="flex items-center px-4 sm:px-5 py-3.5 border-b border-gray-200 bg-white gap-3">
          <Search className="w-5 h-5 text-primary shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t("search_placeholder", locale)}
            className="w-full bg-transparent border-none text-gray-900 placeholder:text-gray-400 text-sm sm:text-base outline-none focus:outline-none focus:ring-0 font-medium"
            dir={isUrdu ? "rtl" : "ltr"}
          />

          {hasQuery ? (
            <button
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : null}

          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 transition-colors hidden xs:inline-block cursor-pointer"
          >
            {t("close", locale)}
          </button>
        </div>

        {/* Solid Category Pills */}
        {categories.length > 2 && (
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const isCatActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedIndex(0);
                  }}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all shrink-0 ${
                    isCatActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat === "All" ? t("all", locale) : cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Solid Product Results List */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-2 flex-grow bg-white">
          {filteredProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  {hasQuery
                    ? `${filteredProducts.length} ${t("products", locale)}`
                    : t("search_popular", locale)}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                {filteredProducts.map((product, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={product.id || idx}
                      onClick={() => navigateToProduct(product.slug)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center gap-3.5 p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-150 border ${
                        isSelected
                          ? "bg-red-50/70 text-primary border-primary/30 shadow-sm"
                          : "bg-white hover:bg-gray-50 border-gray-100"
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name || "Product"}
                            fill
                            sizes="56px"
                            quality={90}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Tag size={16} />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {product.name}
                          </h4>
                          {product.category && (
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                              {product.category}
                            </span>
                          )}
                          {product.collection && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-50 text-primary border border-primary/20 shrink-0 truncate max-w-[120px]">
                              {product.collection}
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1">
                            {product.description}
                          </p>
                        )}
                        {product.price_moq && (
                          <p className="text-[10px] text-primary font-semibold mt-0.5 truncate">
                            {product.price_moq}
                          </p>
                        )}
                      </div>

                      {/* Arrow Action */}
                      <div className="shrink-0 text-gray-400">
                        <ArrowRight
                          size={16}
                          className={`${isUrdu ? "rotate-180" : ""} ${
                            isSelected ? "text-primary translate-x-1" : ""
                          } transition-transform`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : hasQuery ? (
            /* No Results Found for typed query */
            <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-primary flex items-center justify-center border border-red-100">
                <Search size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-gray-900">
                  {t("search_no_results", locale)}
                </h4>
                <p className="text-xs text-gray-500 max-w-sm">
                  {locale === "ur"
                    ? `"${query}" کے لیے کوئی پروڈکٹ نہیں ملی۔ دیگر ناموں سے تلاش کریں۔`
                    : `No matches found for "${query}". Try searching for other spices or browse the catalog.`}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("All");
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  {locale === "ur" ? "تلاش صاف کریں" : "Clear Search"}
                </button>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="text-xs font-semibold px-4 py-1.5 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  {t("search_view_all", locale)}
                  <ArrowRight size={14} className={isUrdu ? "rotate-180" : ""} />
                </Link>
              </div>
            </div>
          ) : (
            /* Loading / Initial View */
            <div className="py-8 text-center text-xs text-gray-400">
              {t("loading", locale)}
            </div>
          )}
        </div>

        {/* Solid Footer */}
        <div className="p-3 px-4 sm:px-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <Link
            href="/products"
            onClick={onClose}
            className="text-primary hover:underline font-semibold flex items-center gap-1"
          >
            {t("search_view_all", locale)}
            <ArrowRight size={13} className={isUrdu ? "rotate-180" : ""} />
          </Link>
          <div className="text-[11px] text-gray-400 hidden sm:block">
            {locale === "ur"
              ? "TheSevenSpice گلوبل B2B سپائس کیٹلاگ"
              : "TheSevenSpice Global B2B Catalog"}
          </div>
        </div>
      </div>
    </div>
  );
}
