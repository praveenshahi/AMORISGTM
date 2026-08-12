# Amoris SEO / AEO Checklist

Last updated: 2026-08-12

---

## Done in code ✅

- [x] **Static HTML output** — content readable without JS execution. This is the core fix; the previous SPA was invisible to every AI crawler.
- [x] `@astrojs/sitemap` → `/sitemap-index.xml`, including the two `intel-echo` pages via `customPages`
- [x] `robots.txt` — explicit allows for GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, Bingbot, Amazonbot, meta-externalagent
- [x] `llms.txt` — rewritten for GTM positioning, with a "Who is Praveen Shahi" block
- [x] **Person + Organization + WebSite** as one `@graph` with `@id` cross-refs, `sameAs` → LinkedIn / GitHub / npm
- [x] `ProfilePage` on `/founder`, `SoftwareApplication` on `/products`
- [x] `BreadcrumbList` auto-generated per page (exactly one per page — verified)
- [x] `FAQPage` on all three pages via `FAQ.astro`
- [x] Canonical URLs matching sitemap entries exactly (trailing slashes verified)
- [x] OG + Twitter tags, `og-default.png` at 1200×630
- [x] One `<h1>` per page, real heading hierarchy
- [x] GA4 `G-6FCMQYGWP2` + Clarity `xizt3yamet` wired and `is:inline`
- [x] Zero external JS bundles; GSAP/three removed
- [x] Progressive enhancement — content visible without JS
- [x] Mobile verified at 375×812: no horizontal overflow, grids collapse, touch targets ≥40px

---

## Blocked on content ⏳

- [ ] **Amazon + Meta** — role titles, dates, one metric each. Currently named in the Operator beat without specifics (`index.astro` `beats[0]`, `founder.astro` `story[0]`).
- [ ] **Founder photo** — `/founder` shows an initials placeholder. Drop a ≥1000px square at `public/founder/praveen-shahi.webp` and replace the `.fd-portrait` block.
- [ ] **Client case study numbers** for Product 1 (`products.astro`, `products[0].proof`)
- [ ] **AI SDR repo URL** — currently links to the GitHub profile, not a specific repo. Point it at the repo once public.
- [ ] **X/Twitter handle** — add to `sameAs` in `Base.astro` only if the account is active. A `sameAs` pointing at a dead profile weakens the entity graph.

---

## Manual, after deploy

### 1. Google Search Console
1. https://search.google.com/search-console → property `https://amoris.in` should already exist
2. **Sitemaps** → submit `https://amoris.in/sitemap-index.xml`
3. **URL Inspection** → `https://amoris.in/founder/` → *Request indexing* (this is the entity page; prioritise it)
4. Remove the stale `sitemap.xml` submission if present

### 2. Validate structured data
- https://search.google.com/test/rich-results — run `/`, `/products/`, `/founder/`
- Confirm Person, Organization, BreadcrumbList, FAQPage, SoftwareApplication all parse with no errors
- https://validator.schema.org for the full graph

### 3. Bing
- https://www.bing.com/webmasters → Import from Search Console

### 4. Point profiles at the site
Each of these is a `sameAs` edge that strengthens the entity graph:
- LinkedIn featured link + About section → amoris.in
- GitHub profile README + website field → amoris.in
- npm `intel-echo` package homepage → amoris.in/products

---

## Verify after each deploy

```bash
# Pages live
for p in / /products/ /founder/ /intel-echo/ /intel-echo-gtm/ /llms.txt /robots.txt /sitemap-index.xml; do printf "%-22s " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "https://amoris.in$p"; done
```

```bash
# The critical one — content visible to a JS-less AI crawler
curl -s -A "GPTBot" https://amoris.in/founder/ | grep -c "AI GTM Engineer"
```

Must return a non-zero count. Against the old SPA this returned `0`, which is the entire reason for the rebuild.

```bash
# Old Labs URLs redirect rather than 404
for p in /research /labs /about; do printf "%-12s " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "https://amoris.in$p"; done
```
