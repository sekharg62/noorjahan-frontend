# NOORJAHAN FABRICS & Design — E-Commerce

Next.js 16 e-commerce storefront for **NOORJAHAN FABRICS & Design**, built with TypeScript and Tailwind CSS v4. Layout inspired by modern Pakistani fashion retail sites.

## Features

- **Slug-based routing** — `/product/[slug]`, `/collection/[slug]`, `/pages/[slug]`
- **SEO** — Metadata API, Open Graph, Twitter cards, JSON-LD product schema, `sitemap.xml`, `robots.txt`
- **Product cards** — Hover quick view, add to cart, sold-out badges
- **Cart** — Drawer + full cart page with localStorage persistence, WhatsApp checkout
- **Centralized config** — `src/config/siteConfig.json` (brand, WhatsApp, email, social, SEO)
- **Static data** — `src/data/data.tsx` (nav, products, collections)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  config/siteConfig.json   # Brand, contact, SEO, social links
  data/data.tsx            # Products, collections, navigation
  app/
    page.tsx               # Home (hero, featured grid, categories)
    product/[slug]/        # Product detail + JSON-LD
    collection/[slug]/     # Collection listing
    cart/                  # Cart page
    search/                # Product search
    pages/[slug]/          # Static content pages
  components/              # Header, Footer, ProductCard, etc.
  context/cart-context.tsx # Cart state
  lib/seo.ts               # Metadata helpers
```

## Brand & Contact

Edit `src/config/siteConfig.json` (defaults to **NOORJAHAN FABRICS & Design**):

- `brandName`, `shortName`, `brandSubtitle`, `tagline`
- `contact.email`, `contact.whatsapp`, `contact.phone`
- `seo.siteUrl` (use your production domain for canonical URLs)
- `social.*` links (leave empty to hide)

Edit products and collections in `src/data/data.tsx`.

## Build

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- lucide-react
