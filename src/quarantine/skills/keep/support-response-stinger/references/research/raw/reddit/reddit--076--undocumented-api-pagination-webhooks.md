---
title: "Undocumented API pagination and webhook timing lose records"
url: "https://www.reddit.com/r/gohighlevel/comments/1uzwdho/some_undocumented_gohighlevel_api_behavior_that/"
fetched: "2026-09-04"
source_type: "community"
visible_age: "20d"
window_role: "ranked-in-window"
clusters:
  - "api-integrations"
  - "tracking-reporting"
repeat_group: "api-reliability"
normalized_issue_count: 4
---

## Captured signal

Pagination changed from page to cursor during a large sync, webhooks arrived before records were readable, 429 limits were undisclosed, and low delivery success could suspend webhooks.

## Normalized issue candidates

- GHL API pagination can switch modes during a result set and silently drop records.
- Webhook events can arrive before the referenced record is readable through the API.
- API rate limits are difficult to discover before 429 responses occur.
- Poor webhook delivery success can lead to webhook suspension.

## Caution

Community report. Any suggested workaround is unverified and must be checked against current provider documentation before reuse.

