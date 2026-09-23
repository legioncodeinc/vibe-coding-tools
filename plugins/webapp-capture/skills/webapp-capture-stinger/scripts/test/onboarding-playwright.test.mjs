import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { chromiumPath } from "../lib/common.mjs";
import { runOnboarding } from "../lib/onboarding.mjs";

test("approved onboarding runs once against a real Chromium page and captures evidence", async (t) => {
  let chromium;
  try { ({ chromium } = await import("playwright-core")); }
  catch { t.skip("playwright-core is not installed"); return; }

  const server = http.createServer((request, response) => {
    response.setHeader("content-type", "text/html; charset=utf-8");
    response.end(`<!doctype html><html><body>
      <h1>Welcome</h1>
      <label>Project name <input aria-label="Project name"></label>
      <button onclick="document.querySelector('h1').textContent='Dashboard'">Continue</button>
    </body></html>`);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const origin = `http://127.0.0.1:${address.port}`;
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "webapp-onboarding-test-"));
  let browser;

  try {
    browser = await chromium.launch({ executablePath: chromiumPath({ browser: {} }), headless: true });
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    const cfg = {
      app: { origin },
      browser: { colorScheme: "light" },
      theme: {},
      redact: { maskSelectors: [] },
      onboarding: {
        enabled: true,
        approved: true,
        environment: "local",
        path: "/onboarding",
        timeoutMs: 5000,
        whenVisible: { role: "heading", name: "Welcome" },
        completeWhenVisible: { role: "heading", name: "Dashboard" },
        steps: [{
          name: "create-project",
          actions: [
            { type: "fill", target: { label: "Project name" }, value: "Demo" },
            { type: "click", target: { role: "button", name: "Continue" } },
          ],
        }],
      },
    };

    assert.deepEqual(await runOnboarding(cfg, page, out), { ran: true, skipped: false });
    assert.equal(await page.getByLabel("Project name").inputValue(), "Demo");
    assert.ok(fs.existsSync(path.join(out, "_onboarding", "01-create-project.png")));
    assert.match(fs.readFileSync(path.join(out, "_onboarding", "manifest.tsv"), "utf8"), /create-project/);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(out, { recursive: true, force: true });
  }
});
