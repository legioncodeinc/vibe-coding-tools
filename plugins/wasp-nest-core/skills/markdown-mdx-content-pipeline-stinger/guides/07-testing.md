# Testing the Pipeline

A unified remark/rehype pipeline is deterministic: given the same input text, the same HTML output should always be produced. This makes it ideal for snapshot testing and fixture-based unit tests.

---

## Setup: vitest + unified

```bash
npm i -D vitest
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

---

## Fixture-based pipeline test

Create representative input files and snapshot their output:

```
__fixtures__/
  basic-paragraph.md
  gfm-table.md
  code-block.md
  math-inline.md
  math-block.md
  callout-note.md
  mermaid.md
  xss-script-tag.md         ← sanitization test
  xss-event-handler.md      ← sanitization test
```

```typescript
// pipeline.test.ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createPipeline } from '../src/pipeline'  // your processor factory

const fixture = (name: string) =>
  readFileSync(join(__dirname, '__fixtures__', name), 'utf-8')

const pipeline = createPipeline()

describe('Markdown pipeline', () => {
  it('renders a basic paragraph', async () => {
    const result = await pipeline.process(fixture('basic-paragraph.md'))
    expect(String(result)).toMatchSnapshot()
  })

  it('renders a GFM table', async () => {
    const result = await pipeline.process(fixture('gfm-table.md'))
    const html = String(result)
    expect(html).toContain('<table>')
    expect(html).toMatchSnapshot()
  })

  it('renders a fenced code block with syntax highlighting', async () => {
    const result = await pipeline.process(fixture('code-block.md'))
    const html = String(result)
    expect(html).toContain('<code')
    expect(html).toMatchSnapshot()
  })
})
```

---

## Sanitization tests (XSS)

These tests verify that malicious payloads are stripped, not just that valid content renders correctly.

```markdown
<!-- __fixtures__/xss-script-tag.md -->
Hello

<script>alert('xss')</script>

World
```

```markdown
<!-- __fixtures__/xss-event-handler.md -->
<a href="javascript:alert('xss')">Click me</a>

<img src="x" onerror="alert('xss')" />
```

```typescript
describe('Sanitization', () => {
  it('strips <script> tags', async () => {
    const result = await pipeline.process(fixture('xss-script-tag.md'))
    const html = String(result)
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('alert(')
  })

  it('strips javascript: href', async () => {
    const result = await pipeline.process(fixture('xss-event-handler.md'))
    const html = String(result)
    expect(html).not.toContain('javascript:')
  })

  it('strips onerror event handler', async () => {
    const result = await pipeline.process(fixture('xss-event-handler.md'))
    const html = String(result)
    expect(html).not.toContain('onerror')
  })
})
```

---

## Math rendering test

```markdown
<!-- __fixtures__/math-inline.md -->
The energy equation is $E = mc^2$ where $c$ is the speed of light.
```

```typescript
it('renders inline math with KaTeX', async () => {
  const result = await pipeline.process(fixture('math-inline.md'))
  const html = String(result)
  // KaTeX output contains the katex CSS class
  expect(html).toContain('katex')
})
```

---

## Plugin unit test

Test a custom plugin in isolation without wiring the full pipeline:

```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import myPlugin from '../src/remark-my-plugin'

it('transforms a specific node', async () => {
  const processor = unified()
    .use(remarkParse)
    .use(myPlugin, { prefix: '[NOTE]' })
    .use(remarkStringify)

  const result = await processor.process('Hello world')
  expect(String(result)).toBe('[NOTE] Hello world\n')
})
```

---

## Snapshot management

Snapshots live in `__snapshots__/pipeline.test.ts.snap`. Update them after intentional pipeline changes:

```bash
npx vitest run --update-snapshots
```

Review the diff carefully before committing: each snapshot change represents a rendering change that will affect production output.

---

## CI integration

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:snapshots": "vitest run --update-snapshots"
  }
}
```

Add to GitHub Actions:

```yaml
- name: Test pipeline
  run: npm test
```

Run with updated snapshots only in a dedicated update PR, not on every push.
