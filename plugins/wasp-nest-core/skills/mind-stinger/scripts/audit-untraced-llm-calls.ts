/**
 * scripts/audit-untraced-llm-calls.ts
 *
 * Static audit — scans the codebase for LLM calls not wrapped in traceAICall().
 * Produces a markdown report listing each unwrapped call with file:line and a
 * canonical fix suggestion.
 *
 * Run:
 *   pnpm tsx .cursor/skills/mind-stinger/scripts/audit-untraced-llm-calls.ts <api-src-path>
 *   # default api-src-path: api/src
 *
 * Detection logic:
 *   1. Find every call to `openai.chat.completions.create(...)` or
 *      `getAIClient().chat.completions.create(...)` in the codebase.
 *   2. For each, walk up the AST. If any ancestor is a CallExpression named
 *      `traceAICall`, the call is traced (skip).
 *   3. Otherwise, emit a finding.
 *
 * Exit code = number of must-fix findings (so CI can gate).
 *
 * Source-of-truth: library/knowledge-base/ai/observability-evaluation.md §2
 *                  guides/16-observability.md
 *
 * Recurring gap-pattern exception: ai-coach-router.ts's routeToCoach() is documented
 * as untraced (one of the recurring gap patterns). The script flags it
 * with a "documented gap" tag instead of a normal finding.
 */

import { Project, SyntaxKind, type Node } from "ts-morph";
import { relative, resolve } from "node:path";
import process from "node:process";

interface Finding {
  file:     string;
  line:     number;
  symbol:   string;
  message:  string;
  status:   "must-fix" | "documented-gap";
}

const TARGET_METHOD_NAMES = new Set([
  "create",
]);

const TARGET_CALL_PATTERNS = [
  /openai\.chat\.completions\.create/,
  /getAIClient\(\)\.chat\.completions\.create/,
  /client\.chat\.completions\.create/,  // common local alias
];

const DOCUMENTED_GAP_FILES = new Set([
  "ai-coach-router.ts",   // routeToCoach() — recurring gap pattern
]);

const root = process.argv[2] ?? "api/src";
const project = new Project({ tsConfigFilePath: resolve(`${root}/../tsconfig.json`) });
project.addSourceFilesAtPaths(`${root}/**/*.ts`);

const findings: Finding[] = [];

for (const sf of project.getSourceFiles()) {
  sf.forEachDescendant(node => {
    if (node.getKind() !== SyntaxKind.CallExpression) return;
    const text = node.getText();
    if (!TARGET_CALL_PATTERNS.some(re => re.test(text))) return;
    if (text.length > 200 || !text.includes("create(")) return;

    // Walk up looking for traceAICall wrapper
    let cur: Node | undefined = node.getParent();
    let traced = false;
    while (cur) {
      if (cur.getKind() === SyntaxKind.CallExpression) {
        const cname = (cur as any).getExpression?.()?.getText?.() ?? "";
        if (cname.endsWith("traceAICall")) { traced = true; break; }
      }
      cur = cur.getParent();
    }
    if (traced) return;

    const filePath = relative(process.cwd(), sf.getFilePath()).replace(/\\/g, "/");
    const fileName = filePath.split("/").pop() ?? "";
    const status: Finding["status"] = DOCUMENTED_GAP_FILES.has(fileName) ? "documented-gap" : "must-fix";
    findings.push({
      file:    filePath,
      line:    node.getStartLineNumber(),
      symbol:  text.slice(0, 80) + (text.length > 80 ? "…" : ""),
      message: status === "documented-gap"
        ? "Routing-call tracing gap — flagged on every observability audit until closed (guides/16-observability.md §4)."
        : "LLM call not wrapped in traceAICall() — must-fix per guides/16-observability.md §3.",
      status,
    });
  });
}

// Render report
const mustFix = findings.filter(f => f.status === "must-fix");
const documented = findings.filter(f => f.status === "documented-gap");

console.log("# audit-untraced-llm-calls\n");
console.log(`Run: ${new Date().toISOString()}`);
console.log(`Root: ${root}\n`);
console.log(`## Summary\n`);
console.log(`- **Must-fix findings:** ${mustFix.length}`);
console.log(`- **Documented gaps:** ${documented.length}\n`);

if (mustFix.length > 0) {
  console.log(`## Must-fix\n`);
  for (const f of mustFix) {
    console.log(`- \`${f.file}:${f.line}\` — \`${f.symbol}\`\n  - ${f.message}\n`);
  }
}

if (documented.length > 0) {
  console.log(`## Documented gaps (recurring gap pattern)\n`);
  for (const f of documented) {
    console.log(`- \`${f.file}:${f.line}\` — \`${f.symbol}\`\n  - ${f.message}\n`);
  }
}

if (findings.length === 0) {
  console.log("No untraced LLM calls detected. ✓");
}

process.exit(mustFix.length);
