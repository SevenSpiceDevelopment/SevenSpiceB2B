"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { 
  saveProduct, deleteProduct, 
  saveBlogPost, deleteBlogPost, 
  saveInquiry, updateInquiryStatus, 
  saveQuoteRequest, updateQuoteRequestStatus, 
  getSiteSettings, saveSiteSettings 
} from "@/lib/db";
import { revalidatePath } from "next/cache";

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
    const company = formData.get("company");
    const email = formData.get("email");
    const phone = formData.get("phone") || null;
    const product_interest = formData.get("product_interest");
    const message = formData.get("message");

    if (!name || !company || !email || !product_interest || !message) {
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

// --- ADMIN ACTIONS ---

// Create or Update Product
export async function saveProductAction(formData) {
  await assertAdmin();

  try {
    const id = formData.get("id") || null;
    const name = formData.get("name");
    const category = formData.get("category");
    const description = formData.get("description");
    const price_moq = formData.get("price_moq");
    const packaging_info = formData.get("packaging_info");
    const is_visible = formData.get("is_visible") === "true";
    
    const imageFile = formData.get("image");
    let image_url = formData.get("existing_image_url") || null;

    // Convert file to base64 if a new one is uploaded
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      image_url = await fileToBase64(imageFile);
    }

    if (!name || !category || !description || !price_moq || !packaging_info) {
      return { success: false, error: "Please fill in all required product fields." };
    }

    const product = {
      name,
      category,
      description,
      price_moq,
      packaging_info,
      image_url,
      is_visible
    };

    if (id) product.id = id;

    await saveProduct(product);
    
    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/");
    
    return { success: true, message: id ? "Product updated successfully." : "Product created successfully." };
  } catch (err) {
    console.error("Error saving product:", err);
    return { success: false, error: err.message || "Failed to save product." };
  }
}

// Delete Product
export async function deleteProductAction(id) {
  await assertAdmin();
  try {
    await deleteProduct(id);
    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, message: "Product deleted successfully." };
  } catch (err) {
    console.error("Error deleting product:", err);
    return { success: false, error: "Failed to delete product." };
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
      featured_image = await fileToBase64(imageFile);
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

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blog");
    
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
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, message: "Blog post deleted successfully." };
  } catch (err) {
    console.error("Error deleting blog post:", err);
    return { success: false, error: "Failed to delete blog post." };
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
      social_linkedin
    };

    await saveSiteSettings(settings);

    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return { success: true, message: "Site settings updated successfully." };
  } catch (err) {
    console.error("Error saving site settings:", err);
    return { success: false, error: "Failed to save site settings." };
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
    const settings = await getSiteSettings();
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
