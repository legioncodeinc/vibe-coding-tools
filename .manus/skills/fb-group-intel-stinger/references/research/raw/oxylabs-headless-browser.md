# Raw Source: Oxylabs Headless Browser (product docs)

- URL: https://developers.oxylabs.io/products/headless-browser
- Fetch date: 2026-08-28
- Source type: official vendor documentation (GitBook)

## Key facts extracted

- Headless Browser runs remote browser instances controllable over CDP (Chrome DevTools Protocol). Works with Playwright (Python/Node), Puppeteer, any CDP client.
- Connection: `wss://USERNAME:PASSWORD@ubc.oxylabs.io` (auth in URL userinfo; header auth NOT supported). US endpoint: `ubc-us.oxylabs.io`.
- Rate limits: 100 concurrent sessions, 10 new sessions per second.
- Features enabled via query parameters on the WSS URL, chained with `&`:
  - `p_cc` country (ISO 3166-1 alpha-2, e.g. US)
  - `p_state` lowercase state (e.g. `ohio`); overrides p_cc
  - `p_city` lowercase city, underscores for spaces
  - `p_device` desktop (default) or mobile fingerprints
  - `solve_captcha` automatic CAPTCHA solving, default true
  - `record` / `record_name` session video recording
  - `session_name` sticky session (reconnect to same live browser; max TTL 24h; pattern ^[A-Za-z0-9-]{3,36}$)
  - `keep_alive` default true; false closes remote browser on disconnect
  - `o_profile` persistent profile name (cookies + localStorage saved/restored; 14 days from last use; pattern ^[A-Za-z0-9_-]{1,36}$) - REQUIRES ACCOUNT ACTIVATION via support
  - `o_profile_save` force mid-session profile save, default true
  - `proxy_resi_ses_id` pin residential exit IP across sessions (pattern ^[A-Za-z0-9]{3,36}$)
  - `proxy_resi_ses_time` minutes to hold pinned IP, 1-1440
- Example: `wss://USER:PASS@ubc.oxylabs.io?p_cc=US&solve_captcha=true&o_vnc=true`
- Python quick start uses `p.chromium.connect_over_cdp(browser_url)`.
- Bandwidth optimization: abort image/stylesheet/media/font requests via page.route interception.
- Retry connect with exponential backoff; cap each attempt with timeout; always browser.close() in finally to avoid leaking sessions against the 100-concurrent cap.
- Persistent profiles restricted by default; contact Oxylabs support or account manager. Profile count capped by `max_profiles`; exceeding returns `CDP_LIMIT_REACHED: profile limit reached`.
- For strict bot monitoring: pair profile with pinned residential exit IP, else cookies may be invalidated when IP changes (blank pages / security verification screens).
- Session inspection via VNC: dashboard.headlesify.io, vnc.headlesify.io (live monitoring and manual takeover).
