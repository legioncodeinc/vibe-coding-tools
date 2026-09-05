---
source_type: github-readme
authority: official
relevance: high
topic: embed-widget
url: https://github.com/preactjs/preact-custom-element
---

# Preact Embed Widget: Shadow DOM Pattern

**Package:** `preact-custom-element` v4.6.0 (October 2025)

## Why third-party embed with Preact

When building a widget that is embedded in third-party pages (chat widget, feedback form, booking widget):
- You don't control the host page's CSS or JavaScript.
- Bundle size directly affects host page LCP.
- Style conflicts with host CSS are common.
- Host page may already have React loaded at a different version.

Preact is 3KB vs React's 40KB: a 37KB saving that matters when the host page already has its own JS budget.

## Shadow DOM isolation (recommended)

Shadow DOM provides full CSS isolation. `preact-custom-element` wraps a Preact component as a Web Component with shadow DOM:

```js
import register from "preact-custom-element";
import App from "./App";

register(App, "my-widget", ["config"], { shadow: true });
```

Host page usage:
```html
<script src="https://cdn.example.com/widget.iife.js"></script>
<my-widget config='{"theme":"dark"}'></my-widget>
```

## CSS isolation options

| Strategy | Isolation | Tradeoff |
|---|---|---|
| Shadow DOM (`shadow: true`) | Full | Cannot inherit host fonts/colors |
| Shadow DOM + CSS vars | Full + theming | Requires host to set vars |
| Inline styles only | Full | No CSS class reuse |
| Scoped class prefix | Partial | Specificity battles possible |

## Event retargeting gotcha

Shadow DOM retargets events: `event.target` inside a shadow root points to the shadow root element, not the original element. If you relay events to the host page (e.g., `document.dispatchEvent`), use `composed: true`:

```js
element.dispatchEvent(new CustomEvent("widget-action", { bubbles: true, composed: true }));
```

## IIFE bundle pattern for third-party delivery

Build as a self-contained IIFE (not ESM) for maximum compatibility:

**vite.config.js:**
```js
export default {
  build: {
    lib: {
      entry: "src/widget.tsx",
      formats: ["iife"],
      name: "MyWidget",
    },
    rollupOptions: {
      external: [], // bundle everything; host page may have different React version
    },
  },
};
```

## `serializable` option (v4.6+)

The `serializable: true` option on `register` enables structured JSON prop serialization, allowing complex objects to be passed as HTML attributes:

```js
register(App, "my-widget", ["config"], { shadow: true, serializable: true });
```

## Size budget checklist for embed widgets

- [ ] Core bundle (Preact + signals if used): < 6KB gzipped
- [ ] Total widget bundle (core + UI): < 50KB gzipped (target < 20KB for high-traffic embeds)
- [ ] No `preact/compat` unless needed (adds ~5KB)
- [ ] Tree-shaking confirmed (no unused icon sets, etc.)
- [ ] CSS in JS or inline to avoid external stylesheets
