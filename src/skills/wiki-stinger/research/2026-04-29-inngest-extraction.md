---
title: Inngest function definition AST extraction
date: 2026-04-29
sources:
  - https://www.inngest.com/docs/reference/typescript/v4/functions/create
  - https://www.inngest.com/docs/features/inngest-functions
  - https://www.inngest.com/docs/reference/typescript/functions/triggers
---

# Inngest function definition AST extraction

## Summary
Inngest is the second major queue/workflow platform wiki-worker-bee must recognize. Unlike BullMQ's class-instantiation pattern, Inngest functions are declared via `inngest.createFunction(config, handler)` where `inngest` is a client instance. Wiki-worker-bee detects them by walking for `CallExpression` nodes whose callee is `<identifier>.createFunction(...)`. The first arg is a config object (with `id`, `triggers`, optional `throttle`, etc.), the second is the handler function. Each `id` becomes the entity name; each trigger generates a separate cross-link (event name, cron expression, or webhook ref).

## Key facts
- Imports: `import { Inngest } from 'inngest'` then `const inngest = new Inngest({ id: 'my-app' })`.
- Function declaration:
  ```ts
  export default inngest.createFunction(
    { id: "import-product-images", triggers: { event: "shop/product.imported" } },
    async ({ event, step, runId }) => { /* handler */ }
  );
  ```
- The signature: `inngest.createFunction(config, handler): InngestFunction`.
- Config keys that matter for documentation:
  - `id: string`: function identifier (entity name).
  - `triggers: Trigger | Trigger[]`: events, crons, webhooks.
  - `throttle: { limit, period }`: flow control.
  - `concurrency`, `rateLimit`, `priority`, `cancelOn`, `batchEvents`, `retries`, `timeouts`: operational characteristics.
- Trigger shapes (one or more in `triggers` array):
  - `{ event: "app/user.created" }`: event-driven.
  - `{ cron: "0 * * * *" }`: scheduled (overlap with `cron-job` entity).
  - `{ event: "...", if: "event.data.size > 100" }`: filtered event.
- Trigger helpers (typed):
  - `eventType("shop/order.placed", { schema: z.object({...}) })`: typed event with runtime validation.
  - `cron("0 * * * *")`: typed cron helper.
  - `staticSchema<UserPayload>()`: type-only, no runtime validation.
- Handler signature: `async ({ event, step, events, runId, attempt, logger, ... }) => any`. `step.run('name', fn)` registers an idempotent step; `step.waitForEvent`, `step.sleep`, `step.invoke` are common patterns worth documenting.
- Functions are typically the default export of a file under `src/inngest/functions/<name>.ts`: file-naming is convention, not enforced.

## Recommended approach for wiki-worker-bee

Detection heuristic:

1. **Quick filter:** grep for `'inngest'` (single-quoted module name) in imports OR `.createFunction(` literal in source. Skip file if neither.
2. **AST walk:** find `CallExpression` nodes where the callee is a `PropertyAccessExpression` ending in `.createFunction`:
   ```ts
   sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
     .filter(ce => {
       const expr = ce.getExpression();
       return expr.getKind() === SyntaxKind.PropertyAccessExpression
         && expr.asKindOrThrow(SyntaxKind.PropertyAccessExpression).getName() === 'createFunction';
     });
   ```
3. **Extract config object:** `ce.getArguments()[0]` should be `ObjectLiteralExpression`. Walk its properties for `id`, `triggers`, `throttle`, `concurrency`, `cancelOn`. The `id` value (string literal) is the entity name.
4. **Extract triggers:** `triggers` value can be an object literal OR an array of object literals. For each trigger, extract `event` (string), `cron` (string), or `if` (string). Each `cron` entry generates a cross-link to a `cron-job` entity with the same handler.
5. **Identify handler:** `ce.getArguments()[1]` is the handler: typically `ArrowFunction` or `FunctionExpression`. If it's a named function reference, link to that function as a separate `function` entity via `triggers: [[entities/<handler-name>]]`.
6. **Detect step.run calls:** walk the handler body for `step.run('step-name', stepFn)` to enumerate logical sub-steps; render as a body subsection but do NOT file each step as its own entity (atomic-page rule: they're internal).

Entity page filename: `entities/inngest-<sanitized-id>.md`. `entity_type: queue` (Inngest functions are conceptually background jobs even though the framework calls them "functions"). Cross-link to a `cron-job` entity if any cron trigger exists.

Gotcha: Inngest functions wrapped via factory functions (e.g., `defineWorkflow({ ... })` that internally calls `inngest.createFunction`) won't be detected by AST. Emit a `gap` and mark with `pattern: inngest-factory` so the user knows to add explicit detection.

## Sources
- [Create Function, Inngest Documentation](https://www.inngest.com/docs/reference/typescript/v4/functions/create): date retrieved 2026-04-29, canonical createFunction signature, config keys.
- [Inngest Functions](https://www.inngest.com/docs/features/inngest-functions): date retrieved 2026-04-29, overview of triggers, throttling, steps.
- [Trigger helpers](https://www.inngest.com/docs/reference/typescript/functions/triggers): date retrieved 2026-04-29, eventType, cron, staticSchema typed helpers.

## Quotes worth preserving
> "Define your functions using the `createFunction` method on the Inngest client.", Inngest docs
> "An Inngest Function is composed of 3 main parts: Triggers, Flow Control, Handler.", Inngest docs

## Open questions / gaps
- Inngest's `step.invoke(otherFunction)` cross-links functions at runtime. Wiki-worker-bee should detect `step.invoke()` calls and emit `depends_on: [[entities/inngest-<other-id>]]` if the invoked function reference resolves statically.
- For projects that import functions from `./functions/index.ts` and register via `serve({ functions: [...] })`, wiki-worker-bee should walk the `serve()` call to enumerate registered functions if not detected per-file. Lower priority: most projects export per-file.
