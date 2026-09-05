---
title: "WhatsApp attachments appear in GHL but are not delivered"
url: "https://www.reddit.com/r/gohighlevel/comments/1ubgwzj/problem_with_the_ghl_attachment_sending_endpoint/"
fetched: "2026-09-04"
source_type: "community"
visible_age: "2mo"
window_role: "ranked-in-window"
clusters:
  - "api-integrations"
  - "phone-voice-whatsapp"
repeat_group: "whatsapp-media-delivery"
normalized_issue_count: 2
---

## Captured signal

An attachment appears inside the GHL conversation after an n8n send, but WhatsApp receives no media. Public media URLs also produced an uploadedFiles null result.

## Normalized issue candidates

- Attachments logged in GHL Conversations are not delivered as WhatsApp media.
- The message attachment endpoint can return uploadedFiles null for otherwise public URLs.

## Caution

Community report. Any suggested workaround is unverified and must be checked against current provider documentation before reuse.

