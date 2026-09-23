// Headless UI inventory extractor. Read-only: navigates same-origin routes and
// clicks only real tabs. Never clicks buttons, toggles, or external links.
// Writes one JSON per page state plus element crops under <inventory>/_raw.
// Designed by Legion Code Inc.
// Usage: CAPTURE_CONFIG=... [SHARD=0 SHARDS=6] [ROUTES=/a,/b] node inventory/extract.mjs
//        or: node parallel.mjs inventory/extract.mjs
import fs from "node:fs";
import path from "node:path";
import { assertTheme, discoverRoutes, gotoChecked, listTabs, loadConfig, log, openApp, routeSlug, settle, shard, shotOptions, slugify, tabName, withTimeout } from "../lib/common.mjs";
import { runOnboarding } from "../lib/onboarding.mjs";

const cfg = loadConfig();
const RAW = process.env.RAW || path.join(cfg.output.inventory, "_raw");
const CROPS = path.join(RAW, "crops");
const CROPS_PER_KEY = 2;
fs.mkdirSync(CROPS, { recursive: true });
const { browser, page } = await openApp(cfg);

// ---------------------------------------------------------------------------
// In-page collector. Returns candidates, style statistics, and CSS variables.
// ---------------------------------------------------------------------------
function collect({ stateId, withVars, redactPatterns, iconPattern }) {
  const REDACT = redactPatterns.map((p) => new RegExp(p, "gi"));
  const redact = (s) => REDACT.reduce((acc, re) => acc.replace(re, "[REDACTED]"), s);
  const STYLE_KEYS = [
    "display", "position", "color", "backgroundColor", "backgroundImage", "borderTopColor",
    "borderTopWidth", "borderTopStyle", "borderRadius", "boxShadow", "outlineStyle",
    "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "gap", "opacity", "cursor",
    "width", "height",
  ];
  const INTERACTIVE = new Set(["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA", "SUMMARY", "LABEL"]);
  const ROLES = new Set([
    "button", "tab", "tablist", "switch", "checkbox", "radio", "combobox", "listbox", "option",
    "menu", "menuitem", "dialog", "alert", "status", "progressbar", "slider", "table", "row",
    "navigation", "tooltip", "badge", "link", "searchbox", "textbox",
  ]);
  const transparent = (c) => c === "rgba(0, 0, 0, 0)" || c === "transparent";

  const visible = (el, r, cs) =>
    r.width >= 8 && r.height >= 8 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.02;

  const iconNames = (el) =>
    [...el.querySelectorAll("*")].filter((i) => new RegExp(iconPattern).test(String(i.className)))
      .map((i) => i.textContent.trim())
      .filter(Boolean);

  const shape = (el, depth) => {
    if (depth === 0) return "";
    return [...el.children]
      .slice(0, 12)
      .map((c) => {
        const isIcon = new RegExp(iconPattern).test(String(c.className?.baseVal ?? c.className ?? ""));
        const tag = isIcon ? "ICON" : c.tagName;
        const inner = shape(c, depth - 1);
        return inner ? `${tag}(${inner})` : tag;
      })
      .join(",");
  };

  const stats = {};
  const bump = (k, v) => {
    if (!v || v === "none" || v === "normal" || v === "0px") return;
    stats[k] ??= {};
    stats[k][v] = (stats[k][v] || 0) + 1;
  };

  const clean = (t) => (t || "").replace(/\s+/g, " ").trim().slice(0, 100);
  const HEAD = "h1, h2, h3, h4, [role=heading]";
  const outsideSidebar = (h) => !h.closest("aside, nav");
  const pageTitle = clean([...document.querySelectorAll("h1")].find(outsideSidebar)?.innerText);
  // Nearest section heading: walk up ancestors, take the last heading that precedes el.
  const headCache = new WeakMap();
  const sectionHeading = (el) => {
    for (let a = el.parentElement, depth = 0; a && depth < 8; a = a.parentElement, depth++) {
      let list = headCache.get(a);
      if (!list) headCache.set(a, (list = [...a.querySelectorAll(HEAD)]));
      const inSidebar = !!el.closest("aside, nav");
      const hs = list.filter(
        (h) => !el.contains(h) && (inSidebar || outsideSidebar(h)) && h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
      if (hs.length) return clean(hs.at(-1).innerText);
    }
    return "";
  };
  const fieldLabel = (el) => {
    if (el.labels?.length) return clean(el.labels[0].innerText);
    const by = el.getAttribute("aria-labelledby");
    if (by) return clean(by.split(" ").map((id) => document.getElementById(id)?.innerText).join(" "));
    const prev = el.previousElementSibling;
    return prev && ["LABEL", "SPAN", "P"].includes(prev.tagName) ? clean(prev.innerText) : "";
  };
  const candidates = [];
  let probe = 0;
  const all = document.querySelectorAll("body *");
  for (const el of all) {
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "svg", "path", "BR"].includes(el.tagName)) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (!visible(el, r, cs)) continue;

    const hasOwnText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (hasOwnText) {
      bump("color", cs.color);
      bump("fontFamily", cs.fontFamily);
      bump("fontSize", cs.fontSize);
      bump("fontWeight", cs.fontWeight);
      bump("lineHeight", cs.lineHeight);
      bump("letterSpacing", cs.letterSpacing);
      bump("typeStyle", `${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight} ${cs.textTransform}`);
    }
    if (!transparent(cs.backgroundColor)) bump("backgroundColor", cs.backgroundColor);
    if (cs.backgroundImage !== "none") bump("backgroundImage", cs.backgroundImage.slice(0, 160));
    if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none") {
      bump("borderColor", cs.borderTopColor);
      bump("borderWidth", cs.borderTopWidth);
    }
    bump("borderRadius", cs.borderRadius);
    bump("boxShadow", cs.boxShadow);
    for (const k of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginBottom", "gap"]) {
      bump("spacing", cs[k]);
    }

    // Component candidate heuristics.
    const role = el.getAttribute("role") || "";
    const tag = el.tagName;
    const interactive = INTERACTIVE.has(tag) || ROLES.has(role);
    const boundary =
      !transparent(cs.backgroundColor) ||
      cs.backgroundImage !== "none" ||
      (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none") ||
      cs.boxShadow !== "none";
    const structural = ["TABLE", "THEAD", "TH", "UL", "OL", "NAV", "HEADER", "ASIDE", "DIALOG", "H1", "H2", "H3", "H4", "HR", "IMG", "PROGRESS"].includes(tag);
    const iconOnly = new RegExp(iconPattern).test(String(el.className));
    if (!(interactive || (boundary && r.width >= 16 && r.height >= 16) || structural || iconOnly)) continue;
    if (r.width > innerWidth * 0.98 && r.height > innerHeight * 0.9) continue; // page shells

    const style = {};
    for (const k of STYLE_KEYS) style[k] = cs[k];
    const classes = String(el.className?.baseVal ?? el.className ?? "")
      .split(/\s+/)
      .filter(Boolean);
    const id = `${stateId}-${probe++}`;
    el.setAttribute("data-ui-probe", id);
    const region = el.closest("aside, nav") ? "sidebar" : el.closest("header") ? "header" : "main";

    candidates.push({
      id,
      tag,
      role,
      type: el.getAttribute("type") || "",
      region,
      classes,
      shape: shape(el, 2),
      style,
      context: {
        page: pageTitle,
        section: redact(sectionHeading(el)),
        label: redact(fieldLabel(el)),
        parentText: redact(clean(el.parentElement?.innerText).slice(0, 80)),
      },
      text: redact((el.innerText || el.value || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 120)),
      ariaLabel: el.getAttribute("aria-label") || "",
      title: el.getAttribute("title") || "",
      state: el.getAttribute("data-state") || el.getAttribute("aria-selected") || el.getAttribute("aria-checked") || (el.disabled ? "disabled" : ""),
      icons: iconNames(el).slice(0, 8).concat(iconOnly ? [el.textContent.trim()] : []),
      images: [...(tag === "IMG" ? [el] : el.querySelectorAll("img"))].slice(0, 4).map((i) => i.getAttribute("src")),
      svgCount: el.querySelectorAll("svg").length,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      html: redact(el.outerHTML.replace(/ data-ui-probe="[^"]*"/g, "").slice(0, 3000)),
    });
  }

  let vars = null;
  if (withVars) {
    const names = new Set();
    const rules = {};
    for (const ss of document.styleSheets) {
      let rs;
      try { rs = ss.cssRules; } catch { continue; }
      const walk = (list, media) => {
        for (const rule of list) {
          if (rule.style && rule.selectorText) {
            for (const n of rule.style) {
              if (!n.startsWith("--") || n.startsWith("--tw-")) continue;
              names.add(n);
              const sel = media ? `${media} ${rule.selectorText}` : rule.selectorText;
              (rules[sel] ??= {})[n] = rule.style.getPropertyValue(n).trim();
            }
          }
          if (rule.cssRules) walk(rule.cssRules, rule.conditionText || rule.name || media);
        }
      };
      walk(rs, "");
    }
    const cs = getComputedStyle(document.documentElement);
    const resolved = {};
    for (const n of [...names].sort()) resolved[n] = cs.getPropertyValue(n).trim();
    vars = { resolved, bySelector: rules, htmlClass: document.documentElement.className };
  }

  return { candidates, stats, vars, title: document.title, path: location.pathname + location.search };
}

