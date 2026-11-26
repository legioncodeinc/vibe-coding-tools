import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { nestedOutputPaths } from "../lib/common.mjs";
import { buildTimeline, editedSpans, findingEntry, isGuardrailError, maskText, parseSegments, planDigest, planTake, scanText, segmentsTsv, titleCues, toSrt, toVtt, validateDemoPlan, writesForScene } from "../lib/demo-plan.mjs";

const example = () => {
  const plan = JSON.parse(fs.readFileSync(new URL("../demo/demo-plan.example.json", import.meta.url), "utf8"));
  plan.approved = true;
  for (const w of plan.writes) w.approved = true;
  return plan;
};
const rejects = (plan, pattern) => assert.throws(() => validateDemoPlan(plan), pattern);

test("the shipped example plan is valid once the user approves it and its writes", () => {
  const plan = example();
  assert.equal(validateDemoPlan(plan), plan);
  assert.deepEqual(writesForScene(plan, "book").map((w) => w.id), ["book-tuesday-slot"]);
});

test("validation refuses unapproved plans and unapproved writes", () => {
  const unapproved = example(); unapproved.approved = false;
  rejects(unapproved, /plan\.approved is not true/);
  const write = example(); write.writes[0].approved = false;
  rejects(write, /approved must be true after the user approves this specific write/);
});

test("write-capable actions must be declared and verified", () => {
  const undeclared = example(); undeclared.writes = [];
  rejects(undeclared, /action "drag" can change data, so declare the scene in plan\.writes/);
  const unverified = example(); unverified.scenes[1].verify = [];
  rejects(unverified, /write scenes need at least one read-only verify check/);
  const ghost = example(); ghost.writes[0].scene = "missing";
  rejects(ghost, /scene "missing" is not a scene id/);
});

test("validation reports every bad action and verify field at once", () => {
  const plan = example();
  plan.scenes[0].actions.push({ type: "teleport" }, { type: "select", selector: "select" }, { type: "drag", from: "#a" }, { type: "confirmDialog", button: "OK", expect: "(" }, { type: "scrollElement", selector: "#grid" }, { type: "waitFor" });
  plan.scenes[0].verify.push({ type: "count", selector: "li" }, { type: "text", selector: "h1", expect: "[" }, { type: "glow", selector: "x" });
  plan.scenes.push({ id: "hook", route: "no-slash" });
  try { validateDemoPlan(plan); assert.fail("expected a validation error"); } catch (e) {
    for (const part of ['unknown action type "teleport"', "select needs an option label", "drag needs to", "confirmDialog needs expect", "scrollElement needs x, y, or intoView", "waitFor needs a selector or text", "count needs equals or atLeast", "text needs expect, a valid regex", "type must be visible", 'duplicate scene id "hook"', "route must start with /"]) {
      assert.ok(e.message.includes(part), `missing: ${part}\n${e.message}`);
    }
  }
});

test("planTake refuses to repeat attempted writes unless retake is set", () => {
  const plan = example();
  const first = planTake(null, plan, "book");
  assert.deepEqual({ take: first.take, dir: first.dir, refuse: first.refuse }, { take: 1, dir: "book", refuse: false });
  const readOnly = planTake({ takes: [{ attemptedWrites: [] }] }, plan, "book");
  assert.equal(readOnly.refuse, false);
  assert.equal(readOnly.dir, "book-take-2");
  const ledger = { takes: [{ attemptedWrites: ["book-tuesday-slot"] }] };
  const refused = planTake(ledger, plan, "book");
  assert.equal(refused.refuse, true);
  assert.match(refused.message, /book-tuesday-slot \(scene book\)/);
  assert.match(refused.message, /--retake/);
  const retake = planTake(ledger, plan, "book", { retake: true });
  assert.equal(retake.refuse, false);
  assert.equal(retake.dir, "book-take-2");
  assert.match(retake.message, /these writes will repeat/);
});

test("planDigest ignores cosmetic fields and tracks scenes and writes", () => {
  const a = example(), b = example();
  b.summary = "different words";
  assert.equal(planDigest(a), planDigest(b));
  b.scenes[0].route = "/elsewhere";
  assert.notEqual(planDigest(a), planDigest(b));
});

test("timeline, segments, edited spans and title cues line up", () => {
  const timeline = buildTimeline([
    { id: "hook", title: "Hook", clip: "scenes/01-hook.webm", durationMs: 4000 },
    { id: "skipped", title: "Skipped", clip: null, durationMs: 0 },
    { id: "book", title: "Book", clip: "scenes/03-book.webm", durationMs: 6000 },
  ]);
  assert.equal(timeline.totalMs, 10000);
  assert.deepEqual(timeline.scenes.map((s) => s.startMs), [0, 4000, 4000]);
  const tsv = segmentsTsv(timeline);
  assert.equal(tsv.split("\n").filter((l) => l && !l.startsWith("#")).length, 2);
  const parsed = parseSegments(tsv);
  assert.deepEqual(parsed[1], { file: "scenes/03-book.webm", inMs: 0, outMs: 6000, id: "book" });
  // Reorder and trim, then check the edited output timeline.
  const edited = parseSegments("scenes/03-book.webm\t1000\t4000\tbook\nscenes/01-hook.webm\t0\t2000\thook\n");
  const { spans, totalMs } = editedSpans(timeline, edited);
  assert.equal(totalMs, 5000);
  assert.deepEqual(spans.map((s) => [s.scene.id, s.startMs, s.durationMs]), [["book", 0, 3000], ["hook", 3000, 2000]]);
  const titles = titleCues(spans);
  assert.equal(titles[0].text, "Book");
  assert.ok(titles[1].startMs >= 3000 && titles[1].endMs <= 5000);
});

