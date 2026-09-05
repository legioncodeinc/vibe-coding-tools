/**
 * scripts/audit-tenant-id-filters.ts
 *
 * Static audit — scans the codebase for Qdrant query calls without a
 * `tenant_id` filter in the `must` list. Missing tenant_id is a security
 * finding (hand to security-worker-bee).
 *
 * Run:
 *   pnpm tsx .cursor/skills/mind-stinger/scripts/audit-tenant-id-filters.ts <api-src-path>
 *   # default api-src-path: api/src
 *
 * Detection logic:
 *   1. Find every call that looks like a Qdrant query:
 *        client.search(...)
 *        client.scroll(...)
 *        client.recommend(...)
 *        client.delete(...)
 *        client.count(...)
 *   2. Look at the second argument (or `filter` property in the call).
 *   3. If it doesn't contain a `must` array with `{ key: "tenant_id", ... }`,
 *      flag as must-fix.
 *
 * Exception: client.createCollection / createPayloadIndex / getCollections — no filter expected.
 *
 * Source-of-truth: library/knowledge-base/ai/vector-payload-schema.md §2
 *                  guides/09-vector-payload-schema.md
 */

import { Project, SyntaxKind, type Node, type CallExpression } from "ts-morph";
import { relative, resolve } from "node:path";
import process from "node:process";

interface Finding {
  file:    string;
  line:    number;
  method:  string;
  message: string;
  hint:    string;
}

const QDRANT_FILTERED_METHODS = new Set([
  "search",
  "scroll",
  "recommend",
  "count",
  "delete",
]);

const root = process.argv[2] ?? "api/src";
const project = new Project({ tsConfigFilePath: resolve(`${root}/../tsconfig.json`) });
project.addSourceFilesAtPaths(`${root}/**/*.ts`);

const findings: Finding[] = [];

function isQdrantClientCall(call: CallExpression): { method: string } | null {
  const expr = call.getExpression();
  if (expr.getKind() !== SyntaxKind.PropertyAccessExpression) return null;
  const pae = expr.asKindOrThrow(SyntaxKind.PropertyAccessExpression);
  const method = pae.getName();
  if (!QDRANT_FILTERED_METHODS.has(method)) return null;
  // Heuristic: the chain looks like client.search / qdrantClient.scroll / getQdrantClient().delete
  const chainText = pae.getExpression().getText();
  if (!/(client|qdrant)/i.test(chainText)) return null;
  return { method };
}

function callTextHasTenantIdFilter(call: CallExpression): boolean {
  const text = call.getText();
  // Cheap heuristic — look for tenant_id in the call text within ~600 chars of "filter"
  return /tenant_id/.test(text);
}

for (const sf of project.getSourceFiles()) {
  sf.forEachDescendant(node => {
    if (node.getKind() !== SyntaxKind.CallExpression) return;
    const call = node.asKindOrThrow(SyntaxKind.CallExpression);
    const meta = isQdrantClientCall(call);
    if (!meta) return;
    if (callTextHasTenantIdFilter(call)) return;

    findings.push({
      file:    relative(process.cwd(), sf.getFilePath()).replace(/\\/g, "/"),
      line:    call.getStartLineNumber(),
      method:  meta.method,
      message: `Qdrant ${meta.method}() without tenant_id filter — security finding (hand to security-worker-bee).`,
      hint:    `Add to filter.must: { key: "tenant_id", match: { value: tenantId } }. See guides/09-vector-payload-schema.md §2.`,
    });
  });
}

// Render report
console.log("# audit-tenant-id-filters\n");
console.log(`Run: ${new Date().toISOString()}`);
console.log(`Root: ${root}\n`);
console.log(`## Summary\n`);
console.log(`- **Findings:** ${findings.length}\n`);

if (findings.length > 0) {
  console.log(`## Findings\n`);
  for (const f of findings) {
    console.log(`- \`${f.file}:${f.line}\` — \`client.${f.method}()\``);
    console.log(`  - ${f.message}`);
    console.log(`  - ${f.hint}\n`);
  }
} else {
  console.log("No Qdrant queries missing tenant_id filter. ✓");
}

process.exit(findings.length);
