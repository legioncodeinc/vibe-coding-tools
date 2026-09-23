// Validate shadcn mapping agent output against the ledger and the shadcn/ui catalog,
// then write shadcn-map.json, SHADCN-MAP.md (migration guide), and globals.css (theme draft).
// Exit 1 with the batches to rerun when mappings are missing or invalid.
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... node inventory/shadcn-build.mjs [--allow-missing-theme]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { capturePaths } from "../lib/common.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const P = capturePaths();
const cfg = P.cfg;
const INV = path.resolve(P.inventory);
const OUT = path.join(INV, "shadcn");
const catalog = JSON.parse(fs.readFileSync(path.join(here, "../../references/shadcn-catalog.json"), "utf8"));
const ledger = JSON.parse(fs.readFileSync(path.join(INV, "ledger.json"), "utf8"));
const known = new Set(catalog.components);
const STRATEGIES = ["direct", "variant", "compose", "custom", "skip"];

// ---- collect and validate ----
const errors = [], warnings = [];
const byName = new Map();
const batchOf = {};
const batchDir = path.join(OUT, "batches");
for (const f of fs.readdirSync(batchDir).filter((f) => /^batch-\d+\.json$/.test(f))) {
  for (const c of JSON.parse(fs.readFileSync(path.join(batchDir, f), "utf8"))) batchOf[c.name] = f.match(/\d+/)[0];
}
for (const f of fs.readdirSync(batchDir).filter((f) => /^map-\d+\.json$/.test(f)).sort()) {
  let arr;
  try { arr = JSON.parse(fs.readFileSync(path.join(batchDir, f), "utf8")); } catch (e) { errors.push({ batch: f.match(/\d+/)[0], issue: `invalid JSON: ${e.message}` }); continue; }
  for (const m of arr) {
    const b = batchOf[m.name];
    if (byName.has(m.name)) { errors.push({ batch: b, component: m.name, issue: "mapped twice" }); continue; }
    if (!STRATEGIES.includes(m.strategy)) errors.push({ batch: b, component: m.name, issue: `invalid strategy ${m.strategy}` });
    for (const s of m.shadcn || []) {
      if (!known.has(s.component)) errors.push({ batch: b, component: m.name, issue: `unknown shadcn component "${s.component}"` });
      if (s.component === "toast") errors.push({ batch: b, component: m.name, issue: "toast is deprecated; use sonner" });
      const allowed = catalog.variants[s.component];
      for (const prop of ["variant", "size"]) {
        const raw = s.props?.[prop];
        if (!allowed?.[prop] || raw === undefined || raw === null || raw === "") continue;
        // Tolerate "a | b" lists and "(new)" or "(per state)" annotations, but every value must still be known.
        const values = String(raw).split("|").map((x) => x.replace(/\(.*?\)/g, "").trim()).filter(Boolean);
        const declared = new Set((m.newVariants || []).filter((n) => n.component === s.component && (n.prop || prop) === prop).map((n) => n.name));
        const unknown = values.filter((v) => !allowed[prop].includes(v) && !declared.has(v));
        if (unknown.length) errors.push({ batch: b, component: m.name, issue: `${s.component} ${prop} value(s) ${unknown.map((u) => `"${u}"`).join(", ")} not in the catalog and not declared in newVariants` });
        else if (values.length > 1 || values[0] !== raw) warnings.push(`${m.name}: ${s.component} ${prop}="${raw}" normalized; use a single value in props and list states in variantMap`);
      }
    }
    for (const i of m.install || []) if (!known.has(i)) errors.push({ batch: b, component: m.name, issue: `install of unknown component "${i}"` });
    if (m.strategy !== "skip" && !(m.shadcn || []).length && m.strategy !== "custom") warnings.push(`${m.name}: ${m.strategy} mapping lists no shadcn components`);
    byName.set(m.name, m);
  }
}
for (const c of ledger.components) if (!byName.has(c.name)) errors.push({ batch: batchOf[c.name], component: c.name, issue: "not mapped" });
for (const name of byName.keys()) if (!ledger.components.some((c) => c.name === name)) warnings.push(`${name}: mapped but not in ledger.json`);

const themePath = path.join(OUT, "theme.json");
const theme = fs.existsSync(themePath) ? JSON.parse(fs.readFileSync(themePath, "utf8")) : null;
if (!theme && !process.argv.includes("--allow-missing-theme")) errors.push({ issue: "theme.json missing: run the theme agent (THEME-INSTRUCTIONS.md)" });

if (errors.length) {
  const rerun = [...new Set(errors.map((e) => e.batch).filter(Boolean))].sort();
  console.log(JSON.stringify({ ok: false, errorCount: errors.length, errors: errors.slice(0, 40), rerunBatches: rerun, warnings: warnings.slice(0, 20) }, null, 2));
  process.exit(1);
}

