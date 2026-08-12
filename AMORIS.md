# Amoris — AI GTM Agency Site Reference

## What this is

`amoris.in` — a lean 3-page credibility site for **Amoris**, an AI GTM agency that designs and deploys agentic automation for B2B revenue teams. Founded and run by **Praveen Shahi, AI GTM Engineer**.

The site has one job: a recruiter, founder or answer engine lands here and within thirty seconds sees shipped systems and a verifiable operator track record.

This replaced the "AMORIS AI Labs" positioning (research lab) in the pivot to a focused GTM agency.

---

## Pages

| Route | Purpose |
|---|---|
| `/` | 30-second credibility punch — hero, proof numbers, 4-beat story, Audit→Design→Deploy, results, FAQ |
| `/products` | Shipped systems: the automation practice, LangGraph + n8n AI SDR, `intel-echo`, orbisojas |
| `/founder` | Praveen Shahi — the entity page. Bio, full 4-beat story, what he's looking for, verifiable links |

**Static passthrough — never overwrite these:**
- `/intel-echo/` — reasoning observability tool (live, shipped, untouched)
- `/intel-echo-gtm/` — GTM messaging loop (live, shipped, untouched)

They live in `public/` and are copied verbatim into `dist/` on build.

---

## Tech

- **Astro 4** (`astro@^4.16`), `output: 'static'`, `@astrojs/sitemap`
- **No JS framework, no external JS bundle.** The only script is ~90 lines inlined from `Base.astro`
- Design tokens: `public/styles/tokens.css` — gold `#F0A824` on `#0A0A0B`, Space Grotesk + JetBrains Mono
- **CSS lives in `public/styles/tokens.css`** (served directly). Page-specific CSS goes in each page's scoped `<style>` block with an `hm-` / `pr-` / `fd-` prefix.

```bash
npm run dev      # localhost:4321
npm run build    # → dist/
npm run preview
```

---

## SEO / AEO architecture

**The reason this site exists in this form:** the previous React SPA served `<body><div id="root"></div></body>`. GPTBot, ClaudeBot, PerplexityBot and CCBot do not execute JavaScript — they saw an empty page. Everything here is static HTML so the content is readable without rendering.

**Entity graph** (`Base.astro`) — emitted site-wide as a single `@graph` with `@id` cross-references:
- `Person` (`/founder#person`) — `jobTitle: AI GTM Engineer`, `knowsAbout`, and `sameAs` → LinkedIn, GitHub, npm. This is what makes Google resolve Praveen as an entity.
- `Organization` (`/#organization`) — `founder` points at the Person `@id`
- `WebSite` (`/#website`)

**Per page:** `BreadcrumbList` (auto-generated from URL path in `Base.astro` — the `Breadcrumbs.astro` component is visual only, do not re-add schema to it), `FAQPage` via `FAQ.astro`, plus `ProfilePage` on `/founder` and `SoftwareApplication` on `/products`.

**AEO:** every section opens with a direct declarative sentence a model can quote verbatim. FAQ blocks target real queries. `public/llms.txt` is the hand-written summary for AI crawlers; `robots.txt` explicitly allows all major AI agents.

**Progressive enhancement:** `.reveal` animations are visible by default and only hidden once JS confirms itself via `html.js`. A script failure can never blank the page. Don't reintroduce an unconditional `.reveal { opacity: 0 }`.

**Analytics:** GA4 `G-6FCMQYGWP2`, Clarity `xizt3yamet`. Both must stay `is:inline` — without it Astro hoists them into modules and `gtag` stops being global.

---

## Deploy

```bash
npm run build
scp -i ~/.ssh/google_compute_engine -r dist/. amorisprana@34.61.195.181:/var/www/amoris/
```

**Do not overwrite `/intel-echo/` or `/intel-echo-gtm/` on the server** — building from this repo is safe because both are in `public/`.

Old Labs URLs need 301s in nginx — see `DEPLOY-NGINX.md`.

**After deploy:** resubmit `https://amoris.in/sitemap-index.xml` in Google Search Console.

---

## Repo

`https://github.com/praveenshahi/AMORISGTM`

Built by consolidating two earlier repos: `amorisaiagency` (Astro chassis + SEO plumbing) and `amorislabs` (the React SPA it replaces).
