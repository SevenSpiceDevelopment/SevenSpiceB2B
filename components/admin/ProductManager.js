"use client";

import { useState } from "react";
import { saveProductAction, deleteProductAction } from "@/app/actions";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  Upload, 
  Check, 
  Loader2,
  AlertCircle
} from "lucide-react";

export default function ProductManager({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setImagePreview(product.image_url);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
        setSuccess(res.message);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    if (editingProduct) {
      formData.append("id", editingProduct.id);
      if (editingProduct.image_url) {
        formData.append("existing_image_url", editingProduct.image_url);
      }
    }

    try {
      const res = await saveProductAction(formData);
      if (res.success) {
        // Simple strategy: reload list or update local state
        // To be safe and reflect changes instantly without page refreshes, we can reload window or mock local updates.
        // Reloading window or updating the state via window.location.reload() is clean, but let's just trigger a hard refresh of data
        setSuccess(res.message);
        setTimeout(() => {
          setIsFormOpen(false);
          window.location.reload();
        }, 1000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center bg-surface border border-on-surface/10 rounded-lg p-4 shadow-xs">
        <span className="text-sm text-on-surface-variant font-mono">
          Items in inventory: <strong>{products.length}</strong>
        </span>
        <button
          onClick={openAddForm}
          className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-4 py-2.5 rounded hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {success && (
        <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded flex items-center gap-3 text-sm animate-fadeIn">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded flex items-center gap-3 text-sm animate-fadeIn">
          <AlertCircle size={18} className="text-error" />
          <span>{error}</span>
        </div>
      )}

      {/* Products Table Card */}
      <div className="bg-surface border border-on-surface/10 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container-low border-b border-on-surface/10 font-mono text-xs text-on-surface-variant/80 uppercase">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-on-surface/5">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded border border-on-surface/10 overflow-hidden bg-surface-container shrink-0">
                        <img 
                          src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=80" } 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate max-w-[200px]">
                        <p className="font-semibold text-primary">{product.name}</p>
                        <p className="text-xs text-on-surface-variant line-clamp-1">{product.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-on-surface-variant">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
                        product.is_visible 
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container-high text-on-surface-variant/70"
                      }`}>
                        {product.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {product.is_visible ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2 border border-on-surface/10 rounded text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                          title="Edit Product"
                          disabled={loading}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 border border-on-surface/10 rounded text-on-surface-variant hover:border-error hover:text-error hover:bg-error/5 transition-all"
                          title="Delete Product"
                          disabled={loading}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-on-surface-variant/80 font-mono text-sm">
                    No products added to wholesale catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sliding Edit/Add Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-xl bg-surface border-l border-on-surface/10 shadow-[0_20px_50px_rgba(26,26,26,0.15)] flex flex-col h-full animate-slideIn">
            {/* Form Header */}
            <div className="p-6 border-b border-on-surface/10 bg-surface-container-low flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-secondary font-bold uppercase tracking-wider">
                  {editingProduct ? "Modify Registry" : "New Catalog Entry"}
                </span>
                <h3 className="font-title-lg text-title-lg text-primary mt-1">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-on-surface/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Product Name */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="prod-name">
                  Product Name *
                </label>
                <input
                  id="prod-name"
                  name="name"
                  required
                  placeholder="e.g. Premium Grade Kashmiri Saffron"
                  defaultValue={editingProduct?.name || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="prod-category">
                  Product Category *
                </label>
                <select
                  id="prod-category"
                  name="category"
                  required
                  defaultValue={editingProduct?.category || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm cursor-pointer"
                >
                  <option value="" disabled>Select category...</option>
                  <option value="Spices">Spices</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Powder">Powder</option>
                  <option value="Blends">Spice Blends</option>
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="prod-desc">
                  Product Description *
                </label>
                <textarea
                  id="prod-desc"
                  name="description"
                  required
                  placeholder="Detailed description of flavors, processing, certifications, and grading..."
                  rows={4}
                  defaultValue={editingProduct?.description || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm resize-y"
                />
              </div>

              {/* Image upload with preview */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs text-on-surface-variant">Product Image</label>
                <div className="flex items-center gap-6 p-4 border border-dashed border-on-surface/20 rounded">
                  <div className="w-20 h-20 bg-surface-container-high rounded overflow-hidden flex items-center justify-center shrink-0 border border-on-surface/10">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-on-surface-variant/40" size={24} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="bg-secondary-container text-on-secondary-container text-xs font-label-md px-4 py-2.5 rounded cursor-pointer hover:opacity-90 transition-all inline-block">
                      Choose File
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                        disabled={loading}
                      />
                    </label>
                    <p className="text-[10px] text-on-surface-variant/75 font-mono">JPG, PNG, WEBP (Max 2MB file size)</p>
                  </div>
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-3 p-4 bg-surface-container rounded border border-on-surface/5">
                <input
                  type="checkbox"
                  id="prod-visibility"
                  name="is_visible"
                  value="true"
                  defaultChecked={editingProduct ? editingProduct.is_visible : true}
                  disabled={loading}
                  className="rounded border-on-surface/20 text-primary focus:ring-primary w-5 h-5 cursor-pointer"
                />
                <div>
                  <label htmlFor="prod-visibility" className="font-semibold text-sm text-primary block cursor-pointer">
                    Show in catalog
                  </label>
                  <span className="text-xs text-on-surface-variant">Toggle visibility on the public website pages.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-on-surface/10 flex justify-end gap-3 bg-surface pb-6 sticky bottom-0">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={loading}
                  className="px-5 py-2.5 rounded border border-on-surface/20 text-xs font-label-md text-on-surface-variant hover:bg-on-surface/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary-container text-on-secondary-container text-xs font-label-md px-6 py-2.5 rounded hover:opacity-90 transition-all flex items-center gap-2 disabled:bg-secondary-container/60 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <>
                      Saving...
                      <Loader2 className="animate-spin w-3.5 h-3.5" />
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
