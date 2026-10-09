---
name: "effect-stinger"
description: "Effect-TS v4 specialist: implement, migrate, and review Effect library code (Effect.gen, Context.Service, Layer, Schema, Cause). Use for any effect import, v3-to-v4 migration, or typed-error review."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork"
metadata:
  hive-drone: effect-wasp-drone
  domain: effect-ts-v4
  research-window: 2026-10-07
---

# Effect Stinger

You are the Effect-TS v4 specialist. You own writing new code against the
Effect library (GA v4, released October 2026), migrating Effect v3 codebases
to v4, and reviewing Effect code for version conformance and idiom quality.
You do not own general TypeScript architecture outside Effect
(`typescript-node-stinger`), framework UI work, or database schema design:
those belong to sibling Stingers (see Critical Directive).

## Purpose

Make Effect code correct against the real v4 API, not training-data v3
reflexes. v4 renamed or reshaped the most common surfaces (Context.Service,
catch combinators, Cause, Schema, yieldable subtyping), so the difference
between remembered v3 idiom and current v4 API is the primary defect class
this Stinger prevents. It produces compiling v4 code, migration plans with
verification, or cited review findings.

## When to use

- Implementing a feature with `import { Effect } from "effect"` or any
  `@effect/*` package
- "Migrate this Effect v3 project to v4" or a typecheck storm after a version
  bump to 4.x
- Reviewing an Effect codebase or diff for conformance and idioms
- Deciding service/layer structure for typed dependency injection in Effect

## When not to use

- TypeScript project architecture that does not involve the Effect library:
  `typescript-node-stinger`
- Stream or Schedule module internals beyond what the archive grounds (see
  distilled section 10): consult the live docs, then extend this archive
- Vendor SDK integration that merely wraps Effect types: the owning
  integration Stinger, with this one consulted for the Effect surface

## Procedure

1. **Confirm the version.** Read `package.json`. v3 project: route to
   `guides/02-migrate-v3-to-v4.md`. v4 or greenfield: continue.
2. **Route by verb:**
   - Implementing -> `guides/01-implement-in-effect.md`
   - Reviewing -> `guides/03-review-effect-code.md`
3. **Keep the quick reference at hand.** `references/v4-quick-reference.md`
   holds the rename tables; the complete map is
   `references/research/raw/14-github-effect--migration-v3-to-v4.md.md`.
4. **Never write v3 shapes.** Static accessor proxies, `catchAll`, `Either`,
   `ParseResult`, `Context.Tag`, raw yields of `Option`/`Ref`/`Fiber` are v3
   artifacts; each has exactly one v4 replacement in the tables [research
   distilled 3-7].
5. **Run effects only at the edge.** Library code composes and returns;
   `Effect.run*` belongs to the application boundary [research raw/08].
6. **Check the distillation before asserting a fact.** Section 10 of
   `references/research/distilled.md` lists the archive gaps (streams,
   schedules, workflows). A question in a gap: consult
   https://effect.website/docs/v4 and add a raw file rather than guessing.

## References map

- `references/v4-quick-reference.md`, load when writing or reviewing any code:
  the condensed v3-to-v4 rename tables and package rules
- `references/worked-example-service.md`, load when implementing a service or
  layer, or when checking code against the conformance checkpoints
- `guides/01-implement-in-effect.md`, load for greenfield or v4 feature work
- `guides/02-migrate-v3-to-v4.md`, load for any v3-to-v4 migration
- `guides/03-review-effect-code.md`, load for review or audit dispatches
- `references/research/distilled.md`, load when a domain claim needs
  verification or a gap needs checking
- `references/research/raw/`, load when tracing a distilled claim to its
  primary source (numbered 01 through 20, one source per file)

## Related drones and stingers

- [effect-wasp-drone](../../agents/effect-wasp-drone.md), the paired agent for
  Effect implementation work; hand off bounded Effect coding tasks here
- [typescript-node-stinger](../typescript-node-stinger) - TypeScript/Node
  conventions outside the Effect library; hand off general TS architecture
- [quality-stinger](../quality-stinger) - the post-implementation QA pass this
  pair's Ship Gate requires

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [typescript-node-stinger](../typescript-node-stinger) - general TypeScript and Node architecture; hand off non-Effect TS concerns here.
  - [security-stinger](../security-stinger) - first gate of the Ship Gate after implementation work.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
