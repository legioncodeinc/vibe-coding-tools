# 01. Fetch and collect signals

How to gather the raw evidence this Stinger classifies. Read this before touching the signature
table in `references/fingerprint-signature-table.md`.

## Where this sits in the run

stack-fingerprint-wasp-drone runs in wave W1a, immediately after `audit-intake-wasp-drone` has
scaffolded the `www.<domain>-audit/` workspace, in parallel with `vendor-inventory-wasp-drone`
(wave W1b). Read `00-intake/` for the target URL before doing anything else; do not ask the user for
it again.

## Step 1: the single-request channel

Fetch the landing page exactly once with a real desktop-Chrome user agent, per the research
archive's convention [raw/edgedns-dev-guides-domain-tech.md]. This single request carries three
independent evidence channels, per both raw sources' converging model
[raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md]
[raw/edgedns-dev-guides-domain-tech.md]:

1. **HTML body.** Vendor asset URLs, framework globals in inline scripts, well-known file paths,
   `<meta name="generator">` tags.
2. **HTTP response headers.** `Server`, `X-Powered-By`, `X-Generator`, CDN-specific headers.
3. **Cookies.** Session cookie names survive even behind a proxy that hides the real backend.

Use `shared/scripts/fingerprint.py --url <target>` to fetch and classify in one step, or fetch with
whatever HTTP tool your harness exposes and feed the results in via `--raw-html-file`,
`--headers-file`, `--cookies-file` if the sandbox does not permit outbound fetches directly from a
Bash-invoked script.

## Step 2: PRD-003's own non-goal boundary

Fetch only the landing page and its immediately linked static assets. Do not follow internal links,
do not paginate, do not crawl. That is `site-crawler-wasp-drone`'s job (wave W4), and it runs only
after this Drone has written `_shared/target-profile.json` for it to read.

## Step 3: the single headless-browser load

PRD-003 requires render-mode detection to come "from response body plus a single headless-browser
load, not from documentation claims." Use whatever browser-automation tool your harness exposes
(e.g. a Chrome DevTools MCP tool, or a scripted Playwright/Puppeteer invocation via Bash if the
harness has no dedicated browser tool) to load the same URL once, let it fully render, and capture
the resulting DOM as HTML. This is the one point in this Stinger's procedure where a browser
executes JavaScript; it exists only to answer the render-mode question, not to discover additional
stack signals (see `references/fingerprint-signature-table.md`'s "channels this table does not act
on yet" section for why).

Save the rendered HTML and pass it to `fingerprint.py --rendered-html-file` per
`guides/03-render-mode-detection.md`.

## Step 4: reachability failures

If the landing page does not respond, or responds with a bot-protection block, record
`reachable: false` in `target-profile.json` and stop. Do not retry into a block.
[raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] states this
plainly: "record `reachable: false` and move on rather than retrying into a block." A retry loop
against a bot-protection wall risks the audited site treating this Drone's traffic as an attack.
