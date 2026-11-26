import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import test from "node:test";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { assertSafeDemoTarget, demoDenyPattern } from "../lib/onboarding.mjs";
import { startMaskedVideo } from "../lib/video-privacy.mjs";
import { bodyDigest, requestAllowed, validateRequestGrants, withApprovedRequests, canonicalCapturePath, isSafeCapturePath } from "../lib/browser-policy.mjs";
import { routeSlug, tabName, saveSessionState, readSessionState, ensureDedicatedProfile, openApp, ensurePrivateOutputDir, writePrivateCapture, validateConfig, shotOptions, gotoChecked, assertCapturePolicy, discoverRoutes, validatePageMaskSelectors, captureScreenshot, validatedMaskSelectors } from "../lib/common.mjs";
const request = (method = "GET", body = "", route = "/api/items", origin = "http://127.0.0.1:3000") => ({ url: () => origin + route, method: () => method, postData: () => body, isNavigationRequest: () => false });
const cfg = { app: { origin: "http://127.0.0.1:3000" } };
test("capture blocks all writes and dangerous GET endpoints unless an exact bounded write grant is active", async () => {
  const page = {};
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) assert.equal(requestAllowed(cfg, request(method), page), false);
  assert.equal(requestAllowed(cfg, request("GET"), page), true);
  assert.equal(requestAllowed(cfg, request("GET", "", "/logout"), page), false);
  const plan = { approved: true, environment: "local", requests: [{ approved: true, path: "/api/items", method: "POST", bodySha256: bodyDigest("fixture") }] };
  await withApprovedRequests(cfg, page, plan, async () => {
    assert.equal(requestAllowed(cfg, request("POST", "fixture"), page), true);
    assert.equal(requestAllowed(cfg, request("POST", "other"), page), false);
    assert.equal(requestAllowed(cfg, request("POST", "fixture", "/api/items?x=1"), page), false);
    assert.equal(requestAllowed(cfg, request("POST", "fixture", "/api/items", "https://other.test"), page), false);
  });
  assert.equal(requestAllowed(cfg, request("POST", "fixture"), page), false);
  await assert.rejects(withApprovedRequests(cfg, page, { ...plan, approved: false }, async () => {}), /explicit/);
  assert.throws(() => validateRequestGrants([{ path: "/api/items" }]), /requires/);
});
test("read POST grants reject GraphQL mutation and mismatched bodies", () => {
  for (const query of ["mutation { remove }", "subscription { changed }", "query { mutation }", "query Items { items }", "{ items }"]) {
    const body = JSON.stringify({ query });
    const configured = { ...cfg, network: { readPost: [{ path: "/api/items", approved: true, kind: "graphql-query", method: "POST", bodySha256: bodyDigest(body) }] } };
    assert.equal(requestAllowed(configured, request("POST", body), {}), query === "query Items { items }");
    assert.equal(requestAllowed(configured, request("POST", body + " "), {}), false);
  }
});
test("route and state IDs distinguish path separators, case and query values", () => {
  const routes = ["/a/b", "/a-b", "/Team", "/team", "/a?x=1", "/a?x=2"];
  assert.equal(new Set(routes.map(routeSlug)).size, routes.length);
  assert.equal(routeSlug("/a/b"), routeSlug("/a/b"));
  assert.notEqual(tabName(cfg.app.origin + "/", cfg.app.origin + "/a", "Team"), tabName(cfg.app.origin + "/", cfg.app.origin + "/a", "team"));
});
test("session sidecar and owned profile fail closed on stale, absent, public or unowned state", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "capture-private-test-"));
  const local = { ...cfg, auth: { storageState: path.join(dir, "state.json") }, browser: { profileDir: path.join(dir, "profile") } };
  try {
    saveSessionState(local, { cookies: [], origins: [] }, {});
    assert.deepEqual(readSessionState(local).entries, {});
    fs.unlinkSync(local.auth.storageState + ".session.json");
    assert.throws(() => readSessionState(local), /missing/);
    saveSessionState(local, { cookies: [], origins: [] }, {});
    fs.chmodSync(local.auth.storageState + ".session.json", 0o644);
    assert.throws(() => readSessionState(local), /private/);
    assert.throws(() => ensureDedicatedProfile(local), /not been initialized/);
    ensureDedicatedProfile(local, true);
    assert.equal(ensureDedicatedProfile(local), local.browser.profileDir);
    fs.writeFileSync(path.join(local.browser.profileDir, "ordinary-user-data"), "fixture");
    fs.unlinkSync(path.join(local.browser.profileDir, ".webapp-capture-profile.json"));
    assert.throws(() => ensureDedicatedProfile(local, true), /unowned/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test("real browser blocks same-origin writes while retaining seeded reads", async (t) => {
  try { await import("playwright-core"); } catch { t.skip("installed Playwright runtime unavailable"); return; }
  let writes = 0;
  const server = http.createServer((req, res) => { if (req.method !== "GET") writes++; res.end("<!doctype html><h1>Fixture</h1>"); });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "capture-browser-policy-"));
  const local = { app: { origin: `http://127.0.0.1:${server.address().port}` }, auth: { storageState: path.join(dir, "state.json") }, browser: { viewport: { width: 640, height: 480 }, deviceScaleFactor: 1 }, redact: {} };
  let opened;
  try {
    saveSessionState(local, { cookies: [], origins: [] }, {});
    opened = await openApp(local);
    await opened.page.goto(local.app.origin);
    const result = await opened.page.evaluate(async () => { try { await fetch("/api/items", { method: "POST", body: "fixture" }); return "sent"; } catch { return "blocked"; } });
    assert.equal(result, "blocked"); assert.equal(writes, 0);
  } finally { if (opened) await opened.browser.close(); await new Promise((resolve) => server.close(resolve)); fs.rmSync(dir, { recursive: true, force: true }); }
});

