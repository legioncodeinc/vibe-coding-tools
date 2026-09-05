---
title: "SMS cannot insert a different image for each assigned user"
url: "https://www.reddit.com/r/gohighlevel/comments/1v987un/sending_dynamic_images_through_sms/"
fetched: "2026-09-04"
source_type: "community"
visible_age: "22d"
window_role: "ranked-in-window"
clusters:
  - "a2p-sms-compliance"
  - "workflows-automation"
  - "crm-data"
repeat_group: "dynamic-messaging"
normalized_issue_count: 2
---

## Captured signal

Email signatures could display dynamic headshots, but SMS attachments were static. A custom-field workaround would send a URL unless used as media.

## Normalized issue candidates

- GHL SMS does not natively support dynamic image variables per assigned user.
- A custom-field image URL may appear as a link instead of an inline MMS image.

## Caution

Community report. Any suggested workaround is unverified and must be checked against current provider documentation before reuse.

