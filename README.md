# TheSevenSpice B2B wholesale Platform

A fully responsive, production-ready B2B logistics and wholesale marketing portal for **TheSevenSpice** featuring a dynamic product catalog, industry insights blog, lead capture systems, and a route-protected custom **Admin Dashboard** to manage all content dynamically.

---

## 🛠️ Technology Stack
* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS (Stitch Design Tokens)
* **Database:** Supabase (PostgreSQL) — with a local JSON file-based fallback
* **Authentication:** NextAuth.js (JWT strategy, credentials provider)
* **Forms:** React Hook Form + Server Actions

---

## 🚀 Key Features
1. **Dynamic Pages:** All public marketing pages (`/`, `/products`, `/about`, `/contact`, `/blog`) are statically generated (SSG/ISR) for page loading speed and SEO optimization.
2. **Hybrid Database Client:** If Supabase credentials are not provided in environment variables, the database client seamlessly falls back to reading and writing database records to a local JSON file (`lib/mockDb.json`). This ensures the app is **immediately runnable and testable** out-of-the-box.
3. **Admin Dashboard:** Access-restricted panel at `/admin` displaying real-time KPI tiles and a unified lead activity stream. Includes managers for catalog CRUD operations (with base64 image encoding uploads), blog publishing (with a custom visual WYSIWYG editor), inquiry controls, and commercial settings configurations.
4. **CSV Exporter:** Download quote requests lists filtered by interest or status directly as Excel-compatible CSV reports.
5. **SEO & Indexing:** Standard search compliance setup using dynamic metadata headers, Open Graph tags, dynamic `sitemap.xml` feeds, and `robots.txt` guidelines.

---

## 📂 Project Structure
```
/app
  /(public)         → Public marketing pages (Home, Catalog, Contact, About, Blog)
  /admin            → Route-protected admin dashboard screens
  /api/auth         → NextAuth.js API endpoint route handlers
  /globals.css      → Global stylesheets with typography, custom patterns, and mobile tap targets
  /layout.js        → Main layout template with SEO metadata settings
  /robots.js        → Dynamic robots.txt generation
  /sitemap.js       → Dynamic sitemap.xml generation
/components
  /admin            → Admin dashboard UI views
  /ui               → Shared public widgets (Navbar, Footer, Quote modal overlays)
/lib
  /db.js            → Database wrapper layer (Supabase / local JSON handler)
  /auth.js          → NextAuth.js configuration options
  /schema.sql       → Table setup scripts for Supabase SQL Editor
  /mockDb.json      → Auto-generated local database file (when fallback is active)
/middleware.js      → Security routing guards checking role authorization
/tailwind.config.js → Custom design styles, border radii, spacing, and brand colors
```

---

## 💾 Local Development Setup

### 1. Install Dependencies
Ensure you have Node.js 18+ and npm installed. Run the following command in the root folder:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory. To run using the local JSON database fallback, you can omit the Supabase variables. To switch to a live database, populate the fields below:
```env
# NextAuth Settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sevenspice_super_secret_key_12345

# Admin Login Profile
ADMIN_EMAIL=admin@thesevenspice.com
ADMIN_PASSWORD=password123

# Live Supabase Database Connection (Optional, client falls back to file storage if empty)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Development Server
Start the Next.js local development build:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Admin Access Credentials
For initial testing and local validation:
* **Admin Login URI:** `/admin/login` (accessible via the lock icon in the footer/navbar)
* **Email:** `admin@thesevenspice.com`
* **Password:** `password123` *(Can be updated directly via Admin Settings)*

---

## 🛢️ Supabase Database Production Setup
If you are deploying to production and connecting to a live Supabase project:
1. Navigate to your Supabase project dashboard.
2. Open the **SQL Editor** from the left-side navigation panel.
3. Copy the contents of the schema file: [`lib/schema.sql`](file:///d:/B2B-Seven-Spice/lib/schema.sql).
4. Paste the SQL statements into the editor and click **Run**.
5. Ensure your environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are configured in Vercel or your deployment provider.