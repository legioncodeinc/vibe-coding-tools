---
url: https://linear.app/docs/slack
title: "Slack – Linear Docs (official)"
source_type: official-docs
authority: official
relevance: high
fetched: 2026-05-20
topic: slack-linear-integration
---

# Linear + Slack Integration: Official Documentation

## Summary

Linear's official documentation for the Slack integration. This is the authoritative source for the bi-directional sync capability that the Angel's `05-integrations.md` guide will specify.

**Core capabilities:**

1. **Create Linear issues from Slack messages** -- via message overflow menu, `@Linear` mention, or `/linear` slash command
2. **Synced threads** -- bidirectional: replies in Slack thread sync to Linear issue comments; comments in Linear sync back to Slack thread. Synced thread is also updated when the issue is completed or cancelled.
3. **Link existing issue** -- associate a Slack message to an existing Linear issue without creating a new one
4. **Rich unfurls** -- Linear issue/project/document links expand in Slack with key properties and quick action buttons
5. **Personal notifications** -- Linear Inbox notifications can forward to personal Slack DMs
6. **Team/project notifications** -- channel-level notifications for team/project updates

**Synced thread details:**

- Create a synced thread by creating an issue from Slack via the "More actions" overflow menu
- Synced comment thread is created in the Linear issue by default
- Both threads update bidirectionally as replies are sent in either location
- Slack thread is updated when issue is completed, cancelled, or reopened
- Useful for keeping non-Linear users (customer-facing staff, stakeholders) informed

**Limitations noted in official docs:**

- Synced threads are not available in DMs
- Private channels require `/invite @Linear` first
- Only users with Linear accounts can create issues from Slack (Slack Guests cannot)
- API support for linking Slack threads: `syncToCommentThread: true` in `attachmentLinkSlack` mutation

**Linear Asks (referenced in docs):**

- Separate integration for helpdesk-style workflows
- Available on Business and Enterprise plans
- Anyone in Slack (even without a Linear account) can create issues via Linear Asks
- Custom email address routing (e.g., `helpdesk@acme.com`) also available

**Enterprise multi-workspace:**

- Enterprise plan supports connecting multiple Slack workspaces to Linear
- Compatible with Slack Enterprise Grid

## Key takeaways

- Linear's native Slack integration supports bidirectional thread sync -- the core escalation pattern for a support tool integration
- The `attachmentLinkSlack` API mutation with `syncToCommentThread: true` is the programmatic path for connecting support tool escalations to Linear
- Linear Asks (Business/Enterprise) enables non-engineers to submit support-style requests without Linear accounts
- The integration is sufficient for a lean team; third-party tools like ClearFeed, Unthread, or Runbear add AI classification, SLA tracking, and de-duplication on top