test("masked video frames never expose dynamically inserted secret pixels", async (t) => {
  let chromium, sharp;
  try { ({ chromium } = await import("playwright-core")); ({ default: sharp } = await import("sharp")); execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); } catch { t.skip("installed video dependencies unavailable"); return; }
  const { chromiumPath } = await import("../lib/common.mjs");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "capture-masked-video-"));
  const browser = await chromium.launch({ executablePath: chromiumPath({ browser: {} }), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 240 } });
    const local = { redact: { maskSelectors: [".secret"], maskColor: "#000000" } };
    const recorder = await startMaskedVideo(local, page, dir, { fps: 5 });
    await page.setContent('<body style="margin:0;background:#fff"><div class="secret" style="position:fixed;left:0;top:0;width:80px;height:80px;background:#00ff00">Secret</div><script>setTimeout(()=>{let el=document.createElement("div");el.className="secret";el.style="position:fixed;left:120px;top:100px;width:80px;height:80px;background:#00ff00";document.body.append(el)},50)</script>');
    await page.waitForTimeout(650);
    const output = path.join(dir, "demo.webm");
    const result = await recorder.stop(output);
    assert.ok(result.frames >= 3); assert.ok(fs.statSync(output).size > 0);
    for (const file of fs.readdirSync(recorder.frames)) {
      const { data, info } = await sharp(path.join(recorder.frames, file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let i = 0; i < data.length; i += info.channels) assert.ok(!(data[i] < 10 && data[i + 1] > 245 && data[i + 2] < 10), `unmasked secret pixel in ${file}`);
    }
    const decoded = execFileSync("ffmpeg", ["-v", "error", "-i", output, "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"], { maxBuffer: 20 * 1024 * 1024 });
    for (let i = 0; i < decoded.length; i += 3) assert.ok(!(decoded[i] < 20 && decoded[i + 1] > 230 && decoded[i + 2] < 20), "unmasked secret pixel in decoded video");
  } finally { await browser.close(); fs.rmSync(dir, { recursive: true, force: true }); }
});

test("persistent and CDP recovery use only a dedicated profile and preserve its owner browser", async (t) => {
  let chromium;
  try { ({ chromium } = await import("playwright-core")); } catch { t.skip("installed Playwright unavailable"); return; }
  const { chromiumPath } = await import("../lib/common.mjs");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "capture-profile-recovery-"));
  const local = { ...cfg, auth: { storageState: path.join(dir, "state.json") }, browser: { profileDir: path.join(dir, "profile"), sessionMode: "persistent", viewport: { width: 640, height: 480 }, deviceScaleFactor: 1 } };
  let owner, recovered;
  try {
    saveSessionState(local, { cookies: [], origins: [] }, {});
    ensureDedicatedProfile(local, true);
    recovered = await openApp(local);
    await recovered.page.setContent("<h1>Private persistent fixture</h1>");
    assert.equal(await recovered.page.locator("h1").innerText(), "Private persistent fixture");
    await recovered.browser.close(); recovered = undefined;
    const portServer = http.createServer();
    await new Promise((resolve) => portServer.listen(0, "127.0.0.1", resolve));
    const port = portServer.address().port; await new Promise((resolve) => portServer.close(resolve));
    owner = await chromium.launchPersistentContext(local.browser.profileDir, { executablePath: chromiumPath(local), headless: true, args: ["--enable-automation", `--remote-debugging-port=${port}`, "--remote-debugging-address=127.0.0.1"] });
    const ownerPage = owner.pages()[0]; await ownerPage.setContent("<h1>Owner survives</h1>");
    local.browser.sessionMode = "cdp"; local.browser.cdpEndpoint = `http://127.0.0.1:${port}`;
    recovered = await openApp(local);
    assert.notEqual(recovered.context, owner);
    await recovered.page.setContent("<h1>Isolated recovered context</h1>");
    await recovered.browser.close(); recovered = undefined;
    assert.equal(ownerPage.isClosed(), false);
    assert.equal(await ownerPage.locator("h1").innerText(), "Owner survives");
    await assert.rejects(openApp({ ...local, browser: { ...local.browser, cdpEndpoint: "https://outside.test" } }), /loopback/);
  } finally { if (recovered) await recovered.browser.close(); if (owner) await owner.close(); fs.rmSync(dir, { recursive: true, force: true }); }
});

