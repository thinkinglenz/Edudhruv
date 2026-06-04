# EduDhruv — Next.js + Supabase

India's trusted study abroad guidance platform — migrated from WordPress to a modern Next.js stack.

**Live**: https://www.edudhruv.com

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **AI**: Anthropic Claude (Priya chatbot + auto blog agent)
- **Analytics**: Google Analytics 4 + Google Search Console
- **Ads**: Google AdSense (`ca-pub-8001713028154145`)
- **Affiliate**: Amazon Associates (`edudhruv-20`)

## Features

- 📰 **325 blog posts** across 6 categories migrated from WordPress
- 🎨 **Hero rotating banner** with featured posts + sponsored slots
- 🤖 **Priya AI chatbot** for education loan guidance (login required)
- 📝 **Comments system** with moderation workflow
- ⭐ **Ratings, likes, bookmarks, shares** on every post
- 🔍 **SEO optimized** — Yoast meta preserved, all WordPress URLs work
- 🔒 **Secure admin panel** at `/admin` (password protected)
- 🖼️ **4,000+ images** served from `/wp-content/uploads/` (same paths as old WP)
- 🚀 **Blog agent** that auto-publishes via GitHub Actions every 4 hours

## Quick Start

```bash
# Install dependencies
npm install

# Copy env vars
cp .env.local.example .env.local
# Edit .env.local with your Supabase + Anthropic + AdSense keys

# Run dev server
npm run dev
# Open http://localhost:3000
```

## Admin Panel

URL: `/admin/login`
Default password: see `ADMIN_PASSWORD` env var (change on Vercel before going live!)

Sections:
- **Dashboard** — Real-time stats, integrations status
- **Posts** — Paginated list with category + search filters
- **Comments** — Moderation workflow (pending/approved/spam)
- **Banners** — Sponsored banner management + analytics
- **Leads** — Student lead capture + CSV export
- **Users** — Registered students from `portal_users`
- **Marketing** — Social media + monetization tracker
- **SEO** — Per-post audit with score, sitemap, schema status
- **Blog Agent** — Auto-publishing control + topic queue
- **Settings & Keys** — Tabbed API keys management
- **My Profile** — Admin profile + password change

## Deployment

### 1. Supabase setup
1. Create project at https://supabase.com
2. Run `supabase/schema.sql` in SQL Editor
3. Run `supabase/schema-social.sql` in SQL Editor (comments, ratings, etc.)
4. Copy URL + anon key + service role key

### 2. Vercel
1. Push this repo to GitHub
2. Import into Vercel
3. Add environment variables (see `.env.local.example`)
4. Deploy

### 3. DNS
Point your domain's A record to Vercel:
- `A @  76.76.21.21`
- `CNAME www  cname.vercel-dns.com`

### 4. Import data to Supabase
After Supabase is configured, run from your local machine:
```bash
python3 automation/extract_from_backup.py
```
This imports all 325 posts + categories + featured images into Supabase.

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── [category]/           # Category listing pages
│   │   └── [slug]/           # Individual blog posts
│   ├── about/contact/...     # Static pages
│   ├── admin/                # Admin panel (password protected)
│   ├── api/                  # API routes (comments, ratings, leads, auth)
│   └── loan-portal/          # Login-required Priya chatbot
├── components/
│   ├── ads/                  # Rotating sponsored banners
│   ├── admin/                # Admin UI components
│   ├── blog/                 # Post cards, lead form, Amazon box
│   ├── home/                 # Hero banner, category slider, sections
│   ├── layout/               # Header, Footer, SiteShell
│   ├── analytics/            # Google Analytics
│   └── social/               # Comments, ratings, share buttons
└── lib/
    ├── banners.ts            # Sponsored banner config
    ├── categories.ts         # 7 category definitions
    ├── pages.ts              # Static page content
    ├── supabase.ts           # DB client + queries
    └── social.ts             # Social engagement helpers

automation/                   # Python migration scripts
├── extract_from_backup.py    # Parse WP SQL dump → JSON
├── extract_pages.py          # Extract About/Contact/Privacy/T&C pages
├── evergreen_agent.py        # Auto blog publisher

migration/                    # Source data (committed for re-import)
├── wp_export.json            # 325 posts ready to import
├── wp_pages.json             # 5 static pages
└── leads_export.json         # Lead exports

supabase/                     # Database schema
├── schema.sql                # Core tables (posts, leads)
└── schema-social.sql         # Comments, ratings, reactions, shares
```

## Migration from WordPress

All WordPress URLs are preserved via Next.js redirects:
- `/about-edudhruv` → `/about` (301)
- `/contact-us` → `/contact` (301)
- `/category/education-loan` → `/education-loan` (301)
- `/wp-admin` → `/admin`
- `/wp-login.php` → `/admin/login`

Blog post URLs are **identical** to WordPress (e.g. `/education-loan/mpower-financing-student-loan-review-2025-6`) — no SEO penalty.

## Author

EduDhruv team · edudruv@gmail.com
