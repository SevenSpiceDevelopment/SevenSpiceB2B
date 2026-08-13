Seven Spices — Website Logo Package

BRAND
- Name: SEVEN SPICES
- Primary mark: Burgundy-red faceted star with integrated 7
- Wordmark: Dark charcoal serif
- Background: Transparent

FOLDERS
01_Master
  High-resolution master PNG assets.

02_Website_Header
  Horizontal logo PNG and lossless WebP variants.
  Recommended:
  - Desktop navbar: 320w–640w source, displayed around 160–260 CSS px wide.
  - Large/retina header: 640w–1280w source.

03_Stacked_Logo
  Stacked logo for hero sections, footer, contact/about pages, and print-like layouts.

04_Icon_Favicon
  Icon-only versions from 16x16 through 512x512.
  Includes favicon.ico, apple-touch-icon.png, and Android Chrome icons.

05_Social_Sharing
  Square logo assets and a 1200x630 Open Graph-ready transparent logo canvas.

WEBSITE IMPLEMENTATION EXAMPLE

HTML:
<img
  src="/assets/logo/seven-spices-horizontal-640w.webp"
  srcset="
    /assets/logo/seven-spices-horizontal-320w.webp 320w,
    /assets/logo/seven-spices-horizontal-640w.webp 640w,
    /assets/logo/seven-spices-horizontal-960w.webp 960w
  "
  sizes="(max-width: 768px) 180px, 240px"
  alt="Seven Spices"
  class="site-logo"
/>

CSS:
.site-logo {
  display: block;
  width: clamp(160px, 18vw, 260px);
  height: auto;
  object-fit: contain;
}

Favicon:
<link rel="icon" href="/assets/logo/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/assets/logo/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/logo/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/assets/logo/android-chrome-512x512.png">

NOTES
- Keep the logo aspect ratio unchanged.
- Do not stretch, skew, recolor, or add effects.
- Preserve clear space around the emblem and wordmark.
- Use the icon-only asset for very small UI placements where the full wordmark would be unreadable.
