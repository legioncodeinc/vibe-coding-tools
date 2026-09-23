// Optional, explicitly approved onboarding preflight for screenshot crawls.
// This is the only capture stage allowed to submit local setup forms. Every
// action is declared in capture.config.json and captured before it executes.
import fs from "node:fs";
import path from "node:path";

import { assertTheme, log, settle, shotOptions, slugify } from "./common.mjs";

const DEFAULT_DENY = "\\b(?:delete|remove|reset|revoke|restart|logout|sign\\s*out|pay|purchase|transfer|publish)\\b";
const SECRET_FIELD = /password|passcode|secret|token|api[-_ ]?key|private[-_ ]?key/i;
const SECRET_VALUE = /-----BEGIN [A-Z ]*PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\bxox[baprs]-[A-Za-z0-9-]{10,}|\bgh[pousr]_[A-Za-z0-9_]{20,}|\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}|\bBearer\s+[A-Za-z0-9._-]+/i;
const ACTION_TYPES = new Set(["fill", "click", "wait", "waitFor"]);

function targetLabel(target = {}) {
  return target.name || target.label || target.placeholder || target.text || target.selector || "target";
}

function targetSearchText(target = {}) {
  return Object.values(target).filter((value) => typeof value === "string").join(" ");
}

async function locatorSearchText(locator) {
  return locator.evaluate((element) => [
    element.textContent,
    element.getAttribute("type"),
    element.getAttribute("name"),
    element.getAttribute("id"),
    element.getAttribute("autocomplete"),
    element.getAttribute("aria-label"),
    element.getAttribute("placeholder"),
    element.getAttribute("title"),
  ].filter(Boolean).join(" "));
}

export function validateOnboardingPlan(plan) {
  if (!["local", "seeded"].includes(plan.environment)) {
    throw new Error("onboarding.environment must be local or seeded; production onboarding is refused");
  }
  if (plan.approved !== true) {
    throw new Error("onboarding.enabled requires onboarding.approved=true after explicit user approval");
  }
  const steps = Array.isArray(plan.steps) ? plan.steps : [];
  if (!steps.length) throw new Error("onboarding.steps must contain at least one step");

  const customDeny = plan.denyPattern ? `|(?:${plan.denyPattern})` : "";
  let deny;
  try { deny = new RegExp(`(?:${DEFAULT_DENY})${customDeny}`, "i"); }
  catch (error) { throw new Error(`onboarding.denyPattern is not a valid regex: ${error.message}`); }

  for (const step of steps) {
    if (step.actions !== undefined && !Array.isArray(step.actions)) throw new Error("onboarding step actions must be an array");
    for (const action of step.actions || []) {
      if (!ACTION_TYPES.has(action.type)) throw new Error(`unsupported onboarding action type: ${action.type}`);
      if (["fill", "click", "waitFor"].includes(action.type) && !action.target) {
        throw new Error(`onboarding ${action.type} action requires a target`);
      }
      if (action.type === "wait" && (!Number.isFinite(Number(action.ms)) || Number(action.ms) < 0)) {
        throw new Error("onboarding wait action requires a non-negative numeric ms value");
      }
      if (action.settleMs !== undefined && (!Number.isFinite(Number(action.settleMs)) || Number(action.settleMs) < 0)) {
        throw new Error("onboarding action settleMs must be a non-negative number");
      }
      const searchable = targetSearchText(action.target);
      if (action.type === "fill" && SECRET_FIELD.test(searchable)) {
        throw new Error(`refusing to fill secret-looking onboarding field: ${targetLabel(action.target)}`);
      }
      if (action.type === "fill" && SECRET_VALUE.test(String(action.value ?? ""))) {
        throw new Error(`refusing secret-looking onboarding value for: ${targetLabel(action.target)}`);
      }
      if (action.type === "click" && deny.test(searchable)) {
        throw new Error(`refusing denied onboarding click: ${targetLabel(action.target)}`);
      }
    }
  }
  return { steps, deny };
}

