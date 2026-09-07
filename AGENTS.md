# Vibe Coding Tools project guidance

This is the always-on briefing for any coding agent working in this repository. Claude Code, Cursor, Codex, and Cowork all read this file, directly or through a thin import.

Human explanations live under [`learn/guides/`](learn/guides/).

## Operating rules

1. Do not add em dashes or en dashes to authored prose. Use ordinary punctuation. Preserve literal data and verbatim source material.
2. Protect user work. Never discard unrelated changes, rewrite history, or delete broad paths without clear authorization and a verified target.
3. For multi-step work, create a feature branch from `main`, state the plan, use the smallest suitable specialist, and verify the result.
4. Run the security gate before the independent quality gate. If quality changes the result, rerun security and quality.
5. Before declaring a pull request ready, fetch `origin/main`, check mergeability, resolve conflicts, and verify again.
6. During parallel work, each agent stays inside its assigned files and scope.
7. Treat `learn/examples/library/` as an example only. A consumer repository's live planning system belongs in its own root `library/`.

## The pairing law

Every Bee (agent) pairs with exactly one Stinger (skill), and every Stinger pairs with exactly one Bee. The Bee is the persona and the guardrails. The Stinger is the knowledge it wields. A Bee dispatched without loading its paired Stinger is a failed dispatch: terminate and re-dispatch.

Three skills are exempt because they operate at the orchestrator level and have no paired Bee:

- `beekeeper-suit` routes a request to the right Bee and arms it.
- `queen-bee-stinger` forges new rules, plugins, commands, Bees, and Stingers.
- `get-started-stinger` initializes and hardens a repository.

Do not add a fourth exemption without a deliberate decision.

## The Ship Gate

Before committing any code, run these in order:

1. `security-stinger`, then resolve every finding rated medium or above and re-evaluate the updated code in full.
2. `quality-stinger`, same discipline.
3. `github-repo-health-stinger`, which is an orchestrator-level task. A sub-agent must reinforce to the orchestrator that it loads this skill itself before commit or push.

Each pass writes its report into the relevant `library/` directory. The user reviews the reports and the agent summary, and approves the commit and push. Never ship around this gate.

## The forge pipeline

New components are built in seven stages, in order, no skipping: Topic, Research, Distillation, References, Guides, Skill File, Register.

Research means a fresh time-bounded sweep, six months by default and never past twelve without explicit consent, archived as raw sources inside the component's own `references/research/raw/`. Distillation means re-reading that archive and writing a cited digest where every claim points back to a raw file. The skill file is authored last, once there is knowledge to point at. Register means pairing the Bee, adding the roster row and guide in `beekeeper-suit`, and syncing repo references.

If a domain claim is not in a research archive on disk, it is not a fact yet. Do not author from training data.

## Component locations

- Agents: [`src/agents/`](src/agents/)
- Skills: [`src/skills/`](src/skills/)
- Commands: [`src/commands/`](src/commands/)
- Rules: [`src/rules/`](src/rules/)
- Hooks: [`src/hooks/`](src/hooks/)
- Model guidance: [`src/model-comparison-matrix.md`](src/model-comparison-matrix.md)

The `src/` tree is canonical. Keep portable components there and store harness entry templates or manifests under `src/harnesses/`. Harness folders and generated root entry files are local build outputs: ignore them, do not commit them, and never edit them as source. Validate affected source packages after a change. When checking generated adapters, run `python learn/scripts/generate-harnesses.py` in a disposable checkout and inspect its output there.

## Validation

Validate any component you create or change:

```
python src/skills/queen-bee-stinger/references/scripts/per-type-validation.py <path> --type skill|agent|rule|command|plugin --harness all
```

Zero errors is the bar. Skill frontmatter that crosses harnesses uses only the six Agent Skills spec fields: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Anything else hard-fails a claude.ai or Cowork upload.
