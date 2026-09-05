# Dependabot vs Renovate: dependabot.yml vs renovate.json Compared — Jsonic
- URL: https://jsonic.io/guides/dependabot-vs-renovate
- Fetched: 2026-08-14
- Source type: community-guide
- Component: dependency-updates

Published/updated 2026-05-15. Practitioner comparison guide, cross-checked against both tools' own docs.

## Setup and config file

| Aspect | Dependabot | Renovate |
| --- | --- | --- |
| Config file path | `.github/dependabot.yml` (only valid location) | `renovate.json`, `.github/renovate.json`, `renovate.json5`, `.renovaterc`, or `package.json > renovate` |
| Format | YAML, supports `#` comments | JSON, JSON5, or YAML (preview); comments only in `.json5` |
| If file missing | Disabled entirely (no PRs) | Onboarding PR auto-created with a default config |
| Enable requirement | File presence enables it | Install the Mend Renovate GitHub App (or self-host) |

Dependabot needs nothing beyond the file. Renovate needs both app installation and a config (or accepts the auto-generated onboarding PR).

## Side-by-side config for the same intent

Dependabot (`.github/dependabot.yml`):
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Etc/UTC"
    groups:
      types-packages:
        patterns:
          - "@types/*"
    ignore:
      - dependency-name: "react"
        update-types: ["version-update:semver-major"]
    open-pull-requests-limit: 10
```

Renovate (`renovate.json`):
```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "schedule": ["before 5am on Monday"],
  "packageRules": [
    { "matchPackagePatterns": ["^@types/"], "groupName": "types packages" }
  ]
}
```

Renovate's config is shorter because it inherits `config:recommended`, a shareable preset. Dependabot has no `extends`/preset mechanism — every repo's YAML stands alone.

## 12-dimension comparison

| Dimension | Dependabot | Renovate |
| --- | --- | --- |
| Scheduling | `interval` keyword (daily/weekly/monthly) + optional day/time | Full DSL: cron-like natural language ("before 5am every weekday"), timezone-aware, separate `automergeSchedule` |
| Grouping | Per-ecosystem `groups` map (patterns, dependency-type, update-types) | `packageRules` — match by name/pattern/path/manager/update-type, composable |
| Package managers | ~30 | 90+ (adds Bazel, Helm, Terraform, pre-commit, Poetry, Nix, etc.) |
| Monorepo support | `directories` array (2024+); no workspace awareness | Workspace-aware (npm/pnpm/yarn); `matchFileNames` path scoping |
| Auto-merge | None native — wire GitHub Actions + `dependabot/fetch-metadata` | Built-in `automerge: true`, branch automerge, own schedule |
| Vulnerability alerts | Built-in "Dependabot Security Updates," GitHub Advisories only | `vulnerabilityAlerts`, reads GH Advisories + OSV, fully configurable |
| Lockfile maintenance | Bundled with regular updates, no refresh-only mode | `lockFileMaintenance` — scheduled lockfile-only PRs |
| Custom rules | `ignore`, `allow`, `groups` | `packageRules`, chainable, much finer matchers |
| Presets | None — one file per repo | Shareable `extends` presets, org-wide config inheritance |
| Cost | Free everywhere on GitHub.com | Free on public/most private via Mend Cloud; AGPL-3.0 self-host; paid Mend add-ons |
| Ownership | GitHub (Microsoft), closed-source service | Mend (formerly WhiteSource), open-source AGPL-3.0 |

## Security updates: two separate mechanisms

Dependabot Security Updates is a distinct product from `dependabot.yml` version updates — it's a repo-settings toggle, wired to GitHub Security Advisories, opens PRs immediately on a published CVE regardless of the configured schedule, and ignores `open-pull-requests-limit`/ignore lists. Renovate's `vulnerabilityAlerts` reads the same GH Advisories plus OSV and is configurable like any other rule (labels, schedule override, automerge).

## Running both

Not recommended as general-purpose updaters on the same repo — duplicate PRs, doubled CI cost, lockfile merge conflicts. The one supported pattern: Dependabot Security Updates only (for automatic vulnerability PRs) plus Renovate for all routine version bumps, with Renovate's `vulnerabilityAlerts.enabled` set `false` and Dependabot's non-security `open-pull-requests-limit` set to 0.

## Decision guidance (source's own framing)

Use Dependabot if: on GitHub, want zero setup, happy with GitHub-native security wiring. Use Renovate if: need grouped updates, fine-grained scheduling, monorepo-aware filtering, lockfile-only refresh, or ecosystems outside Dependabot's ~30. This distillation follows that default: **Dependabot first** for the `get-started-stinger` template (zero-config, GitHub-native, matches the "properly initialize a repo with minimum decisions" goal), with Renovate flagged as the swap-in for monorepos or multi-platform needs.
