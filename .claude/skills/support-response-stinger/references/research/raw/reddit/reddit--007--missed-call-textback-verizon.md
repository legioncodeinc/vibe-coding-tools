---
title: "Missed-call text-back fails with Verizon forwarding and voicemail"
url: "https://www.reddit.com/r/gohighlevel/comments/1viwz5u/client_not_wanting_to_switch_their_phone_number/"
fetched: "2026-09-04"
source_type: "community"
visible_age: "3d"
window_role: "ranked-in-window"
clusters:
  - "phone-voice-whatsapp"
  - "workflows-automation"
  - "a2p-sms-compliance"
repeat_group: "missed-call-routing"
normalized_issue_count: 2
---

## Captured signal

A Verizon business number forwarded to an A2P verified GHL number, but the mobile voicemail intercepted the call and the no-answer workflow never fired.

## Normalized issue candidates

- Missed-call text-back does not trigger when a forwarded carrier number reaches carrier voicemail.
- Call-forwarding status values may not match GHL workflow conditions.

## Caution

Community report. Any suggested workaround is unverified and must be checked against current provider documentation before reuse.

