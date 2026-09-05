# Inputs Checklist: website-stinger

Collect all inputs in a single batched question before scaffolding. Do not ask per-phase.

---

## Stack confirmation

- Confirmation: stack defaults (SvelteKit 5, Payload CMS, Supabase, Vercel) acceptable? *(If no, record the override.)*

## CMS mode

- **Does this site need a managed content admin panel with blog/pages management by non-developer editors?**
  - YES → **Payload mode** (default): scaffold `apps/cms` (Next.js + Payload), use Payload Collections for blog
  - NO → **TypeScript-as-CMS fallback**: no `apps/cms`, blog posts are TypeScript data objects

---

## Site identity

- Site name
- Target audience (1 to 2 sentences)
- Primary conversion action (e.g. "Book a consultation", "Start free trial", "Contact us")
- Industry / vertical (for generic schema.org selection)

## URLs and environment

- Primary domain (or "not yet decided")
- Vercel project for `apps/web` (linked / create new)
- Vercel project for `apps/cms` (Payload mode only: linked / create new / N/A)
- Supabase project ref (`abcdefgh12` format, or "create new")
- Payload URL (e.g. `https://cms.example.com`, or "same domain at /cms", or "TBD")
- `PUBLIC_SITE_URL` value

## Analytics

- GA4 measurement ID (G-XXXXXXXXXX, or "skip")
- Microsoft Clarity project ID (or "skip")
- Facebook Pixel ID (or "skip")

## Brand

- Primary brand color (HEX or HSL)
- Secondary / accent color (HEX or HSL)
- Display font (Google Fonts name, or "default Inter")
- Body font (Google Fonts name, or "default Inter")
- Dark mode: enabled by default / light only / system preference

## Content

- Blog/content needed: yes / no (drives CMS mode confirmation above)
- Lead capture form: yes / no
- Estimated number of pages at launch
- Any existing content to migrate

## Phase opt-outs

- List any phases to skip and why (e.g. "skip Phase 10: no webhook integrations needed")
- No opt-outs → proceed with all 12 phases in canonical order

---

## Architectural consequences of common opt-outs

| Opt-out | Consequence |
|---|---|
| Skip Payload (TypeScript-as-CMS fallback) | No `apps/cms` scaffold. Blog content requires code deploys to publish. No visual editor. |
| Skip Supabase (Phase 5) | No leads table, no RLS, no app_settings. Phase 8 needs an email-relay fallback. |
| Skip auth (Phase 6) | No protected admin routes. Phase 7 is automatically skipped. |
| Skip blog (Phase 9) | No blog routes. If Payload mode: Posts collection still recommended for future use. |
| Skip webhooks (Phase 10) | No outbound integrations. Lead notifications must be handled by Supabase email or alternative. |
