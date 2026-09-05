---
title: BullMQ queue definition extraction patterns
date: 2026-04-29
sources:
  - https://docs.bullmq.io/readme-1
  - https://docs.bullmq.io/guide/queues
  - https://api.docs.bullmq.io/classes/v5.Queue.html
  - https://api.docs.bullmq.io/classes/v4.Worker.html
---

# BullMQ queue definition extraction patterns

## Summary
BullMQ is the dominant TypeScript-native Redis-backed queue library. Queues are declared via `new Queue(name, opts?)`; workers (handlers) via `new Worker(name, processor, opts?)`. Wiki-worker-bee detects queues by AST-walking for `NewExpression` nodes whose constructor is `Queue` or `Worker` imported from `bullmq` (or `@bullmq/*` org packages). The queue's name string is the entity identifier; the worker's processor function is the entity's handler: link them via `triggers: [[entities/<handler-name>]]` per the brief's atomic principle.

## Key facts
- Imports: `import { Queue, Worker, QueueEvents, FlowProducer } from 'bullmq'`.
- Queue declaration: `const myQueue = new Queue('foo', { connection })`. First arg is the queue name (string literal), second is options.
- Job adds: `myQueue.add('jobName', payload, opts?)`: the `'jobName'` is a sub-entity within the queue (job kind), not a separate queue.
- Worker declaration: `const worker = new Worker('foo', async job => { ... }, { connection })`. First arg is queue name (must match the Queue's name), second is the processor function (or path to a sandboxed file), third is options.
- Worker processor can be inline (`async job => {}`), a named function reference (`processJob`), or a string path to a sandboxed processor file.
- Queue/Worker pairs: same first-string-arg → same queue. Wiki-worker-bee must group by name to render the queue page.
- Other related classes:
  - `QueueEvents`: listens for queue lifecycle events; not a queue per se.
  - `FlowProducer`: composes parent/child jobs; advanced topology.
- Generic types convey job data shape: `new Queue<MyDataType, MyResultType, "blue" | "brown">('myQueue')`. Names of allowed jobs are in the third type param.
- Job options that matter for documentation: `delay`, `attempts`, `backoff`, `removeOnComplete`, `removeOnFail`, `priority`, `repeat` (cron-style scheduling, overlaps with the `cron-job` entity sub-type).
- A queue declared with `repeat: { cron: '0 0 * * *' }` is BOTH a `queue` and a `cron-job` entity in the catalog: wiki-worker-bee should file two pages with cross-link.
- Connection: `connection: IORedis | RedisOptions`. Useful for `depends_on: [[entities/redis-connection]]` if the connection is shared.

## Recommended approach for wiki-worker-bee

Detection heuristic (run on every `.ts`/`.js` file in chunk):

1. **Quick filter (cheap):** grep for `bullmq` in imports. Skip file if not found.
2. **AST walk (precise):** use ts-morph to find `NewExpression` nodes:
   ```ts
   sourceFile.getDescendantsOfKind(SyntaxKind.NewExpression)
     .filter(ne => {
       const name = ne.getExpression().getText();  // 'Queue' | 'Worker' | 'QueueEvents' | etc.
       return ['Queue', 'Worker', 'QueueEvents', 'FlowProducer'].includes(name);
     });
   ```
3. **Extract the name argument:** `ne.getArguments()[0]`: must be a string literal (`StringLiteral` or `NoSubstitutionTemplateLiteral`). If it's an identifier or template expression, fall back to "dynamic queue name" with a `gap` in the response.
4. **Pair queues with workers:** group by name. The queue page lists known handlers (workers) as `triggers: [[entities/<worker-handler>]]`; the worker handler page (a `function` entity if extractable) lists `triggered_by: [[entities/queues/<queue-name>]]`.
5. **Detect repeat-job queues:** if the file calls `queue.add(name, data, { repeat: { cron: '...' } })`, ALSO file a `cron-job` entity page named `<queue-name>-<job-name>-cron` and cross-link.

Entity page filename: `entities/queue-<sanitized-name>.md` (kebab-cased). Frontmatter `entity_type: queue`, body sections: Purpose / Job kinds / Handler / Connection / Options / Source. Cite file:line for the `new Queue(...)` declaration.

For workers where the processor is a module path string (sandboxed processor), file the worker as a queue-attached entity AND emit a `gap` for the processor-file path so the chunk-driver can re-scan that file in the next pass.

## Sources
- [BullMQ Quick Start](https://docs.bullmq.io/readme-1): date retrieved 2026-04-29, canonical Queue + Worker declaration shape.
- [BullMQ Queues Guide](https://docs.bullmq.io/guide/queues): date retrieved 2026-04-29, queue lifecycle, options, add semantics.
- [BullMQ Queue API](https://api.docs.bullmq.io/classes/v5.Queue.html): date retrieved 2026-04-29, full constructor signature with generic type params.
- [BullMQ Worker API](https://api.docs.bullmq.io/classes/v4.Worker.html): date retrieved 2026-04-29, Worker constructor signature.

## Quotes worth preserving
> "Queues are controlled with the Queue class. As all classes in BullMQ, this is a lightweight class with a handful of methods that gives you control over the queue: `const queue = new Queue('Cars');`", BullMQ docs

## Open questions / gaps
- For projects that wrap `new Queue` in a factory (`createQueue('foo')`), AST detection by `NewExpression` will miss them. Recommend a secondary pass that recognizes function calls returning `Queue` instances (TypeScript inference required), but this is a v2 enhancement; v1 ships with new-expression detection only and emits a `gap` for unrecognized factory patterns.
- BullMQ Pro and Bull (legacy) have similar but not identical APIs. Wiki-worker-bee should detect import source: `bull` (legacy) gets a stub with `framework: bull-legacy`; `bullmq` and `@bullmq/*` get full extraction.
