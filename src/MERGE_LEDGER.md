# Honeybee reconciliation ledger

## Scope and authority

The audit covered the local `.claude`, `.agents`, `.codex`, and `.cursor` libraries; the `the-apiary` super-repository and its initialized `cli-kit`, `doctor`, `hive`, `honeycomb`, `knectar`, `nectar`, and `queen` submodules; and the attached `legion-suite`, `littlebird-skills`, `personal-ai-skills`, and `red-team-blue-team` sources.

`vibe-coding-tools/.claude` supplied the active canonical baseline. A source asset with the same type and name as that baseline did not replace it.

## Action record

| Disposition | Count | Action taken |
| --- | ---: | --- |
| Canonical active baseline | 181 | Copied from `.claude` into the active package. |
| Additive active assets | 57 | Added only when a worker-bee and stinger pair was complete, or when the asset was a non-pair type with no canonical name conflict. |
| Active package total | 238 | 109 agents, 112 skills, 7 commands, 5 hooks, and 5 rules. |
| Quarantine copies | 56 | 8 agents and 48 skills copied into `quarantine/` without participating in an installable hive. |
| Canonical-name conflicts | 182 | Left canonical and recorded, not copied over. |
| Correlated historical legacy assets | 148 | Guardian and weapon forms had a current correlated pair and were recorded as superseded, not copied. |
| Command aliases | 2 | `the-beekeeper` became `beekeeper`; `the-smoker` became `smoke-it`. |

The detailed, source-level results are in [asset-inventory.csv](reports/asset-inventory.csv), [common-folder-inventory.md](reports/common-folder-inventory.md), [net-gain.csv](reports/net-gain.csv), and [net-gain-report.md](reports/net-gain-report.md).

## Reconciliation rules applied

1. Canonical `vibe-coding-tools` wins every same-name conflict.
2. A new active Bee requires both `<base>-worker-bee` and `<base>-stinger`. Where multiple noncanonical candidates existed, the report selects the latest modified record deterministically and retains every source occurrence in the inventory.
3. `guardian`, `weapon`, `angel`, `forge`, `big-bang`, and other nonstandard agent or skill forms are not active assets. A form with a current correlated pair is superseded. A form without a complete correlated pair is copied to the matching quarantine type folder.
4. Source folders were copied from only. Nothing was removed or modified outside `src`.
5. No beekeeper-suit registration check was performed. This pass establishes source integrity and namespace inputs only.

## Portability work completed

- Active commands are named `beekeeper.md` and `smoke-it.md`, with the remaining canonical commands retained.
- Operative paths in active commands, agents, and `SKILL.md` entrypoints point to this package with relative navigation.
- `model-comparison-matrix.md` is included at this package root because `smoke-it` uses it as a supporting local reference.
- Research archives, quarantined historical copies, and literal descriptions of external harness locations were not rewritten as though they were portable package paths.

## Open product work

The [plugin-category proposal](reports/plugin-categories.md) is deliberately a packaging plan, not a registry change. Dynamic CI registration and marketplace bundle metadata remain future work. No skills were created in this reconciliation.

`support-response-stinger` originated in the canonical library but has no worker-bee and is not an orchestrator exception. It was therefore moved into `quarantine/skills/` under the same pairing rule. The natural-photography pair remains active: its agent is a Codex `.toml` agent rather than a Markdown agent.
