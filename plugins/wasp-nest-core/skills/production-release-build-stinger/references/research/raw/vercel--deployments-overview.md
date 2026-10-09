# Vercel Docs: Deployments
- URL: https://vercel.com/docs/deployments
- Fetched: 2026-09-29
- Source type: official vendor docs (vercel.com, last_updated 2026-09-03)

## Key facts
- A deployment is the result of a successful build; each gets a unique URL.
- Deployment sources: Git (most common; every push/PR on a connected repo auto-deploys), CLI (vercel / vercel --prod), Deploy Hooks (unique URL), REST API, Vercel Drop.
- Three default environments: Local, Preview, Production. First deployment of a new project is always production even without --prod.
- vercel --prod creates a Production Deployment; on Pro/Enterprise a deployment policy controls which Git sources/mechanisms deploy to each environment.
- Dashboard can "Promote to Production" (converts preview to production via rebuild) and "Promote" a staged production build (no rebuild).
