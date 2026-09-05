# Sentry releases: associating commits, resolving issues by commit, and CI automation

- URL: https://docs.sentry.io/product/releases/associate-commits/ ; https://docs.sentry.io/product/releases/ ; https://docs.sentry.io/cli/releases/ ; https://docs.sentry.io/product/releases/setup/release-automation/
- Fetched: 2026-08-14
- Source type: Official docs (docs.sentry.io)
- Component: Releases / commit association

## Content

### Why associate commits with a release

Notifying Sentry of a release and associating it with commits enables:

- Auto-discovery of which commits belong to a release.
- Identifying "the most recent release" when searching in sentry.io.
- Seeing, per release: files touched by commits, files observed in stack traces, authors of those files, and issues resolved by commits.
- **This feature only applies to error issues** - it does not apply to performance issues or replay issues.

### Path 1: repository integration (recommended, automatic)

If a repository integration (GitHub, GitLab, Bitbucket, etc.) is installed and the repository added under **Organization Settings > Integrations > Repositories**, Sentry receives commit metadata (authors, files changed) automatically for every push - no manual CLI/API step required per release, assuming the release-creation step itself still runs (see CI automation below).

### Path 2: Sentry CLI (`sentry-cli releases set-commits`)

```bash
# Assumes running inside a git repository
export SENTRY_AUTH_TOKEN=<your-sentry-auth-token>
export SENTRY_ORG=<your-org-slug>
VERSION=$(sentry-cli releases propose-version)

sentry-cli releases new -p project1 -p project2 $VERSION
sentry-cli releases set-commits --auto $VERSION
```

- `propose-version` auto-derives a release identifier.
- `--auto` auto-determines the repository name and associates commits between the previous release's head commit and the current head commit.
- If there is **no repo-based integration**, `--auto` falls back to using the **local git tree** directly: for the first release ever, it uses the latest 10-20 commits (docs give both "10-20" and "20" depending on page - flagged as a minor inconsistency across two docs.sentry.io pages, not resolved further in this research), configurable via `--initial-depth`.
- `--local` flag makes the local-git-tree behavior the default without needing to fall back into it implicitly.
- For explicit control (or when the command can't run inside the repo), specify manually: `sentry-cli releases set-commits --commit "my-repo@from..to" $VERSION`, where `my-repo` matches the name entered when linking the repository (`owner-name/repo-name` form), and `from` is optional (defaults to the previous release's commit).
- **Missing commits** (amended/rebased/squashed history): CLI throws an error it can't find the commit; pass `--ignore-missing` to fall back to the default recent-commits behavior instead of failing the build.

### Path 3: raw API (no repo integration, custom CI)

`POST` to the create-release endpoint with a `commits` array:

```json
{
  "commits": [
    {
      "patch_set": [
        { "path": "path/to/added-file.html", "type": "A" },
        { "path": "path/to/modified-file.html", "type": "M" },
        { "path": "path/to/deleted-file.html", "type": "D" }
      ],
      "repository": "owner-name/repo-name",
      "author_name": "Author Name",
      "author_email": "author_email@example.com",
      "timestamp": "2018-09-20T11:50:22+03:00",
      "message": "This is the commit message.",
      "id": "8371445ab8a9facd271df17038ff295a48accae7"
    }
  ]
}
```

Field notes:
- `patch_set` (with `path` + type `A`/`M`/`D`) powers suspect-commit and suggested-assignee features - optional but valuable.
- `repository` defaults to `organization-<organization_id>` if omitted.
- `author_email` is required for the suggested-assignee feature specifically.
- `timestamp` is used to sort commits if provided; otherwise commits stay in given order.
- Auth: use **Auth Tokens** (`Authorization: Bearer <token>`), not the deprecated API Keys.

### Resolving issues via commit message

Once commit association is active, including the Sentry issue ID in a commit message references (but does not immediately resolve) the issue:

```
Prevent empty queries on users

Fixes SENTRY-317
```

The issue is marked resolved **only once a release containing that commit is created in Sentry** - the commit message alone doesn't resolve anything until it ships in an associated release. Pull requests can also resolve issues by including `fixes <ISSUE-ID>` in the title/description; resolution fires when the PR's merge commit lands in a release.

### GitHub-specific caveat for suggested assignees

If a GitHub account has "Keep my email address private" enabled, Sentry can't match the commit author's email to a Sentry/GitHub user for the suggested-owners feature - must be unchecked in GitHub account settings for that feature to work correctly.

### CI/CD release automation - supported platforms

Official first-party automation guides exist for: Bitbucket Pipelines, CircleCI, **GitHub Actions** (explicitly also covers uploading source maps, not just commit association), Jenkins, Netlify, Travis CI. **Vercel is not in this specific first-party CI-automation-guide list** - Vercel release/commit-association wiring instead flows through Sentry's dedicated Vercel integration (see the Vercel integration raw file), which uses `VERCEL_GITHUB_COMMIT_SHA` / `VERCEL_GITLAB_COMMIT_SHA` / `VERCEL_BITBUCKET_COMMIT_SHA` env vars that Vercel itself exposes at build time, rather than a `sentry-cli releases set-commits --auto` step run as a discrete CI stage. If a platform isn't in the automation-guide list, the manual CLI/API process above is the documented fallback.

### Practical sequencing implication for a Vercel-deployed SvelteKit app

Because Vercel builds happen in an ephemeral environment per-deployment, `sentry-cli releases set-commits --auto` needs either (a) the build to run inside a full git checkout (so `--auto`/`--local` can read the local tree) or (b) reliance on the Sentry Vercel integration's own commit-SHA-based association path instead of a manual CLI call. This research did not find a Sentry-authored end-to-end "Vercel + `sentry-cli releases`" walkthrough; treat that combination as a gap and default to the Vercel-integration-driven path (source maps raw file + Vercel integration raw file) rather than hand-rolling `sentry-cli releases set-commits` in a Vercel build step.
