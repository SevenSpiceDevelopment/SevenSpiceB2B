"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  saveProductAction, 
  deleteProductAction, 
  batchSaveProductsAction,
  saveCollectionAction,
  deleteCollectionAction 
} from "@/app/actions";
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
  AlertCircle,
  Layers,
  Sparkles,
  Search,
  PlusCircle,
  FolderPlus,
  PackagePlus,
  Boxes,
  ArrowRight
} from "lucide-react";
import WysiwygEditor from "@/components/admin/WysiwygEditor";

export default function ProductManager({ initialProducts = [], initialCollections = [] }) {
  const [activeTab, setActiveTab] = useState("products"); // "products" | "collections"
  const [products, setProducts] = useState(initialProducts || []);
  const [collections, setCollections] = useState(initialCollections || []);

  // Filter states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState("All");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // Product Form states
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [descValue, setDescValue] = useState("");
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  // Batch Add Form states
  const [isBatchFormOpen, setIsBatchFormOpen] = useState(false);
  const [batchCategory, setBatchCategory] = useState("Spices");
  const [batchCollection, setBatchCollection] = useState("");
  const [batchRows, setBatchRows] = useState([
    { name: "", description: "", price_moq: "Available on inquiry", image_url: "" },
    { name: "", description: "", price_moq: "Available on inquiry", image_url: "" },
    { name: "", description: "", price_moq: "Available on inquiry", image_url: "" },
  ]);

  // Collection Form states
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionImagePreview, setCollectionImagePreview] = useState(null);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Categories list
  const categoriesList = ["Spices", "Herbs", "Powder", "Blends"];

  // Filtered collections for dropdowns
  const availableCollectionNames = useMemo(() => {
    const names = new Set(collections.map(c => c.name));
    products.forEach(p => { if (p.collection) names.add(p.collection); });
    return Array.from(names);
  }, [collections, products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (selectedCategoryFilter !== "All" && product.category?.toLowerCase() !== selectedCategoryFilter.toLowerCase()) {
        return false;
      }
      if (selectedCollectionFilter !== "All" && product.collection?.toLowerCase() !== selectedCollectionFilter.toLowerCase()) {
        return false;
      }
      if (adminSearchQuery.trim()) {
        const q = adminSearchQuery.toLowerCase().trim();
        const nameMatch = product.name?.toLowerCase().includes(q);
        const catMatch = product.category?.toLowerCase().includes(q);
        const colMatch = (product.collection || "").toLowerCase().includes(q);
        const descMatch = product.description?.toLowerCase().includes(q);
        return nameMatch || catMatch || colMatch || descMatch;
      }
      return true;
    });
  }, [products, selectedCategoryFilter, selectedCollectionFilter, adminSearchQuery]);

  // Handle single product image change
  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle collection image change
  const handleCollectionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCollectionImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open single product form
  const openAddProductForm = () => {
    setEditingProduct(null);
    setDescValue("");
    setIsSpecsOpen(false);
    setProductImagePreview(null);
    setError("");
    setSuccess("");
    setIsProductFormOpen(true);
  };

  const openEditProductForm = (product) => {
    setEditingProduct(product);
    setDescValue(product.description || "");
    setIsSpecsOpen(true);
    setProductImagePreview(product.image_url);
    setError("");
    setSuccess("");
    setIsProductFormOpen(true);
  };

  // Open Batch Add form
  const openBatchAddForm = () => {
    setBatchCategory("Spices");
    setBatchCollection("");
    setBatchRows([
      { name: "", description: "", price_moq: "Available on inquiry", image_url: "" },
      { name: "", description: "", price_moq: "Available on inquiry", image_url: "" },
      { name: "", description: "", price_moq: "Available on inquiry", image_url: "" },
    ]);
    setError("");
    setSuccess("");
    setIsBatchFormOpen(true);
  };

  // Open collection form
  const openAddCollectionForm = () => {
    setEditingCollection(null);
    setCollectionImagePreview(null);
    setError("");
    setSuccess("");
    setIsCollectionFormOpen(true);
  };

  const openEditCollectionForm = (col) => {
    setEditingCollection(col);
    setCollectionImagePreview(col.image_url);
    setError("");
    setSuccess("");
    setIsCollectionFormOpen(true);
  };

  // Batch rows modifiers
  const handleAddBatchRow = () => {
    setBatchRows([...batchRows, { name: "", description: "", price_moq: "Available on inquiry", image_url: "" }]);
  };

  const handleRemoveBatchRow = (idx) => {
    if (batchRows.length <= 1) return;
    setBatchRows(batchRows.filter((_, i) => i !== idx));
  };

  const handleBatchRowChange = (idx, field, value) => {
    const updated = [...batchRows];
    updated[idx][field] = value;
    setBatchRows(updated);
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
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

  // Delete collection
  const handleDeleteCollection = async (id) => {
    if (!confirm("Are you sure you want to delete this collection? Products in this collection will remain in their category.")) return;

    setLoading(true);
    setError("");
    try {
      const res = await deleteCollectionAction(id);
      if (res.success) {
        setCollections(collections.filter(c => c.id !== id));
        setSuccess(res.message);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Failed to delete collection.");
    } finally {
      setLoading(false);
    }
  };

  // Submit single product
  const handleProductSubmit = async (e) => {
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
        setSuccess(res.message);
        setTimeout(() => {
          setIsProductFormOpen(false);
          window.location.reload();
        }, 800);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  // Submit batch products
  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const validProducts = batchRows.filter(r => r.name && r.name.trim().length > 0);
    if (validProducts.length === 0) {
      setError("Please fill in at least one product name.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("category", batchCategory);
    formData.append("collection", batchCollection.trim());
    formData.append("products_json", JSON.stringify(validProducts));

    try {
      const res = await batchSaveProductsAction(formData);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          setIsBatchFormOpen(false);
          window.location.reload();
        }, 1000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("An error occurred while batch saving products.");
    } finally {
      setLoading(false);
    }
  };

  // Submit collection
  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    if (editingCollection) {
      formData.append("id", editingCollection.id);
      if (editingCollection.image_url) {
        formData.append("existing_image_url", editingCollection.image_url);
      }
    }

    try {
      const res = await saveCollectionAction(formData);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          setIsCollectionFormOpen(false);
          window.location.reload();
        }, 800);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("An error occurred while saving the collection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP NAVIGATION & VIEW TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-on-surface/10 rounded-xl p-4 shadow-xs">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "products"
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            <Boxes size={15} />
            <span>Products Inventory ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "collections"
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            <Layers size={15} />
            <span>Collections ({collections.length})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === "products" ? (
            <>
              {/* Batch Add to Collection */}
              <button
                onClick={openBatchAddForm}
                className="bg-secondary text-on-secondary font-label-md text-xs px-3.5 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
                title="Add multiple products in a category/collection at once"
              >
                <PackagePlus size={15} />
                <span>Batch Add to Collection</span>
              </button>

              {/* Single Product Add (Full Page) */}
              <Link
                href="/admin/products/new"
                className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-4 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={15} /> Add Single Product
              </Link>
            </>
          ) : (
            <button
              onClick={openAddCollectionForm}
              className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-4 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FolderPlus size={15} /> Add New Collection
            </button>
          )}
        </div>
      </div>

      {/* Global Alerts */}
      {success && (
        <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-center gap-3 text-sm animate-fadeIn">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded-xl flex items-center gap-3 text-sm animate-fadeIn">
          <AlertCircle size={18} className="text-error" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. TAB CONTENT: PRODUCTS INVENTORY */}
      {activeTab === "products" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-surface border border-on-surface/10 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="font-mono uppercase font-bold">Category:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    setSelectedCollectionFilter("All");
                  }}
                  className="bg-surface-container-low border border-on-surface/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="All">All Categories</option>
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Collection Filter */}
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="font-mono uppercase font-bold">Collection:</span>
                <select
                  value={selectedCollectionFilter}
                  onChange={(e) => setSelectedCollectionFilter(e.target.value)}
                  className="bg-surface-container-low border border-on-surface/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary max-w-[200px]"
                >
                  <option value="All">All Collections</option>
                  {availableCollectionNames.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
              <input
                type="text"
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-surface-container-low border border-on-surface/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-surface border border-on-surface/10 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-container-low border-b border-on-surface/10 font-mono text-xs text-on-surface-variant/80 uppercase">
                    <th className="px-5 py-3.5">Product</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Collection</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/5">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-5 py-3.5 flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg border border-on-surface/10 overflow-hidden bg-surface-container shrink-0">
                            <img 
                              src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=80" } 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="truncate max-w-[220px]">
                            <p className="font-semibold text-primary text-xs sm:text-sm">{product.name}</p>
                            <p className="text-[11px] text-on-surface-variant line-clamp-1">{product.description}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-xs text-on-surface-variant">
                          <span className="bg-surface-container-high px-2 py-0.5 rounded text-[11px]">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          {product.collection ? (
                            <span className="inline-flex items-center gap-1 bg-secondary-container/80 text-on-secondary-container px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-secondary/20 truncate max-w-[150px]">
                              <Layers size={10} className="text-secondary" />
                              <span>{product.collection}</span>
                            </span>
                          ) : (
                            <span className="text-on-surface-variant/40 text-[11px] italic">None</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            product.is_visible 
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-surface-container-high text-on-surface-variant/70"
                          }`}>
                            {product.is_visible ? <Eye size={11} /> : <EyeOff size={11} />}
                            {product.is_visible ? "Visible" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="p-1.5 border border-on-surface/10 rounded-lg text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all inline-flex items-center"
                              title="Edit Product (Full Page)"
                            >
                              <Edit size={13} />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1.5 border border-on-surface/10 rounded-lg text-on-surface-variant hover:border-error hover:text-error hover:bg-error/5 transition-all"
                              title="Delete Product"
                              disabled={loading}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-on-surface-variant/80 font-mono text-xs">
                        No products match the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: COLLECTIONS MANAGEMENT */}
      {activeTab === "collections" && (
        <div className="space-y-4">
          <div className="bg-surface border border-on-surface/10 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-container-low border-b border-on-surface/10 font-mono text-xs text-on-surface-variant/80 uppercase">
                    <th className="px-5 py-3.5">Collection</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Products Included</th>
                    <th className="px-5 py-3.5 text-center">Featured</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/5">
                  {collections.length > 0 ? (
                    collections.map((col) => {
                      const count = products.filter(p => p.collection?.toLowerCase() === col.name?.toLowerCase()).length;

                      return (
                        <tr key={col.id} className="hover:bg-surface-container-low transition-colors group">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg border border-on-surface/10 overflow-hidden bg-surface-container shrink-0">
                                <img 
                                  src={col.image_url || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=80"} 
                                  alt={col.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="truncate max-w-[240px]">
                                <p className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-1.5">
                                  <Layers size={13} className="text-secondary" />
                                  <span>{col.name}</span>
                                </p>
                                <p className="text-[11px] text-on-surface-variant line-clamp-1">{col.description || col.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-xs text-on-surface-variant">
                            <span className="bg-surface-container-high px-2 py-0.5 rounded text-[11px]">
                              {col.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs font-semibold text-primary">
                            <span className="bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full text-[11px]">
                              {count} {count === 1 ? "Product" : "Products"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                              col.is_featured 
                                ? "bg-secondary-container text-on-secondary-container"
                                : "bg-surface-container-high text-on-surface-variant/70"
                            }`}>
                              {col.is_featured ? <Sparkles size={11} /> : null}
                              {col.is_featured ? "Featured" : "Standard"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditCollectionForm(col)}
                                className="p-1.5 border border-on-surface/10 rounded-lg text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                                title="Edit Collection"
                                disabled={loading}
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteCollection(col.id)}
                                className="p-1.5 border border-on-surface/10 rounded-lg text-on-surface-variant hover:border-error hover:text-error hover:bg-error/5 transition-all"
                                title="Delete Collection"
                                disabled={loading}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-on-surface-variant/80 font-mono text-xs">
                        No collections registered. Click "Add New Collection" to create your first collection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: SINGLE PRODUCT ADD / EDIT (Moved to dedicated full-page routes /admin/products/new and /admin/products/[id]/edit) */}
      {false && isProductFormOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-xl bg-surface border-l border-on-surface/10 shadow-[0_20px_50px_rgba(26,26,26,0.15)] flex flex-col h-full animate-slideIn">
            <div className="p-6 border-b border-on-surface/10 bg-surface-container-low flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-secondary font-bold uppercase tracking-wider">
                  {editingProduct ? "Modify Product" : "New Product Registry"}
                </span>
                <h3 className="font-title-lg text-title-lg text-primary mt-1">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>
              </div>
              <button 
                onClick={() => setIsProductFormOpen(false)}
                className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-on-surface/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
              {/* Product Name */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="prod-name">
                  Product Name *
                </label>
                <input
                  id="prod-name"
                  name="name"
                  required
                  placeholder="e.g. Premium Grade Kashmiri Saffron"
                  defaultValue={editingProduct?.name || ""}
                  disabled={loading}
                  className="bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="prod-category">
                  Product Category *
                </label>
                <select
                  id="prod-category"
                  name="category"
                  required
                  defaultValue={editingProduct?.category || "Spices"}
                  disabled={loading}
                  className="bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Collection (Dropdown + Custom input) */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1 font-semibold flex items-center justify-between" htmlFor="prod-collection">
                  <span>Product Collection (Group)</span>
                  <span className="text-[10px] text-secondary font-mono font-normal">Optional</span>
                </label>
                <div className="space-y-1.5">
                  <input
                    id="prod-collection"
                    name="collection"
                    list="collections-datalist"
                    placeholder="e.g. Signature Kashmir Harvest"
                    defaultValue={editingProduct?.collection || ""}
                    disabled={loading}
                    className="w-full bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <datalist id="collections-datalist">
                    {availableCollectionNames.map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  <p className="text-[10px] text-on-surface-variant/70">
                    Select an existing collection or type a new collection name to group products together in the same category.
                  </p>
                </div>
              </div>

              {/* Description with WordPress-style WYSIWYG Editor */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-label-md text-xs text-on-surface-variant font-semibold">
                    Product Description (WordPress Visual Editor) *
                  </label>
                  <span className="text-[10px] text-secondary font-mono">Preserves Exact Spacing & Formatting</span>
                </div>

                {/* Hidden input to pass value into FormData */}
                <input type="hidden" name="description" value={descValue} />

                <WysiwygEditor
                  value={descValue}
                  onChange={(html) => setDescValue(html)}
                  disabled={loading}
                />
                <p className="mt-1.5 text-[11px] leading-relaxed text-on-surface-variant/75">
                  Type naturally: Press <strong>Enter</strong> for new paragraphs, use tool buttons for Headings (H2/H3), Bold text, and Bullet lists. Everything is preserved on the public product page.
                </p>
              </div>

              {/* Commercial Fields: MOQ & Packaging */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-label-md text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="prod-moq">
                    Minimum Order Quantity (MOQ)
                  </label>
                  <input
                    id="prod-moq"
                    name="price_moq"
                    placeholder="e.g. Custom B2B Quotation (MOQ: 150 kg)"
                    defaultValue={editingProduct?.price_moq || ""}
                    disabled={loading}
                    className="bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-label-md text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="prod-pack">
                    Export Packaging Info
                  </label>
                  <input
                    id="prod-pack"
                    name="packaging_info"
                    placeholder="e.g. 20kg vacuum-sealed aluminum foil inner liner in carton"
                    defaultValue={editingProduct?.packaging_info || ""}
                    disabled={loading}
                    className="bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Collapsible Technical Specifications Section */}
              <div className="border border-on-surface/15 rounded-xl bg-surface-container-low overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-primary hover:bg-surface-container transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-secondary" />
                    <span>Technical & Laboratory Specifications (Export Data Sheet)</span>
                  </span>
                  <span className="text-[11px] text-secondary font-mono">{isSpecsOpen ? "Collapse ▲" : "Expand ▼"}</span>
                </button>

                {isSpecsOpen && (
                  <div className="p-4 pt-2 border-t border-on-surface/10 space-y-3 bg-surface text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-on-surface-variant font-semibold mb-1">Geographic Origin</label>
                        <input
                          name="spec_origin"
                          placeholder="e.g. Pakistan / Kasur, Punjab"
                          defaultValue={editingProduct?.specifications?.origin || "Pakistan"}
                          disabled={loading}
                          className="w-full bg-surface-container-low border border-on-surface/15 rounded px-2.5 py-1.5 text-xs text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant font-semibold mb-1">Botanical / Scientific Name</label>
                        <input
                          name="spec_botanical"
                          placeholder="e.g. Allium sativum / Curcuma longa"
                          defaultValue={editingProduct?.specifications?.botanical_name || ""}
                          disabled={loading}
                          className="w-full bg-surface-container-low border border-on-surface/15 rounded px-2.5 py-1.5 text-xs text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant font-semibold mb-1">Physical Form / Appearance</label>
                        <input
                          name="spec_form"
                          placeholder="e.g. Fine Dehydrated Powder / Coarse Crystal"
                          defaultValue={editingProduct?.specifications?.form || ""}
                          disabled={loading}
                          className="w-full bg-surface-container-low border border-on-surface/15 rounded px-2.5 py-1.5 text-xs text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant font-semibold mb-1">Granulation / Mesh Size</label>
                        <input
                          name="spec_mesh"
                          placeholder="e.g. 80 – 100 Mesh / 0.2 – 0.8 mm"
                          defaultValue={editingProduct?.specifications?.mesh_size || ""}
                          disabled={loading}
                          className="w-full bg-surface-container-low border border-on-surface/15 rounded px-2.5 py-1.5 text-xs text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant font-semibold mb-1">Moisture Content</label>
                        <input
                          name="spec_moisture"
                          placeholder="e.g. Max 6.0%"
                          defaultValue={editingProduct?.specifications?.moisture || ""}
                          disabled={loading}
                          className="w-full bg-surface-container-low border border-on-surface/15 rounded px-2.5 py-1.5 text-xs text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant font-semibold mb-1">Commercial Shelf Life</label>
                        <input
                          name="spec_shelf_life"
                          placeholder="e.g. 24 Months"
                          defaultValue={editingProduct?.specifications?.shelf_life || "24 Months"}
                          disabled={loading}
                          className="w-full bg-surface-container-low border border-on-surface/15 rounded px-2.5 py-1.5 text-xs text-on-surface"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-on-surface-variant font-semibold mb-1">Certifications & Compliance</label>
                      <input
                        name="spec_certifications"
                        placeholder="e.g. 100% Halal, HACCP & ISO 22000 compliant"
                        defaultValue={editingProduct?.specifications?.certifications || "100% Halal, HACCP & ISO 22000 compliant"}
                        disabled={loading}
                        className="w-full bg-surface-container-low border border-on-surface/15 rounded px-2.5 py-1.5 text-xs text-on-surface"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs text-on-surface-variant font-semibold">Product Image</label>
                <div className="flex items-center gap-4 p-3 border border-dashed border-on-surface/20 rounded-xl bg-surface-container-low">
                  <div className="w-16 h-16 bg-surface-container-high rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-on-surface/10">
                    {productImagePreview ? (
                      <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-on-surface-variant/40" size={20} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="bg-secondary-container text-on-secondary-container text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90 transition-all inline-block shadow-xs">
                      Choose Image
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={handleProductImageChange} 
                        className="hidden" 
                        disabled={loading}
                      />
                    </label>
                    <p className="text-[10px] text-on-surface-variant/70">JPG, PNG, WEBP (Max 2MB)</p>
                  </div>
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-3 p-3.5 bg-surface-container-low rounded-xl border border-on-surface/10">
                <input
                  type="checkbox"
                  id="prod-visibility"
                  name="is_visible"
                  value="true"
                  defaultChecked={editingProduct ? editingProduct.is_visible : true}
                  disabled={loading}
                  className="rounded border-on-surface/20 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <div>
                  <label htmlFor="prod-visibility" className="font-semibold text-xs text-primary block cursor-pointer">
                    Show in Public Catalog
                  </label>
                  <span className="text-[11px] text-on-surface-variant">When enabled, buyers can browse this product.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-on-surface/10 flex justify-end gap-3 sticky bottom-0 bg-surface pb-2">
                <button
                  type="button"
                  onClick={() => setIsProductFormOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg border border-on-surface/20 text-xs font-semibold text-on-surface-variant hover:bg-on-surface/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-on-primary text-xs font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
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

      {/* 5. MODAL: BATCH ADD MULTIPLE PRODUCTS TO A COLLECTION */}
      {isBatchFormOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-3xl bg-surface border border-on-surface/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col max-h-[90vh] overflow-hidden animate-slideIn">
            {/* Header */}
            <div className="p-5 border-b border-on-surface/10 bg-surface-container-low flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-secondary font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <PackagePlus size={14} className="text-secondary" />
                  <span>Batch Product Creation</span>
                </span>
                <h3 className="font-title-lg text-lg sm:text-xl font-bold text-primary mt-1">
                  Add Multiple Products in the Same Category / Collection
                </h3>
              </div>
              <button 
                onClick={() => setIsBatchFormOpen(false)}
                className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-on-surface/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleBatchSubmit} className="flex-grow overflow-y-auto p-5 space-y-6">
              {/* Category and Collection Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-xl border border-on-surface/10">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Target Category *
                  </label>
                  <select
                    value={batchCategory}
                    onChange={(e) => setBatchCategory(e.target.value)}
                    className="w-full bg-surface border border-on-surface/15 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {categoriesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Target Collection (Group)
                  </label>
                  <input
                    list="batch-collections-list"
                    value={batchCollection}
                    onChange={(e) => setBatchCollection(e.target.value)}
                    placeholder="e.g. Signature Kashmir Harvest"
                    className="w-full bg-surface border border-on-surface/15 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                  <datalist id="batch-collections-list">
                    {availableCollectionNames.map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Product Rows List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-on-surface-variant">
                    Products to Add ({batchRows.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddBatchRow}
                    className="text-xs font-semibold text-secondary hover:text-primary flex items-center gap-1 hover:underline"
                  >
                    <PlusCircle size={14} /> Add Another Product Row
                  </button>
                </div>

                <div className="space-y-3">
                  {batchRows.map((row, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 bg-surface-container-low/60 hover:bg-surface-container-low border border-on-surface/10 rounded-xl space-y-2.5 transition-all relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-secondary">
                          #{idx + 1}
                        </span>
                        {batchRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBatchRow(idx)}
                            className="text-on-surface-variant hover:text-error p-1 rounded transition-colors"
                            title="Remove row"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5">
                          <input
                            type="text"
                            placeholder="Product Name (e.g. Kashmiri Saffron Grade A)"
                            value={row.name}
                            onChange={(e) => handleBatchRowChange(idx, "name", e.target.value)}
                            className="w-full bg-surface border border-on-surface/15 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary font-semibold"
                            required
                          />
                        </div>
                        <div className="sm:col-span-7">
                          <input
                            type="text"
                            placeholder="Brief description / grading info..."
                            value={row.description}
                            onChange={(e) => handleBatchRowChange(idx, "description", e.target.value)}
                            className="w-full bg-surface border border-on-surface/15 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            placeholder="Price & MOQ (e.g. $8.50/gram (MOQ: 500g))"
                            value={row.price_moq}
                            onChange={(e) => handleBatchRowChange(idx, "price_moq", e.target.value)}
                            className="w-full bg-surface border border-on-surface/15 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary text-on-surface-variant"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <input
                            type="url"
                            placeholder="Image URL (optional)"
                            value={row.image_url}
                            onChange={(e) => handleBatchRowChange(idx, "image_url", e.target.value)}
                            className="w-full bg-surface border border-on-surface/15 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-on-surface/10 flex justify-between items-center bg-surface sticky bottom-0">
                <button
                  type="button"
                  onClick={handleAddBatchRow}
                  className="px-3 py-1.5 rounded-lg border border-secondary/30 text-xs font-semibold text-secondary hover:bg-secondary/10 transition-colors flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Row
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBatchFormOpen(false)}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg border border-on-surface/20 text-xs font-semibold text-on-surface-variant hover:bg-on-surface/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-on-primary text-xs font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        Saving Batch...
                        <Loader2 className="animate-spin w-3.5 h-3.5" />
                      </>
                    ) : (
                      "Save All Products"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: COLLECTION ADD / EDIT */}
      {isCollectionFormOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-lg bg-surface border-l border-on-surface/10 shadow-[0_20px_50px_rgba(26,26,26,0.15)] flex flex-col h-full animate-slideIn">
            <div className="p-6 border-b border-on-surface/10 bg-surface-container-low flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-secondary font-bold uppercase tracking-wider">
                  {editingCollection ? "Modify Collection" : "New Collection"}
                </span>
                <h3 className="font-title-lg text-title-lg text-primary mt-1">
                  {editingCollection ? "Edit Collection" : "Add Collection"}
                </h3>
              </div>
              <button 
                onClick={() => setIsCollectionFormOpen(false)}
                className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-on-surface/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCollectionSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
              {/* Collection Name */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="col-name">
                  Collection Name *
                </label>
                <input
                  id="col-name"
                  name="name"
                  required
                  placeholder="e.g. Signature Kashmir Harvest"
                  defaultValue={editingCollection?.name || ""}
                  disabled={loading}
                  className="bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="col-category">
                  Primary Category *
                </label>
                <select
                  id="col-category"
                  name="category"
                  required
                  defaultValue={editingCollection?.category || "Spices"}
                  disabled={loading}
                  className="bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="col-desc">
                  Collection Description
                </label>
                <textarea
                  id="col-desc"
                  name="description"
                  placeholder="Brief highlight about the origins, terroir, or processing of this product collection..."
                  rows={3}
                  defaultValue={editingCollection?.description || ""}
                  disabled={loading}
                  className="bg-surface-container-low border border-on-surface/15 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary resize-y"
                />
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs text-on-surface-variant font-semibold">Collection Hero Image</label>
                <div className="flex items-center gap-4 p-3 border border-dashed border-on-surface/20 rounded-xl bg-surface-container-low">
                  <div className="w-16 h-16 bg-surface-container-high rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-on-surface/10">
                    {collectionImagePreview ? (
                      <img src={collectionImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-on-surface-variant/40" size={20} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="bg-secondary-container text-on-secondary-container text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90 transition-all inline-block shadow-xs">
                      Choose Image
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={handleCollectionImageChange} 
                        className="hidden" 
                        disabled={loading}
                      />
                    </label>
                    <p className="text-[10px] text-on-surface-variant/70">JPG, PNG, WEBP (Max 2MB)</p>
                  </div>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 p-3.5 bg-surface-container-low rounded-xl border border-on-surface/10">
                <input
                  type="checkbox"
                  id="col-featured"
                  name="is_featured"
                  value="true"
                  defaultChecked={editingCollection ? editingCollection.is_featured : true}
                  disabled={loading}
                  className="rounded border-on-surface/20 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <div>
                  <label htmlFor="col-featured" className="font-semibold text-xs text-primary block cursor-pointer">
                    Feature on Catalog Filters
                  </label>
                  <span className="text-[11px] text-on-surface-variant">Show this collection as a quick-filter pill in public catalog.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-on-surface/10 flex justify-end gap-3 sticky bottom-0 bg-surface pb-2">
                <button
                  type="button"
                  onClick={() => setIsCollectionFormOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg border border-on-surface/20 text-xs font-semibold text-on-surface-variant hover:bg-on-surface/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-on-primary text-xs font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      Saving...
                      <Loader2 className="animate-spin w-3.5 h-3.5" />
                    </>
                  ) : (
                    "Save Collection"
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
