// Pure demo-plan logic: action validation, the approved write ledger, retake
// decisions, the scene timeline and its edit list, and the per-scene privacy scan.
// No browser here, so every rule is unit tested. Designed by Legion Code Inc.
import { createHash } from "node:crypto";

export const ACTIONS = new Set(["wait", "hover", "click", "type", "scroll", "drag", "dragTo", "select", "check", "uncheck", "scrollElement", "waitFor", "confirmDialog"]);
// Actions that can change app state. A scene that uses one must be declared in plan.writes[].
export const WRITE_CAPABLE = new Set(["drag", "dragTo", "select", "check", "uncheck", "confirmDialog"]);
// Actions after which the cursor is parked so hover cards do not linger in frame.
export const PARK_AFTER = new Set(["click", "drag", "dragTo", "select", "check", "uncheck", "confirmDialog"]);
const VERIFY_TYPES = new Set(["visible", "hidden", "text", "count"]);

const isPoint = (p) => p && typeof p === "object" && Number.isFinite(p.x) && Number.isFinite(p.y);
const isEnd = (e) => typeof e === "string" ? e.trim().length > 0 : isPoint(e);
const validRegex = (s) => { try { new RegExp(s, "i"); return true; } catch { return false; } };

export const sceneKey = (scene, i) => String(scene.id || scene.title || `scene-${i + 1}`);

/** Every problem at once, like validateConfig. Returns the plan. */
export function validateDemoPlan(plan) {
  const errors = [];
  const need = (cond, msg) => { if (!cond) errors.push(msg); };
  need(Array.isArray(plan?.scenes) && plan.scenes.length, "plan.scenes must be a non-empty array");
  if (errors.length) throw new Error(`Invalid demo plan:\n  - ${errors.join("\n  - ")}`);
  need(plan.approved === true, 'plan.approved is not true. Show the plan to the user, and set "approved": true only after they approve it.');
  const ids = new Set();
  for (const [i, sc] of plan.scenes.entries()) {
    const at = `scene ${i + 1}`;
    const key = sceneKey(sc, i);
    need(!ids.has(key), `${at}: duplicate scene id "${key}"`); ids.add(key);
    need(typeof sc.route === "string" && sc.route.startsWith("/"), `${at}: route must start with /`);
    for (const [j, a] of (sc.actions || []).entries()) {
      const where = `${at} action ${j + 1}`;
      if (!ACTIONS.has(a.type)) { errors.push(`${where}: unknown action type "${a.type}"`); continue; }
      if (["hover", "click", "type", "select", "check", "uncheck", "scrollElement"].includes(a.type)) need(typeof a.selector === "string" && a.selector, `${where}: ${a.type} needs a selector`);
      if (a.type === "type") need(typeof a.text === "string", `${where}: type needs text`);
      if (a.type === "select") need(typeof a.label === "string" && a.label, `${where}: select needs an option label`);
      if (a.type === "drag") { need(isEnd(a.from), `${where}: drag needs from (selector or {x,y})`); need(isEnd(a.to), `${where}: drag needs to (selector or {x,y})`); }
      if (a.type === "dragTo") { need(typeof a.selector === "string" && a.selector, `${where}: dragTo needs a source selector`); need(typeof a.target === "string" && a.target, `${where}: dragTo needs a target selector`); }
      if (a.type === "scrollElement") need(typeof a.intoView === "string" || Number.isFinite(a.x) || Number.isFinite(a.y), `${where}: scrollElement needs x, y, or intoView`);
      if (a.type === "waitFor") need((typeof a.selector === "string" && a.selector) || (typeof a.text === "string" && a.text), `${where}: waitFor needs a selector or text`);
      if (a.type === "confirmDialog") {
        need(typeof a.button === "string" && a.button, `${where}: confirmDialog needs the button name to click`);
        need(typeof a.expect === "string" && a.expect && validRegex(a.expect), `${where}: confirmDialog needs expect, a valid regex the dialog text must match`);
      }
    }
    for (const [j, v] of (sc.verify || []).entries()) {
      const where = `${at} verify ${j + 1}`;
      need(VERIFY_TYPES.has(v.type), `${where}: type must be visible, hidden, text, or count`);
      need((typeof v.selector === "string" && v.selector) || (v.type !== "count" && typeof v.text === "string" && v.text), `${where}: needs a selector${v.type === "count" ? "" : " or text"}`);
      if (v.type === "text") need(typeof v.expect === "string" && validRegex(v.expect), `${where}: text needs expect, a valid regex`);
      if (v.type === "count") need(Number.isInteger(v.equals) || Number.isInteger(v.atLeast), `${where}: count needs equals or atLeast`);
    }
  }
  const writes = plan.writes || [];
  need(Array.isArray(writes), "plan.writes must be an array");
  const writeScenes = new Set();
  for (const [i, w] of (Array.isArray(writes) ? writes : []).entries()) {
    const at = `write ${i + 1}`;
    need(typeof w.id === "string" && w.id, `${at}: needs an id`);
    need(ids.has(w.scene), `${at}: scene "${w.scene}" is not a scene id in this plan`);
    need(typeof w.description === "string" && w.description, `${at}: needs a description of what it changes`);
    need(typeof w.effect === "string" && w.effect, `${at}: needs the expected effect`);
    need(w.approved === true, `${at}: approved must be true after the user approves this specific write`);
    writeScenes.add(w.scene);
  }
  for (const [i, sc] of plan.scenes.entries()) {
    const key = sceneKey(sc, i);
    const writeAction = (sc.actions || []).find((a) => WRITE_CAPABLE.has(a.type));
    if (writeAction) need(writeScenes.has(key), `scene ${i + 1}: action "${writeAction.type}" can change data, so declare the scene in plan.writes[]`);
    if (writeScenes.has(key)) need((sc.verify || []).length > 0, `scene ${i + 1}: write scenes need at least one read-only verify check`);
  }
  if (errors.length) throw new Error(`Invalid demo plan:\n  - ${errors.join("\n  - ")}`);
  return plan;
}

