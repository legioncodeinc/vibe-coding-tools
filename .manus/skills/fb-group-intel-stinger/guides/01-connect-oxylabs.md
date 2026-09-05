# Guide 01: Connecting to Oxylabs Headless Browser

Grounded in `references/research/raw/oxylabs-headless-browser.md`. Read that first if anything here conflicts with it; the raw source wins.

## Endpoint and credentials

The Chrome endpoint is `wss://USERNAME:PASSWORD@ubc.oxylabs.io`. Credentials come from the environment: `OXY_UNBLOCKER_USERNAME` / `OXY_UNBLOCKER_PASSWORD` (preferred) or the legacy aliases `OXY_HB_USERNAME` / `OXY_HB_PASSWORD`. Never hardcode credentials into scripts; load them from env or a `.env` file that is gitignored.

## The persona URL for this project

For the John persona we always connect with the same parameter set so the session is stable:

```
wss://USER:PASS@ubc.oxylabs.io?p_cc=US&p_state=ohio&solve_captcha=true&o_profile=john&proxy_resi_ses_id=johnohio1&proxy_resi_ses_time=1440
```

The parameters do the following: `p_state=ohio` geolocates the exit IP to Ohio; `solve_captcha=true` leaves automatic CAPTCHA handling on (it is on by default, stated for clarity); `o_profile=john` restores John's saved cookies/localStorage (requires the persistent-profiles feature to be activated on the account); `proxy_resi_ses_id=johnohio1` pins the same residential exit IP across sessions so Facebook does not see the persona teleport.

If persistent profiles are not yet activated, drop `o_profile` and use `session_name=john-fb-run` instead, which keeps one live browser for up to 24 hours and lets you reconnect after disconnects.

## Python connection pattern

```python
import os
from playwright.sync_api import sync_playwright

user = os.environ["OXY_UNBLOCKER_USERNAME"]
pw = os.environ["OXY_UNBLOCKER_PASSWORD"]
url = (
    f"wss://{user}:{pw}@ubc.oxylabs.io"
    "?p_cc=US&p_state=ohio&solve_captcha=true"
    "&o_profile=john&proxy_resi_ses_id=johnohio1&proxy_resi_ses_time=1440"
)

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp(url, timeout=60_000)
    try:
        ctx = browser.contexts[0] if browser.contexts else browser.new_context()
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto("https://ip.oxylabs.io/location")
        print(page.inner_text("body"))  # verify Ohio exit IP
    finally:
        browser.close()
```

## Validation before touching Facebook

Always run one validation request first: load `https://ip.oxylabs.io/location` and confirm the exit IP reports an Ohio location. Then load `https://www.facebook.com/` and confirm the persona is logged in (page body contains the account name, not a login form). Only then proceed to extraction.

## Operational rules

Wrap `connect_over_cdp` in retry with exponential backoff (base 1s, up to 5 attempts) because the 10-new-sessions-per-second rate limit causes transient failures. Always close the browser in a `finally` block; leaked sessions count against the 100-concurrent-session cap. Abort image, stylesheet, media, and font requests with `page.route` to save bandwidth, except when the task is the image-download pass.
