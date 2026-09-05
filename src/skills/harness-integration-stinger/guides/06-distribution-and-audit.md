# Guide 06: Distribution and Audit, Per Harness

**Sources:** `research/distilled-harness-integration.md` §1, §5; queen-bee-stinger distilled-research-articles.md, Claude Code §Plugins ("Test and install workflow," marketplace.json); Cursor §Plugins ("Submission checklist," "Multi-plugin repos"); ChatGPT Codex §Plugins ("Marketplaces"); Claude Cowork §Plugins ("Install flow," "Plugin limits," "Update/remove and org-managed behavior," "Security gotcha")

---

## Distribution surfaces, per harness

| Harness | Distribution mechanism | Gate |
|---|---|---|
| Claude Code | Marketplace (`marketplace.json` + plugin sources: relative path, `github`, `url`, `git-subdir`, `npm`, `archive`, `command`) or local `--plugin-dir`/`--plugin-url` | Valid `plugin.json` + component paths; `claude plugin validate` runs the same check used by the community-marketplace review pipeline (`--strict` turns warnings into failures) |
| Cursor | Cursor Marketplace (`cursor.com/marketplace/publish`) or `.cursor-plugin/marketplace.json` for multi-plugin repos | Official submission checklist (below); logo/README/manifest validation |
| Codex | Repo marketplace (`$REPO_ROOT/.agents/plugins/marketplace.json`), personal marketplace (`~/.agents/plugins/marketplace.json`), or legacy-compatible `.claude-plugin/marketplace.json` (also read by the ChatGPT desktop app) | `policy.installation` (`AVAILABLE`/`INSTALLED_BY_DEFAULT`/`NOT_AVAILABLE`) and `policy.authentication` must be set per plugin entry |
| Cowork | Anthropic's official catalog, a Git-repo marketplace (GitHub/GitHub Enterprise/GitLab/Bitbucket), or file upload | Enterprise-only: skill scanning at install/update blocks malicious content and flags risky content with a caution banner |

## Cowork's install flow and limits (the newest, least CLI-like of the four)

Install: Customize > Plugins > Browse plugins (default marketplace is Anthropic's catalog, add others by URL) > select > Install (prompts sign-in if a connector needs auth). Once installed, skills and agents appear as tabs; connectors and hooks get their own pages; individual components can be enabled/disabled without uninstalling the whole plugin.

| Limit | Value |
|---|---|
| Plugin package size (uncompressed) | 200 MB |
| Files per plugin package | 5,000 |
| Marketplace repository archive | 512 MB |
| Plugins per marketplace | 500 |
| Marketplaces you can add | 25 |

Org-managed behavior: Team/Enterprise admins can require certain plugins for everyone (auto-install, users can't remove them, shown as "required by your organization"); auto-installed non-required plugins can still be uninstalled by the user; a locally edited plugin's files trigger an update-conflict warning rather than a silent overwrite.

## Cursor's submission checklist (official)

Valid manifest; unique lowercase kebab-case `name`; clear `description`; valid files/frontmatter for every component; logo committed with a relative path; a `README.md`; Agent Plugins conform to agent-plugins.org schemas; every `${VAR}` referenced in `mcp.json` declared in `variables`; all manifest paths relative and valid (no `..`, no absolute paths); tested locally; multi-plugin repos need `.cursor-plugin/marketplace.json` with unique names across the set.

## Codex's marketplace source types

Beyond a plain local path: `git-subdir` (a plugin living in a subdirectory of a git repo - `url`, `path`, `ref`/`sha`), `url` (a plugin at repo root), `npm` (package name required, version/registry optional - "no lifecycle scripts run, requires local `npm`"). Installed-plugin cache: `~/.codex/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION/`. Admins can disable sharing entirely via `requirements.toml` → `features.plugin_sharing = false`.

---

## Every distribution channel has a real gate - budget for it

The common thread across all four harnesses: shipping through a marketplace or install flow means passing that harness's own validation, not just producing a syntactically valid manifest. Claude Code's `claude plugin validate --strict` turns warnings into hard failures; Cursor's submission checklist is enforced at `cursor.com/marketplace/publish`; Codex requires explicit `policy.installation`/`policy.authentication` on every marketplace entry; Cowork's Enterprise tier runs a security scanner on install/update that can outright block a plugin flagged as malicious.

**A worked example of the most demanding version of this gate**: OpenClaw's ClawHub distribution channel ran a static scanner that rejected bare `spawn`/`execFileSync` calls in a bundle - forcing subprocess access through `createRequire`-based indirection so the static scan never saw a literal reference. This isn't one of The Hive's four current harnesses, but it's the sharpest real example on record of "a distribution channel's static analysis gate can silently reject a working bundle for a reason that has nothing to do with correctness." See `examples/case-study-hivemind-six-host-installer.md` §7 for the full worked pattern (the `createRequire` bypass, the audit script, the pre-publish checklist) - treat it as the reference case for what a strict third-party bundle scanner can demand, and audit any Hive capability's distribution artifact for the equivalent gate on its actual target harness before assuming "it built locally" means "it will install."

---

*See also:* `guides/00-decision-framework.md` for how distribution fits into the overall integration decision sequence, and `examples/case-study-hivemind-six-host-installer.md` for the full worked six-host distribution story, including the exact pre-publish checklists used.
