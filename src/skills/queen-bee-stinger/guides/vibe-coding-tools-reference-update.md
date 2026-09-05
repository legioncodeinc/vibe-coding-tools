# Vibe Coding Tools reference update

Vibe Coding Tools is the repository that carries The Hive. Every forge, registration, or removal changes what the repository claims about itself, and stale references rot faster than code. This guide is the sweep you run after any component change.

## The reference surfaces

| Surface | What lives there | Update when |
|---|---|---|
| `.claude/skills/` | Canonical Stingers, beekeeper-suit, queen-bee-stinger | Any skill forged, updated, replaced, or removed |
| `.claude/agents/` | Canonical Bees | Any Bee forged, updated, replaced, or removed |
| `.claude/skills/beekeeper-suit/` | Roster, guides, sequences | Any pair registered or deregistered |
| `.cursor/rules/`, `.claude/agents/`, `.claude/skills/` | Cursor-specific mirrors where Cursor-only fields are needed | Only when a component carries Cursor-specific configuration; otherwise Cursor reads the `.claude/` paths directly |
| `AGENTS.md` | Cross-harness rules baseline (Codex native, Cursor native, Claude Code via import bridge) | Rule changes that should reach more than one harness |
| `CLAUDE.md` | Claude Code project guidance, mirrors `.cursor/rules/` per repo convention | Rule changes; keep the mirror statement true |
| `RULES.md` | Human explanation of each always-on rule | Any rule added or changed |
| `README.md` | Repo landing page, Hive overview | Structural changes: new component types, replaced systems |
| `library/` | Planning docs, knowledge docs, ADRs, PRDs, IRDs (Library Schema v2), Ship Gate reports | Every development cycle; reports land here |

## The post-change sweep

Run top to bottom after forging, updating, or removing any component:

1. **Component files themselves.** New or changed files in the right canonical location, folder name matches frontmatter name, Hive convention blocks present and verbatim.
2. **Beekeeper roster.** Row added, changed, or removed; guide file matches; registered count accurate; multi-Bee sequences still name real Bees.
3. **Cross-links.** Every related-skills list that should mention the component does, and none point at removed paths. Grep for the old name across `.claude/`, `.cursor/`, `library/`, and the root docs before declaring a removal complete.
4. **Rules bridges.** If a rule changed: AGENTS.md updated, CLAUDE.md mirror updated, matching `.mdc` updated, RULES.md explanation updated. One rule, four surfaces, one meaning.
5. **Library docs.** Decision-grade changes get an ADR. Feature work traces to its PRD or IRD. Ship Gate reports for the change sit in the relevant `library/` directory.
6. **Plugin builds.** If the component ships to Codex or Cowork via the plugin layer, rebuild and revalidate the plugin (`per-type-validation.py --type plugin`, then the Cowork packager if applicable). A component updated in the repo but not in the plugin is a fork, not a deployment.
7. **Repo hygiene conventions.** No em dashes in any prose written for the repo (chat, docs, commits, PR descriptions, comments). PRs checked for merge conflicts before being called shippable. Other agents' active work left untouched.

## Replacement records

When a system component is replaced wholesale (skill-creator and stinger-forge into queen-bee-stinger being the founding example), record it where the next contributor will look:

- A short note in the successor's README naming what it replaced and why.
- The beekeeper deregistration steps from [beekeeper-registration.md](beekeeper-registration.md).
- An ADR in `library/` if the replacement changed how the system works, not just which file does the work.

## Drift audits

Once a quarter, or after any burst of parallel agent work, run a drift audit: validate every skill and agent under `.claude/` with `per-type-validation.py --harness all`, grep the roster against the filesystem in both directions (registered but missing, present but unregistered), and spot-check that harness claims in the guides still match the research corpus. Harnesses ship fast; when the guides and the world disagree, re-run the research pipeline and update `references/research/` rather than hand-patching claims.
