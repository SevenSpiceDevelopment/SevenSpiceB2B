"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QuoteModal from "./QuoteModal";
import { Search, SlidersHorizontal, Tag } from "lucide-react";

export default function ProductCatalog({ initialProducts }) {
  const searchParams = useSearchParams();
  
  // State
  const [products, setProducts] = useState(initialProducts || []);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState({ name: "", id: "" });

  // Get category list dynamically
  const categories = ["All", ...new Set(initialProducts.map(p => p.category))];

  // Auto-trigger modal if search params are present (e.g. redirected from Home page)
  useEffect(() => {
    const quoteProduct = searchParams.get("quoteProduct");
    const productId = searchParams.get("productId");
    if (quoteProduct) {
      setModalProduct({ name: quoteProduct, id: productId || "" });
      setModalOpen(true);
    }
  }, [searchParams]);

  // Filter products based on search & category selection
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openQuote = (product) => {
    setModalProduct({ name: product.name, id: product.id });
    setModalOpen(true);
  };

  return (
    <div className="space-y-stack-lg animate-fadeIn">
      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-low border border-on-surface/10 rounded-lg p-5">
        {/* Search */}
        <div className="relative w-full md:max-w-md shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
          <input
            type="text"
            placeholder="Search catalog by spice name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-on-surface/15 focus:border-primary focus:ring-0 rounded pl-11 pr-4 py-2.5 font-body-md text-sm text-on-surface transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="text-on-surface-variant/40 w-4 h-4 mr-2 hidden lg:block" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`font-label-md text-xs px-4 py-2.5 rounded transition-all border ${
                selectedCategory === category
                  ? "bg-primary border-primary text-on-primary font-bold shadow-sm"
                  : "bg-surface border-on-surface/10 text-on-surface-variant hover:text-primary hover:border-primary/30"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-surface-container-lowest border border-on-surface/10 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(26,26,26,0.04)] hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div>
                {/* Image Frame */}
                <div className="h-60 overflow-hidden relative bg-surface-container-high border-b border-on-surface/10">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5">
                    <Tag size={10} /> {product.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-title-lg text-title-lg text-primary line-clamp-1">{product.name}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Specs and CTAs */}
              <div className="px-6 pb-6 pt-2">
                <div className="border-t border-on-surface/5 pt-4 mb-4">
                  <div className="flex flex-col gap-1.5 text-xs font-mono text-on-surface-variant/80">
                    <div className="flex justify-between">
                      <span>PACKAGING SPEC</span>
                      <span className="text-on-surface font-semibold">{product.packaging_info}</span>
                    </div>
                    <div className="flex justify-between border-t border-on-surface/5 pt-1.5 mt-1">
                      <span>BASE RATE / MOQ</span>
                      <span className="text-primary font-bold">{product.price_moq}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openQuote(product)}
                  className="w-full bg-primary text-on-primary py-3 rounded text-center font-label-md hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Request Commercial Quote
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-surface-container-low border border-on-surface/10 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">inventory_2</span>
            <p className="font-body-lg text-on-surface-variant">No products found matching your active filters.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-4 text-xs font-label-md text-primary hover:underline"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </div>

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
      />
    </div>
  );
}
