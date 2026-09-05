---
source_url: https://driverjs.com/docs/installation
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: oss-libraries
stinger: product-tour-onboarding-ui-stinger
---

# Driver.js Official Documentation: Installation and Basic Usage

## Summary
Official installation and API reference for Driver.js. The library is installed via npm (`npm install driver.js`) and imported as a single ES module with a companion CSS file. The core API is minimal: create a `driver()` instance, configure it with steps and options, then call `.drive()` to start the tour. Driver.js supports both multi-step tours (via the `steps` array) and single-element highlighting (via `.highlight()`). The library is SSR-safe in the sense that it makes no DOM calls at import time; it only activates when `.drive()` or `.highlight()` is called. React integration requires managing the driver instance in a `useRef` to avoid re-initialization on re-renders, and calling `.drive()` inside a `useEffect` or user event handler.

## Key quotations / statistics

```javascript
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver();
driverObj.highlight({
  element: "#some-element",
  popover: {
    title: "Title",
    description: "Description"
  }
});
```

- CDN option available via `jsdelivr.net` for non-bundled environments.
- Multi-step tour configured via `steps` array on the `driver()` constructor options object.
- State persistence: Driver.js does not manage user completion state; teams must implement their own persistence (localStorage, DB) to avoid showing the tour on every page load.
- React key pattern from practitioner sources: use `useRef` for the driver instance; trigger `.drive()` from a `useEffect` gated on a "has seen tour" localStorage flag.

## Annotations for stinger-forge
- This is the canonical reference for the `guides/03-driver-js-shepherd-js.md` Driver.js section.
- The absence of built-in state persistence is a material gap stinger-forge must address: include a localStorage pattern and a database pattern (for cross-device persistence) in the guide.
- The `element` selector field accepts any valid CSS selector, including `[data-tour="step-name"]` attributes, which ties directly to the `data-tour` stable-anchor strategy in `guides/06-maintenance-and-drift.md`.
- SSR safety: Driver.js is safe to import server-side; only DOM operations happen client-side on invocation. No special Next.js wrapper required, unlike some other tour libraries.
