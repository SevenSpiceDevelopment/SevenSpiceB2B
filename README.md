# TheSevenSpice B2B Wholesale Platform

A high-performance, enterprise B2B spice logistics and wholesale marketing portal for **TheSevenSpice**. It includes public marketing pages, an interactive product catalog with wholesale specifications, insights/blog content, quote request generation, bilingual localization (English / Urdu), a floating WhatsApp CTA, and a route-protected custom **Admin Dashboard** for managing site content.

---

## Technology Stack
* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS with custom design tokens
* **Database:** Supabase Cloud PostgreSQL (via `@supabase/supabase-js`)
* **Authentication:** NextAuth.js with JWT credentials auth
* **Forms:** React Hook Form and Server Actions
* **Caching:** High-speed in-memory memoization (`<1ms` response time)

---

## Key Features
1. **Dynamic Public Pages:** Marketing pages include `/`, `/products`, `/products/[slug]`, `/about`, `/contact`, and `/blog`.
2. **Supabase Cloud Database:** 100% remote cloud database for products, collections, blog posts, inquiries, quotes, and site settings.
3. **Admin Dashboard:** Protected `/admin` area for managing products, blog posts, inquiries, quote requests, site settings, and admin credentials.
4. **CSV Exporter:** Quote request lists can be downloaded as Excel-compatible CSV reports.
5. **Floating WhatsApp CTA:** Public pages include an interactive floating WhatsApp button configured from Admin Settings.
6. **SEO & Indexing:** Dynamic metadata, Open Graph tags, dynamic sitemap generation (`/sitemap.xml`), and robots rules (`/robots.txt`).
7. **Multilingual UI:** English and Urdu localization handled smoothly through `lib/translations.js`.

---

## Environment Variables (.env)

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-strong-random-secret-key
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=export.seven.spices@gmail.com
ADMIN_PASSWORD=password123@

# Supabase Database Configurations
NEXT_PUBLIC_SUPABASE_URL=https://qmeasimwncgqfuicmddf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

---

## Local Setup & Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize and Seed Supabase
```bash
npm run db:setup
```

### 3. Run in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Build and Run in Production Mode
```bash
npm run build
npm run start
```

---

## Vercel / Cloud Deployment Checklist

When deploying to **Vercel** or any cloud host:
1. Connect your GitHub repository.
2. In **Project Settings → Environment Variables**, add:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `NEXTAUTH_SECRET`
   * `NEXTAUTH_URL` (set to your production domain, e.g. `https://thesevenspice-b2b.vercel.app`)
   * `ADMIN_EMAIL`
   * `ADMIN_PASSWORD`
3. Deploy! Next.js will automatically pre-render all static pages and serve them with ultra-low latency.
