/**
 * scripts/scan-anti-patterns.ts
 *
 * Stub — scans a React codebase for common anti-patterns listed in
 * `guides/12-anti-patterns.md`. Produces a markdown report to stdout.
 *
 * Run:
 *   pnpm tsx .cursor/skills/react-stinger/scripts/scan-anti-patterns.ts <src-path>
 *
 * Detectors (first pass — extend as needed):
 *
 *   1. useEffect-for-derived-state   (useEffect whose body is only `setState(derivedFromExistingVars)`)
 *   2. useEffect-for-prop-sync       (useEffect([props.X], () => setLocal(props.X)))
 *   3. barrel-files                  (aggregator index.ts that only re-exports)
 *   4. premature-memoization         (useMemo / useCallback for trivial compute)
 *   5. any-type-on-api-data          (const x = await fetch(..) as SomeType)
 *   6. use-client-at-root            ('use client' at page.tsx / layout.tsx top)
 *   7. leaf-fetch                    (fetch() inside a component file, not in api/ layer)
 *   8. index-as-key                  ({items.map((_, i) => <X key={i} />)})
 *
 * Implementation guidance:
 * - Use ts-morph for AST parsing.
 * - Emit findings as structured JSON, then render markdown.
 * - Exit code = # of must-fix findings (so CI can gate).
 */

import { Project, SyntaxKind, type Node } from 'ts-morph';
import { relative, resolve } from 'node:path';
import process from 'node:process';

type Severity = 'must-fix' | 'should-refactor' | 'style';
type Finding = { file: string; line: number; rule: string; severity: Severity; message: string; guide: string };

const MUST_FIX_RULES = new Set([
  'useEffect-for-derived-state',
  'useEffect-for-prop-sync',
  'any-type-on-api-data',
  'use-client-at-root',
  'index-as-key',
]);

function main() {
  const srcArg = process.argv[2] ?? './src';
  const srcPath = resolve(srcArg);

  const project = new Project({ tsConfigFilePath: resolve('tsconfig.json') });
  const findings: Finding[] = [];

  project.getSourceFiles().forEach((sf) => {
    const rel = relative(process.cwd(), sf.getFilePath());
    if (!sf.getFilePath().startsWith(srcPath)) return;

    // 1 + 2 — naive scan for useEffect(() => setX(Y), [Y])
    sf.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
      const expr = call.getExpression();
      if (expr.getText() !== 'useEffect') return;
      const body = call.getArguments()[0];
      if (!body) return;
      const bodyText = body.getText();
      const setStateMatch = bodyText.match(/^\(\)\s*=>\s*set[A-Z]\w+\((.+)\)\s*$/s);
      if (setStateMatch) {
        findings.push({
          file: rel,
          line: call.getStartLineNumber(),
          rule: 'useEffect-for-derived-state',
          severity: 'must-fix',
          message: `useEffect whose body is only setState of derived value. Compute during render.`,
          guide: 'guides/12-anti-patterns.md#1',
        });
      }
    });

    // 6 — 'use client' at a page/layout root
    const first = sf.getStatements()[0];
    if (first?.getText().includes("'use client'")) {
      const p = sf.getFilePath();
      if (p.includes('/app/') && (p.endsWith('/page.tsx') || p.endsWith('/layout.tsx'))) {
        findings.push({
          file: rel,
          line: 1,
          rule: 'use-client-at-root',
          severity: 'must-fix',
          message: `'use client' on a page/layout forces the whole subtree into the client bundle.`,
          guide: 'guides/11-server-components.md#push-use-client-down',
        });
      }
    }

    // 8 — <X key={i}> with index arg
    sf.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((attr) => {
      if (attr.getNameNode().getText() !== 'key') return;
      const expr = attr.getFirstChildByKind(SyntaxKind.JsxExpression);
      if (expr?.getText().match(/^\{(i|idx|index)\}$/)) {
        findings.push({
          file: rel,
          line: attr.getStartLineNumber(),
          rule: 'index-as-key',
          severity: 'must-fix',
          message: `Using array index as key. Use a stable ID.`,
          guide: 'guides/12-anti-patterns.md#11',
        });
      }
    });

    // 3 — barrel files (leaf exception: a single-component folder exporting its main component is OK)
    if (sf.getBaseName() === 'index.ts') {
      const stmts = sf.getStatements();
      const reExportOnly = stmts.length > 0 && stmts.every((s) => s.getKind() === SyntaxKind.ExportDeclaration);
      if (reExportOnly && stmts.length > 3) {
        findings.push({
          file: rel,
          line: 1,
          rule: 'barrel-files',
          severity: 'should-refactor',
          message: `Aggregator barrel file with ${stmts.length} re-exports hurts tree-shaking.`,
          guide: 'guides/12-anti-patterns.md#3',
        });
      }
    }
  });

  report(findings);
  const mustFix = findings.filter((f) => MUST_FIX_RULES.has(f.rule)).length;
  process.exit(mustFix);
}

function report(findings: Finding[]) {
  console.log('# Anti-pattern scan');
  console.log('');
  console.log(`Total findings: ${findings.length}`);
  const bySev = (s: Severity) => findings.filter((f) => f.severity === s).length;
  console.log(`- must-fix: ${bySev('must-fix')}`);
  console.log(`- should-refactor: ${bySev('should-refactor')}`);
  console.log(`- style: ${bySev('style')}`);
  console.log('');
  const byRule = new Map<string, Finding[]>();
  findings.forEach((f) => {
    if (!byRule.has(f.rule)) byRule.set(f.rule, []);
    byRule.get(f.rule)!.push(f);
  });
  for (const [rule, fs] of byRule) {
    console.log(`## ${rule} (${fs.length})`);
    fs.forEach((f) => {
      console.log(`- **[${f.severity}]** \`${f.file}:${f.line}\` — ${f.message} (${f.guide})`);
    });
    console.log('');
  }
}

main();