export const writesForScene = (plan, key) => (plan.writes || []).filter((w) => w.scene === key);

/** Stable hash of what the user approved: scenes and writes, not cosmetic fields. */
export function planDigest(plan) {
  return createHash("sha256").update(JSON.stringify({ scenes: plan.scenes, writes: plan.writes || [] })).digest("hex");
}

/**
 * Decide where a take goes and whether it may run. Earlier takes live in the ledger.
 * Returns { take, dir, repeats, refuse, message }.
 */
export function planTake(ledger, plan, slug, { retake = false } = {}) {
  const takes = ledger?.takes || [];
  const take = takes.length + 1;
  const dir = take === 1 ? slug : `${slug}-take-${take}`;
  const executed = new Set(takes.flatMap((t) => t.attemptedWrites || []));
  const repeats = (plan.writes || []).filter((w) => executed.has(w.id));
  if (repeats.length && !retake) {
    return { take, dir, repeats, refuse: true, message: `Refusing to rerun: earlier takes already executed ${repeats.length} write(s). These would repeat:\n${repeats.map((w) => `  - ${w.id} (scene ${w.scene}): ${w.description}`).join("\n")}\nReset the data or pick new free slots from live state, then rerun with --retake.` };
  }
  return { take, dir, repeats, refuse: false, message: repeats.length ? `Retake ${take}: these writes will repeat:\n${repeats.map((w) => `  - ${w.id}: ${w.description}`).join("\n")}` : `Take ${take}: no earlier writes will repeat.` };
}

/** Scene timeline: start offsets from actual encoded durations. */
export function buildTimeline(scenes) {
  let offset = 0;
  const out = scenes.map((s) => { const row = { ...s, startMs: offset }; offset += s.durationMs; return row; });
  return { totalMs: offset, scenes: out };
}

/** Editable edit list: one segment per recorded clip, in-point and out-point in ms. */
export function segmentsTsv(timeline) {
  return ["# file\tin_ms\tout_ms\tscene  (reorder, delete or trim lines; then rerun build-cues.mjs and make-video.sh)",
    ...timeline.scenes.filter((s) => s.clip).map((s) => `${s.clip}\t0\t${s.durationMs}\t${s.id}`)].join("\n") + "\n";
}
export function parseSegments(text) {
  const rows = [];
  for (const [n, raw] of text.split("\n").entries()) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [file, inMs, outMs, id = ""] = line.split("\t");
    if (!/^(?:scenes|clips)\/[A-Za-z0-9._-]+\.webm$/.test(file || "") || file.includes("..")) throw new Error(`segments.tsv line ${n + 1}: file must be scenes/<name>.webm or clips/<name>.webm`);
    const a = Number(inMs), b = Number(outMs);
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b <= a) throw new Error(`segments.tsv line ${n + 1}: in_ms and out_ms must be integers with out_ms > in_ms >= 0`);
    rows.push({ file, inMs: a, outMs: b, id });
  }
  if (!rows.length) throw new Error("segments.tsv lists no segments");
  return rows;
}

