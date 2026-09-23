// Code-level UI inconsistency scan over a source tree. Dependency-free first pass;
// pair with stylelint and jscpd for depth (see guides/03-inconsistency-audit.md).
// Usage: SRC=<repo or src dir> OUT=<report path without extension> node audit/audit-code.mjs
import fs from "node:fs";
import path from "node:path";
import { capturePaths } from "../lib/common.mjs";

const SRC = path.resolve(process.env.SRC || ".");
const OUT = process.env.OUT || (process.env.CAPTURE_CONFIG ? path.join(capturePaths().audit, `${new Date().toISOString().slice(0, 10)}-code-ui-audit`) : path.join(SRC, "code-ui-audit"));
const EXT = /\.(tsx?|jsx?|mjs|cjs|svelte|vue|astro|html|css|scss|less)$/;
const SKIP = /(^|\/)(node_modules|dist|build|out|\.next|\.svelte-kit|\.turbo|coverage|vendor|\.git)(\/|$)/;

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.test(path.relative(SRC, p))) continue;
    if (e.isDirectory()) walk(p);
    else if (EXT.test(e.name) && fs.statSync(p).size < 1_000_000) files.push(p);
  }
})(SRC);

const hits = { hexColor: [], rgbColor: [], arbitraryValue: [], arbitraryTokenValue: [], inlineStyle: [], important: [], zIndex: [] };
const classStrings = new Map();
const cssVarDefs = new Set(), cssVarUses = new Map();

for (const file of files) {
  const rel = path.relative(SRC, file);
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const isStyle = /\.(css|scss|less)$/.test(file);
  lines.forEach((line, i) => {
    const at = { file: rel, line: i + 1, text: line.trim().slice(0, 160) };
    const noUrl = line.replace(/https?:\/\/\S+/g, "");
    if (/#[0-9a-fA-F]{3,8}\b/.test(noUrl) && !/^\s*(\/\/|\*|<!--)/.test(line) && !/--[\w-]+\s*:/.test(line)) hits.hexColor.push(at);
    if (/\b(rgba?|hsla?|oklch|oklab)\(/.test(line) && !/--[\w-]+\s*:/.test(line)) hits.rgbColor.push(at);
    for (const m of line.matchAll(/\b[\w:-]+-\[[^\]\s]+\]/g)) {
      const token = m[0].replace(/^(?:[\w-]+:)+/, ""); // strip variants like hover: md:
      if (/^(data|aria|group|peer|supports|has|not|nth)-\[/.test(token)) continue; // selector variants, not values
      (/\[var\(--/.test(token) ? hits.arbitraryTokenValue : hits.arbitraryValue).push({ ...at, token });
    }
    if (/\bstyle=\{\{|\bstyle="[^"]*:/.test(line)) hits.inlineStyle.push(at);
    if (/!important/.test(line)) hits.important.push(at);
    if (/z-index\s*:\s*\d{3,}|\bz-\[\d+\]/.test(line)) hits.zIndex.push(at);
    for (const m of line.matchAll(/--([\w-]+)\s*:/g)) cssVarDefs.add(m[1]);
    for (const m of line.matchAll(/var\(--([\w-]+)/g)) cssVarUses.set(m[1], (cssVarUses.get(m[1]) || 0) + 1);
    if (!isStyle) {
      for (const m of line.matchAll(/class(?:Name)?=["'`{]\s*["'`]?([^"'`}]{40,})["'`]/g)) {
        const key = m[1].trim().split(/\s+/).sort().join(" ");
        const arr = classStrings.get(key) || [];
        arr.push(`${rel}:${i + 1}`);
        classStrings.set(key, arr);
      }
    }
  });
}

const arbitraryByToken = {};
for (const h of hits.arbitraryValue) arbitraryByToken[h.token] = (arbitraryByToken[h.token] || 0) + 1;
const repeatedClassLists = [...classStrings.entries()].filter(([, locs]) => locs.length >= 3).sort((a, b) => b[1].length - a[1].length).slice(0, 40).map(([classes, locs]) => ({ classes, count: locs.length, locations: locs.slice(0, 10) }));
const unusedVars = [...cssVarDefs].filter((v) => !cssVarUses.has(v) && !v.startsWith("tw-"));

const summary = {
  scannedFiles: files.length,
  hardcodedHexColors: hits.hexColor.length,
  functionalColorLiterals: hits.rgbColor.length,
  tailwindArbitraryValues: hits.arbitraryValue.length,
  tailwindArbitraryTokenRefs: hits.arbitraryTokenValue.length,
  inlineStyles: hits.inlineStyle.length,
  importantDeclarations: hits.important.length,
  largeZIndexLiterals: hits.zIndex.length,
  repeatedLongClassLists: repeatedClassLists.length,
  cssVariablesDefined: cssVarDefs.size,
  cssVariablesNeverUsed: unusedVars.length,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(`${OUT}.json`, JSON.stringify({ summary, topArbitraryValues: Object.entries(arbitraryByToken).sort((a, b) => b[1] - a[1]).slice(0, 50), repeatedClassLists, unusedVars, hits }, null, 1));
const md = [
  "# Code UI inconsistency scan", "",
  `Scanned ${files.length} files under \`${SRC}\`.`, "",
  "| Signal | Count | Why it matters |", "| --- | --- | --- |",
  `| Hardcoded hex colors | ${summary.hardcodedHexColors} | Bypass design tokens; drift when the palette changes |`,
  `| rgb/hsl/oklch literals | ${summary.functionalColorLiterals} | Same as above |`,
  `| Tailwind arbitrary values | ${summary.tailwindArbitraryValues} | One-off sizes and colors outside the theme scale |`,
  `| Arbitrary values wrapping CSS variables | ${summary.tailwindArbitraryTokenRefs} | Token-backed but bypassing the theme; promote the variable into @theme |`,
  `| Inline styles | ${summary.inlineStyles} | Styling outside the system; hard to audit |`,
  `| !important | ${summary.importantDeclarations} | Specificity fights, often patching inconsistency |`,
  `| z-index literals of 100+ | ${summary.largeZIndexLiterals} | Missing layering scale |`,
  `| Long class lists repeated 3+ times | ${summary.repeatedLongClassLists} | Copy-pasted components that should be one component |`,
  `| CSS variables never used | ${summary.cssVariablesNeverUsed} of ${summary.cssVariablesDefined} | Dead or misspelled tokens |`, "",
  "## Most common arbitrary values", "",
  ...Object.entries(arbitraryByToken).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([t, n]) => `- \`${t}\` x${n}`), "",
  "## Repeated class lists (component extraction candidates)", "",
  ...repeatedClassLists.slice(0, 15).map((r) => `- ${r.count}x \`${r.classes.slice(0, 120)}\` (${r.locations.slice(0, 3).join(", ")})`), "",
  "Full hit lists with file and line are in the JSON report.",
].join("\n");
fs.writeFileSync(`${OUT}.md`, md);
console.log(JSON.stringify(summary));
