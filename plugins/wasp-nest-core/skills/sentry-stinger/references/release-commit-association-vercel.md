# Release and commit association for a Vercel build

Grounded in [raw/sentry--releases--commit-association.md], [raw/sentry--integrations--vercel-marketplace.md]. This is a documented gap area - read the caveats before treating any single path below as "the" answer.

## What commit association actually does

Associating a release with commits lets Sentry show, per release: files touched, files observed in stack traces, commit authors, and issues resolved by those commits. **This only applies to error issues** - not performance or replay issues [raw/sentry--releases--commit-association.md].

## Path A (default for this stack): let the Vercel integration handle it

If Sentry's "Releases and Source Map Integration" is installed and linked to the Vercel project (see `env-var-checklist.md`), Vercel exposes commit-SHA environment variables at build time (`VERCEL_GITHUB_COMMIT_SHA`, `VERCEL_GITLAB_COMMIT_SHA`, or `VERCEL_BITBUCKET_COMMIT_SHA` depending on the connected git provider), which the integration consumes to associate the deployment's release with the correct commit automatically. This is the path with the most direct official-docs support for a Vercel deployment specifically - no manual `sentry-cli releases` invocation required in the build [raw/sentry--integrations--vercel-marketplace.md].

Requirement: a repository integration (GitHub/GitLab/Bitbucket app) must also be installed in Sentry with the relevant repo added, so Sentry can pull commit metadata (authors, files changed) for whatever SHA it's told about [raw/sentry--releases--commit-association.md].

## Path B: manual `sentry-cli` step (if not using the Vercel integration, or need explicit control)

```bash
export SENTRY_AUTH_TOKEN=<token>
export SENTRY_ORG=<org-slug>
VERSION=$(sentry-cli releases propose-version)

sentry-cli releases new -p <project-slug> "$VERSION"
sentry-cli releases set-commits --auto "$VERSION"
sentry-cli releases finalize "$VERSION"
```

- `--auto` uses the connected repo integration (if any) or falls back to the local git tree if run inside a full checkout. `--local` forces the local-git-tree behavior explicitly.
- If commit history was rewritten (rebase/squash) since the last release, `set-commits` can fail to find a commit - pass `--ignore-missing` to fall back to a default recent-commit window instead of failing the build [raw/sentry--releases--commit-association.md].

**Gap, stated plainly**: no Sentry-authored end-to-end guide combining this CLI sequence with a Vercel build was found in the research. Vercel's build environment is ephemeral per-deployment; whether it has a full enough git checkout for `--auto`/`--local` to work correctly depends on Vercel's own checkout depth for the build, which was not verified here. **If choosing Path B over Path A, test it against a real Vercel deployment before relying on it** - do not assume it works identically to running the same command in a full local clone or a traditional CI runner [raw/sentry--releases--commit-association.md].

## Resolving issues automatically via commit message

Once commit association is active (either path), a commit message containing the issue ID resolves that issue **once a release containing the commit is created in Sentry** - not immediately on commit:

```
Fix null pointer on empty cart

Fixes SENTRY-482
```

Pull request titles/descriptions with `fixes <ISSUE-ID>` work the same way, resolving when the PR's merge commit lands in a release [raw/sentry--releases--commit-association.md].

## Recommendation for this stack

Default to Path A (Vercel integration + repo integration) since it has direct official support and requires no custom build-step scripting. Only reach for Path B if the Vercel integration cannot be installed for some organizational reason (e.g. billing/permissions), and flag to the user that the CLI-in-Vercel-build combination is unverified by this skill's research and should be smoke-tested before being trusted in production.
