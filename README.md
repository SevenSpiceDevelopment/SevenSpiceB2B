# TheSevenSpice B2B Wholesale Platform

A responsive B2B logistics and wholesale marketing portal for **TheSevenSpice**. It includes public marketing pages, a dynamic product catalog, blog content, lead capture forms, a floating WhatsApp CTA, and a route-protected custom **Admin Dashboard** for managing site content.

---

## Technology Stack
* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS with custom design tokens
* **Database:** Turso/libSQL with local JSON fallback
* **Authentication:** NextAuth.js with JWT credentials auth
* **Forms:** React Hook Form and Server Actions

---

## Key Features
1. **Dynamic Public Pages:** Marketing pages include `/`, `/products`, `/about`, `/contact`, and `/blog`.
2. **Hybrid Database Client:** When Turso is not configured, the app falls back to local JSON storage at `lib/mockDb.json`.
3. **Admin Dashboard:** Protected `/admin` area for managing products, blog posts, inquiries, quote requests, site settings, and admin credentials.
4. **CSV Exporter:** Quote request lists can be downloaded as Excel-compatible CSV reports.
5. **Floating WhatsApp CTA:** Public pages include a floating WhatsApp button configured from Admin Settings.
6. **SEO & Indexing:** Dynamic metadata, Open Graph tags, sitemap generation, and robots rules are included.
7. **Multilingual UI:** English and Urdu UI copy is handled through `lib/translations.js`.

---

## Recent Updates
* Added `components/WhatsAppButton.js` and mounted it globally from `app/layout.js`.
* Added WhatsApp number and default message fields to Admin Settings.
* Updated `lib/db.js` so existing Turso databases still receive compatibility migrations for `whatsapp_number` and `whatsapp_message`.
* Added local fallback merging in `getSiteSettings()` so older `lib/mockDb.json` files still receive default WhatsApp values.
* Added polished responsive UI updates, mobile catalog/blog layouts, and updated product imagery.

---

## Project Structure
```text
/app
  /(public)          Public marketing pages
  /admin             Protected admin dashboard screens
  /api/auth          NextAuth.js API route handlers
  /globals.css       Global styles
  /layout.js         Main layout, metadata, navbar, footer, WhatsApp CTA
  /robots.js         Dynamic robots.txt generation
  /sitemap.js        Dynamic sitemap.xml generation
/components
  /admin             Admin dashboard UI components
  WhatsAppButton.js  Floating public WhatsApp CTA
  Navbar.js          Public navigation
  Footer.js          Public footer
/lib
  /db.js             Turso/local JSON database wrapper
  /auth.js           NextAuth.js configuration
  /schema.sql        Database schema reference
  /mockDb.json       Local fallback database file
/middleware.js       Admin route protection
/tailwind.config.js  Theme tokens and Tailwind config
```

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the project root.

For local JSON fallback, leave `TURSO_DATABASE_URL` empty or set it to `placeholder`.

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sevenspice_super_secret_key_12345

ADMIN_EMAIL=admin@thesevenspice.com
ADMIN_PASSWORD=password123

TURSO_DATABASE_URL=placeholder
TURSO_AUTH_TOKEN=
```

For live Turso:

```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port `3000` is already in use, Next.js may run on another port such as [http://localhost:3001](http://localhost:3001).

---

## Admin Access
For local testing:
* **Login URL:** `/admin/login`
* **Email:** `admin@thesevenspice.com`
* **Password:** `password123`

The password can be changed from Admin Settings.

---

## WhatsApp Button Setup
The floating WhatsApp CTA is rendered globally through `app/layout.js` and `components/WhatsAppButton.js`.

To configure it:
1. Log in to `/admin/login`.
2. Open **Admin Settings**.
3. Go to **HQ Contact & Socials**.
4. Add a WhatsApp number with country code, for example `+923001234567`.
5. Add an optional default pre-filled message.
6. Save settings and check a public page such as `/`, `/products`, or `/contact`.

The button will not show when:
* The current route starts with `/admin`.
* `whatsapp_number` is empty or missing from site settings.
* The database is an older Turso schema that has not yet received the WhatsApp columns.

The current `lib/db.js` handles the database issue by always running compatibility migrations before reading settings. It also merges local mock settings with default settings so older `lib/mockDb.json` files do not hide the button.

---

## Turso Production Setup
1. Create or open your Turso database.
2. Apply `lib/schema.sql` if the database is new.
3. Configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in your deployment provider.
4. Start the app once so `lib/db.js` can run compatibility migrations for existing databases.
5. Confirm Admin Settings shows the WhatsApp fields, then save the desired WhatsApp number and message.

---

## Troubleshooting
* If the WhatsApp button does not appear, first check that the page is not under `/admin`.
* Confirm the WhatsApp number is saved in Admin Settings with the country code.
* Restart the dev server after changing `.env.local`.
* If using Turso, make sure the app has run once after this update so the compatibility migration can add the WhatsApp columns.