// ---------------------------------------------------------------------------

async function captureState(route, stateName, isFirst) {
  const stateId = stateName.split("__").map(slugify).join("__");
  const scrollHeight = await page.evaluate(() => {
    let best = document.scrollingElement;
    for (const el of document.querySelectorAll("*")) {
      const oy = getComputedStyle(el).overflowY;
      if (["auto", "scroll"].includes(oy) && el.scrollHeight > el.clientHeight + 1 && el.clientWidth > innerWidth * 0.4) {
        if (el.scrollHeight > best.scrollHeight) best = el;
      }
    }
    return best.scrollHeight;
  });
  await page.mouse.move(-1, -1); // avoid incidental :hover states in crops and styles
  const data = await page.evaluate(collect, { stateId, withVars: isFirst, redactPatterns: cfg.redact.patterns, iconPattern: cfg.icons?.classPattern || "^$" });

  // Crops: first CROPS_PER_KEY instances of each rough signature in this state.
  const seen = new Map();
  let crops = 0;
  for (const c of data.candidates) {
    const key = [c.tag, c.role, c.shape, c.style.backgroundColor, c.style.borderRadius, c.style.fontSize, c.rect.w > 600 ? "wide" : "narrow"].join("|");
    const n = seen.get(key) || 0;
    seen.set(key, n + 1);
    c.sigKey = key;
    if (n >= CROPS_PER_KEY || c.rect.h > 2400) continue;
    const file = `${c.id}.png`;
    try {
      await page.locator(`[data-ui-probe="${c.id}"]`).screenshot(shotOptions(cfg, page, { path: path.join(CROPS, file), timeout: 4000 }));
      c.crop = `crops/${file}`;
      crops++;
    } catch {}
  }
  const outFile = path.join(RAW, `${stateId}.json`);
  fs.writeFileSync(outFile, JSON.stringify({ route, state: stateName, scrollHeight, ...data }, null, 1));
  log(`  ${stateName}: ${data.candidates.length} candidates, ${crops} crops`);
}

