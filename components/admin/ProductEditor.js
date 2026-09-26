"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Upload, 
  Layers, 
  ShieldCheck, 
  Package, 
  Check, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  FileText,
  Sparkles
} from "lucide-react";
import WysiwygEditor from "@/components/admin/WysiwygEditor";
import { saveProductAction } from "@/app/actions";
import { getProductSlug } from "@/lib/productPaths";

export default function ProductEditor({ initialProduct = null, initialCollections = [] }) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct?.id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [descValue, setDescValue] = useState(initialProduct?.description || "");
  const [productImagePreview, setProductImagePreview] = useState(initialProduct?.image_url || null);
  const [isVisible, setIsVisible] = useState(initialProduct ? Boolean(initialProduct.is_visible) : true);

  // Collections helper
  const availableCollectionNames = Array.from(new Set(initialCollections.map((c) => c.name).filter(Boolean)));
  const categoriesList = ["Spices", "Herbs", "Powder", "Blends"];


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    formData.set("description", descValue);
    formData.set("is_visible", String(isVisible));

    if (isEditing) {
      formData.set("id", initialProduct.id);
      if (initialProduct.image_url) {
        formData.set("existing_image_url", initialProduct.image_url);
      }
    }

    try {
      const res = await saveProductAction(formData);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 1000);
      } else {
        setError(res.error || "Failed to save product.");
      }
    } catch (err) {
      setError("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Action Header Bar */}
      <div className="bg-surface border border-on-surface/10 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md bg-surface/95">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 border border-on-surface/10 rounded-lg hover:border-primary hover:text-primary hover:bg-surface-container transition-colors text-on-surface-variant inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft size={16} /> Back to Products
          </Link>
          <div className="h-6 w-[1px] bg-on-surface/10 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-secondary font-bold uppercase tracking-wider">
                {isEditing ? "WordPress Product Editor" : "New Product Registry"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                isVisible ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"
              }`}>
                {isVisible ? <Eye size={10} /> : <EyeOff size={10} />}
                {isVisible ? "Public" : "Draft (Hidden)"}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-primary truncate max-w-md">
              {isEditing ? `Editing: ${initialProduct.name}` : "Create New Wholesale Product"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {isEditing && (
            <Link
              href={`/products/${getProductSlug(initialProduct)}`}
              target="_blank"
              className="px-3.5 py-2 border border-on-surface/15 rounded-lg text-xs font-semibold text-on-surface hover:text-primary hover:border-primary/40 transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink size={13} /> View Live Page
            </Link>
          )}

          <Link
            href="/admin/products"
            className="px-4 py-2 border border-on-surface/15 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary hover:bg-primary-container px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>{isEditing ? "Update Product" : "Publish Product"}</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2.5 border border-error/20">
          <AlertCircle size={16} className="text-error shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl text-xs flex items-center gap-2.5 border border-secondary/30 font-semibold">
          <Check size={16} className="text-secondary shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Full-Page Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Primary Content (Title + Full WYSIWYG + Specifications) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Product Title & Lead Overview Card */}
          <div className="bg-surface border border-on-surface/10 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <label htmlFor="prod-title" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Product Name *
              </label>
              <input
                id="prod-title"
                name="name"
                required
                defaultValue={initialProduct?.name || ""}
                placeholder="e.g. Premium Dehydrated Garlic Powder (Export Grade)"
                className="w-full text-base sm:text-lg font-semibold text-primary bg-surface-container-low border border-on-surface/15 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* 2. Full WordPress WYSIWYG Description Editor */}
          <div className="bg-surface border border-on-surface/10 rounded-xl p-6 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-on-surface/10 pb-3">
              <div>
                <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                  <FileText size={16} className="text-secondary" /> Product Description & Commercial Profile
                </h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Full WordPress visual editor. Whatever formatting, headings, bullet lists, or spacing you write here will display identically on the live product page.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded self-start sm:self-auto">
                WYSIWYG ACTIVE
              </span>
            </div>

            <WysiwygEditor
              value={descValue}
              onChange={(html) => setDescValue(html)}
              disabled={loading}
            />
          </div>

        </div>

        {/* Right Column: Meta Panels (Publish, Category, MOQ, Image) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Panel 1: Visibility & Actions */}
          <div className="bg-surface border border-on-surface/10 rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-on-surface/10 pb-2">
              Catalog Visibility
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-on-surface block">Live on Store</span>
                <span className="text-[11px] text-on-surface-variant">Visible to public wholesale buyers</span>
              </div>
              <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isVisible ? "bg-secondary" : "bg-surface-container-highest"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isVisible ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary hover:bg-primary-container py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>{isEditing ? "Save & Update Product" : "Publish Product"}</span>
            </button>
          </div>

          {/* Panel 2: Categorization */}
          <div className="bg-surface border border-on-surface/10 rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-on-surface/10 pb-2">
              Classification
            </h4>

            <div>
              <label htmlFor="prod-category" className="block text-xs font-semibold text-on-surface-variant mb-1">
                Category *
              </label>
              <select
                id="prod-category"
                name="category"
                required
                defaultValue={initialProduct?.category || "Spices"}
                className="w-full bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prod-collection" className="block text-xs font-semibold text-on-surface-variant mb-1">
                Collection / Group (Optional)
              </label>
              <input
                id="prod-collection"
                name="collection"
                list="collections-list"
                defaultValue={initialProduct?.collection || ""}
                placeholder="e.g. Ground Spices"
                className="w-full bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
              <datalist id="collections-list">
                {availableCollectionNames.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Hidden inputs to preserve commercial fields without displaying the panel */}
          <input type="hidden" name="price_moq" value={initialProduct?.price_moq || ""} />
          <input type="hidden" name="packaging_info" value={initialProduct?.packaging_info || ""} />

          {/* Panel 4: Featured Product Image */}
          <div className="bg-surface border border-on-surface/10 rounded-xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-on-surface/10 pb-2">
              Featured Image
            </h4>

            {productImagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-on-surface/15 h-48 bg-surface-container">
                <img
                  src={productImagePreview}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-on-surface/15 rounded-lg p-6 text-center text-xs text-on-surface-variant flex flex-col items-center justify-center bg-surface-container-low">
                <Package size={28} className="text-secondary mb-2" />
                <span>No product image selected</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Upload New Image File</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="text-xs text-on-surface-variant file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border file:border-on-surface/15 file:text-xs file:font-semibold file:bg-surface-container file:text-primary hover:file:bg-surface-container-high cursor-pointer w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
