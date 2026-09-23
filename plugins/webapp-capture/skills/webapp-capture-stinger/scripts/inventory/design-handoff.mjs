// Package a Claude Design handoff: component library, candidate tokens, audit findings,
// page screenshots, and filled CLAUDE-DESIGN-INSTRUCTIONS.md, zipped for upload.
// Images are converted to lossless WebP (pixel-identical, smaller) unless KEEP_PNG=1.
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... node inventory/design-handoff.mjs
//   env: OUT=<zip path>  SHOTS_PER_COMPONENT=4  KEEP_PNG=1  SCREENSHOTS=<dir of route screenshots>
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { capturePaths, log, slugify } from "../lib/common.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const P = capturePaths();
const cfg = P.cfg;
const INV = P.inventory;
const ledgerPath = path.join(INV, "ledger.json");
if (!fs.existsSync(ledgerPath)) throw new Error(`${ledgerPath} not found: build the component library first (inventory/build.mjs)`);
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const tokensRaw = fs.existsSync(P.tokensRaw) ? JSON.parse(fs.readFileSync(P.tokensRaw, "utf8")) : null;
const appName = cfg?.app?.name || "App";
const stamp = P.today;
const OUT = path.resolve(process.env.OUT || path.join(INV, `${slugify(appName)}-claude-design-handoff-${stamp}.zip`));
const SHOTS = Number(process.env.SHOTS_PER_COMPONENT || 4);
const keepPng = process.env.KEEP_PNG === "1";

let sharp = null;
if (!keepPng) { try { sharp = (await import("sharp")).default; } catch { log("sharp not installed: images stay PNG"); } }

const stage = fs.mkdtempSync(path.join(os.tmpdir(), "claude-design-handoff-"));
const root = path.join(stage, `${slugify(appName)}-claude-design-handoff`);
fs.mkdirSync(root, { recursive: true });
const copyImage = async (src, destNoExt) => {
  if (sharp) {
    const dest = `${destNoExt}.webp`;
    await sharp(src).webp({ lossless: true, effort: 4 }).toFile(dest);
    return path.basename(dest);
  }
  const dest = `${destNoExt}${path.extname(src)}`;
  fs.copyFileSync(src, dest);
  return path.basename(dest);
};
const rewriteRefs = (text, renames) => renames.reduce((t, [a, b]) => t.split(a).join(b), text);

// 1) Components: markdown, styles, assets, markup, and a capped set of screenshots.
let imageCount = 0;
for (const c of ledger.components) {
  const src = path.join(INV, c.path);
  const dst = path.join(root, "components", c.name);
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.join(dst, "screenshots"), { recursive: true });
  for (const f of ["styles.json", "assets.json", "code.html"]) {
    if (fs.existsSync(path.join(src, f))) fs.copyFileSync(path.join(src, f), path.join(dst, f));
  }
  const shotDir = path.join(src, "screenshots");
  const shots = fs.existsSync(shotDir) ? fs.readdirSync(shotDir).filter((f) => /\.(png|webp)$/i.test(f)).sort() : [];
  // Keep the first shot of each variant or part, then fill up to the cap.
  const firsts = shots.filter((f) => /-01\.(png|webp)$/i.test(f));
  const chosen = [...new Set([...firsts, ...shots])].slice(0, Math.max(SHOTS, firsts.length));
  const renames = [];
  for (const f of chosen) {
    const out = await copyImage(path.join(shotDir, f), path.join(dst, "screenshots", f.replace(/\.(png|webp)$/i, "")));
    if (out !== f) renames.push([`screenshots/${f}`, `screenshots/${out}`]);
    imageCount++;
  }
  const md = fs.readFileSync(path.join(src, "component.md"), "utf8");
  fs.writeFileSync(path.join(dst, "component.md"), rewriteRefs(md, renames));
}
fs.writeFileSync(path.join(root, "ledger.json"), JSON.stringify(ledger, null, 1));

// 2) Tokens: candidate DTCG file plus a readable summary.
fs.mkdirSync(path.join(root, "tokens"), { recursive: true });
const candidate = path.join(INV, "candidate.tokens.json");
if (fs.existsSync(candidate)) fs.copyFileSync(candidate, path.join(root, "tokens", "candidate.tokens.json"));
const top = (key, n = 12) => (tokensRaw?.observed?.[key] || []).slice(0, n).map((e) => `| \`${e.value}\` | ${e.count} | ${e.routes} |`).join("\n");
if (tokensRaw) {
  const section = (title, key, n) => `## ${title}\n\n| Value | Uses | Routes |\n| --- | --- | --- |\n${top(key, n) || "| none observed | | |"}\n`;
  fs.writeFileSync(path.join(root, "tokens", "tokens-summary.md"), [
    `# Observed token summary: ${appName}`, "",
    `${tokensRaw.generatedFrom.states} page states across ${tokensRaw.generatedFrom.routes} routes, ${tokensRaw.generatedFrom.theme} theme. Counts are text or box occurrences.`, "",
    section("Text colors", "color", 15), section("Background colors", "backgroundColor", 15), section("Border colors", "borderColor", 10),
    section("Font sizes", "fontSize", 15), section("Font weights", "fontWeight", 8), section("Line heights", "lineHeight", 10),
    section("Font families", "fontFamily", 5), section("Border radius", "borderRadius", 10), section("Spacing", "spacing", 20), section("Box shadows", "boxShadow", 8),
  ].join("\n"));
}

