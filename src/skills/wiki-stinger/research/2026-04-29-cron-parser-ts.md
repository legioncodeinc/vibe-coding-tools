---
title: cron-parser Node.js TypeScript
date: 2026-04-29
sources:
  - https://github.com/harrisiirak/cron-parser
  - https://www.npmjs.com/package/cron-parser
---

# cron-parser

## Summary
`cron-parser` is the canonical Node.js library for parsing and validating cron expressions. Wiki-worker-bee uses it both as a **validator** (is this string a real cron expression?) and a **describer** (when does this fire next?). For the `cron-job` entity sub-type, the agent extracts cron strings from common framework call sites (`node-cron`, `node-schedule`, `croner`, BullMQ `repeat: { cron }`, Inngest `triggers: [{ cron }]`, AWS EventBridge constants) and validates each via `CronExpressionParser.parse(expr)`. If parse fails, file as a stub with the literal expression and a `gap` flag.

## Key facts
- Modern API (v4+): `import { CronExpressionParser } from 'cron-parser'` then `CronExpressionParser.parse('*/2 * * * *')`. Returns an `Interval`-like object with `.next()`, `.prev()`, `.take(n)`, `.hasNext()`, `.hasPrev()`, `.reset(date?)`.
- Older API (v2-3): `cronParser.parseExpression('*/2 * * * *')`: equivalent. Some legacy projects still use this.
- Parse errors throw: wrap in try/catch.
- Required: Node.js ≥ 18, TypeScript ≥ 5 (modern versions). Older versions support Node 12+.
- Standard cron format (5 or 6 fields):
  - 5-field: `minute hour day-of-month month day-of-week`
  - 6-field (with seconds): `second minute hour day-of-month month day-of-week`
- `cron-parser` supports both 5- and 6-field expressions. Detect by counting whitespace-separated tokens.
- Options:
  - `currentDate: string | Date`: base time for `.next()`/`.prev()` calculations.
  - `endDate`, `startDate`: bounds; iteration throws once exceeded.
  - `tz: string`: IANA timezone (e.g., `'Europe/Paris'`).
  - `strict: boolean`: rejects ambiguous expressions and empty fields.
- Known gotcha (issue #338): `reset()` after `prev()` then `next()` skips a day in some timezone scenarios. Workaround: don't reuse the same parser instance; re-parse for each computation.
- Special expressions: `@yearly`, `@monthly`, `@weekly`, `@daily`, `@hourly`, `@reboot`: supported as syntactic sugar.
- For cron-job framework detection, look for these import sources:
  - `node-cron`: `cron.schedule('* * * * *', fn)`.
  - `node-schedule`: `schedule.scheduleJob('0 0 * * *', fn)`.
  - `croner`: `new Cron('0 0 * * *', fn)`.
  - `bullmq`: `queue.add(name, data, { repeat: { cron: '0 0 * * *' } })`.
  - `inngest`: `triggers: [{ cron: '0 0 * * *' }]`.
  - AWS Lambda EventBridge: schedule expressions in CDK/SAM YAML.

## Recommended approach for wiki-worker-bee

Detection heuristic for `cron-job`:

1. **AST scan for cron string literals at known call sites.** For each chunk file:
   - Scan import declarations for `node-cron`, `node-schedule`, `croner`, `cron`.
   - Walk `CallExpression` nodes whose callee is `cron.schedule`, `schedule.scheduleJob`, `new Cron(...)`, or `.add(name, data, { repeat: { cron: ... } })`.
   - Extract the first or relevant string-literal argument.
2. **Validate every extracted string with `CronExpressionParser.parse`:**
   ```ts
   try {
     const interval = CronExpressionParser.parse(expr);
     const next = interval.next().toString();
     // file entity with parsed-OK status
   } catch (err) {
     // file entity with status: stub, validation_error: err.message
   }
   ```
3. **Pair with handler:** the second arg of `cron.schedule(expr, handler)` is the function. If a named function reference, link via `triggers: [[entities/<handler>]]`. If inline arrow, list it as the handler in the body but don't file as separate entity.
4. **Cross-link to queue if the cron lives inside a Queue/Inngest config:** the cron-job entity links `triggered_by: [[entities/queue-foo]]` and the queue entity lists `cron_schedule: ...`.

Entity page filename: `entities/cron-<sanitized-name>.md`. The name comes from the surrounding context (variable assigned to, named export, or a fallback like `cron-<file-basename>-<line>`). `entity_type: cron-job`. Body sections: Expression / Next runs (top 3) / Handler / Source. The "Next runs" subsection is generated at extraction time and is informational only: wiki-worker-bee does NOT recompute it on every scan unless the expression changed.

For frameworks that accept cron expressions as enum constants (e.g., `CronExpression.EVERY_DAY_AT_MIDNIGHT` from `@nestjs/schedule`), look up the actual string value via the import resolution and validate that. If unresolvable statically, file as stub with a `gap` flag.

## Sources
- [harrisiirak/cron-parser GitHub](https://github.com/harrisiirak/cron-parser): date retrieved 2026-04-29, modern API, TypeScript examples, options.
- [cron-parser npm](https://www.npmjs.com/package/cron-parser): date retrieved 2026-04-29, package metadata, usage examples.

## Quotes worth preserving
> "A JavaScript library for parsing and manipulating cron expressions. Features timezone support, DST handling, and iterator capabilities.", cron-parser README

## Open questions / gaps
- For dynamically-built cron expressions (`buildCron(env.SCHEDULE)`), wiki-worker-bee can't statically resolve the value: emit a `gap` with the variable name.
- Should we render the next 3 fire times in the entity body? Recommend yes: it's the kind of cross-cutting visibility the wiki provides that grep doesn't (parallels the brief's recommendation for feature-flag `read_at` sites).
- Timezone: `cron-parser` accepts IANA tz strings. If the framework call doesn't specify a tz (most don't), default to UTC and note this in the body.