function locatorFor(page, target = {}) {
  if (target.role && target.namePattern) {
    return page.getByRole(target.role, { name: new RegExp(target.namePattern, target.flags || "i") });
  }
  if (target.role) return page.getByRole(target.role, { name: target.name, exact: target.exact ?? true });
  if (target.label) return page.getByLabel(target.label, { exact: target.exact ?? true });
  if (target.placeholder) return page.getByPlaceholder(target.placeholder, { exact: target.exact ?? true });
  if (target.text) return page.getByText(target.text, { exact: target.exact ?? true });
  if (target.selector) return page.locator(target.selector);
  throw new Error("onboarding target needs role, label, placeholder, text, or selector");
}

async function waitForTarget(page, target, timeoutMs) {
  await locatorFor(page, target).first().waitFor({ state: "visible", timeout: timeoutMs });
}

export async function runOnboarding(cfg, page, screenshotsRoot) {
  const plan = cfg.onboarding;
  if (!plan?.enabled) return { ran: false, skipped: true };
  const { steps, deny } = validateOnboardingPlan(plan);

  const timeoutMs = Number(plan.timeoutMs || 120000);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error("onboarding.timeoutMs must be a positive number");
  const route = plan.path || "/onboarding";
  await page.goto(cfg.app.origin + route, { waitUntil: "domcontentloaded", timeout: 30000 });
  await settle(page);
  await assertTheme(cfg, page);

  if (plan.skipWhenApiHasItems) {
    const hasItems = await page.evaluate(async (apiPath) => {
      const response = await fetch(apiPath, { credentials: "same-origin" });
      if (!response.ok) throw new Error(`onboarding precheck failed with HTTP ${response.status}`);
      const body = await response.json();
      return Array.isArray(body) && body.length > 0;
    }, plan.skipWhenApiHasItems);
    if (hasItems) {
      log(`onboarding preflight skipped: ${plan.skipWhenApiHasItems} already contains items`);
      return { ran: false, skipped: true };
    }
  }

  if (plan.whenVisible) {
    const gate = locatorFor(page, plan.whenVisible).first();
    if (!(await gate.isVisible().catch(() => false))) {
      log(`onboarding preflight skipped: ${targetLabel(plan.whenVisible)} is not visible`);
      return { ran: false, skipped: true };
    }
  }

  const dir = path.join(screenshotsRoot, plan.outputSubdir || "_onboarding");
  fs.mkdirSync(dir, { recursive: true });
  const manifest = path.join(dir, "manifest.tsv");
  fs.writeFileSync(manifest, "step\tscreenshot\turl\n");

  for (let index = 0; index < steps.length; index++) {
    const step = steps[index];
    const name = slugify(step.name || `step-${index + 1}`);
    if (step.waitFor) await waitForTarget(page, step.waitFor, timeoutMs);
    await settle(page, 5000, 500);
    const screenshot = `${String(index + 1).padStart(2, "0")}-${name}.png`;
    await page.screenshot(shotOptions(cfg, page, { path: path.join(dir, screenshot) }));
    fs.appendFileSync(manifest, `${name}\t${screenshot}\t${page.url()}\n`);
    log(`onboarding ${name}: captured`);

    for (const action of step.actions || []) {
      if (action.type === "fill") {
        const target = locatorFor(page, action.target).first();
        const searchable = `${targetSearchText(action.target)} ${await locatorSearchText(target)}`;
        if (SECRET_FIELD.test(searchable)) {
          throw new Error(`refusing to fill secret-looking onboarding field: ${targetLabel(action.target)}`);
        }
        await target.fill(String(action.value ?? ""), { timeout: timeoutMs });
      } else if (action.type === "click") {
        const target = locatorFor(page, action.target).first();
        const searchable = `${targetSearchText(action.target)} ${await locatorSearchText(target)}`;
        if (deny.test(searchable)) {
          throw new Error(`refusing denied onboarding click: ${targetLabel(action.target)}`);
        }
        await target.click({ timeout: timeoutMs });
      } else if (action.type === "wait") {
        await page.waitForTimeout(Math.max(0, Number(action.ms || 0)));
      } else if (action.type === "waitFor") {
        await waitForTarget(page, action.target, timeoutMs);
      }
      await settle(page, 5000, Number(action.settleMs ?? 700));
    }
  }

  if (plan.completeWhenVisible) await waitForTarget(page, plan.completeWhenVisible, timeoutMs);
  log(`onboarding preflight complete at ${page.url()}`);
  return { ran: true, skipped: false };
}