// 3) Audit reports (visual and code) from the configured audit folder, newest first.
fs.mkdirSync(path.join(root, "audit"), { recursive: true });
let hasCodeAudit = false;
let auditFiles = [];
if (fs.existsSync(P.audit)) {
  auditFiles = fs.readdirSync(P.audit).filter((f) => /(visual-audit|code-ui-audit|ui-inconsistency-report)\.(md|json)$/.test(f)).sort().reverse();
  const latest = new Map();
  for (const f of auditFiles) {
    const kind = f.replace(/^\d{4}-\d{2}-\d{2}-/, "");
    if (!latest.has(kind)) latest.set(kind, f);
  }
  for (const f of latest.values()) {
    fs.copyFileSync(path.join(P.audit, f), path.join(root, "audit", f));
    if (f.includes("code-ui-audit")) hasCodeAudit = true;
  }
}
if (!fs.readdirSync(path.join(root, "audit")).length) {
  fs.writeFileSync(path.join(root, "audit", "README.md"), "No audit reports were found when this package was built. Run the audit route to add them.\n");
}

// 4) Page screenshots: the first scroll shot of every route and tab state.
const shotsRoot = process.env.SCREENSHOTS || cfg?.output?.screenshots;
let pageCount = 0;
if (shotsRoot && fs.existsSync(shotsRoot)) {
  fs.mkdirSync(path.join(root, "pages"), { recursive: true });
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : /-001\.png$/.test(e.name) ? [path.join(dir, e.name)] : []);
  for (const file of walk(shotsRoot).sort()) {
    await copyImage(file, path.join(root, "pages", path.basename(file).replace(/-001\.png$/, "")));
    pageCount++;
  }
  const onboarding = path.join(shotsRoot, "_onboarding");
  if (fs.existsSync(onboarding)) {
    for (const file of fs.readdirSync(onboarding).filter((name) => /\.png$/i.test(name)).sort()) {
      await copyImage(path.join(onboarding, file), path.join(root, "pages", `onboarding-${file.replace(/\.png$/i, "")}`));
      pageCount++;
    }
  }
}

// Optional project context files, supplied explicitly by the caller. These are
// copied as evidence only and never discovered from the source tree implicitly.
const contextFiles = (process.env.HANDOFF_FILES || "").split(",").filter(Boolean).map((file) => path.resolve(file));
if (contextFiles.length) {
  fs.mkdirSync(path.join(root, "context"), { recursive: true });
  const contextNames = new Set();
  const sensitiveName = /(^|[._-])(env|auth|session|credential|secret|private[-_ ]?key)([._-]|$)|\.(pem|key|p12|pfx)$/i;
  const allowedExt = new Set([".md", ".txt", ".json", ".yaml", ".yml", ".csv"]);
  const redactPatterns = (cfg?.redact?.patterns || []).map((pattern) => new RegExp(pattern, "gi"));
  for (const file of contextFiles) {
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`handoff context file not found: ${file}`);
    if (fs.lstatSync(file).isSymbolicLink()) throw new Error(`handoff context file cannot be a symbolic link: ${file}`);
    const name = path.basename(file);
    if (contextNames.has(name)) throw new Error(`handoff context filenames must be unique: ${name}`);
    if (sensitiveName.test(name)) throw new Error(`refusing sensitive-looking handoff context file: ${name}`);
    if (!allowedExt.has(path.extname(name).toLowerCase())) throw new Error(`handoff context file must be text, JSON, YAML, or CSV: ${name}`);
    if (fs.statSync(file).size > 5 * 1024 * 1024) throw new Error(`handoff context file exceeds 5 MB: ${name}`);
    const content = fs.readFileSync(file, "utf8");
    for (const pattern of redactPatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(content)) throw new Error(`handoff context file matches a configured redaction pattern: ${name}`);
    }
    fs.writeFileSync(path.join(root, "context", name), content);
    contextNames.add(name);
  }
}

