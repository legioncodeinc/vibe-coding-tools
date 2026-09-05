---
title: "API-created SPA contacts have blank native attribution"
url: "https://www.reddit.com/r/gohighlevel/comments/1uz41u9/native_ghl_attribution_on_a_customcoded_site_the/"
fetched: "2026-09-04"
source_type: "community"
visible_age: "19d"
window_role: "ranked-in-window"
clusters:
  - "tracking-reporting"
  - "forms-sites-domains"
  - "api-integrations"
repeat_group: "custom-site-attribution"
normalized_issue_count: 2
---

## Captured signal

Custom UTM fields could be written, but GHL did not stamp native Attribution Source without a real form submit. The poster used a constrained iframe workaround.

## Normalized issue candidates

- Contacts created by API from a single-page app can have blank native Attribution Source.
- GHL external tracking may require a real native form navigation instead of a JavaScript submit.

## Caution

Community report. Any suggested workaround is unverified and must be checked against current provider documentation before reuse.

