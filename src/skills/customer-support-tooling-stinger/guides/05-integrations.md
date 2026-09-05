---
guide: 05-integrations
stinger: customer-support-tooling-stinger
research_sources:
  - research/external/2026-05-20-slack-linear-integration.md
  - research/external/2026-05-20-plain-docs-overview.md
  - research/external/2026-05-20-front-shared-inbox.md
---

# Integrations — Slack Sync, Linear Escalation, Notion KB Surfacing

Source: `research/external/2026-05-20-slack-linear-integration.md`

## Slack bi-directional sync

### Plain + Slack Connect (native — recommended)

Plain's Slack Connect inbox is bi-directional by design:
- Customer sends message in shared Slack channel → appears as Plain thread.
- Agent replies in Plain UI → message appears in customer's Slack channel.
- No middleware required. Configure in Plain Settings → Channels → Slack Connect.

### Intercom + Slack (notification only by default)

Intercom's native Slack integration fires notifications to a designated Slack channel when:
- New conversation created
- Conversation assigned
- SLA breach (if configured)

Full bi-directional sync requires Runbear middleware or a custom Intercom webhook → Slack Bolt app. See `research/external/2026-05-20-slack-linear-integration.md` for the Runbear pattern.

### Help Scout / Front + Slack

Both tools support Slack notifications (not bi-directional). Configure in Settings → Integrations → Slack.

## Linear escalation integration

### Plain + Linear (native — best)

1. In Plain: Settings → Integrations → Linear → connect workspace.
2. Select target Linear team and project for escalated threads.
3. On a Plain thread: click "Create Linear issue" button.
4. Linear issue is created with a link back to the Plain thread.
5. When the Linear issue is closed, Plain thread is auto-resolved.

This is the cleanest pattern. No middleware. No sync drift. Source: `research/external/2026-05-20-plain-docs-overview.md`.

### Intercom + Linear (via Zapier/Make)

1. Create a Zapier Zap: Trigger = `Intercom conversation tagged "needs-eng"`.
2. Action = `Linear: Create issue` in configured team.
3. Second action = `Intercom: Post internal note` with Linear issue URL.
4. **Limitation:** No auto-close sync — agent must manually resolve Intercom conversation when Linear issue closes.

### Pylon + Linear (native, basic)

Similar to Plain's integration but without auto-resolution on Linear issue close. Manually close Pylon thread after Linear issue resolution.

## Notion knowledge base surfacing

Notion can be surfaced as a knowledge base within support tools using these patterns:

### Pattern 1: Notion + Front (built-in integration)

Front has a Notion integration in its Marketplace. Agents can search Notion pages from within the conversation sidebar. Copy link or inline content into replies. Source: `research/external/2026-05-20-front-shared-inbox.md`.

### Pattern 2: Notion + Plain (via API/webhook)

Plain does not have a native Notion integration. Workaround:
1. Create a Notion database of help articles.
2. Use Notion's API to export articles as Plain Notes (Plain's knowledge base equivalent).
3. Set up a webhook: when Notion page is published → create or update Plain Note.

This is a custom integration requiring engineering time. For most teams, migrating Notion content to Plain's native Notes product is simpler.

### Pattern 3: Link surfacing in deflection flows

For AI deflection (Fin or rule-based bots), surfacing Notion links requires publishing the Notion page publicly (or via a custom domain). Add the Notion page URL to Fin's Help Center article as an external reference. Fin will surface the Help Center article and link the Notion page.

## Integration wiring checklist

Before going live with any integration:
- [ ] Test with a synthetic thread (not a real customer conversation).
- [ ] Verify bi-directional sync (reply appears in both systems).
- [ ] Confirm Linear issue auto-resolution triggers Plain/Pylon thread close.
- [ ] Confirm SLA breach alert fires in the correct Slack channel.
- [ ] Document the integration setup in `library/knowledge-base/support/integrations.md` for future team members.
