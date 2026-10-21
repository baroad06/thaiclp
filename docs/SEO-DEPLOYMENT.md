# SEO deployment — thaictp.com

## Configuration

The confirmed canonical origin is `https://thaictp.com`. It is the default; override it only with another verified HTTPS origin using `SITE_URL`. Canonical and sitemap URLs never use the incoming Host header.

Production:

```sh
NODE_ENV=production SITE_URL=https://thaictp.com npm start
```

Preview/staging:

```sh
NODE_ENV=production SEO_INDEXABLE=false SITE_URL=https://thaictp.com npm start
```

`SEO_INDEXABLE=false` sets noindex through HTML and HTTP headers. robots.txt still allows crawling so crawlers can see noindex; it omits the production sitemap in preview mode. Development defaults to this state. `SEO_INDEXABLE=true` is an explicit override and should only be enabled on the public production site. These crawler directives are not access control.

Configure HTTP → HTTPS redirects at the TLS proxy or hosting layer. The app still listens over HTTP behind that layer; configure trusted proxy hops for the actual deployment rather than assuming every forwarded header is trustworthy. The SEO middleware redirects `www.thaictp.com` to the configured canonical origin in indexable mode (301 for GET/HEAD, method-preserving 308 for submissions). DNS and TLS for www must also be configured before that redirect can be used by real visitors.

## Implemented

- One title and description per page/locale, including all eight category pages.
- Absolute, self-referencing canonicals; reciprocal TH/EN hreflang and x-default; no search or tracking queries in SEO URLs.
- Search results with `q` are `noindex,follow`; category-only filter URLs redirect to their clean category route. The language switch preserves the user's current search independently of SEO metadata.
- `/en` normalizes to `/en/`; non-root trailing slashes normalize to the route without a slash.
- `/sitemap.xml` lists 26 canonical URLs: five main pages and eight categories in both languages. No synthetic lastmod dates.
- `/robots.txt` changes by indexing configuration and points to the production sitemap when indexable.
- Open Graph and Twitter sharing metadata; Organization/WebSite structured data on the home page, BreadcrumbList on other known pages, with visible breadcrumb navigation.
- Short, factual category introductions using existing product data. No fabricated technical specifications, ratings, prices or Product/Offer markup.
- Responsive WebP category covers for homepage cards and carousel. Source photographs remain unchanged. Rebuild using `python3 scripts/optimize-category-images.py` with Pillow installed.

## Before going live

1. Set the production environment deliberately. Check both `/` and `/en/` for `index,follow`, correct canonical/hreflang, and absence of an X-Robots-Tag noindex header.
2. Check HTTPS/non-www redirects at the hosting layer without loops; verify `/en` and category redirects preserve the intended language.
3. Fetch `/robots.txt` and `/sitemap.xml` on the public domain. Every sitemap URL should return 200 and identify itself as canonical.
4. Use Google Rich Results Test / Schema Markup Validator to validate the structured data. JSON parse checks in local tests do not replace Google's validation.
5. Verify the Search Console domain property and submit `https://thaictp.com/sitemap.xml` after ownership access is supplied. Inspect a Thai/English category pair for indexing and selected canonical.
6. Establish an analytics baseline and conversion events after account access and tracking preferences are confirmed. Do not count the existing mail form's optimistic success response as verified delivery.
7. Measure PageSpeed Insights / field Core Web Vitals after deployment. Image compression is implemented; field performance and ranking improvements have not been measured or guaranteed.

## Remaining content work

Detailed product pages, dedicated injection/extrusion service pages and purchase-intent articles need verified product specifications, manufacturing capability and business priorities. See `SEO-PLAN.md` for the full roadmap. Search Console, DNS, hosting, analytics and production deployment have not been changed in this local task.

Crawler reference: [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing). Blocking a URL in robots.txt would prevent crawlers from reading its noindex instruction.
