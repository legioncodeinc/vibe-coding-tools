# Vercel Docs: Promoting Deployments (+ vercel promote CLI)
- URLs: https://vercel.com/docs/deployments/promoting-a-deployment (last_updated 2026-06-26), https://vercel.com/docs/cli/promote (last_updated 2026-07-15)
- Fetched: 2026-09-29
- Source type: official vendor docs (vercel.com)

## Key facts
- DEFAULT: merging/committing to the production branch (often main) automatically promotes to Production. This is the Tier 0-1 "push-to-main deploys" anchor.
- Three manual paths: (1) Instant Rollback - assign domains to an existing past-serving deployment, no rebuild; (2) Promote preview to production - full rebuild; (3) Promote a STAGED production build - never-served production deployment, no rebuild, requires turning OFF "Auto-assign Custom Production Domains" (Settings > Environments > Production > Branch Tracking).
- Production deployment states: Staged (built, no domain), Promoted, Current (aliased to domain, serving traffic).
- CLI: vercel promote [deployment-id-or-url] promotes an existing deployment to current; --timeout (default 3m; timeout does not cancel the promotion); vercel promote status shows pending promotions. Promoting a Preview-built deployment prompts for confirmation (or --yes) and results in a new production deployment.
