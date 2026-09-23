import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { discoverRoutes, validateConfig } from "../lib/common.mjs";
import { validateOnboardingPlan } from "../lib/onboarding.mjs";
import { mergeScreenshotManifests } from "../merge-screenshot-manifests.mjs";

const baseConfig = () => ({
  app: { origin: "https://example.test", loginPath: "/login" },
  auth: { storageState: ".capture/auth.json" },
  browser: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  routes: { discover: "crawl-links", startPath: "/", exclude: [] },
  tabs: { selector: "[role=tab]", notATabLabel: "^$" },
  icons: { classPattern: "^$" },
  redact: { patterns: [] },
  output: { inventory: "library/design" },
});

function fakeCrawlPage(pages) {
  let current = "https://example.test/";
  return {
    async goto(url) { current = url; },
    async waitForLoadState() {},
    async waitForTimeout() {},
    url() { return current; },
    async evaluate() {
      const url = new URL(current);
      return pages[`${url.pathname}${url.search}`] || [];
    },
  };
}

test("validateConfig accepts crawl settings and rejects invalid optional patterns", () => {
  assert.equal(validateConfig(baseConfig()).routes.discover, "crawl-links");
  const cfg = baseConfig();
  cfg.onboarding = { denyPattern: "[" };
  assert.throws(() => validateConfig(cfg), /onboarding\.denyPattern is not a valid regex/);
  cfg.onboarding = { outputSubdir: "../../private" };
  assert.throws(() => validateConfig(cfg), /must stay inside the screenshots directory/);
  cfg.onboarding = { outputSubdir: "C:\\private" };
  assert.throws(() => validateConfig(cfg), /must stay inside the screenshots directory/);
  cfg.onboarding = { skipWhenApiHasItems: "https://outside.test/items" };
  assert.throws(() => validateConfig(cfg), /must be a same-origin absolute path/);
  cfg.onboarding = undefined;
  cfg.routes.maxRoutes = "many";
  assert.throws(() => validateConfig(cfg), /routes.maxRoutes must be a positive integer/);
});

test("crawl-links follows same-origin links while honoring include, exclude, and maxRoutes", async () => {
  const cfg = baseConfig();
  cfg.routes.maxRoutes = 3;
  cfg.routes.includePattern = "^/(|app|reports|settings)";
  cfg.routes.exclude = ["/settings"];
  const page = fakeCrawlPage({
    "/": [
      { href: "https://example.test/app", target: "" },
      { href: "https://example.test/settings", target: "" },
      { href: "https://example.test/account/delete", target: "" },
      { href: "https://outside.test/ignored", target: "" },
    ],
    "/app": [
      { href: "https://example.test/reports?range=30d", target: "" },
      { href: "https://example.test/new-tab", target: "_blank" },
    ],
    "/reports?range=30d": [],
  });
  assert.deepEqual(await discoverRoutes(cfg, page), ["/", "/app", "/reports?range=30d"]);
});

test("onboarding validates the complete plan before execution", () => {
  assert.throws(() => validateOnboardingPlan({ environment: "production", approved: true, steps: [{}] }), /production onboarding is refused/);
  assert.throws(() => validateOnboardingPlan({ environment: "local", approved: false, steps: [{}] }), /approved=true/);
  assert.throws(() => validateOnboardingPlan({
    environment: "local",
    approved: true,
    steps: [{ actions: [{ type: "fill", target: { name: "Account", selector: "#api-key" }, value: "x" }] }],
  }), /secret-looking/);
  assert.throws(() => validateOnboardingPlan({
    environment: "seeded",
    approved: true,
    denyPattern: "harmless-custom-pattern",
    steps: [{ actions: [{ type: "click", target: { role: "button", name: "Delete account" } }] }],
  }), /denied onboarding click/);
  assert.doesNotThrow(() => validateOnboardingPlan({
    environment: "local",
    approved: true,
    steps: [{ actions: [{ type: "click", target: { role: "button", name: "Display options" } }] }],
  }));
  assert.throws(() => validateOnboardingPlan({
    environment: "local",
    approved: true,
    steps: [{ actions: [{ type: "submit", target: { role: "button", name: "Continue" } }] }],
  }), /unsupported onboarding action type/);
  assert.throws(() => validateOnboardingPlan({
    environment: "local",
    approved: true,
    steps: [{ actions: [{ type: "fill", target: { label: "Import value" }, value: "Bearer demo" }] }],
  }), /secret-looking onboarding value/);
});

test("manifest merge preserves route identity and lets successful retries win", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "webapp-capture-test-"));
  try {
    const first = path.join(dir, "manifest-0.tsv");
    const retry = path.join(dir, "manifest-retry.tsv");
    const output = path.join(dir, "manifest-final.tsv");
    fs.writeFileSync(first, [
      "route\tstate\tshots\ttruncated\turl",
      "/a\tshared\t0\tfalse\terror: timeout",
      "/b\tshared\t1\tfalse\thttps://example.test/b",
      "/c\tc\t2\ttrue\thttps://example.test/c",
      "",
    ].join("\n"));
    fs.writeFileSync(retry, [
      "route\tstate\tshots\ttruncated\turl",
      "/a\tshared\t2\tfalse\thttps://example.test/a",
      "",
    ].join("\n"));

    const result = mergeScreenshotManifests({ inputs: [first, retry], output });
    assert.equal(result.rows.length, 3);
    assert.equal(result.failures.length, 1);
    assert.match(fs.readFileSync(output, "utf8"), /\/a\tshared\t2\tfalse/);
    assert.match(fs.readFileSync(output, "utf8"), /\/b\tshared\t1\tfalse/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
