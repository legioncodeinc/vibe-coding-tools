# typescript-node-wasp-drone

## Domain
Owns TypeScript/Node for Hivemind (`@deeplake/hivemind`) specifically: strict ESM on Node 22, tsconfig Node16 module resolution + ES2022 + strict, esbuild multi-harness bundling, Vitest with coverage-v8, zod boundary validation (zod ^4 in the app, zod/v3 in the MCP server), the Deep Lake SQL-API access client (retry, `Semaphore(5)`, SQL string-guarding), the single-sourced Deep Lake schema and `healMissingColumns`, MCP tool authorship, jscpd duplication discipline, and the npm publish contract. This is opinionated to the real Hivemind stack, not generic TypeScript advice.

## Paired Stinger
[typescript-node-stinger](../../typescript-node-stinger) - stack enforcement, ESM/project-layout rules, the Deep Lake SQL-API client, zod-at-boundaries, MCP tool authoring, Vitest discipline, and deterministic audit scripts.

## Trigger phrases
- "review this TypeScript code"
- "Hivemind code review"
- "add a zod-validated MCP tool"
- "write a Vitest suite for this"
- "add a column to a Deep Lake table"
- "fix the esbuild bundle"
- "jscpd is failing"
- "ESM import broke at runtime"

## Do NOT route when
- The ask is Deep Lake table/index design from a data-engineering point of view rather than the TS access pattern: route to vector-store-wasp-drone.
- The ask is a security audit including auth/credential lifecycle: route to security-wasp-drone (this Drone flags and enforces `sqlStr`/`sqlLike`/`sqlIdent` and env-only secrets, it does not audit).
- The ask is recall ranking, embeddings strategy, or evals: route to retrieval-wasp-drone or embeddings-runtime-wasp-drone.
- The ask is Dockerfile shape, GitHub Actions, or release automation: route to ci-release-wasp-drone.
- The ask is PRD authoring for a TypeScript feature: route to library-wasp-drone.

## Inputs the Drone needs
- `package.json` and `tsconfig.json` to confirm the stack (ESM, Node 22, Node16 resolution, strict mode) before ruling.
- The classification of the invocation: code review, ESM/import audit, Deep Lake query audit, MCP tool add, Vitest setup, or schema change.
- Whether the codebase actually matches the canonical Hivemind stack, or whether reduced-coverage flagging is needed for a divergent stack (CJS, Webpack, different test runner).

## Outputs
- File:line-cited code review findings classified must-fix / should-refactor / style.
- New or refactored MCP tools with zod/v3 `inputSchema`, Deep Lake queries routed through the SQL-API client, or Vitest suites mirroring the harness layout.
- Deterministic audit-script output (untyped boundaries, unbatched queries, hardcoded secrets, swallowed catches, schema drift).
- An audit report or ADR filed under `library/requirements/reports/typescript/` or `library/knowledge/private/architecture/`.

## Commonly sequenced with
- vector-store-wasp-drone: for schema shape and indexing strategy behind a TS change.
- security-wasp-drone: for the audit pass this Drone's findings feed into.
- ci-release-wasp-drone: for the Dockerfile/CI shape wrapping the build this Drone enforces.
- library-wasp-drone: for PRD authorship once an architectural rationale is produced here.