// 5) Assets, and the shadcn/ui map when one has been generated.
if (fs.existsSync(path.join(INV, "assets"))) fs.cpSync(path.join(INV, "assets"), path.join(root, "assets"), { recursive: true });
const hasShadcn = fs.existsSync(path.join(INV, "shadcn", "shadcn-map.json"));
if (hasShadcn) {
  fs.mkdirSync(path.join(root, "shadcn"), { recursive: true });
  for (const f of ["SHADCN-MAP.md", "shadcn-map.json", "globals.css", "theme.json"]) {
    if (fs.existsSync(path.join(INV, "shadcn", f))) fs.copyFileSync(path.join(INV, "shadcn", f), path.join(root, "shadcn", f));
  }
}

// 6) Instructions.
const byLayer = {};
for (const c of ledger.components) byLayer[c.layer] = (byLayer[c.layer] || 0) + 1;
const iconsFile = path.join(INV, "assets", "icons.json");
const icons = fs.existsSync(iconsFile) ? JSON.parse(fs.readFileSync(iconsFile, "utf8")) : null;
const keyNumbers = [
  `- ${ledger.components.length} components (${Object.entries(byLayer).map(([k, v]) => `${v} ${k}`).join(", ")}), ${(ledger.unassigned || []).length} unassigned groups`,
  tokensRaw ? `- ${tokensRaw.observed.color?.length || 0} text colors, ${tokensRaw.observed.backgroundColor?.length || 0} background colors, ${tokensRaw.observed.fontSize?.length || 0} font sizes, ${tokensRaw.observed.borderRadius?.length || 0} radii, ${tokensRaw.observed.boxShadow?.length || 0} shadows observed` : "",
  icons ? `- ${icons.glyphs.length} icon glyphs (${icons.font})` : "",
  `- ${pageCount} page screenshots, ${imageCount} component screenshots`,
].filter(Boolean).join("\n");
const topInconsistencies = (ledger.inconsistencies || []).slice(0, 15).map((x, i) => `${i + 1}. ${typeof x === "string" ? x : JSON.stringify(x)}`).join("\n") || "None recorded in the ledger; see `audit/`.";
const template = fs.readFileSync(path.join(here, "../../references/prompts/claude-design-handoff.md"), "utf8").replace(/^<!-- Template\..*?-->\s*/s, "");
const fill = {
  APP_NAME: appName,
  APP_CONTEXT: cfg?.app?.context || "a web application",
  DATE: stamp,
  ORIGIN: cfg?.app?.origin || "the captured origin",
  THEME: tokensRaw?.generatedFrom?.theme || cfg?.browser?.colorScheme || "default",
  ROUTES: String(tokensRaw?.generatedFrom?.routes ?? "?"),
  STATES: String(tokensRaw?.generatedFrom?.states ?? "?"),
  COMPONENTS: String(ledger.components.length),
  ICON_FONT: icons?.font || cfg?.icons?.fontName || "icon font",
  SHADCN_ROW: hasShadcn ? "| `shadcn/` | A component-by-component map onto shadcn/ui (`shadcn-map.json`, `SHADCN-MAP.md`) and a draft `globals.css` theme | Use it so the system you design can be implemented directly with shadcn/ui |\n" : "",
  CODE_AUDIT_NOTE: hasCodeAudit ? ", plus code-level findings (hardcoded colors, one-off values, repeated class lists)" : "",
  KEY_NUMBERS: keyNumbers,
  TOP_INCONSISTENCIES: topInconsistencies,
};
fs.writeFileSync(path.join(root, "CLAUDE-DESIGN-INSTRUCTIONS.md"), template.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in fill ? fill[k] : m)));

// 7) Zip: system zip, else tar with zip format (Windows 10+), then verify.
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.rmSync(OUT, { force: true });
try {
  execFileSync("zip", ["-qr", OUT, path.basename(root)], { cwd: stage, stdio: "inherit" });
} catch {
  execFileSync("tar", ["-a", "-cf", OUT, path.basename(root)], { cwd: stage, stdio: "inherit" });
}
const bytes = fs.statSync(OUT).size;
fs.rmSync(stage, { recursive: true, force: true });
log(`Claude Design handoff: ${OUT}`);
log(`${ledger.components.length} components, ${imageCount} component screenshots, ${pageCount} page screenshots, ${(bytes / 1048576).toFixed(1)} MB`);
if (bytes > 200 * 1048576) log("WARNING: over 200 MB. Rerun with SHOTS_PER_COMPONENT=2 to shrink it.");
console.log(JSON.stringify({ zip: OUT, megabytes: +(bytes / 1048576).toFixed(1), components: ledger.components.length, componentScreenshots: imageCount, pageScreenshots: pageCount }));
