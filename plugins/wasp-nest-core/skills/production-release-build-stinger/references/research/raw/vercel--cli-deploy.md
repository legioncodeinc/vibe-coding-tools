# Vercel Docs: vercel deploy (CLI)
- URL: https://vercel.com/docs/cli/deploy
- Fetched: 2026-09-29
- Source type: official vendor docs (vercel.com, last_updated 2026-09-18)

## Key facts
- vercel deploy = vercel. stdout is always the Deployment URL.
- --prod deploys to the production domain. --skip-domain (with --prod) disables automatic domain aliasing so promotion can happen later with vercel promote.
- --prebuilt deploys output of vercel build (.vercel/output); System Environment Variables missing at build time with --prebuilt.
- --target picks environment: production, preview, or custom environment (e.g. --target=staging).
- --no-wait, --force, --archive, --meta (githubDeployment=1, githubCommitRef=<branch>) documented.