// ---- color: hex -> OKLCH (sRGB -> XYZ D65 -> Oklab via Ottosson's M1/M2 -> OKLCH) ----
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function hexToOklch(hex) {
  const m = String(hex).trim().match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const [r, g, b] = [lin((n >> 16) & 255), lin((n >> 8) & 255), lin(n & 255)];
  const X = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const Y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const Z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;
  const l = Math.cbrt(0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z);
  const mm = Math.cbrt(0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z);
  const s = Math.cbrt(0.0482003018 * X + 0.2643662691 * Y + 0.633851707 * Z);
  const L = 0.2104542553 * l + 0.793617785 * mm - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s;
  const C = Math.hypot(A, B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  const alpha = m[2] ? parseInt(m[2], 16) / 255 : 1;
  const fmt = (x, d) => +x.toFixed(d);
  return `oklch(${fmt(L, 3)} ${fmt(C, 3)} ${C < 0.0005 ? 0 : fmt(H, 1)}${alpha < 1 ? ` / ${fmt(alpha * 100, 1)}%` : ""})`;
}

// ---- outputs ----
const mappings = ledger.components.map((c) => ({ ...byName.get(c.name), instances: c.instances, layer: c.layer, kind: c.kind }));
const counts = {};
for (const m of mappings) counts[m.strategy] = (counts[m.strategy] || 0) + 1;
const installs = [...new Set(mappings.flatMap((m) => m.install || []).filter((i) => !catalog.notInstallable[i]))].sort();
const guides = [...new Set(mappings.flatMap((m) => (m.shadcn || []).map((s) => s.component)).filter((i) => catalog.notInstallable[i]))];
const newVariants = mappings.flatMap((m) => (m.newVariants || []).map((v) => ({ ...v, from: m.name })));
const variantGroups = {};
for (const v of newVariants) (variantGroups[`${v.component}.${v.prop}.${v.name}`] ??= { component: v.component, prop: v.prop, name: v.name, recipe: v.recipe, usedBy: [] }).usedBy.push(v.from);
const customTokens = [...mappings.flatMap((m) => m.customTokens || []), ...(theme?.customTokens || [])];

fs.writeFileSync(path.join(OUT, "shadcn-map.json"), JSON.stringify({
  generated: P.today, app: cfg?.app?.name, catalogFetched: catalog.fetched,
  summary: { components: mappings.length, byStrategy: counts, installs, guides },
  newVariants: Object.values(variantGroups), customTokens, theme, mappings,
}, null, 1));

// globals.css draft
let css = "";
if (theme) {
  const captured = theme.capturedTheme || "dark";
  const block = (vals) => Object.entries(vals || {}).map(([k, v]) => {
    const hex = typeof v === "object" ? v.value : v;
    const ok = hexToOklch(hex);
    const note = typeof v === "object" && v.source ? ` /* ${String(v.source).replace(/\*\//g, "")} */` : "";
    return ok ? `  --${k}: ${ok};${note}` : `  /* --${k}: ${hex} (not a hex color, set manually) */`;
  }).join("\n");
  const custom = (key) => (theme.customTokens || []).flatMap((t) => [
    t[key] ? `  --${t.name}: ${hexToOklch(t[key]) || t[key]};` : "",
    t[`foreground${key[0].toUpperCase()}${key.slice(1)}`] ? `  --${t.name}-foreground: ${hexToOklch(t[`foreground${key[0].toUpperCase()}${key.slice(1)}`])};` : "",
  ]).filter(Boolean).join("\n");
  const other = captured === "dark" ? "light" : "dark";
  const radius = theme.radius?.value ? `  --radius: ${theme.radius.value};\n` : "";
  const capturedSelector = captured === "dark" ? ".dark" : ":root";
  const otherSelector = captured === "dark" ? ":root" : ".dark";
  const otherVals = theme.themes?.[other];
  const themeInline = [...catalog.themeTokens.filter((t) => t !== "radius"), ...(theme.customTokens || []).flatMap((t) => [t.name, ...(t[`foreground${captured[0].toUpperCase()}${captured.slice(1)}`] ? [`${t.name}-foreground`] : [])])]
    .map((t) => `  --color-${t}: var(--${t});`).join("\n");
  css = `/* shadcn/ui theme draft for ${cfg?.app?.name || "the app"}, generated ${P.today} by Webapp Capture (Legion Code Inc.).
   Captured theme: ${captured}. Values are measured from the running app and converted to OKLCH.
   Review before use: merge into your existing globals.css rather than replacing it. */

${otherSelector} {
${radius}${otherVals ? block(otherVals) : `  /* ${other} theme was not captured. Keep shadcn/ui defaults here or design a ${other} theme. */`}
}

${capturedSelector} {
${captured === "dark" ? "" : radius}${block(theme.themes?.[captured])}
${custom(captured)}
}

@theme inline {
${Object.entries(catalog.radiusScale).map(([k, v]) => `  --${k}: ${v};`).join("\n")}
${themeInline}
}
`;
  fs.writeFileSync(path.join(OUT, "globals.css"), css);
}

// SHADCN-MAP.md
const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const order = ["direct", "variant", "compose", "custom", "skip"];
const md = [
  `# shadcn/ui migration map: ${cfg?.app?.name || "app"}`,
  "",
  `Generated ${P.today} by Webapp Capture (designed and built by Legion Code Inc.) from ${mappings.length} captured components. shadcn/ui catalog as of ${catalog.fetched}.`,
  "",
  "## Summary",
  "",
  "| Strategy | Components | Meaning |",
  "| --- | --- | --- |",
  `| direct | ${counts.direct || 0} | Existing shadcn component and variant |`,
  `| variant | ${counts.variant || 0} | Existing component plus a new cva variant |`,
  `| compose | ${counts.compose || 0} | Built from several shadcn components |`,
  `| custom | ${counts.custom || 0} | No catalog match; Tailwind and theme tokens |`,
  `| skip | ${counts.skip || 0} | Not rebuilt as a component |`,
  "",
  "## 1. Set up",
  "",
  "```bash",
  catalog.init,
  `npx shadcn@latest add ${installs.join(" ")}`,
  "```",
  "",
  guides.length ? `Guides rather than installable components: ${guides.map((g) => `\`${g}\` (${catalog.notInstallable[g]})`).join("; ")}.\n` : "",
  theme ? "Merge `globals.css` from this folder into your app's global stylesheet to apply the captured theme.\n" : "",
  `shadcn-svelte: ${catalog.svelte.api}`,
  "",
  "## 2. New variants to add",
  "",
  Object.values(variantGroups).length ? "| Component | Prop | New value | Recipe | Used by |\n| --- | --- | --- | --- | --- |\n" + Object.values(variantGroups).map((v) => `| ${v.component} | ${v.prop} | \`${esc(v.name)}\` | ${esc(v.recipe)} | ${v.usedBy.map((u) => `\`${u}\``).join(", ")} |`).join("\n") : "None.",
  "",
  "## 3. Custom tokens",
  "",
  customTokens.length ? "| Token | Value | Reason |\n| --- | --- | --- |\n" + customTokens.map((t) => `| \`--${esc(t.name)}\` | \`${esc(t.value || t.dark || t.light || "")}\` | ${esc(t.reason)} |`).join("\n") : "None.",
  "",
  "## 4. Component map",
  "",
  "| Captured component | Instances | Strategy | shadcn/ui | Confidence |",
  "| --- | --- | --- | --- | --- |",
  ...mappings.sort((a, b) => order.indexOf(a.strategy) - order.indexOf(b.strategy) || b.instances - a.instances)
    .map((m) => `| [\`${m.name}\`](../components/${m.name}/component.md) | ${m.instances} | ${m.strategy} | ${esc((m.shadcn || []).map((s) => `${s.component}${s.props && Object.keys(s.props).length ? ` (${Object.entries(s.props).map(([k, v]) => `${k}=${v}`).join(" ")})` : ""}`).join(" + ")) || "none"} | ${m.confidence} |`),
  "",
  "## 5. Details",
  "",
  ...mappings.filter((m) => m.strategy !== "skip").flatMap((m) => [
    `### ${m.name}`,
    "",
    `- Strategy: ${m.strategy}; confidence ${m.confidence}; ${m.instances} instances`,
    `- Install: ${(m.install || []).map((i) => `\`${i}\``).join(", ") || "nothing"}`,
    ...(m.variantMap?.length ? ["- Variants:", ...m.variantMap.map((v) => `  - \`${v.captured}\` to ${v.shadcn}${v.notes ? ` (${v.notes})` : ""}`)] : []),
    ...(m.tokens ? [`- Tokens: ${Object.entries(m.tokens).map(([k, v]) => `${k} \`${v}\``).join(", ")}`] : []),
    ...(m.states?.length ? [`- States: ${m.states.map((s) => `${s.state} via ${s.shadcn}`).join("; ")}`] : []),
    ...(m.svelte ? [`- shadcn-svelte: ${m.svelte}`] : []),
    ...(m.gaps?.length ? [`- Gaps: ${m.gaps.join("; ")}`] : []),
    ...(m.notes ? [`- Notes: ${m.notes}`] : []),
    ...(m.structure ? ["", "```tsx", m.structure, "```"] : []),
    "",
  ]),
  warnings.length ? `## Warnings\n\n${warnings.map((w) => `- ${w}`).join("\n")}\n` : "",
].join("\n");
fs.writeFileSync(path.join(OUT, "SHADCN-MAP.md"), md);
console.log(JSON.stringify({ ok: true, components: mappings.length, byStrategy: counts, installs: installs.length, newVariants: Object.keys(variantGroups).length, customTokens: customTokens.length, theme: !!theme, out: OUT, warnings: warnings.length }, null, 2));
