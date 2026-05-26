# ADHD Reflect — Site

## Setup on Replit

1. Create a new Replit project (Node.js template, or import from GitHub)
2. Drop all these files into the project, keeping the folder structure
3. In the Replit shell, run:

```bash
npm install
npm run dev
```

4. The dev server will start on port 4321

## Deploying

```bash
npm run build
```

This creates a `dist/` folder with static HTML. You can deploy this to:
- Replit (static deployment)
- Cloudflare Pages (free, recommended since your domain is on Cloudflare)
- Vercel (free tier)

### Cloudflare Pages deployment (recommended)

Since your domain is on Cloudflare already:
1. Push the code to a GitHub repo
2. In Cloudflare dashboard, go to Workers & Pages > Create
3. Connect the GitHub repo
4. Build command: `npm run build`
5. Output directory: `dist`
6. Set your custom domain to adhdreflect.com

This gives you free hosting, automatic SSL, global CDN, and your DNS is already there.

## File structure

```
src/
  layouts/
    Base.astro          — Main page wrapper (nav + footer)
    Legal.astro         — Layout for markdown legal/prose pages
  components/
    Logo.astro          — Brand logo mark + wordmark
    Nav.astro           — Sticky nav with mobile menu
    Footer.astro        — Footer with legal links + safety note
  styles/
    global.css          — All design tokens, typography, base styles
  pages/
    index.astro         — Homepage (quiz CTA + value prop)
    legal/
      privacy.md        — Privacy policy
      terms.md          — Terms of use
      safety.md         — Crisis support + safety info
      how-the-ai-works.md — AI transparency page
      affiliate-disclosure.md — Commercial relationships
      cookies.md        — Cookie + analytics notice
public/
  favicon.svg           — Logo mark as favicon
```

## Design tokens

All colours, fonts, spacing and typography are in `src/styles/global.css`.
They match the ADHD Reflect Design & Writing Style Bible exactly.

Fonts: Fraunces (serif/display), Lexend (body/UI), IBM Plex Mono (labels/meta)
Palette: Cloud, Mist, Reflect Blue, Sage, Slate, Pewter + accent colours

## What to build next

1. Quiz page (`src/pages/quiz.astro` — React island component)
2. Cards page (`src/pages/cards.astro`)
3. About page (`src/pages/about.astro`)
4. Resources page (`src/pages/resources.astro`)
5. AI router component (React island)
6. Newsletter integration (replace mock form with ConvertKit/provider embed)

## Placeholders to fill in

Search the legal pages for these strings and replace before publishing:
- `[Legal entity name]` — your registered business name
- `[XX XXX XXX XXX]` — your ABN
- `[Postal address, Brisbane QLD, Australia]` — a PO Box is fine
- Confirm email addresses: privacy@adhdreflect.com, hello@adhdreflect.com

## Notes

- `<meta name="robots" content="noindex, nofollow" />` is set in the layout.
  Remove it when you are ready to go live.
- The newsletter form on the homepage is a disabled placeholder.
  Replace with your email provider's embed code.