let failures = 0;
try {
  if (!process.env.SHARDS && !process.env.WEBAPP_CAPTURE_ONBOARDING_DONE) {
    await runOnboarding(cfg, page, cfg.output.screenshots || path.join(cfg.output.inventory, "screenshots"));
  }
  let routes = process.env.ROUTES ? process.env.ROUTES.split(",").filter(Boolean) : await discoverRoutes(cfg, page);
  const varsRoute = routes[0]; // CSS variables are captured once, by whichever shard owns the first route
  if (process.env.SHARDS) routes = shard(routes, Number(process.env.SHARDS))[Number(process.env.SHARD || 0)] || [];

  for (const route of routes) {
    try {
      await withTimeout((async () => {
        await gotoChecked(cfg, page, route);
        const base = routeSlug(route);
        log(route);
        await captureState(route, base, route === varsRoute);
        for (const t of (await listTabs(cfg, page, route)).filter((x) => !x.selected)) {
          await gotoChecked(cfg, page, route);
          const currentTabs = await listTabs(cfg, page, route);
          const current = currentTabs.find((candidate) => candidate.index === t.index && candidate.label === t.label && !candidate.selected)
            || currentTabs.find((candidate) => candidate.label === t.label && !candidate.selected);
          if (!current) {
            log(`  tab ${t.label}: skipped because it is no longer available from the base route`);
            continue;
          }
          const before = page.url();
          await page.locator(`${cfg.tabs.selector}:visible`).nth(current.index).click({ timeout: 5000 });
          await settle(page);
          await assertTheme(cfg, page);
          await captureState(route, `${base}__${tabName(before, page.url(), t.label)}`, false);
        }
      })(), 15 * 60000, route);
    } catch (err) {
      failures++;
      log(`${route} ERROR ${err.message.split("\n")[0]}`);
      if (/session expired/.test(err.message)) break; // every later route would fail too
    }
  }
} finally {
  await browser.close();
}
log(failures ? `done with ${failures} route error(s)` : "done");
process.exit(failures ? 1 : 0);
