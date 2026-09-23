# Guide 8: Deployments, domains, rollbacks, and cost control

Grounded in `references/research/distilled-vercel.md` §9-10, §12-14, `references/research/raw/vercel--deployments--rollback-promote-domains.md`, `references/research/raw/vercel--pricing--cost-model-function-bandwidth-images.md`, `references/research/raw/vercel--monorepos--turborepo-deploy.md`.

## When to walk this guide

Setting a custom domain, recovering from a bad production deploy, auditing spend, or deploying inside a Turborepo monorepo.

## Instant Rollback - read the traps before an incident, not during one

Reassigns production domains to a prior production-serving deployment, no rebuild. Fast, but:

- Env vars are **not** rebuilt - restores whatever env state existed when that old build ran, not current project settings.
- Cron jobs revert to the rolled-back deployment's cron config too.
- After a rollback, **auto-assignment of production domains turns off**. New pushes to the production branch will NOT go live automatically until someone runs "Undo Rollback" (dashboard) or `vercel promote <deployment-id>` (CLI). This is the trap: a team rolls back during an incident, ships a real fix, pushes to `main`, and is confused when the fix doesn't appear - because auto-promotion is still disabled from the rollback.
- Hobby can only roll back to the immediately previous deployment; Pro/Enterprise can choose any eligible (previously-production) deployment.

## Promotion flows - three distinct operations, don't mix them up

1. Instant Rollback - revert to a deployment that already served production.
2. Promote preview to production - full rebuild-free promotion of an existing preview deployment; **preview env vars do not carry over**, the promoted deployment switches to production env vars.
3. Promote a staged production build - for projects with auto-promotion disabled, push a production-shaped build live that never served production traffic yet.

## Custom domains

```bash
vercel domains add example.com
vercel domains inspect example.com   # returns the exact records for THIS project
vercel dns add example.com '@' A <ip-from-inspect>
vercel dns add example.com www CNAME <cname-from-inspect>
vercel domains inspect example.com   # re-verify
```

Always pull the actual values from `inspect` rather than hardcoding generic example values - they can differ per project. Wildcard domains must use the nameservers verification method; the A/CNAME path doesn't support wildcards. External DNS providers (Cloudflare, Route 53) can't use `vercel dns add` - add the same records at the provider directly, then re-run `inspect` to confirm detection.

## Cost control

Set a **Spend Limit** in the Pro dashboard - this is the platform's own primary guardrail; Vercel pauses service at the cap instead of overbilling. Do this before shipping anything with variable-cost surfaces (dynamic image generation, long-running SSR, high-cardinality API routes).

Watch these three patterns specifically, per the cost research (distilled §9):

1. Dynamic image-generation routes (e.g. OG images) burning through the image-transformation quota - see Guide 5.
2. Long-running streaming/SSR functions (e.g. LLM responses held open with a DB connection) billed by GB-hours of active compute.
3. Unoptimized media served on every page load eating into the bandwidth allowance.

## Turborepo monorepo deploys

Vercel auto-detects Turborepo and sets Build Command (`turbo run build` or the filtered variant), Root Directory, and an Ignored Build Step (`npx turbo-ignore --fallback=HEAD^1`) automatically. The sharp edge: declare every env var that affects build output in `turbo.json`'s `env` (task-scoped, preferred) or `globalEnv` (all tasks) keys - an undeclared env var can produce a stale cache hit that ships one environment's config into another. For this stack's SvelteKit app, the expected `outputs` glob for cache correctness is `.svelte-kit/**`, `.vercel/**`.

## Common mistakes

- Forgetting to undo a rollback's auto-promotion-disable state after shipping a real fix.
- Hardcoding generic DNS record values instead of the project-specific ones from `vercel domains inspect`.
- Shipping a variable-cost feature (dynamic images, long streaming responses) without a Spend Limit set first.
- Missing an env var declaration in `turbo.json`, causing a stale cross-environment cache hit.
