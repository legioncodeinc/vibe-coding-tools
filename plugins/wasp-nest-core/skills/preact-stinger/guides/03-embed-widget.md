# Guide 03: Third-Party Embed Widget

> Source: `research/external/2026-05-20-embed-widget-shadow-dom.md`

This guide covers building a Preact-powered widget that is embedded on third-party pages (chat widget, feedback form, booking button, etc.) where you do not control the host page's CSS or JavaScript.

---

## Why Preact for embed widgets

- Host page's JS budget is not yours to spend: every extra KB affects their LCP.
- Bundle size: Preact ~3KB gzipped vs React ~40KB.
- Parse time: ~12ms (Preact) vs ~120ms (React) on throttled CPU.
- No version conflicts: embedding a React widget when the host page already loads React can cause duplicate React errors. Preact doesn't conflict.

---

## The architecture

```
your-widget.iife.js  (self-contained IIFE bundle)
  └── preact core (3KB)
  └── @preact/signals (3KB, optional)
  └── your widget component (varies)
  └── styles (inlined or shadow DOM scoped)
```

The host page adds:
```html
<script src="https://cdn.example.com/widget.iife.js"></script>
<my-widget config='{"theme":"dark"}'></my-widget>
```

---

## Shadow DOM isolation (recommended)

Shadow DOM provides full CSS isolation. Use `preact-custom-element` to wrap your Preact component as a Web Component:

```bash
npm install preact-custom-element
```

```tsx
// src/widget.tsx
import register from "preact-custom-element";
import App from "./App";

register(App, "my-widget", ["config"], { shadow: true });
```

Your `App` component receives `config` as a prop (always a string from HTML attributes, parse it):

```tsx
function App({ config }: { config: string }) {
  const opts = JSON.parse(config);
  return <div>...</div>;
}
```

---

## CSS isolation options

| Strategy | Isolation | Tradeoff |
|---|---|---|
| Shadow DOM (`shadow: true`) | Full | Cannot inherit host page fonts/colors by default |
| Shadow DOM + CSS custom properties | Full + theming | Host page sets `--widget-primary-color` etc. |
| Inline styles only | Full | No CSS class reuse; verbose |
| Scoped class prefix (e.g., `mw-`) | Partial | Specificity battles still possible |

**Recommended:** Shadow DOM + CSS custom properties for theming.

---

## Event retargeting gotcha

Inside a shadow root, `event.target` points to the shadow host element, not the originating element. When dispatching events to the host page, use `composed: true`:

```ts
element.dispatchEvent(
  new CustomEvent("widget-action", {
    detail: { action: "submit" },
    bubbles: true,
    composed: true, // cross shadow boundary
  })
);
```

---

## IIFE bundle configuration (Vite)

Build as a self-contained IIFE; bundle all dependencies, do not externalize:

```js
// vite.config.js
export default {
  build: {
    lib: {
      entry: "src/widget.tsx",
      formats: ["iife"],
      name: "MyWidget",
      fileName: () => "widget.iife.js",
    },
    rollupOptions: {
      external: [], // bundle everything
    },
  },
  resolve: {
    // No preact/compat needed unless migrating React components
  },
};
```

---

## Size budget checklist

Before shipping an embed widget, verify all pass:

- [ ] Core bundle (Preact): ~3KB gzipped
- [ ] + Signals (if used): +3KB → ~6KB
- [ ] + Widget UI code + deps: total target < 20KB gzipped (< 50KB absolute max)
- [ ] No `preact/compat` unless porting React components (adds ~5KB)
- [ ] No unused icon sets or large dependency trees
- [ ] CSS inlined or shadow-DOM scoped (no external stylesheet request)
- [ ] Tree-shaking confirmed (`rollup-plugin-visualizer` or equivalent)

---

## `serializable` option (preact-custom-element v4.6+)

For complex JSON props, enable `serializable: true`:

```ts
register(App, "my-widget", ["config"], { shadow: true, serializable: true });
```

This enables passing structured objects as HTML attributes (serialized to JSON string by the host, deserialized by the widget).

---

## Minimal vanilla (no Web Components)

If the host page can execute a JavaScript snippet (e.g., a tag manager injection):

```ts
// src/widget.ts
import { render, h } from "preact";
import App from "./App";

(function() {
  const container = document.createElement("div");
  container.id = "my-widget-root";
  document.body.appendChild(container);
  render(h(App, { config: window.MyWidgetConfig || {} }), container);
})();
```

This is simpler but has no style isolation: use a shadow root or scoped CSS if style conflicts are a concern.
