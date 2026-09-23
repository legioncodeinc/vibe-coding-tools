<!-- Copy-ready template for 01-recon/stack-fingerprint.md. Hydrate every <placeholder> from the
same run that produced _shared/target-profile.json; the two files must agree, this report is the
human-readable narrative of that JSON record, not a second source of truth. -->

# Stack fingerprint

**Target:** <target_url>
**Run date:** <ISO 8601 date>
**Fetch outcome:** <reachable | unreachable, if unreachable state the error and stop here>

## Classification

| Field | Value | Confidence |
|---|---|---|
| Stack | `<stack id, e.g. wordpress-php-mysql>` (<platform label>) | <high / medium / low> |
| Render mode | `<ssr / csr / hybrid / other / unknown-requires-headless-load>` | <high / medium / low> |

**Grounding:** <researched | judgment-call> - <one line: if judgment-call, name the gap explicitly,
e.g. "React+Vite has no dedicated signature in this Stinger's research archive; this classification
rests on common public Vite build-output conventions and is capped at low confidence.">

## Evidence

| Channel | Signal | Note |
|---|---|---|
| <html / header / cookie / meta_generator> | `<matched string>` | <where it appeared> |

## Render-mode reasoning

<One paragraph. State the raw-HTML-vs-rendered-HTML comparison that produced the render-mode call
(visible-text ratio, or "not yet run" if the headless load has not happened this session), and name
this as a judgment-call heuristic, not a researched methodology, per
references/research/distilled-stack-fingerprint.md section 2's honesty note.>

## Hosting/CDN hints (informational only)

- <e.g. "cf-ray header present: Cloudflare-fronted">

## Unknown-stack handling (only if stack is `unknown`)

Per PRD-003 AC-2, this site was NOT forced into the nearest known category. Raw signals collected:

- HTML length: <n>
- Header names seen: <list>
- Cookie names seen: <list>

## Blind spots acknowledged this run

- <Only the landing page and its directly linked static assets were fetched; tooling loaded only on
  inner pages (example from research: a checkout-only payment SDK) would not appear here.>
- <If the site returned a bot-protection block or otherwise did not respond, `reachable: false` was
  recorded rather than retrying into the block, per
  references/research/raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md.>

## Downstream handoff

`_shared/target-profile.json` written this run. `platform_guide` field points
site-crawler-wasp-drone (wave W4) at: `<platform_guide path, or "none, stack is unknown">`.
