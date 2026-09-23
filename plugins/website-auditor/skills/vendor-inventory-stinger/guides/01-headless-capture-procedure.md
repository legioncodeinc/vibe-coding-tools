# 01. Headless-capture procedure

How to gather the evidence this Stinger classifies. Read this before touching the vendor lookup
table in `references/vendor-lookup-table.md`.

## Where this sits in the run

vendor-inventory-wasp-drone runs in wave W1b, immediately after `audit-intake-wasp-drone` has
scaffolded the `www.<domain>-audit/` workspace, in parallel with `stack-fingerprint-wasp-drone`
(wave W1a). Read `00-intake/` for the target URL and `_shared/target-profile.json` for render-mode
context before capturing anything, per this pair's shared-workspace contract; if
`target-profile.json` does not exist yet because `stack-fingerprint-wasp-drone` has not finished,
proceed with the capture anyway (the two Drones run in parallel by design) and note the render-mode
context as "not yet available" rather than blocking on it.

## Why a real JS-executed load, not a static fetch

PRD-004's central requirement: enumerate every third-party script, tag, pixel, and iframe present
after a real headless-browser load, including anything Google Tag Manager injects at runtime. A
static HTML fetch only sees a GTM container, not what it dispatches
[raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. Use whatever browser-automation tool your
harness exposes (e.g. a Chrome DevTools MCP tool, or a scripted Playwright/Puppeteer invocation via
Bash if the harness has no dedicated browser tool) to:

1. Navigate to the target URL with a real desktop-Chrome user agent.
2. Let the page fully load and settle (network idle, or a fixed reasonable wait if the tool has no
   idle signal).
3. Capture the full list of network requests made during the load, filtered to third-party origins
   (any origin that is not the audited domain or its own subdomains).
4. Capture the rendered DOM's `<script src>` list.
5. Capture the rendered HTML for the html-source-pattern channel (HTML comments, noscript iframes).

## Read-only, per plugin-wide conduct rules

This capture is passive. Do not submit forms, do not accept/reject a consent banner in a way that
changes what loads (some CMPs gate GTM behind consent; if a consent banner blocks a tag from firing,
record that as a finding, "GTM present but gated behind unaccepted consent," not as "GTM absent").
Any step that would create state on the target (order placement, form submission, auth bypass, file
upload) requires explicit per-run opt-in that defaults OFF, per PRD-004's own conduct-rules section
and `plan/website-auditor-build-plan.md` section 7 rule 1.

## Degraded mode

If your harness has no browser-automation tool available this session, fall back to a static HTML
fetch and run `shared/scripts/vendor-census.py --html-file` without `--network-log-file`. The script
labels this run `static-only` and attaches an explicit under-reporting caveat; carry that caveat
into `01-recon/vendor-inventory.md` rather than presenting a static-only census as complete. Flag
this to the user and recommend a re-run once a browser tool is available.
