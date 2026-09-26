"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { 
  saveProduct, deleteProduct, batchSaveProducts, getProductById,
  saveCollection, deleteCollection,
  saveBlogPost, deleteBlogPost, 
  saveInquiry, updateInquiryStatus, 
  saveQuoteRequest, updateQuoteRequestStatus, 
  getSiteSettingsFresh, saveSiteSettings,
  uploadMediaFile
} from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

// Helper to assert admin session
async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
  return session;
}

// Convert File to Base64 data URL on server
async function fileToBase64(file) {
  if (!file || !(file instanceof File) || file.size === 0) {
    return null;
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString("base64");
  return `data:${file.type};base64,${base64String}`;
}

// --- PUBLIC ACTIONS ---

// Submit Contact Inquiry
export async function submitInquiry(prevState, formData) {
  try {
    const name = formData.get("name");
    const company = formData.get("company") || "N/A";
    const email = formData.get("email");
    const phone = formData.get("phone") || null;
    const product_interest = formData.get("product_interest");
    const message = formData.get("message");

    if (!name || !email || !product_interest || !message) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const inquiry = {
      name,
      company,
      email,
      phone,
      product_interest,
      message,
      status: "unread"
    };

    await saveInquiry(inquiry);

    // Mock Email Notification
    console.log(`[EMAIL NOTIFICATION] New Inquiry from ${name} (${company}). Product Interest: ${product_interest}`);
    
    return { success: true, message: "Thank you! Your inquiry has been submitted successfully. Our team will contact you shortly." };
  } catch (err) {
    console.error("Error submitting inquiry:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// Submit Quote Request
export async function submitQuoteRequest(prevState, formData) {
  try {
    const product_id = formData.get("product_id") || null;
    const product_name = formData.get("product_name");
    const name = formData.get("name");
    const company = formData.get("company");
    const email = formData.get("email");
    const phone = formData.get("phone") || null;
    const quantity = formData.get("quantity");
    const message = formData.get("message") || null;

    if (!product_name || !name || !company || !email || !quantity) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const quote = {
      product_id,
      product_name,
      name,
      company,
      email,
      phone,
      quantity,
      message,
      status: "pending"
    };

    await saveQuoteRequest(quote);
    
    console.log(`[EMAIL NOTIFICATION] New Quote Request for ${product_name} (${quantity}) from ${name} (${company}).`);

    return { success: true, message: "Your quote request has been submitted successfully." };
  } catch (err) {
    console.error("Error submitting quote request:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// Request password reset instructions
export async function forgotPasswordAction(prevState, formData) {
  try {
    const email = formData.get("email");
    if (!email) {
      return { success: false, error: "Please enter your administrative email address." };
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error("[AUTH] ADMIN_EMAIL environment variable is not set.");
      return { success: false, error: "Authentication system is misconfigured." };
    }

    if (email !== adminEmail) {
      console.log(`[PASSWORD RESET BLOCKED] Password reset request for unregistered email: ${email}`);
      return { success: true, message: "If this email is registered, password recovery instructions have been logged to the server console." };
    }

    const adminPassword = process.env.ADMIN_PASSWORD || "No password configured";
    console.log(`
========================================================================
[PASSWORD RECOVERY LOG]
Admin requested credentials recovery.
Registered Admin Email: \x1b[32m${adminEmail}\x1b[0m
Configured Admin Password (Env): \x1b[33m${adminPassword}\x1b[0m

NOTE: If you have modified the password from the admin settings dashboard,
the updated password is stored as a secure bcrypt hash in the database.
To reset or overwrite the database password, you may delete the 
"admin_password" column value in the site_settings table or restart 
the application with a new ADMIN_PASSWORD env value.
========================================================================
`);

    return { success: true, message: "Password recovery instructions have been successfully logged to the server console log. Please check your terminal/logs to proceed." };
  } catch (err) {
    console.error("Error in forgotPasswordAction:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// --- ADMIN ACTIONS ---

// Create or Update Product
export async function saveProductAction(formData) {
  await assertAdmin();

  try {
    const normalizeText = (value) => {
      if (typeof value !== "string") return "";
      return value.replace(/\s+/g, " ").trim();
    };
    const normalizeMultilineText = (value) => {
      if (typeof value !== "string") return "";
      return value
        .replace(/\r\n?/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    };

    const id = formData.get("id") || null;
    const name = normalizeText(formData.get("name"));
    const category = normalizeText(formData.get("category"));
    const collection = normalizeText(formData.get("collection"));
    const description = normalizeMultilineText(formData.get("description"));
    const is_visible = formData.get("is_visible") === "true";
    
    const imageFile = formData.get("image");
    let image_url = formData.get("existing_image_url") || null;

    // Upload to Supabase storage if a new file is uploaded, fallback to base64
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const uploadedUrl = await uploadMediaFile(imageFile, "products");
      image_url = uploadedUrl || (await fileToBase64(imageFile));
    }

    if (!name || !category || !description) {
      return { success: false, error: "Please fill in all required product fields." };
    }

    // Preserve existing product details if updating
    let existingProduct = null;
    if (id) {
      try {
        existingProduct = await getProductById(id);
      } catch (e) {
        console.warn("Could not fetch existing product for preservation:", e.message);
      }
    }

    const price_moq = normalizeText(formData.get("price_moq")) || existingProduct?.price_moq || "Custom B2B Quotation (MOQ on request)";
    const packaging_info = normalizeText(formData.get("packaging_info")) || existingProduct?.packaging_info || "Bulk export packaging available on request";

    const existingSpecs = typeof existingProduct?.specifications === "object"
      ? (existingProduct.specifications || {})
      : JSON.parse(existingProduct?.specifications || "{}");

    const updatedSpecs = {
      ...existingSpecs,
      origin: normalizeText(formData.get("spec_origin")) || existingSpecs.origin || "Pakistan",
      botanical_name: normalizeText(formData.get("spec_botanical")) || existingSpecs.botanical_name || "",
      form: normalizeText(formData.get("spec_form")) || existingSpecs.form || "",
      mesh_size: normalizeText(formData.get("spec_mesh")) || existingSpecs.mesh_size || "",
      moisture: normalizeText(formData.get("spec_moisture")) || existingSpecs.moisture || "",
      shelf_life: normalizeText(formData.get("spec_shelf_life")) || existingSpecs.shelf_life || "24 Months",
      certifications: normalizeText(formData.get("spec_certifications")) || existingSpecs.certifications || "100% Halal, HACCP and ISO 22000 compliant"
    };

    const product = {
      ...(existingProduct || {}),
      name,
      category,
      collection: collection || "",
      description,
      price_moq,
      packaging_info,
      image_url: image_url || existingProduct?.image_url || null,
      is_visible,
      specifications: updatedSpecs
    };

    if (id) product.id = id;

    await saveProduct(product);

    revalidateTag("products");
    revalidateTag("collections");
    
    revalidatePath("/", "layout");
    revalidatePath("/products");
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    
    return { success: true, message: id ? "Product updated successfully." : "Product created successfully." };
  } catch (err) {
    console.error("Error saving product:", err);
    return { success: false, error: err.message || "Failed to save product." };
  }
}

// Batch Add Multiple Products under a Category & Collection
export async function batchSaveProductsAction(formData) {
  await assertAdmin();

  try {
    const category = formData.get("category");
    const collection = formData.get("collection") || "";
    const rawProductsJson = formData.get("products_json");

    if (!category) {
      return { success: false, error: "Category is required for batch product addition." };
    }

    let products = [];
    try {
      products = JSON.parse(rawProductsJson || "[]");
    } catch (e) {
      return { success: false, error: "Invalid product entries data." };
    }

    if (!Array.isArray(products) || products.length === 0) {
      return { success: false, error: "Please enter at least one product." };
    }

    const res = await batchSaveProducts({ category, collection, products });
    if (!res.success) {
      return { success: false, error: res.error || "Failed to batch save products." };
    }

    revalidateTag("products");
    revalidateTag("collections");

    revalidatePath("/", "layout");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");

    return { 
      success: true, 
      message: `Successfully added ${res.count} products to ${collection ? `"${collection}"` : category}!` 
    };
  } catch (err) {
    console.error("Error batch saving products:", err);
    return { success: false, error: err.message || "Failed to batch save products." };
  }
}

// Delete Product
export async function deleteProductAction(id) {
  await assertAdmin();
  try {
    await deleteProduct(id);

    revalidateTag("products");
    revalidateTag("collections");

    revalidatePath("/", "layout");
    revalidatePath("/products");
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true, message: "Product deleted successfully." };
  } catch (err) {
    console.error("Error deleting product:", err);
    return { success: false, error: err.message || "Failed to delete product." };
  }
}

// Create or Update Collection
export async function saveCollectionAction(formData) {
  await assertAdmin();

  try {
    const normalizeText = (value) => {
      if (typeof value !== "string") return "";
      return value.replace(/\s+/g, " ").trim();
    };

    const id = formData.get("id") || null;
    const name = normalizeText(formData.get("name"));
    const category = normalizeText(formData.get("category"));
    const description = normalizeText(formData.get("description"));
    const is_featured = formData.get("is_featured") === "true";

    const imageFile = formData.get("image");
    let image_url = formData.get("existing_image_url") || null;

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const uploadedUrl = await uploadMediaFile(imageFile, "collections");
      image_url = uploadedUrl || (await fileToBase64(imageFile));
    }

    if (!name || !category) {
      return { success: false, error: "Collection name and category are required." };
    }

    const collectionData = {
      name,
      category,
      description: description || "",
      image_url,
      is_featured
    };

    if (id) collectionData.id = id;

    await saveCollection(collectionData);

    revalidateTag("collections");
    revalidateTag("products");

    revalidatePath("/", "layout");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");

    return { success: true, message: id ? "Collection updated successfully." : "Collection created successfully." };
  } catch (err) {
    console.error("Error saving collection:", err);
    return { success: false, error: err.message || "Failed to save collection." };
  }
}

// Delete Collection
export async function deleteCollectionAction(id) {
  await assertAdmin();
  try {
    await deleteCollection(id);

    revalidateTag("collections");
    revalidateTag("products");

    revalidatePath("/", "layout");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true, message: "Collection deleted successfully." };
  } catch (err) {
    console.error("Error deleting collection:", err);
    return { success: false, error: err.message || "Failed to delete collection." };
  }
}

// Create or Update Blog Post
export async function saveBlogPostAction(formData) {
  await assertAdmin();

  try {
    const id = formData.get("id") || null;
    const title = formData.get("title");
    const slug = formData.get("slug");
    const category = formData.get("category");
    const content = formData.get("content");
    const author = formData.get("author");
    const is_published = formData.get("is_published") === "true";
    const tagsString = formData.get("tags") || "";
    
    const imageFile = formData.get("image");
    let featured_image = formData.get("existing_featured_image") || null;

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const uploadedUrl = await uploadMediaFile(imageFile, "blog");
      featured_image = uploadedUrl || (await fileToBase64(imageFile));
    }

    if (!title || !slug || !category || !content || !author) {
      return { success: false, error: "Please fill in all required blog fields." };
    }

    // Process tags into array
    const tags = tagsString
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const post = {
      title,
      slug,
      content,
      featured_image,
      category,
      tags,
      author,
      is_published,
      published_at: is_published ? new Date().toISOString() : null
    };

    if (id) post.id = id;

    await saveBlogPost(post);

    revalidateTag("blog-posts");

    revalidatePath("/", "layout");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blog");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    
    return { success: true, message: id ? "Blog post updated successfully." : "Blog post created successfully." };
  } catch (err) {
    console.error("Error saving blog post:", err);
    return { success: false, error: err.message || "Failed to save blog post." };
  }
}

// Delete Blog Post
export async function deleteBlogPostAction(id) {
  await assertAdmin();
  try {
    await deleteBlogPost(id);

    revalidateTag("blog-posts");

    revalidatePath("/", "layout");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true, message: "Blog post deleted successfully." };
  } catch (err) {
    console.error("Error deleting blog post:", err);
    return { success: false, error: err.message || "Failed to delete blog post." };
  }
}

// Update Inquiry Status
export async function updateInquiryStatusAction(id, status) {
  await assertAdmin();
  try {
    await updateInquiryStatus(id, status);
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/dashboard");
    return { success: true, message: `Inquiry marked as ${status}.` };
  } catch (err) {
    console.error("Error updating inquiry status:", err);
    return { success: false, error: "Failed to update inquiry." };
  }
}

// Update Quote Request Status
export async function updateQuoteRequestStatusAction(id, status) {
  await assertAdmin();
  try {
    await updateQuoteRequestStatus(id, status);
    revalidatePath("/admin/quotes");
    revalidatePath("/admin/dashboard");
    return { success: true, message: `Quote request marked as ${status}.` };
  } catch (err) {
    console.error("Error updating quote status:", err);
    return { success: false, error: "Failed to update quote request." };
  }
}

// Save General Site Settings
export async function saveSiteSettingsAction(formData) {
  await assertAdmin();
  try {
    const hero_title = formData.get("hero_title");
    const hero_subtitle = formData.get("hero_subtitle");
    const hero_cta_text = formData.get("hero_cta_text");
    const hero_cta_link = formData.get("hero_cta_link");
    const business_address = formData.get("business_address");
    const business_phone = formData.get("business_phone");
    const business_email = formData.get("business_email");
    const social_facebook = formData.get("social_facebook");
    const social_twitter = formData.get("social_twitter");
    const social_instagram = formData.get("social_instagram");
    const social_linkedin = formData.get("social_linkedin");
    const social_youtube = formData.get("social_youtube");
    const whatsapp_number = formData.get("whatsapp_number");
    const whatsapp_message = formData.get("whatsapp_message");
    const deal_headline_enabled = formData.get("deal_headline_enabled") === "on" || formData.get("deal_headline_enabled") === "true";
    const deal_headline_badge = formData.get("deal_headline_badge") || "";
    const deal_headline_text = formData.get("deal_headline_text") || "";
    const deal_headline_link = formData.get("deal_headline_link") || "/contact";
    const deal_headline_link_text = formData.get("deal_headline_link_text") || "Inquire Now";
    const marquee_ticker_enabled = formData.get("marquee_ticker_enabled") === "on" || formData.get("marquee_ticker_enabled") === "true";
    const rawTickerItems = formData.get("marquee_ticker_items") || "";
    const marquee_ticker_items = typeof rawTickerItems === "string"
      ? rawTickerItems.split("\n").map(s => s.trim()).filter(Boolean)
      : [];

    if (!hero_title || !hero_subtitle || !hero_cta_text || !hero_cta_link || !business_address || !business_phone || !business_email) {
      return { success: false, error: "Please fill in all required settings fields." };
    }

    const settings = {
      hero_title,
      hero_subtitle,
      hero_cta_text,
      hero_cta_link,
      business_address,
      business_phone,
      business_email,
      social_facebook,
      social_twitter,
      social_instagram,
      social_linkedin,
      social_youtube,
      whatsapp_number,
      whatsapp_message,
      deal_headline_enabled,
      deal_headline_badge,
      deal_headline_text,
      deal_headline_link,
      deal_headline_link_text,
      marquee_ticker_enabled,
      marquee_ticker_items: JSON.stringify(marquee_ticker_items)
    };

    await saveSiteSettings(settings);

    revalidateTag("site-settings");

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/dashboard");
    revalidatePath("/products");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true, message: "Site configurations and continuous moving ticker updated successfully." };
  } catch (err) {
    console.error("Error saving site settings:", err);
    return { success: false, error: err.message || "Failed to save site settings." };
  }
}

// Change Admin Password
export async function changeAdminPasswordAction(formData) {
  await assertAdmin();
  try {
    const currentPassword = formData.get("current_password");
    const newPassword = formData.get("new_password");
    const confirmPassword = formData.get("confirm_password");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "Please fill in all password fields." };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long." };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match." };
    }

    // Verify current password
    const settings = await getSiteSettingsFresh();
    let isCurrentPasswordValid = false;

    if (settings.admin_password) {
      // DB password is bcrypt-hashed
      isCurrentPasswordValid = await bcrypt.compare(currentPassword, settings.admin_password);
    } else if (process.env.ADMIN_PASSWORD) {
      // Fallback to env var for first-time password change
      isCurrentPasswordValid = currentPassword === process.env.ADMIN_PASSWORD;
    } else {
      return { success: false, error: "No admin password configured. Set ADMIN_PASSWORD in environment variables." };
    }

    if (!isCurrentPasswordValid) {
      return { success: false, error: "Incorrect current password." };
    }

    // Hash the new password before storing
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await saveSiteSettings({
      ...settings,
      admin_password: hashedPassword
    });

    return { success: true, message: "Admin password changed successfully." };
  } catch (err) {
    console.error("Error changing password:", err);
    return { success: false, error: "Failed to change password." };
  }
}