test("Doctor honors explicit Chromium and requires the private hash-bound sidecar and both ignore rules", async (t) => {
  try { await import("playwright-core"); } catch { t.skip("installed Playwright unavailable"); return; }
  const { chromiumPath } = await import("../lib/common.mjs");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "capture-doctor-proof-"));
  let redirectMode = false, redirectHits = 0;
  const server = http.createServer((req, res) => { if (req.url === "/logout") { redirectHits++; res.end("unsafe sentinel"); } else if (redirectMode) { res.writeHead(302, { location: "/logout" }); res.end(); } else res.end("fixture"); });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const local = { app: { origin: `http://127.0.0.1:${server.address().port}` }, auth: { storageState: path.join(dir, "state.json") }, browser: { executablePath: chromiumPath({ browser: {} }), viewport: { width: 640, height: 480 }, deviceScaleFactor: 1 }, routes: { discover: "list", list: ["/"] }, tabs: { selector: "[role=tab]" }, redact: { patterns: [] }, output: { inventory: path.join(dir, "inventory") } };
  const configPath = path.join(dir, "capture.json");
  const doctor = new URL("../doctor.mjs", import.meta.url).pathname;
  const run = async () => {
    const { spawn } = await import("node:child_process");
    return await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [doctor, "--route", "screenshots", "--json"], { env: { ...process.env, CAPTURE_CONFIG: configPath } });
      let output = "", error = ""; child.stdout.on("data", (d) => { output += d; }); child.stderr.on("data", (d) => { error += d; });
      child.once("error", reject); child.once("exit", (code) => { try { resolve({ code, report: JSON.parse(output), error }); } catch (e) { reject(new Error(output + error + e.message)); } });
    });
  };
  try {
    execFileSync("git", ["init", "-q", dir]);
    saveSessionState(local, { cookies: [], origins: [] }, {});
    fs.writeFileSync(configPath, JSON.stringify(local)); fs.writeFileSync(path.join(dir, ".gitignore"), "state.json\n");
    const partial = await run(); assert.equal(partial.code, 1); assert.ok(partial.report.checks.some((c) => c.name === "session.gitignore" && c.level === "error"));
    fs.appendFileSync(path.join(dir, ".gitignore"), "state.json.session.json\n");
    const ready = await run(); assert.equal(ready.code, 0, JSON.stringify(ready)); assert.equal(ready.report.ready, true);
    fs.chmodSync(local.auth.storageState + ".session.json", 0o644);
    const unsafe = await run(); assert.equal(unsafe.code, 1); assert.ok(unsafe.report.checks.some((c) => c.level === "error" && /private/.test(c.detail)));
    fs.chmodSync(local.auth.storageState + ".session.json", 0o600); redirectMode = true;
    const redirected = await run(); assert.equal(redirected.code, 1); assert.ok(redirected.report.checks.some((c) => c.name === "origin" && c.level === "error" && /refused redirect/.test(c.detail))); assert.equal(redirectHits, 0);
  } finally { await new Promise((resolve) => server.close(resolve)); fs.rmSync(dir, { recursive: true, force: true }); }
});

test("opaque persisted GraphQL cannot use read POST grants or masquerade as REST", () => {
  const persisted = JSON.stringify({ operationName: "UpdateAccount", variables: {}, extensions: { persistedQuery: { version: 1, sha256Hash: "fixture" } } });
  for (const kind of ["graphql-query", "rest-read"]) {
    const configured = { ...cfg, network: { readPost: [{ path: "/api/items", approved: true, method: "POST", kind, bodySha256: bodyDigest(persisted) }] } };
    assert.equal(requestAllowed(configured, request("POST", persisted), {}), false);
  }
  const restBody = JSON.stringify({ filter: "active" });
  const grant = { path: "/api/items", approved: true, method: "POST", kind: "rest-read", bodySha256: bodyDigest(restBody) };
  assert.equal(requestAllowed({ ...cfg, network: { readPost: [grant] } }, request("POST", restBody), {}), true);
  assert.equal(requestAllowed({ ...cfg, network: { readPost: [{ ...grant, method: "PUT" }] } }, request("POST", restBody), {}), false);
  const two = JSON.stringify({ query: "query One { items } query Two { items }" });
  assert.equal(requestAllowed({ ...cfg, network: { readPost: [{ ...grant, kind: "graphql-query", bodySha256: bodyDigest(two) }] } }, request("POST", two), {}), false);
  assert.throws(() => validateRequestGrants([{ ...grant, kind: undefined }], { reads: true }), /requires/);
});

