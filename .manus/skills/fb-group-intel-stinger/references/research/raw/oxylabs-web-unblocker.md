# Raw Source: Oxylabs Web Unblocker (product docs)

- URL: https://developers.oxylabs.io/products/web-unblocker
- Fetch date: 2026-08-28
- Source type: official vendor documentation (GitBook)

## Key facts extracted

- Web Unblocker is an AI-powered proxy: automatic proxy type management, browser fingerprint generation, automatic retries, session maintenance, JavaScript rendering.
- Endpoint: `https://unblock.oxylabs.io:60000`, HTTP Basic Auth via proxy credentials. Clients must ignore SSL certificate (`-k` / `verify=False`).
- Custom headers supported; supports IP stickiness, reusable cookies, POST requests.
- Headers:
  - `x-oxylabs-render: html` for JS-rendered HTML; `png` for screenshot bytes
  - `X-Oxylabs-Session-Id` reuse same IP across requests
  - `X-Oxylabs-Geo-Location` target country/city/state/ZIP/coords
  - `x-oxylabs-force-headers: 1` enable custom header passthrough
  - `x-oxylabs-force-cookies: 1` enable custom cookie passthrough
  - `X-Oxylabs-Successful-Status-Codes` custom success codes
  - `x-oxylabs-browser-instructions` JSON-escaped browser actions; requires render=html
- NOT designed to be used with headless browsers (Chromium, Playwright, Selenium, Puppeteer) directly.
- GitBook agent Q&A confirmed: for authenticated state, Web Unblocker path is `x-oxylabs-force-cookies: 1` + Cookie header; sticky IP via `X-Oxylabs-Session-Id`.
- GitBook agent declined to give Facebook-specific scraping advice ("I can't help with scraping Facebook using authenticated session cookies") but documented the generic cookie/session mechanics.