const pad = (n, w) => String(n).padStart(w, "0");
export function timestamp(ms, sep = ".") {
  const t = Math.max(0, Math.round(ms));
  return `${pad(Math.floor(t / 3600000), 2)}:${pad(Math.floor(t / 60000) % 60, 2)}:${pad(Math.floor(t / 1000) % 60, 2)}${sep}${pad(t % 1000, 3)}`;
}
export function toSrt(cues) {
  return cues.map((c, i) => `${i + 1}\n${timestamp(c.startMs, ",")} --> ${timestamp(c.endMs, ",")}\n${c.text}\n`).join("\n");
}
export function toVtt(cues) {
  return "WEBVTT\n\n" + cues.map((c, i) => `${i + 1}\n${timestamp(c.startMs)} --> ${timestamp(c.endMs)}\n${c.text}\n`).join("\n");
}

/**
 * Place every scene on the edited output timeline. A scene appears wherever its
 * clip is used, trimmed to the segment window. A spliced clip (clips/...) is not in
 * the timeline, so it takes the scene named in its segment line.
 */
export function editedSpans(timeline, segments) {
  const spans = [];
  let offset = 0;
  for (const seg of segments) {
    const scene = timeline.scenes.find((s) => s.clip === seg.file) || timeline.scenes.find((s) => s.id === seg.id);
    spans.push({ scene, file: seg.file, startMs: offset, durationMs: seg.outMs - seg.inMs });
    offset += seg.outMs - seg.inMs;
  }
  return { totalMs: offset, spans };
}
export function titleCues(spans, { leadMs = 200 } = {}) {
  return spans.filter((s) => s.scene?.title).map((s) => ({ startMs: s.startMs + Math.min(leadMs, s.durationMs / 4), endMs: s.startMs + Math.max(s.durationMs - leadMs, s.durationMs / 2), text: s.scene.title }));
}

// Personal data that pixels can show even when text exports are redacted.
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const PHONE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{3}\)|\b\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
/** Show enough to find the value on screen, never the value itself. */
export function maskHit(value) {
  const v = String(value);
  if (v.includes("@")) { const [user, host] = v.split("@"); const tld = host.split(".").pop(); return `${user[0] || ""}***@***.${tld}`; }
  const digits = v.replace(/\D/g, "");
  if (digits.length >= 7) return `***-***-${digits.slice(-2)}`;
  return `${v.slice(0, 1)}***(${v.length})`;
}
/** Scan visible page text. Returns masked hits; raw text is never stored. */
export function scanText(text, patterns = []) {
  const hits = [];
  const add = (kind, value) => { const masked = maskHit(value); const hit = hits.find((h) => h.kind === kind && h.masked === masked); if (hit) hit.count++; else hits.push({ kind, masked, count: 1 }); };
  for (const m of String(text).matchAll(EMAIL)) add("email", m[0]);
  for (const m of String(text).matchAll(PHONE)) add("phone", m[0]);
  for (const [i, p] of patterns.entries()) {
    let re; try { re = new RegExp(p, "gi"); } catch { continue; }
    for (const m of String(text).matchAll(re)) { if (!m[0]) break; if (!EMAIL.test(m[0])) add(`redact.patterns[${i}]`, m[0]); EMAIL.lastIndex = 0; }
  }
  return hits;
}

/** Replace emails and phone numbers in free text (error messages, verify output) with masked forms. */
export const maskText = (text) => String(text ?? "").replace(EMAIL, (m) => maskHit(m)).replace(PHONE, (m) => maskHit(m));

/** One findings.md entry. The caller passes already redacted strings. */
export function findingEntry({ when, title, take, scene, kind, detail, evidence }) {
  return [`## ${when} ${title}: scene ${scene} (${kind})`, "", `- Take: ${take}`, `- What happened: ${detail}`, evidence ? `- Evidence: ${evidence}` : null, "- Status: open. Decide whether this is an app bug, test data, or a plan error.", "", ""].filter((l) => l !== null).join("\n");
}

/** Guardrail refusals abort the whole run; everything else is a scene failure. */
export const isGuardrailError = (error) => /refus|left origin|session expired|capture polic|unsafe|credential|destructive|not approved|blocked/i.test(String(error?.message || error));
