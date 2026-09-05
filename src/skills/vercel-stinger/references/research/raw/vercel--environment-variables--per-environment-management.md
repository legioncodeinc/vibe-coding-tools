# Vercel environment variables: environments, CLI management, sensitive values, branch overrides

- URL: https://vercel.com/docs/environment-variables ; https://vercel.com/docs/environment-variables/manage-across-environments ; https://vercel.com/docs/deployments/environments
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Environment variables / Environments

## Content

### The three (or more) environments

| Environment | Trigger | Notes |
|---|---|---|
| Production | push/merge to Production Branch (usually `main`) or `vercel --prod` | First deployment of a new project is always Production, regardless of branch. |
| Preview | push to any non-production branch, PR on GitHub/GitLab/Bitbucket, or `vercel` (no `--prod`) | Gets both a branch-specific URL (always latest on that branch) and a commit-specific URL. |
| Development | `vercel dev` or local dev command | Defined via `.env.local`, or pulled with `vercel env pull`. `vercel dev` auto-downloads Development vars into memory without needing a pull. |
| Custom (Pro/Enterprise) | `staging`, `QA`, etc. | Each custom environment gets its own variable set; managed via `vercel target list` / CLI `-e` flag. |

Per-variable, you choose which environment(s) it applies to. Preview variables can be scoped to "all preview branches" or to one specific branch; a branch-specific value overrides the general preview value for that name, so you don't need to duplicate every preview var per branch - only the overrides.

### CLI workflow (canonical sequence)

```bash
vercel target list                                  # list environments incl. custom
vercel env ls production                            # audit per environment
vercel env ls preview
vercel env ls development
vercel env add DATABASE_URL production               # add, prompts for value via stdin
vercel env add DATABASE_URL preview
vercel env add API_SECRET production --sensitive     # hidden in dashboard, extra security
vercel env add DATABASE_URL preview feature-branch    # branch-scoped preview override
vercel env update DATABASE_URL production             # update existing
vercel pull --environment=production                  # verify locally
vercel pull --environment=preview --git-branch=feature-branch
vercel env run -e preview -- npm test                  # run a command with env injected, no file written
vercel env run -e production -- npm run build
```

`--sensitive` variables: hidden/non-readable in the dashboard once created, behave identically at runtime, but are **only available in Production and Preview environments** (not Development).

### Common failure mode

Missing an env var in one environment but not another is flagged explicitly as "a common cause of deployment failures where a preview works but production doesn't, or vice versa" - audit with `vercel env ls <environment>` across all three before shipping.

`vercel pull` writes to `.vercel/.env.<environment>.local` (or equivalent) rather than clobbering `.env.local` unconditionally - check the actual file written for the target environment.
