# Vercel deployments: Instant Rollback, promotion, domains/DNS

- URL: https://vercel.com/docs/instant-rollback ; https://vercel.com/docs/deployments/promoting-a-deployment ; https://vercel.com/docs/domains/set-up-custom-domain ; https://vercel.com/docs/domains/working-with-domains/add-a-domain ; https://vercel.com/docs/domains/managing-dns-records
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Deployments / Domains

## Content

### Instant Rollback

Reassigns production domains to a previously-served deployment **without a rebuild** - the fast-recovery path for a bad production push.

- Eligible deployments = ones that **previously served production traffic**. Preview deployments that never got promoted are not eligible.
- Hobby: can roll back only to the immediately previous deployment. Pro/Enterprise: can roll back to any eligible deployment, chosen from a list.
- Explicit caveats: environment variables are **not** rebuilt/updated on rollback (a project-settings env var change won't apply retroactively - the rollback restores the old build's env state); if the project uses cron jobs, they revert to the rolled-back deployment's cron config too; custom aliases are only preserved if they were present on that previous production deployment.
- After a rollback, Vercel **disables auto-assignment of production domains** - new pushes to the production branch will NOT go live automatically until you explicitly "Undo Rollback" (dashboard button, or `vercel promote <deployment-id>` from CLI) to restore normal behavior. This is a easy-to-miss trap: teams roll back during an incident, fix forward, push, and are confused when the fix doesn't appear live.

### Promotion (the three flows, distinct use cases)

1. **Instant Rollback** - replace current production with a deployment that already served production before (fast, no rebuild).
2. **Promote preview to production** - take an existing preview deployment (e.g. one built from a non-production branch) and make it production via the dashboard's "Promote to Production" action on that deployment. Note: preview env vars do NOT carry over - the promoted deployment switches to production env vars, and you cannot use preview env vars in a production deployment.
3. **Promote a staged production build** - for projects with auto-assignment of production domains turned off, promote a production-shaped build that has never actually served production traffic yet.

### Custom domains and DNS

CLI flow:
```bash
vercel domains add example.com          # add domain to linked project
vercel domains inspect example.com      # see exactly which records are needed
vercel dns add example.com '@' A 76.76.21.21          # apex domain -> A record
vercel dns add example.com www CNAME cname.vercel-dns-0.com   # subdomain -> CNAME
vercel domains inspect example.com      # re-verify
```

The A-record IP and CNAME target shown above are Vercel's general-purpose values; `vercel domains inspect` returns the project-specific exact values to use - do not hardcode the generic ones without checking.

If nameservers point to an external DNS provider (Cloudflare, Route 53, etc.), `vercel dns add` cannot be used - add the same records directly at the external provider instead, then re-run `inspect` to confirm Vercel detected them.

Wildcard domains (`*.example.com`) **must** use the Vercel nameservers verification method - the A/CNAME record path doesn't support wildcards.

DNS record types supported when using Vercel-managed nameservers: A, AAAA, ALIAS, CAA, CNAME, HTTPS, MX, NS, SRV, TXT. Records can take up to 24 hours to fully propagate/clear local caches even though Vercel's own systems pick them up faster. DNS Presets exist for common third-party services (email providers, etc.) to auto-populate MX/TXT records without manual lookup.
