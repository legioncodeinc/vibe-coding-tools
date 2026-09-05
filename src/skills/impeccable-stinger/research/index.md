# Research Index — impeccable-stinger

Manifest of primary-source research for `impeccable-worker-bee`. All files cite repo paths under `/tmp/impeccable-RZVWdD` (github.com/pbakaus/impeccable, commit aee6ce9, Apache-2.0).

| File | Covers | Primary sources |
|---|---|---|
| `research-plan.md` | Scope, depth, method, provenance | Command Brief, repo |
| `01-system-overview.md` | Whole system: 7 layers, four-phase loop, per-model builds | `README.md`, `PRODUCT.md`, `skill/SKILL.src.md`, `package.json`, site `/designing` |
| `02-context-contract.md` | PRODUCT.md / DESIGN.md / surfaces / design.json, modes | `skill/scripts/context.mjs`, `skill/reference/init.md`, `document.md`, site `/docs/context` |
| `03-command-vocabulary.md` | 23 commands, routing rules, pinning | `skill/scripts/command-metadata.json`, `skill/SKILL.src.md`, site `/docs` |
| `04-new-work-direction.md` | Classification, five tests, direction contract, roll/dice, research lessons | `skill/reference/new-work.md`, `skill/scripts/concept-seed.mjs`, `lib/concept-catalog.mjs`, site `/research` |
| `05-craft-floor.md` | Quality floor, bans, reflexes, per-model sections | `skill/reference/craft-floor.md` |
| `06-detector-rules.md` | 59 rules (id/category/severity), CLI, exit codes, engines, ignores | `cli/engine/registry/antipatterns.mjs`, `cli/engine/*`, site `/slop` |
| `07-hooks-enforcement.md` | Per-edit + deep pass, harness manifests, approval, config | `skill/reference/hooks.md`, `skill/scripts/hook-admin.mjs`, `hook-lib.mjs`, site `/docs/hooks` |
| `08-live-mode.md` | Live browser iteration, alpha status, scripts | `skill/reference/live.md`, `skill/scripts/live/*`, site `/docs/live` |
| `09-maintenance-doctor.md` | Doctor (tool/schema/truth drift), config, ignores, update | `skill/reference/doctor.md`, `skill/scripts/doctor.mjs`, site `/docs/doctor`, `/docs/config` |
| `10-native-platforms-harnesses.md` | iOS/Android/adaptive, per-harness builds, per-model rules | `skill/reference/ios.md`, `android.md`, `audit.native.md`, `adapt.native.md`, `docs/HARNESSES.md` |
| `11-license-provenance.md` | Apache-2.0, site content signals, versioning, research provenance | `LICENSE`, `NOTICE.md`, `package.json`, site `robots.txt` |

## Open questions for the user (not for stinger-forge to invent)

1. **Scope of the Bee's routing:** should `impeccable-worker-bee` become the *default* router for all frontend UI/UX work (retiring `design-taste-frontend`, `frontend-design`, `high-end-visual-design`, `gpt-taste`, `web-design-guidelines` as fallbacks), or coexist?
2. **Upstream install vs stinger-only:** should the army run `npx impeccable install` per project (hooks + compiled skill) as the enforcement layer, with the stinger as guidance + gate procedure? (Recommended: yes.)
3. **CI gate:** add `npx impeccable detect src/` to army projects' PR checks?
4. **Live Mode:** adopt now (alpha) or defer until stable?
5. **Native:** does the army need the iOS/Android/adaptive playbooks in the first stinger release, or web-only?
