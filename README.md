# Upthrust — landing page

Responsive landing page built from the supplied Figma design. Static site, CMS-editable, with a working newsletter form and GTM conversion tracking.

**Live:** `https://YOUR-SITE.netlify.app` · **CMS:** `/admin`

## Stack and why
- **Astro 5 (static output)** — ships almost no JS, content is in the rendered HTML (SEO), great Core Web Vitals. Content collections give typed, validated content.
- **Decap CMS** — Git-based, no database. Editors change content in a UI; it commits to GitHub; Netlify rebuilds.
- **Netlify** — hosting, build, Forms (submission storage + email notifications), OAuth for the CMS login.
- Plain CSS (container-query units, so the layout scales proportionally with the design and re-flows at breakpoints). No UI framework.
- Trade-off: Decap is simple but basic; at larger scale I'd move to a hosted headless CMS (Sanity/Contentful) with live preview and roles.

## Structure
```
src/content/site.json        SEO, nav, footer, newsletter copy
src/content/home.json        hero text, proof strip, services labels
src/content/services/*.md    one file per services slide (repeatable)
src/content.config.ts        schema (validates CMS content at build time)
src/pages/index.astro        page markup · thanks.astro = no-JS form fallback
src/layouts/BaseLayout.astro head: SEO, OG, canonical, JSON-LD, GTM dataLayer
src/scripts/services.ts      pinned horizontal scroll (progressive enhancement)
src/scripts/newsletter.ts    validation, submit, form_submit event
src/styles/global.css        all styles
public/admin/                Decap CMS (index.html + config.yml)
```

## Run locally
```
npm install
cp .env.example .env     # set PUBLIC_SITE_URL, PUBLIC_GTM_ID
npm run dev              # http://localhost:4321
npm run build            # output in dist/
```
Edit content locally: run `npm run cms` in a second terminal, open `/admin` (uses `local_backend`, no login).

## Editing content (non-developer)
Open `/admin` → log in with GitHub → edit **Services (slides)** (headline, intro, bullets, image, order, add/remove slides), **Homepage copy**, or **Site, SEO & footer**. Save/Publish → Netlify rebuilds in ~1 minute. Images uploaded to a service are optimised automatically (Astro).

## Form and tracking
- Newsletter form in the footer: validates email + consent, posts (`fetch`) to **Netlify Forms** (`name="newsletter"`, honeypot `bot-field`), shows a success state. No-JS fallback posts to `/thanks/`.
- **Submissions:** Netlify dashboard → Forms → newsletter. Add an email notification under Forms → Form notifications.
- **Tracking:** after a *successful* response only, pushes `{ event: 'form_submit', form_name: 'newsletter', form_location: 'footer' }` to `window.dataLayer`. GTM loads after `window.load` (idle) when `PUBLIC_GTM_ID` is set; the dataLayer exists from first byte so no events are lost.
- **Verify:** GTM Preview mode → submit → `form_submit` appears in the event list; or type `dataLayer` in the browser console.

## Environment variables (Netlify → Site settings → Environment)
| Var | Purpose |
|---|---|
| `PUBLIC_SITE_URL` | canonical URL, OG URLs, sitemap |
| `PUBLIC_GTM_ID` | GTM container (public by design) |
No secrets are used or committed (`.env` is git-ignored).

## SEO / accessibility / performance
Unique title + description, one H1, canonical, Open Graph/Twitter, JSON-LD (Organization, WebSite, service ItemList), sitemap, robots. Alt text, skip link, visible focus, labelled form, keyboard-scrollable slides, reduced-motion respected. Self-hosted subset fonts (~80 KB), responsive WebP via `astro:assets`, lazy-loaded below-fold images, deferred GTM.
Local Lighthouse (mobile): Performance 93 · Accessibility 100 · Best Practices 100 · SEO 100.

## Safe updates after launch
Work on a branch → Netlify deploy preview → review → merge to `main`. Content edits via CMS commit to `main` (switch Decap to `publish_mode: editorial_workflow` for review steps). Roll back with Netlify “Publish deploy” on a previous build.

## AI tools used
Claude was used to scaffold the project, render the supplied GLB models to images (three.js in headless Chrome), draft CSS and scripts, and run Lighthouse. I reviewed the code, tuned the visual match against Figma, and tested the form flow.

## Known limitations / next steps
- The Drive folder had no logos, blueprint drawing or service imagery: logos are text/SVG stand-ins, the blueprint is a generated SVG, service images are placeholder collages → replace with Figma exports.
- Statue iridescence is an approximation of the Blender shader.
- Privacy Policy link is `#`; footer body copy is placeholder-style.
- With more time: visual regression tests, CMS live preview, real logo SVGs, analytics consent banner.
