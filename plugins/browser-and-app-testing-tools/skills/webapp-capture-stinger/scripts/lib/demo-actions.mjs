// Browser side of the demo recorder: one function per plan action, read-only verify
// checks, the visible cursor overlay and cursor parking. The caller injects its safety
// guard, so every targeted control is checked before the pointer touches it.
// Designed by Legion Code Inc.
import { PARK_AFTER } from "./demo-plan.mjs";

const DIALOG = '[role="alertdialog"]:visible, [role="dialog"]:visible, dialog[open]:visible';
const CANCEL = /^(cancel|close|no|keep|back|dismiss)$/i;

export class DemoSceneError extends Error {}

/** Runs in the page (context.addInitScript). Headless Chromium draws no cursor, so the
 * recorder draws one in the DOM; it follows real mouse events and never takes pointer events. */
export function installCursorOverlay() {
  if (window.__webappCaptureCursor) return;
  window.__webappCaptureCursor = true;
  const make = () => {
    const c = document.createElement("div");
    c.setAttribute("data-demo-cursor", "");
    c.setAttribute("aria-hidden", "true");
    c.style.cssText = "position:fixed;left:0;top:0;width:24px;height:24px;z-index:2147483647;pointer-events:none;transform:translate(-200px,-200px);";
    c.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 2 L3 19 L7.6 14.8 L10.8 21.6 L13.7 20.3 L10.6 13.6 L17 13.6 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.documentElement.appendChild(c);
    const path = c.querySelector("path");
    addEventListener("mousemove", (e) => { c.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 2}px)`; }, true);
    addEventListener("mousedown", () => { path.setAttribute("fill", "#2563eb"); }, true);
    addEventListener("mouseup", () => { path.setAttribute("fill", "#111"); }, true);
  };
  if (document.documentElement) make(); else addEventListener("DOMContentLoaded", make);
}

async function centerOf(locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  const box = await locator.boundingBox();
  if (!box) throw new DemoSceneError("target is not visible on screen");
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** A raw {x, y} drag end has no selector, so guard whatever control is under that point. */
async function guardPoint(page, point, guard) {
  const handle = await page.evaluateHandle(({ x, y }) => {
    let node = document.elementFromPoint(x, y);
    while (node?.shadowRoot) { const inner = node.shadowRoot.elementFromPoint(x, y); if (!inner || inner === node) break; node = inner; }
    const control = node?.closest('button,a[href],input,select,textarea,label,summary,[role="button"],[role="link"],[role="menuitem"],[onclick]');
    return control || node;
  }, { x: point.x, y: point.y });
  const element = handle.asElement();
  if (!element) throw new DemoSceneError(`drag point ${point.x},${point.y} is outside the page`);
  const tag = await element.evaluate((n) => n.tagName.toLowerCase());
  if (["iframe", "frame", "object", "embed"].includes(tag)) throw new Error("refusing drag point inside a frame the guard cannot inspect");
  // Bare page background holds no control; its text is the whole document.
  if (tag !== "html" && tag !== "body") await guard(element, { type: "click" });
  await handle.dispose();
}

/**
 * Run one action. ctx: { guard(locator, action), deny, settle(page), wrap(fn), parkAt, pointer }.
 * ctx.pointer tracks the last cursor position so it can be restored after navigation.
 */
export async function runAction(page, a, ctx) {
  const { guard, deny, settle = async () => {}, wrap = (fn) => fn(), parkAt } = ctx;
  const move = async (p, steps = 25) => { await page.mouse.move(p.x, p.y, { steps }); ctx.pointer = p; };
  const end = async (spec) => {
    if (typeof spec === "string") { const loc = page.locator(spec).first(); await guard(loc, { type: "click", selector: spec }); return centerOf(loc); }
    await guardPoint(page, spec, guard);
    return { x: spec.x, y: spec.y };
  };
  const target = a.selector ? page.locator(a.selector).first() : null;
  if (target && !["drag", "scrollElement", "waitFor"].includes(a.type)) {
    // type keeps its own type so the credential-field checks apply; the rest are guarded as clicks.
    await guard(target, a.type === "type" ? a : { ...a, type: "click" });
    await move(await centerOf(target));
  }
  await wrap(async () => {
    switch (a.type) {
      case "wait": await page.waitForTimeout(a.ms ?? 1000); break;
      case "hover": await page.waitForTimeout(a.ms ?? 800); break;
      case "click": await target.click(); await settle(page); break;
      case "type": await target.pressSequentially(a.text, { delay: a.delay ?? 60 }); break;
      case "scroll": await page.mouse.wheel(a.dx ?? 0, a.dy ?? 600); await page.waitForTimeout(a.ms ?? 400); break;
      case "select":
        if (deny.test(a.label)) throw new Error("refusing destructive-looking demo option");
        await target.selectOption({ label: a.label }); await settle(page); break;
      case "check": await target.check(); await settle(page); break;
      case "uncheck": await target.uncheck(); await settle(page); break;
      case "drag": {
        // Pointer drag with stepped moves, for libraries that listen to mouse or pointer events.
        let from = await end(a.from);
        const to = await end(a.to);
        if (typeof a.from === "string") {
          // Bringing the drop target into view may have scrolled the source: read it again, without scrolling.
          const box = await page.locator(a.from).first().boundingBox();
          const view = page.viewportSize();
          from = box && { x: box.x + box.width / 2, y: box.y + box.height / 2 };
          if (!from || from.x < 0 || from.y < 0 || (view && (from.x > view.width || from.y > view.height))) throw new DemoSceneError("drag source and target are not on screen together");
        } else await guardPoint(page, from, guard); // the same scroll can put another control under a raw point
        await move(from, 20);
        await page.mouse.down();
        await page.mouse.move(from.x + 6, from.y + 6, { steps: 3 }); // cross the drag-start threshold
        await move(to, a.steps ?? 30);
        await page.waitForTimeout(a.holdMs ?? 250);
        await page.mouse.up();
        await settle(page); break;
      }
      case "dragTo": {
        // Native HTML5 drag and drop (draggable="true" with dragstart/drop handlers).
        const dest = page.locator(a.target).first();
        await guard(dest, { type: "click", selector: a.target });
        await target.dragTo(dest);
        ctx.pointer = await centerOf(dest).catch(() => ctx.pointer);
        await settle(page); break;
      }
      case "scrollElement": {
        // Scroll a container (calendar grid, kanban lane, table) instead of the page.
        const box = page.locator(a.selector).first();
        if (a.intoView) await box.locator(a.intoView).first().evaluate((n, block) => n.scrollIntoView({ block, inline: "nearest" }), a.block || "center");
        else await box.evaluate((n, { x, y }) => n.scrollTo({ left: x ?? n.scrollLeft, top: y ?? n.scrollTop }), { x: a.x, y: a.y });
        await page.waitForTimeout(a.ms ?? 600); break;
      }
      case "waitFor": {
        const loc = a.selector ? page.locator(a.selector).first() : page.getByText(a.text).first();
        await loc.waitFor({ state: a.state || "visible", timeout: a.timeoutMs ?? 10000 }).catch(() => { throw new DemoSceneError(`waitFor timed out: ${a.selector || a.text}`); });
        break;
      }
      case "confirmDialog": {
        // Click the named button only when the dialog says what the plan expects.
        const dialog = page.locator(a.dialog || DIALOG).last();
        await dialog.waitFor({ state: "visible", timeout: a.timeoutMs ?? 5000 }).catch(() => { throw new DemoSceneError("confirmDialog: no dialog appeared"); });
        const text = (await dialog.innerText()).replace(/\s+/g, " ").trim();
        if (!new RegExp(a.expect, "i").test(text)) {
          const cancel = dialog.getByRole("button", { name: a.cancel ? new RegExp(`^${a.cancel}$`, "i") : CANCEL }).first();
          // The cancel name comes from the plan, so it passes the same guard as any other click.
          if (await cancel.count()) { await guard(cancel, { type: "click", selector: a.cancel }); await cancel.click(); }
          else await page.keyboard.press("Escape");
          throw new DemoSceneError(`confirmDialog: dialog text did not match /${a.expect}/ and was cancelled. It said: "${text.slice(0, 160)}"`);
        }
        const button = dialog.getByRole("button", { name: a.button, exact: a.exact ?? true }).first();
        await guard(button, { type: "click", selector: a.button });
        await move(await centerOf(button));
        await button.click();
        await settle(page); break;
      }
      default: throw new Error(`unknown action type ${a.type}`);
    }
  });
  if (PARK_AFTER.has(a.type) && a.park !== false && parkAt) {
    // Move off the content so hover cards and tooltips close before the next frame.
    await move(parkAt, 12);
    await page.waitForTimeout(150);
  }
}

/** Read-only check after a scene's actions. Never clicks or types. */
export async function runVerify(page, v, timeoutMs = 8000) {
  const loc = v.selector ? page.locator(v.selector) : page.getByText(v.text);
  const label = v.selector || `text "${v.text}"`;
  const deadline = Date.now() + (v.timeoutMs ?? timeoutMs);
  const poll = async (probe) => { let last; for (;;) { last = await probe(); if (last.pass || Date.now() > deadline) return last; await page.waitForTimeout(250); } };
  if (v.type === "visible" || v.type === "hidden") {
    const ok = await loc.first().waitFor({ state: v.type, timeout: v.timeoutMs ?? timeoutMs }).then(() => true, () => false);
    return { check: `${label} is ${v.type}`, expected: v.type, actual: ok ? v.type : v.type === "visible" ? "not visible" : "still visible", pass: ok };
  }
  if (v.type === "text") {
    const re = new RegExp(v.expect, "i");
    return poll(async () => { const t = await loc.first().innerText({ timeout: 1000 }).catch(() => ""); return { check: `${label} text matches /${v.expect}/`, expected: v.expect, actual: t.replace(/\s+/g, " ").trim().slice(0, 160), pass: re.test(t) }; });
  }
  return poll(async () => { const n = await loc.count(); const pass = Number.isInteger(v.equals) ? n === v.equals : n >= v.atLeast; return { check: `${label} count ${Number.isInteger(v.equals) ? `= ${v.equals}` : `>= ${v.atLeast}`}`, expected: v.equals ?? `>= ${v.atLeast}`, actual: n, pass }; });
}

/** Visible page text, used only for the privacy scan; callers never store it. */
export const visibleText = (page) => page.evaluate(() => document.body?.innerText || "").catch(() => "");
