# Upthrust — landing page

Responsive landing page built from the supplied Figma design. Static site, CMS-editable, with a working newsletter form and GTM conversion tracking.

**Live:** https://upthrust-aditya.netlify.app · 
**CMS:** https://upthrust-aditya.netlify.app/admin · 
**Repo:** https://github.com/aditya24736/upthrust-landing

## Stack and why
- **Astro 5 (static output)** — ships almost no JavaScript and the content is in the rendered HTML (good for SEO and Core Web Vitals). Content collections give typed, validated content.
- **Decap CMS** — Git-based, no database. Editors change content in a UI; it commits to GitHub; Netlify rebuilds.
- **Netlify** — hosting and builds, Forms (submission storage and notifications), and OAuth for the CMS login.
- **Plain CSS** — container-query units, so the layout scales proportionally with the design and re-flows at the tablet and mobile breakpoints. No UI framework.
- **Trade-off:** Decap is simple but basic. At larger scale I would move to a hosted headless CMS (Sanity or Contentful) with live preview and roles.

## Structure
```
src/content/site.json         SEO, nav, footer, newsletter copy
src/content/home.json         hero text, proof strip, services labels
src/content/services/*.md     one file per services slide (repeatable section)
src/content.config.ts         schema (validates CMS content at build time)
src/pages/index.astro         page markup (thanks.astro = no-JS form fallback)
src/components/BrandLogo.astro client logo strip
src/layouts/BaseLayout.astro  head: SEO, Open Graph, canonical, JSON-LD, GTM dataLayer
src/scripts/services.ts       pinned horizontal scroll (progressive enhancement)
src/scripts/newsletter.ts     validation, submit, form_submit event
src/styles/global.css         all styles
src/assets/                   optimised source images (hero, brand, services)
public/admin/                 Decap CMS (index.html + config.yml)
```

## Run locally
```
npm install
cp .env.example .env     # Windows Command Prompt: copy .env.example .env
npm run dev              # http://localhost:4321
npm run build            # output in dist/
```
Set `PUBLIC_SITE_URL` and `PUBLIC_GTM_ID` in `.env`. To edit content locally, run `npm run cms` in a second terminal and open `/admin` (uses `local_backend`, no login needed).

## Editing content (non-developer)
Open `/admin`, log in with GitHub, then edit **Services (slides)** (headline, intro, bullets, image, order; add or remove slides), **Homepage copy**, or **Site, SEO & footer**. Click Publish and Netlify rebuilds in about a minute. Images uploaded to a service are optimised automatically by Astro.

The design has no testimonials or FAQ sections, so none are built. The same pattern would add them: a new folder collection in `src/content.config.ts` plus an entry in `public/admin/config.yml`.

## Deployment
Netlify builds from the `main` branch of the GitHub repo and publishes automatically on every push (build settings are in `netlify.toml`, which also sets cache and security headers).

## Form and tracking
- **Form:** the newsletter form in the footer validates email and consent, posts with `fetch` to **Netlify Forms** (`name="newsletter"`, honeypot field `bot-field`), and shows a success state. The no-JS fallback posts to `/thanks/`.
- **Where submissions go:** Netlify dashboard → Forms → newsletter. Email notifications can be added under Forms → Form notifications.
- **Tracking:** only after a *successful* response, the script pushes `{ event: 'form_submit', form_name: 'newsletter', form_location: 'footer' }` to `window.dataLayer`. GTM loads after `window.load` (in idle time) when `PUBLIC_GTM_ID` is set. The dataLayer exists from the first byte, so no events are lost.
- **Verify:** GTM Preview mode → submit the form → `form_submit` appears in the event list; or type `dataLayer` in the browser console.

## Environment variables
Set in Netlify → Project configuration → Environment variables.

| Variable | Purpose |
|---|---|
| `PUBLIC_SITE_URL` | canonical URL, Open Graph URLs, sitemap |
| `PUBLIC_GTM_ID` | Google Tag Manager container ID (public by design) |

No secrets are committed (`.env` is git-ignored; `.env.example` documents the variables). The GitHub OAuth client secret used for the CMS login is stored only in Netlify's OAuth settings, never in the repo.

## SEO / accessibility / performance
Unique title and meta description, one H1, canonical URL, Open Graph and Twitter tags, JSON-LD (Organization, WebSite, services list), sitemap and robots.txt. Alt text on images, skip link, visible focus states, labelled form fields, keyboard-scrollable slides, reduced-motion respected. Self-hosted subset fonts (about 66 KB), responsive WebP images via `astro:assets`, lazy-loaded below-the-fold images, deferred GTM.

PageSpeed Insights on the live URL (mobile): Performance 100, Accessibility 100, Best Practices 100, SEO 100. Scores can vary by a few points between runs.

## Safe updates after launch
Work on a branch, check the Netlify deploy preview, then merge to `main`. CMS edits commit to `main` (Decap can be switched to `publish_mode: editorial_workflow` to add a review step). To roll back, use Netlify's "Publish deploy" on a previous build.

## AI tools used
I used **Claude (Anthropic)** as my main development assistant for this assignment.

**What Claude did**
- Proposed the stack (Astro, Decap CMS, Netlify Forms) and generated the initial project structure, content schema and CMS configuration.
- Wrote the first versions of the page markup, CSS, the newsletter form script and the services scroll script.
- Processed the Figma export: extracted logos, images and vector artwork from the Figma SVG and produced the optimised image files. Early on it also rendered the supplied 3D models as placeholders, which were later replaced by the Figma exports.
- Ran Lighthouse locally and suggested performance fixes (image sizing, font loading, removing an unused font).

**What I did myself**
- Created and configured the GitHub repository, the Netlify site, the environment variables and the form detection.
- Set up Google Tag Manager (container, `form_submit` custom-event trigger, GA4 tag) and tested the event in GTM Preview mode.
- Created the GitHub OAuth app and connected it to Netlify so the CMS login works, then tested editing content through `/admin`.
- Tested the live form end to end, checked the page at 375, 768 and 1440 px, and ran PageSpeed Insights on the live URL.

**What I would still verify or change with more time**
- The hero lettering is an image exported from the Figma vectors; the warped grid texture is a recreation rather than an export.
- I would add visual regression tests and a consent banner before using analytics on a real client site.

## Assets
- The statue, orange curve, client logos (Zomato, Bosch, Vega, Dell), the four services mosaics and the photos inside them come from the Figma export. The statue crop and the curve placement follow the exact Figma coordinates.
- The L'Oréal logo, rocket logo, footer mark, blueprint drawing and hero lettering are vector shapes in the Figma SVG; I rendered them at 2x and extracted them as transparent WebP.
- The 3D files in the Drive folder (`.glb` and `.blend`) were used only for early placeholders; the final images come from the Figma export.
- The hero lettering ("BOLD DESIGN / THAT / PERFORMS") is an envelope-warped vector in Figma, which CSS cannot reproduce exactly, so it is used as an image. The real heading text is kept in the HTML as a visually hidden `<h1>` for SEO and screen readers.
- The warped grid texture is my own SVG recreation, not an export.

## Known limitations / next steps
- The headline artwork is an image: changing the hero words in the CMS updates the hidden H1 but not the artwork (it must be re-exported from Figma).
- Footer description lines and the Privacy Policy link (`#`) are placeholders; edit them in the CMS.
- At 375 px the small taglines from the desktop composition would be unreadable, so on mobile I enlarged them and repositioned them around the statue.
- With more time: visual regression tests, CMS live preview, an analytics consent banner, and rendering the hero artwork at 3x for very high-density screens.