test("a spliced clip takes the scene named on its segment line", () => {
  const timeline = buildTimeline([{ id: "book", title: "Book", clip: "scenes/01-book.webm", durationMs: 6000 }]);
  const { spans } = editedSpans(timeline, parseSegments("clips/01-book-take-2.webm\t0\t9000\tbook\nclips/outro.webm\t0\t1000\toutro\n"));
  assert.deepEqual(spans.map((s) => [s.scene?.id, s.durationMs]), [["book", 9000], [undefined, 1000]]);
  assert.equal(titleCues(spans)[0].text, "Book");
});

test("segments.tsv refuses traversal, odd files and empty windows", () => {
  for (const bad of ["../x.webm\t0\t10\n", "scenes/../../x.webm\t0\t10\n", "/etc/passwd\t0\t10\n", "scenes/a.mp4\t0\t10\n", "scenes/a.webm\t10\t10\n", "scenes/a.webm\t-1\t10\n", "# only a comment\n"]) {
    assert.throws(() => parseSegments(bad), /segments\.tsv/);
  }
  assert.equal(parseSegments("clips/take-2.webm\t0\t900\tbook\n")[0].file, "clips/take-2.webm");
});

test("SRT and VTT timestamps use the right separators", () => {
  const cues = [{ startMs: 3723004, endMs: 3725010, text: "Hi" }];
  assert.match(toSrt(cues), /^1\n01:02:03,004 --> 01:02:05,010\nHi\n/);
  assert.match(toVtt(cues), /^WEBVTT\n\n1\n01:02:03\.004 --> 01:02:05\.010\nHi\n/);
});

test("privacy scan returns masked hits and never the raw value", () => {
  const text = "Call Dana at (555) 123-4567 or dana.smith@example.com. dana.smith@example.com again. Order ACME-99812.";
  const hits = scanText(text, ["ACME-\\d+", "("]);
  const raw = JSON.stringify(hits);
  for (const secret of ["dana.smith", "123-4567", "ACME-99812"]) assert.ok(!raw.includes(secret), `leaked ${secret}`);
  assert.deepEqual(hits.find((h) => h.kind === "email"), { kind: "email", masked: "d***@***.com", count: 2 });
  assert.equal(hits.find((h) => h.kind === "phone").masked, "***-***-67");
  assert.equal(hits.find((h) => h.kind === "redact.patterns[0]").masked, "A***(10)");
  assert.equal(maskText("mail dana.smith@example.com now"), "mail d***@***.com now");
});

test("guardrail classification and finding entries", () => {
  for (const m of ["refusing destructive-looking demo control", "left origin: https://evil.test", "session expired: log in again", "refusing credential-looking demo field or value"]) assert.ok(isGuardrailError(new Error(m)), m);
  assert.equal(isGuardrailError(new Error("waitFor timed out: .slot")), false);
  const entry = findingEntry({ when: "2026-10-23T12:00:00Z", title: "Demo", take: "demo-take-2", scene: "book", kind: "mismatch", detail: "count = 1: got 2", evidence: "demo-take-2/failures/02-book.png" });
  assert.match(entry, /^## 2026-10-23T12:00:00Z Demo: scene book \(mismatch\)/);
  assert.match(entry, /- Take: demo-take-2/);
  assert.match(entry, /- Evidence: demo-take-2\/failures\/02-book\.png/);
});

test("the example config does not nest its outputs when copied to library/design", () => {
  const { output } = JSON.parse(fs.readFileSync(new URL("../capture.config.example.json", import.meta.url), "utf8"));
  const cfgDir = path.join(path.sep, "repo", "library", "design");
  assert.deepEqual(nestedOutputPaths(cfgDir, output), []);
  assert.deepEqual(Object.values(output).map((p) => path.join(cfgDir, p)), ["/repo/library/design/screenshots", "/repo/library/design/inventory", "/repo/library/design/demo", "/repo/library/requirements/reports/capture-audit"].map((p) => path.normalize(p)));
});

test("nestedOutputPaths flags output paths that repeat the config folder", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "webapp-nested-"));
  const cfgDir = path.join(root, "repo", "library", "design");
  const warnings = nestedOutputPaths(cfgDir, { demo: "library/design/demo", screenshots: "design/shots", inventory: "inventory", audit: "../../library/requirements/reports", abs: "/tmp/x", exact: "library/design" });
  const byKey = Object.fromEntries(warnings.map((w) => [w.key, w]));
  assert.deepEqual(Object.keys(byKey).sort(), ["demo", "exact", "screenshots"]);
  assert.equal(byKey.demo.suggested, "demo");
  assert.equal(byKey.demo.repeated, "library/design");
  assert.equal(byKey.demo.resolved, path.join(cfgDir, "library/design/demo"));
  assert.equal(byKey.screenshots.suggested, "shots");
  assert.equal(byKey.exact.suggested, ".");
  fs.rmSync(root, { recursive: true, force: true });
});