test("capture output starts private and refuses caller public roots or linked ancestors", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "capture-output-refusal-"));
  try {
    const out = path.join(dir, "new/deep/output"); ensurePrivateOutputDir(out);
    assert.equal(fs.statSync(out).mode & 0o777, 0o700);
    const file = path.join(out, "capture.json"); writePrivateCapture(file, "one"); writePrivateCapture(file, "two", { append: true });
    assert.equal(fs.statSync(file).mode & 0o777, 0o600); assert.equal(fs.readFileSync(file, "utf8"), "onetwo");
    fs.chmodSync(file, 0o644); assert.throws(() => writePrivateCapture(file, "changed"), /privately owned/); assert.equal(fs.readFileSync(file, "utf8"), "onetwo");
    const publicDir = path.join(dir, "public"); fs.mkdirSync(publicDir, { mode: 0o755 });
    assert.throws(() => ensurePrivateOutputDir(publicDir), /privately owned/); assert.equal(fs.statSync(publicDir).mode & 0o777, 0o755);
    const outside = path.join(dir, "outside"); fs.mkdirSync(outside, { mode: 0o700 });
    const linked = path.join(dir, "linked"); fs.symlinkSync(outside, linked);
    await assert.rejects(startMaskedVideo({}, {}, linked), /linked/); assert.deepEqual(fs.readdirSync(outside), []);
    assert.throws(() => shotOptions({ redact: { maskColor: "rgba(0,0,0,0)" } }, {}), /opaque/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test("configuration admission refuses secret-bearing origins and CDP queries without echoing them", async () => {
  const base = { app: { origin: "http://127.0.0.1:3000" }, auth: { storageState: "state.json" }, browser: { viewport: { width: 640, height: 480 }, deviceScaleFactor: 1 }, routes: { discover: "list", list: ["/"] }, tabs: { selector: "[role=tab]" }, output: { inventory: "inventory" } };
  for (const origin of ["http://synthetic:secret@127.0.0.1:3000", "http://127.0.0.1:3000?token=synthetic-secret", "http://127.0.0.1:3000#synthetic-secret", "not-a-url-synthetic-secret"]) {
    let message = ""; try { validateConfig({ ...base, app: { origin } }); } catch (e) { message = e.message; }
    assert.ok(message); assert.equal(message.includes("synthetic-secret"), false);
    await assert.rejects(openApp({ ...base, app: { origin } }), /clean HTTP origin/);
  }
  assert.throws(() => validateConfig({ ...base, browser: { ...base.browser, sessionMode: "cdp", profileDir: "profile", cdpEndpoint: "http://127.0.0.1:9222?token=synthetic-secret" } }), /loopback/);
});

test("private capture overwrite and append refuse a hardlinked external sentinel before mutation", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "capture-hardlink-refusal-"));
  try {
    const out = path.join(dir, "output"); ensurePrivateOutputDir(out);
    const sentinel = path.join(dir, "external.txt"); fs.writeFileSync(sentinel, "sentinel unchanged", { mode: 0o600 });
    const linked = path.join(out, "capture.txt"); fs.linkSync(sentinel, linked);
    for (const append of [false, true]) {
      assert.throws(() => writePrivateCapture(linked, "corrupted", { append }), /hardlinked/);
      assert.equal(fs.readFileSync(sentinel, "utf8"), "sentinel unchanged");
      assert.equal(fs.readFileSync(linked, "utf8"), "sentinel unchanged");
    }
    const privateFile = path.join(out, "private.txt"); writePrivateCapture(privateFile, "first"); writePrivateCapture(privateFile, "second"); writePrivateCapture(privateFile, "+append", { append: true });
    assert.equal(fs.readFileSync(privateFile, "utf8"), "second+append"); assert.equal(fs.statSync(privateFile).nlink, 1); assert.equal(fs.statSync(privateFile).mode & 0o777, 0o600);
    const publicFile = path.join(out, "public.txt"); fs.writeFileSync(publicFile, "public sentinel", { mode: 0o644 });
    assert.throws(() => writePrivateCapture(publicFile, "corrupted"), /privately owned/); assert.equal(fs.readFileSync(publicFile, "utf8"), "public sentinel");
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("one-hop capture refuses 307/308 writes and banned or off-origin GET redirects before follow", async (t) => {
  try { await import("playwright-core"); } catch { t.skip("installed Playwright unavailable"); return; }
  let readPosts = 0, redirectedWrites = 0, logoutHits = 0, externalHits = 0;
  const external = http.createServer((req, res) => { externalHits++; res.end("external sentinel"); });
  await new Promise((resolve) => external.listen(0, "127.0.0.1", resolve));
  const server = http.createServer((req, res) => {
    if (req.url.startsWith("/api/read")) { readPosts++; res.writeHead(req.url.endsWith("308") ? 308 : 307, { location: "/api/delete" }); res.end(); }
    else if (req.url === "/api/delete") { redirectedWrites++; res.end("unsafe write sentinel"); }
    else if (req.url === "/start-banned") { res.writeHead(302, { location: "/logout" }); res.end(); }
    else if (req.url === "/start-outside") { res.writeHead(302, { location: `http://127.0.0.1:${external.address().port}/outside` }); res.end(); }
    else if (req.url === "/logout") { logoutHits++; res.end("logout sentinel"); }
    else { res.setHeader("content-type", "text/html"); res.end("<!doctype html><h1>Fixture</h1>"); }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "capture-redirect-refusal-"));
  const base = { app: { origin: `http://127.0.0.1:${server.address().port}` }, auth: { storageState: path.join(dir, "state.json") }, browser: { viewport: { width: 640, height: 480 }, deviceScaleFactor: 1 }, redact: {} };
  let opened;
  try {
    saveSessionState(base, { cookies: [], origins: [] }, {});
    for (const status of [307, 308]) {
      const local = { ...base, network: { readPost: [{ approved: true, method: "POST", kind: "rest-read", path: `/api/read-${status}`, bodySha256: bodyDigest(JSON.stringify({ filter: "active" })) }] } };
      opened = await openApp(local); await opened.page.goto(local.app.origin);
      const result = await opened.page.evaluate(async (status) => { try { await fetch(`/api/read-${status}`, { method: "POST", body: JSON.stringify({ filter: "active" }) }); return "followed"; } catch { return "blocked"; } }, status);
      assert.equal(result, "blocked"); assert.throws(() => assertCapturePolicy(opened.page), new RegExp(`HTTP ${status} redirect`));
      await opened.browser.close(); opened = undefined;
    }
    for (const route of ["/start-banned", "/start-outside"]) {
      opened = await openApp(base);
      await assert.rejects(gotoChecked(base, opened.page, route, { idleMs: 50, extraMs: 0 }), /HTTP 302 redirect/);
      await opened.browser.close(); opened = undefined;
    }
    assert.equal(readPosts, 2); assert.equal(redirectedWrites, 0); assert.equal(logoutHits, 0); assert.equal(externalHits, 0);
  } finally { if (opened) await opened.browser.close(); await new Promise((resolve) => server.close(resolve)); await new Promise((resolve) => external.close(resolve)); fs.rmSync(dir, { recursive: true, force: true }); }
});

test("REST read grants reject percent-encoded GraphQL forms and opaque bodies", () => {
  for (const body of ["%71uery=%6dutation%20%7B%20change%20%7D", "query=query%20%7B%20items%20%7D", "operationName=Query&extensions=%7B%7D", "opaque-read-body", JSON.stringify({ nested: { query: "query { items }" } })]) {
    const grant = { approved: true, method: "POST", kind: "rest-read", path: "/api/items", bodySha256: bodyDigest(body) };
    assert.equal(requestAllowed({ ...cfg, network: { readPost: [grant] } }, request("POST", body), {}), false);
  }
  const body = JSON.stringify({ filter: "active", fields: ["title"] });
  const grant = { approved: true, method: "POST", kind: "rest-read", path: "/api/items", bodySha256: bodyDigest(body) };
  assert.equal(requestAllowed({ ...cfg, network: { readPost: [grant] } }, request("POST", body), {}), true);
});

test("read grants hash exact request bytes and refuse invalid UTF-8 rather than replacement collisions", () => {
  const prefix = Buffer.from('{"filter":"'), suffix = Buffer.from('"}');
  const first = Buffer.concat([prefix, Buffer.from([0xc0]), suffix]);
  const second = Buffer.concat([prefix, Buffer.from([0xc1]), suffix]);
  assert.equal(first.toString("utf8"), second.toString("utf8")); assert.notEqual(bodyDigest(first), bodyDigest(second));
  for (const buffer of [first, second]) {
    const actual = { ...request("POST", buffer.toString("utf8")), postDataBuffer: () => buffer };
    for (const digest of [bodyDigest(first.toString("utf8")), bodyDigest(first), bodyDigest(second)]) {
      const grant = { approved: true, method: "POST", kind: "rest-read", path: "/api/items", bodySha256: digest };
      assert.equal(requestAllowed({ ...cfg, network: { readPost: [grant] } }, actual, {}), false);
    }
  }
  const valid = Buffer.from(JSON.stringify({ filter: "active" }));
  const actual = { ...request("POST", "intentionally incorrect decoded fallback"), postDataBuffer: () => valid };
  const grant = { approved: true, method: "POST", kind: "rest-read", path: "/api/items", bodySha256: bodyDigest(valid) };
  assert.equal(requestAllowed({ ...cfg, network: { readPost: [grant] } }, actual, {}), true);
});

test("decoded and nested destructive paths are refused before request or route discovery", async () => {
  const unsafe = ["/logout", "/%6cogout", "/api/%64elete", "/%256cogout", "/api/%2564elete", "/api%2fdelete", "/%25256cogout", "/api/%zz", "/%", "/%25252525256cogout", "/safe%3faction=delete", "/safe%5cdelete"];
  const safeRoute = "/reports/Annual%20Report";
  assert.equal(canonicalCapturePath(safeRoute), "/reports/Annual Report"); assert.equal(isSafeCapturePath(safeRoute), true);
  for (const route of unsafe) {
    assert.equal(isSafeCapturePath(route), false, route);
    assert.equal(requestAllowed(cfg, request("GET", "", route), {}), false, route);
    await assert.rejects(gotoChecked(cfg, { goto() { throw new Error("must not navigate"); } }, route), /unsafe or ambiguously encoded/);
  }
  const configured = { ...cfg, routes: { discover: "list", list: [...unsafe, safeRoute] } };
  assert.deepEqual(await discoverRoutes(configured, {}), [safeRoute]);
  assert.equal(requestAllowed(cfg, request("GET", "", safeRoute), {}), true);
});

test("actual demo DOM credentials and destructive labels are refused before interaction even with custom deny", async (t) => {
  let chromium;
  try { ({ chromium } = await import("playwright-core")); } catch { t.skip("installed Playwright unavailable"); return; }
  const { chromiumPath } = await import("../lib/common.mjs");
  const browser = await chromium.launch({ executablePath: chromiumPath({ browser: {} }), headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent('<input id="field" type="password"><label for="plain">API Key</label><input id="plain"><input id="otp" autocomplete="one-time-code"><input id="search" aria-label="Search"><button id="destroy" onclick="window.clicked=true">Delete account</button>');
    const deny = demoDenyPattern("harmless-custom-label");
    for (const selector of ["#field", "#plain", "#otp"]) {
      const target = page.locator(selector); const action = { type: "type", selector, text: "benign fixture" };
      await assert.rejects(async () => { await assertSafeDemoTarget(target, action, deny); await target.pressSequentially(action.text); }, /credential-looking/);
      assert.equal(await target.inputValue(), "");
    }
    const search = page.locator("#search");
    await assert.rejects(assertSafeDemoTarget(search, { type: "type", selector: "#search", text: "Bearer fixture" }, deny), /credential-looking/); assert.equal(await search.inputValue(), "");
    await assertSafeDemoTarget(search, { type: "type", selector: "#search", text: "active projects" }, deny); await search.pressSequentially("active projects"); assert.equal(await search.inputValue(), "active projects");
    const button = page.locator("#destroy"); await assert.rejects(async () => { await assertSafeDemoTarget(button, { type: "click", selector: "#destroy" }, deny); await button.click(); }, /destructive-looking/);
    assert.equal(await page.evaluate(() => Boolean(window.clicked)), false);
  } finally { await browser.close(); }
});

test("generated video assembly produces private files and refuses linked or existing targets and scene inputs", async (t) => {
  try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); } catch { t.skip("installed ffmpeg unavailable"); return; }
  // record-demo.mjs copies this template into every take folder.
  const script = fs.readFileSync(new URL("../demo/make-video.sh", import.meta.url), "utf8");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "capture-assembly-proof-"));
  const prepare = (name) => {
    const out = path.join(dir, name); ensurePrivateOutputDir(out); ensurePrivateOutputDir(path.join(out, "scenes"));
    writePrivateCapture(path.join(out, "make-video.sh"), script); writePrivateCapture(path.join(out, "segments.tsv"), "scenes/01-fixture.webm\t0\t200\tfixture\n"); writePrivateCapture(path.join(out, "assembly.conf"), "end_hold_seconds=0\n"); writePrivateCapture(path.join(out, "captions.vtt"), "WEBVTT\n\n00:00:00.000 --> 00:00:00.200\nFixture\n");
    execFileSync("ffmpeg", ["-v", "error", "-n", "-f", "lavfi", "-i", "color=black:s=320x240:d=0.2", "-c:v", "libvpx-vp9", path.join(out, "scenes/01-fixture.webm")]); fs.chmodSync(path.join(out, "scenes/01-fixture.webm"), 0o600);
    return out;
  };
  try {
    const valid = prepare("valid"); execFileSync("bash", ["make-video.sh"], { cwd: valid, stdio: "pipe" });
    for (const file of ["segments/001.mp4", "demo-silent.mp4", "demo.mp4"]) assert.equal(fs.statSync(path.join(valid, file)).mode & 0o777, 0o600);
    const unsafe = prepare("linked-output"), sentinel = path.join(dir, "sentinel.mp4"); fs.writeFileSync(sentinel, "unchanged outside sentinel", { mode: 0o600 }); fs.symlinkSync(sentinel, path.join(unsafe, "demo.mp4"));
    assert.throws(() => execFileSync("bash", ["make-video.sh"], { cwd: unsafe, stdio: "pipe" }), /assembly refused/); assert.equal(fs.readFileSync(sentinel, "utf8"), "unchanged outside sentinel"); assert.equal(fs.existsSync(path.join(unsafe, "segments/001.mp4")), false);
    const linkedInput = prepare("linked-input"); const original = path.join(linkedInput, "scenes/01-fixture.webm"); fs.renameSync(original, path.join(dir, "outside.webm")); fs.symlinkSync(path.join(dir, "outside.webm"), original);
    assert.throws(() => execFileSync("bash", ["make-video.sh"], { cwd: linkedInput, stdio: "pipe" }), /assembly refused/);
    assert.throws(() => execFileSync("bash", ["make-video.sh"], { cwd: valid, stdio: "pipe" }), /assembly refused/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("privacy capture hides overflow text, pseudo, absolute and shadow descendants without changing layout", async (t) => {
  let chromium, sharp;
  try { ({ chromium } = await import("playwright-core")); ({ default: sharp } = await import("sharp")); } catch { t.skip("installed browser dependencies unavailable"); return; }
  const { chromiumPath } = await import("../lib/common.mjs"); const browser = await chromium.launch({ executablePath: chromiumPath({ browser: {} }), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 500, height: 300 } });
    await page.setContent(`<style>body{margin:0;background:white}.sensitive{position:absolute;left:20px;top:20px;width:90px;height:20px;white-space:nowrap;font:24px monospace}.sensitive::after{content:"CANARY";position:absolute;left:140px;top:20px;background:#00ff00}.sensitive span{position:absolute;left:190px;top:80px;width:100px;height:40px;background:#00ff00}</style><div class="sensitive" style="opacity:1!important;filter:none!important">CAPTURE_CANARY<span>SECRET</span><x-secret></x-secret></div><script>let s=document.querySelector("x-secret").attachShadow({mode:"open"});s.innerHTML='<span style="position:fixed;left:330px;top:180px;width:90px;height:40px;background:#00ff00">SHADOW</span>'</script>`);
    const cfg = { redact: { maskSelectors: [".sensitive"], maskColor: "#000000" } }; await validatePageMaskSelectors(cfg, page);
    const before = await page.locator(".sensitive").evaluate((el) => ({ style: el.getAttribute("style"), opacity: getComputedStyle(el).opacity, box: [el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight] }));
    const unsafe = await sharp(await page.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const unsafePixel = (x, y) => [...unsafe.data.subarray((y * unsafe.info.width + x) * unsafe.info.channels, (y * unsafe.info.width + x) * unsafe.info.channels + 3)];
    assert.deepEqual(unsafePixel(220, 135), [0, 255, 0], "absolute overflow fixture must visibly paint before masking");
    assert.deepEqual(unsafePixel(175, 65), [0, 255, 0], "pseudo overflow fixture must visibly paint before masking");
    assert.deepEqual(unsafePixel(350, 215), [0, 255, 0], "shadow overflow fixture must visibly paint before masking");
    const { data, info } = await sharp(await captureScreenshot(cfg, page)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      if (x >= 20 && x < 110 && y >= 20 && y < 40) continue;
      const index = (y * info.width + x) * info.channels;
      assert.ok(data[index] === 255 && data[index + 1] === 255 && data[index + 2] === 255, `sensitive overflow paint at ${x},${y}`);
    }
    const after = await page.locator(".sensitive").evaluate((el) => ({ style: el.getAttribute("style"), opacity: getComputedStyle(el).opacity, box: [el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight] })); assert.deepEqual(after, before);
    assert.throws(() => shotOptions({ redact: { maskSelectors: [".sensitive; body {color:red}"] } }, page), /stylesheet injection/);
    assert.throws(() => shotOptions({ redact: { maskSelectors: [".sensitive"] } }, page, { style: "body{color:red}" }), /cannot override/);
    assert.throws(() => shotOptions({ redact: { maskSelectors: [".sensitive"] } }, page, { style: "" }), /cannot override/);
    assert.throws(() => captureScreenshot(cfg, page, { path: "/public.png" }), /returns bytes/);
  } finally { await browser.close(); }
});

test("overlapping captures serialize dynamic overflow suppression and restore DOM hooks", async (t) => {
  let chromium, sharp;
  try { ({ chromium } = await import("playwright-core")); ({ default: sharp } = await import("sharp")); } catch { t.skip("installed browser dependencies unavailable"); return; }
  const { chromiumPath } = await import("../lib/common.mjs"); const browser = await chromium.launch({ executablePath: chromiumPath({ browser: {} }), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 400, height: 250 } });
    await page.setContent('<body style="margin:0;background:white"><script>window.originalAttachShadow=Element.prototype.attachShadow</script>');
    const cfg = { redact: { maskSelectors: [".sensitive"] } }; let active = 0, maximum = 0;
    const instrumented = { screenshot: async (options) => {
      maximum = Math.max(maximum, ++active);
      await page.evaluate(() => { if (!document.querySelector(".sensitive")) { const el = document.createElement("div"); el.className = "sensitive"; el.style.cssText = "position:absolute;left:20px;top:20px;width:80px;height:20px;opacity:1!important;filter:none!important"; el.innerHTML = '<span style="position:absolute;left:140px;top:70px;width:100px;height:40px;background:#00ff00">CANARY</span>'; document.body.append(el); } });
      await page.waitForTimeout(30); const image = await page.screenshot(options); active--; return image;
    } };
    const captures = await Promise.all([captureScreenshot(cfg, page, {}, instrumented), captureScreenshot(cfg, page, {}, instrumented)]); assert.equal(maximum, 1);
    for (const image of captures) {
      const { data, info } = await sharp(image).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) { if (x >= 20 && x < 100 && y >= 20 && y < 40) continue; const i = (y * info.width + x) * info.channels; assert.ok(data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255, `dynamic sensitive paint at ${x},${y}`); }
    }
    assert.equal(await page.evaluate(() => Element.prototype.attachShadow === window.originalAttachShadow), true);
    assert.equal(await page.locator(".sensitive").evaluate((el) => el.style.getPropertyValue("opacity")), "1");
    await page.locator(".sensitive").evaluate((el) => { el.style.opacity = "0.5"; }); await page.waitForTimeout(20);
    assert.equal(await page.locator(".sensitive").evaluate((el) => el.style.getPropertyValue("opacity")), "0.5");
  } finally { await browser.close(); }
});

