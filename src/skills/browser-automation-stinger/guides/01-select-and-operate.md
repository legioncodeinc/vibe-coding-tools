# Select and operate browser automation

Playwright's installation flow offers TypeScript or JavaScript, a tests directory, an optional GitHub Actions workflow, and browser installation. Treat browser installation as a required environment dependency rather than an incidental local cache. [raw/playwright-installation.md]

Puppeteer's official introduction identifies it as a JavaScript library for browser automation and presents browser support as a first-class documentation topic. Do not silently substitute a Chromium binary or version without confirming the chosen Puppeteer package's documented support. [raw/puppeteer-overview.md]

Use this decision rule:

| Need | Default |
|---|---|
| E2E suite, UI mode, cross-browser execution, test fixtures | Playwright |
| Small browser-control script or an existing Puppeteer codebase | Puppeteer |
| Direct CDP domain command or Chromium build and debugging | Chrome Chromium Stinger |

For either tool, pin the test target and inputs, avoid arbitrary production mutations, and save diagnostics on failure. A passed automation job is evidence only for the browser, channel, data, and environment that actually ran.
