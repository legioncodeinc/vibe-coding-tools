---
title: "Contacts API rejects multiple phone numbers that CSV accepts"
url: "https://www.reddit.com/r/gohighlevel/comments/1vfdmeg/api_additionalphones/"
fetched: "2026-09-04"
source_type: "community"
visible_age: "1mo"
window_role: "ranked-in-window"
clusters:
  - "api-integrations"
  - "crm-data"
repeat_group: "contacts-api-field-gaps"
normalized_issue_count: 1
---

## Captured signal

A comma-separated pair of phone numbers imported through CSV but the same value was rejected by the API.

## Normalized issue candidates

- The Contacts API does not accept multiple phone numbers in the same format supported by CSV import.

## Caution

Community report. Treat the reported behavior as a user observation until it is independently reproduced.

