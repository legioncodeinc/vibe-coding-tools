---
title: "Email statistics report incorrect delivery and unsubscribe states"
url: "https://www.reddit.com/r/gohighlevel/comments/1v9eh0u/has_anyone_figured_out_how_to_get_accurate/"
fetched: "2026-09-04"
source_type: "community"
visible_age: "1mo"
window_role: "ranked-in-window"
clusters:
  - "tracking-reporting"
  - "email-deliverability"
repeat_group: "email-reporting"
normalized_issue_count: 3
---

## Captured signal

Sent messages were not counted as delivered, the sender's own address appeared unsubscribed, and expected sends showed no delivery attempt.

## Normalized issue candidates

- GHL email reporting can omit messages that were actually delivered.
- The unsubscribe report can mark the wrong address.
- Expected recipients may show no recorded send attempt.

## Caution

Community report. Treat the reported behavior as a user observation until it is independently reproduced.