test("capture rejects navigation that replaces privacy guards before returning any image bytes", async (t) => {
  let chromium, sharp;
  try { ({ chromium } = await import("playwright-core")); ({ default: sharp } = await import("sharp")); } catch { t.skip("installed browser dependencies unavailable"); return; }
  const { chromiumPath } = await import("../lib/common.mjs");
  const server = http.createServer((req, res) => { res.setHeader("content-type", "text/html"); res.end(req.url === "/new" ? '<body style="margin:0;background:white"><div class="sensitive" style="position:absolute;left:20px;top:20px;width:80px;height:20px;opacity:1!important;filter:none!important"><span style="position:absolute;left:150px;top:90px;width:100px;height:50px;background:#00ff00">PRIVATE</span></div>' : '<body><div class="sensitive">Old fixture</div>'); });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ executablePath: chromiumPath({ browser: {} }), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 400, height: 250 } }), origin = `http://127.0.0.1:${server.address().port}`; await page.goto(origin + "/old");
    const cfg = { redact: { maskSelectors: [".sensitive"] } }; let exported = false, attackImage;
    const replacement = { screenshot: async (options) => { await page.goto(origin + "/new"); attackImage = await page.screenshot(options); return attackImage; } };
    await assert.rejects(async () => { const bytes = await captureScreenshot(cfg, page, {}, replacement); exported = Boolean(bytes); }, /capture context changed/);
    assert.equal(exported, false);
    const { data, info } = await sharp(attackImage).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const i = (145 * info.width + 200) * info.channels; assert.deepEqual([...data.subarray(i, i + 3)], [0, 255, 0], "regression must reproduce sensitive replacement-document paint before export refusal");
    assert.equal(await page.locator(".sensitive").evaluate((el) => el.style.getPropertyValue("opacity")), "1");
  } finally { await browser.close(); await new Promise((resolve) => server.close(resolve)); }
});

