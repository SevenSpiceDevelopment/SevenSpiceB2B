"use client";

import { useState } from "react";
import Link from "next/link";
import { saveBlogPostAction, deleteBlogPostAction } from "@/app/actions";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileEdit, 
  X, 
  Upload, 
  Check, 
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  Bold,
  Italic,
  Heading2,
  List
} from "lucide-react";

export default function BlogManager({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [slug, setSlug] = useState("");
  const [wysiwygContent, setWysiwygContent] = useState("");
  const [rawHtmlMode, setRawHtmlMode] = useState(false);

  // Helper to generate slug in real time
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/[\s_]+/g, "-") // Replace spaces/underscores with -
      .replace(/-+/g, "-") // Replace multiple - with single -
      .replace(/^-+|-+$/g, ""); // Trim - from start/end
  };

  const handleTitleChange = (e) => {
    if (!editingPost) {
      setSlug(generateSlug(e.target.value));
    }
  };

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
    setSlug("");
    setWysiwygContent("");
    setRawHtmlMode(false);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const openEditForm = (post) => {
    setEditingProduct(post);
    setImagePreview(post.featured_image);
    setSlug(post.slug);
    setWysiwygContent(post.content);
    setRawHtmlMode(false);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await deleteBlogPostAction(id);
      if (res.success) {
        setPosts(posts.filter(p => p.id !== id));
        setSuccess(res.message);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Failed to delete blog post.");
    } finally {
      setLoading(false);
    }
  };

  // Insert HTML helper at cursor for custom editor
  const insertHtml = (tagOpen, tagClose = "") => {
    const textarea = document.getElementById("blog-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagOpen + selected + tagClose;
    
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setWysiwygContent(newContent);
    
    // Focus back & select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    formData.set("slug", slug);
    formData.set("content", wysiwygContent);

    if (editingPost) {
      formData.append("id", editingPost.id);
      if (editingPost.featured_image) {
        formData.append("existing_featured_image", editingPost.featured_image);
      }
    }

    try {
      const res = await saveBlogPostAction(formData);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          setIsFormOpen(false);
          window.location.reload();
        }, 1000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("An error occurred while saving the blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center bg-surface border border-on-surface/10 rounded-lg p-4 shadow-xs">
        <span className="text-sm text-on-surface-variant font-mono">
          Total published posts: <strong>{posts.length}</strong>
        </span>
        <button
          onClick={openAddForm}
          className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-4 py-2.5 rounded hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={16} /> Add Article
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

      {/* Blog List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => {
            const dateStr = post.published_at 
              ? new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }) 
              : "Draft";

            return (
              <div 
                key={post.id} 
                className="bg-surface border border-on-surface/10 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-surface-container-high rounded border border-on-surface/10 overflow-hidden shrink-0">
                    <img 
                      src={post.featured_image || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=80" } 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary text-base leading-tight hover:underline">
                      <Link href={`/blog/${post.slug}`} target="_blank">{post.title}</Link>
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant/75 font-mono mt-1.5">
                      <span>Cat: {post.category}</span>
                      <span>•</span>
                      <span>By: {post.author.split(",")[0]}</span>
                      <span>•</span>
                      <span>Published: {dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                    post.is_published 
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-surface-container-high text-on-surface-variant/70"
                  }`}>
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                  
                  <button
                    onClick={() => openEditForm(post)}
                    className="p-2.5 border border-on-surface/10 rounded text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                    title="Edit Post"
                    disabled={loading}
                  >
                    <FileEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2.5 border border-on-surface/10 rounded text-on-surface-variant hover:border-error hover:text-error hover:bg-error/5 transition-all"
                    title="Delete Post"
                    disabled={loading}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
            <div className="text-center py-12 bg-surface border border-on-surface/10 rounded-lg font-mono text-sm text-on-surface-variant/80">
              No blog posts created yet.
            </div>
          )}
        </div>

      {/* Edit/Add Sliding Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-2xl bg-surface border-l border-on-surface/10 shadow-[0_20px_50px_rgba(26,26,26,0.15)] flex flex-col h-full animate-slideIn">
            
            {/* Header */}
            <div className="p-6 border-b border-on-surface/10 bg-surface-container-low flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-secondary font-bold uppercase tracking-wider">
                  {editingPost ? "Insights Registry" : "New Editorial entry"}
                </span>
                <h3 className="font-title-lg text-title-lg text-primary mt-1">
                  {editingPost ? "Edit Blog Article" : "Create Blog Article"}
                </h3>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-on-surface/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* Title */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="blog-title">
                  Article Title *
                </label>
                <input
                  id="blog-title"
                  name="title"
                  required
                  placeholder="e.g. Sourcing Grade A Saffron: A B2B Buyer's Guide"
                  defaultValue={editingPost?.title || ""}
                  onChange={handleTitleChange}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                />
              </div>

              {/* Slug (Auto-generated/editable) */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="blog-slug">
                  Slug Address (auto-generated) *
                </label>
                <input
                  id="blog-slug"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  required
                  placeholder="sourcing-grade-a-saffron-b2b-buyers-guide"
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Category */}
                <div className="flex flex-col">
                  <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="blog-cat">
                    Article Category *
                  </label>
                  <select
                    id="blog-cat"
                    name="category"
                    required
                    defaultValue={editingPost?.category || ""}
                    disabled={loading}
                    className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm cursor-pointer"
                  >
                    <option value="" disabled>Select category...</option>
                    <option value="Industry Insights">Industry Insights</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Crop Reports">Crop Reports</option>
                    <option value="Company News">Company News</option>
                  </select>
                </div>

                {/* Author */}
                <div className="flex flex-col">
                  <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="blog-author">
                    Author Details *
                  </label>
                  <input
                    id="blog-author"
                    name="author"
                    required
                    placeholder="e.g. Imran Al-Habib, Sourcing Director"
                    defaultValue={editingPost?.author || ""}
                    disabled={loading}
                    className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                  />
                </div>
              </div>

              {/* Tags (Comma separated) */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="blog-tags">
                  Keywords / Tags (comma-separated)
                </label>
                <input
                  id="blog-tags"
                  name="tags"
                  placeholder="sourcing, saffron, logistics"
                  defaultValue={editingPost?.tags?.join(", ") || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                />
              </div>

              {/* Image upload with preview */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs text-on-surface-variant">Featured Cover Image</label>
                <div className="flex items-center gap-6 p-4 border border-dashed border-on-surface/20 rounded">
                  <div className="w-20 h-20 bg-surface-container-high rounded overflow-hidden flex items-center justify-center shrink-0 border border-on-surface/10">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-on-surface-variant/40" size={24} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="bg-primary text-on-primary text-xs font-label-md px-4 py-2.5 rounded cursor-pointer hover:bg-primary/90 transition-colors inline-block">
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
                    <p className="text-[10px] text-on-surface-variant/75 font-mono">JPG, PNG, WEBP (Max 2MB)</p>
                  </div>
                </div>
              </div>

              {/* Custom HTML editor */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-label-md text-xs text-on-surface-variant" htmlFor="blog-textarea">
                    Article content (HTML format) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setRawHtmlMode(!rawHtmlMode)}
                    className="text-xs text-secondary hover:text-primary transition-colors hover:underline font-mono"
                  >
                    {rawHtmlMode ? "WYSIWYG Toolbar" : "Show raw editor"}
                  </button>
                </div>
                
                {/* Custom editor controls bar */}
                {!rawHtmlMode && (
                  <div className="bg-surface-container border border-on-surface/10 p-2 rounded flex flex-wrap gap-2 text-on-surface-variant">
                    <button 
                      type="button" 
                      onClick={() => insertHtml("<strong>", "</strong>")} 
                      className="p-1.5 border border-on-surface/5 hover:border-on-surface/20 rounded hover:bg-surface transition-colors"
                      title="Bold"
                    >
                      <Bold size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertHtml("<em>", "</em>")} 
                      className="p-1.5 border border-on-surface/5 hover:border-on-surface/20 rounded hover:bg-surface transition-colors"
                      title="Italic"
                    >
                      <Italic size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertHtml("<h2>", "</h2>")} 
                      className="p-1.5 border border-on-surface/5 hover:border-on-surface/20 rounded hover:bg-surface transition-colors"
                      title="H2 Header"
                    >
                      <Heading2 size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertHtml("<ul>\n  <li>", "</li>\n</ul>")} 
                      className="p-1.5 border border-on-surface/5 hover:border-on-surface/20 rounded hover:bg-surface transition-colors"
                      title="List"
                    >
                      <List size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const url = prompt("Enter URL link address:");
                        if (url) insertHtml(`<a href="${url}" class="text-secondary hover:underline" target="_blank">`, "</a>");
                      }} 
                      className="p-1.5 border border-on-surface/5 hover:border-on-surface/20 rounded hover:bg-surface transition-colors"
                      title="Insert Link"
                    >
                      <LinkIcon size={14} />
                    </button>
                  </div>
                )}

                <textarea
                  id="blog-textarea"
                  value={wysiwygContent}
                  onChange={(e) => setWysiwygContent(e.target.value)}
                  required
                  placeholder="<h2>Heading</h2><p>Write your detailed B2B industry updates here in standard HTML paragraphs...</p>"
                  rows={10}
                  disabled={loading}
                  className="w-full bg-transparent border border-on-surface/20 focus:border-primary focus:ring-0 p-3 font-mono text-xs text-on-surface rounded resize-y"
                />
              </div>

              {/* Status toggles */}
              <div className="flex items-center gap-3 p-4 bg-surface-container rounded border border-on-surface/5">
                <input
                  type="checkbox"
                  id="blog-status"
                  name="is_published"
                  value="true"
                  defaultChecked={editingPost ? editingPost.is_published : true}
                  disabled={loading}
                  className="rounded border-on-surface/20 text-primary focus:ring-primary w-5 h-5 cursor-pointer"
                />
                <div>
                  <label htmlFor="blog-status" className="font-semibold text-sm text-primary block cursor-pointer">
                    Publish immediately
                  </label>
                  <span className="text-xs text-on-surface-variant">Uncheck to keep this article saved as a Draft.</span>
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
                    "Save Blog Article"
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
