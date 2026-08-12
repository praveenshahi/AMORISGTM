# nginx — redirects for the Labs → GTM pivot

The old AMORIS AI Labs site had `/research`, `/products` and `/labs` indexed and listed in
`sitemap.xml`. `/products` still exists in the new site, so it needs no rule. `/research` and
`/labs` are retired and must 301 to the homepage so already-crawled URLs don't 404 and whatever
link equity exists is preserved.

Apply on the GCP VM (`34.61.195.181`). **Requires your SSH access — I can't apply this.**

```bash
sudo nano /etc/nginx/sites-available/amoris
```

Add inside the `server { ... }` block for `amoris.in`, **above** the main `location /`:

```nginx
# ── Labs → GTM pivot (added 2026-08) ──
location = /research      { return 301 https://amoris.in/; }
location = /research/     { return 301 https://amoris.in/; }
location = /labs          { return 301 https://amoris.in/; }
location = /labs/         { return 301 https://amoris.in/; }

# Old Astro catalogue paths, if any are still indexed
location ^~ /ai-employees  { return 301 https://amoris.in/products/; }
location ^~ /agents        { return 301 https://amoris.in/products/; }
location = /aios           { return 301 https://amoris.in/products/; }
location = /pricing        { return 301 https://amoris.in/; }
location = /how-it-works   { return 301 https://amoris.in/; }
location = /about          { return 301 https://amoris.in/founder/; }
location = /work           { return 301 https://amoris.in/products/; }
location = /contact        { return 301 https://amoris.in/#contact; }
```

Then test and reload — `nginx -t` first, always:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Verify

```bash
for p in /research /labs /about /work /ai-employees; do printf "%-16s " "$p"; curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "https://amoris.in$p"; done
```

Each should report `301` with the correct target. Then confirm the live pages still serve:

```bash
for p in / /products/ /founder/ /intel-echo/ /intel-echo-gtm/ /llms.txt /sitemap-index.xml; do printf "%-22s " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "https://amoris.in$p"; done
```

## Also worth adding

The old site's `sitemap.xml` (Labs) is superseded by `sitemap-index.xml` (Astro). Point the stale
path at the new one so anything still requesting it follows through:

```nginx
location = /sitemap.xml { return 301 https://amoris.in/sitemap-index.xml; }
```
