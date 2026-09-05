---
title: "The GHL MCP server cannot read most configuration objects"
url: "https://www.reddit.com/r/gohighlevel/comments/1vb5oej/ghl_mcp_server_has_no_read_access_to_workflows/"
fetched: "2026-09-04"
source_type: "community"
visible_age: "15d"
window_role: "ranked-in-window"
clusters:
  - "api-integrations"
  - "ai-conversation"
  - "crm-data"
repeat_group: "mcp-capability-gaps"
normalized_issue_count: 3
---

## Captured signal

The MCP surface exposed records but not workflows, forms, surveys, calendars, products, tags, users, funnels, media, and other configuration. Calendar events required IDs that MCP could not discover.

## Normalized issue candidates

- The GHL MCP server cannot list most configuration objects.
- MCP calendar tools require calendar, user, or group IDs that no MCP tool returns.
- MCP lacks field projection and may require retrieving excessive contact or transaction data.

## Caution

Community report. Any suggested workaround is unverified and must be checked against current provider documentation before reuse.