test("raw empty mask configuration still masks password inputs by default", async (t) => {
  let chromium, sharp;
  try { ({ chromium } = await import("playwright-core")); ({ default: sharp } = await import("sharp")); } catch { t.skip("installed browser dependencies unavailable"); return; }
  const { chromiumPath } = await import("../lib/common.mjs"); const browser = await chromium.launch({ executablePath: chromiumPath({ browser: {} }), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 240, height: 120 } });
    await page.setContent('<body style="margin:0;background:white"><input type="password" value="CAPTURE_CANARY" style="position:absolute;left:20px;top:20px;box-sizing:border-box;width:100px;height:30px;background:#00ff00;opacity:1!important;filter:none!important">');
    const cfg = { redact: { maskSelectors: [] } }; assert.deepEqual(validatedMaskSelectors(cfg), ["input[type=password]"]);
    const { data, info } = await sharp(await captureScreenshot(cfg, page)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const i = (35 * info.width + 50) * info.channels; assert.deepEqual([...data.subarray(i, i + 3)], [0, 0, 0]);
    assert.equal(await page.locator("input").inputValue(), "CAPTURE_CANARY"); assert.equal(await page.locator("input").evaluate((el) => el.style.getPropertyValue("opacity")), "1");
  } finally { await browser.close(); }
});
