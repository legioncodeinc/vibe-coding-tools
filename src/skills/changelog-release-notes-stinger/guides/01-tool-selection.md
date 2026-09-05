# Guide 01: Tool Selection

> Use when the team has no changelog tool, or when asked to compare options.

*Derived from: `research/external/headway-app.md`, `research/external/featurebase.md`, `research/external/productlane.md`, `research/external/beamer.md`, `research/external/keep-a-changelog.md`*

---

## The decision framework

Answer four questions in order:

1. **What is the team's primary issue tracker?** → If Linear: Productlane is the strongest ROI. If GitHub: plain markdown (CHANGELOG.md) or Headway. If Jira: FeatureBase or Beamer.
2. **Does the team need a feedback loop (feature voting, NPS)?** → Yes: FeatureBase or Beamer. No: Headway or Productlane.
3. **What is the budget?** → $0: Headway free tier or plain markdown. $30-50/mo: any of the four. More: Beamer Pro or Enterprise.
4. **Does the team need user segmentation** (show "Enterprise plan" features only to enterprise users)? → Yes: Beamer is the only option that handles this well.

---

## Platform comparison matrix

| Criterion | Headway | FeatureBase | Productlane | Beamer | Self-hosted markdown |
|---|---|---|---|---|---|
| **Free tier** | Yes (limited) | Yes (50 posts) | Yes (1 portal) | Yes (limited) | Always free |
| **Issue tracker integration** | None | Jira, Linear, GitHub | Linear native, GitHub | Zapier/Integrations | Manual or CI script |
| **Email digest** | Basic | Yes, automated | Yes | Yes, automated | Mailchimp/manual |
| **In-app widget** | Yes | Yes | Yes | Yes (most options) | DIY |
| **NPS / surveys** | No | No | No | Yes | No |
| **User segmentation** | No | Limited | No | Yes | No |
| **Custom domain** | Paid | Paid | Paid | Paid | Always (self-hosted) |
| **Analytics** | Basic (views) | Basic | Basic | Advanced | None built-in |
| **Setup complexity** | Low | Medium | Low (for Linear teams) | Medium-high | Low |
| **Best for** | Indie/small team | Feedback-loop teams | Linear-native teams | B2B SaaS with segments | Open-source / full control |

---

## Decision paths

### "We're a small team, just want something that works"
→ **Headway** (free tier). Embed the JS snippet, create entries in their editor. Takes 30 minutes to set up.

### "We already use Linear"
→ **Productlane**. Install the OAuth app, connect your workspace. Future Linear completions auto-draft entries.

### "We have an active community / feature voting board"
→ **FeatureBase**. One platform for feedback + roadmap + changelog + email digest.

### "We have enterprise customers and need to show different changes to different plan tiers"
→ **Beamer**. Requires passing user metadata (userId, plan) to the widget init.

### "We're open-source or want full control / no vendor lock-in"
→ **Keep a Changelog markdown** (`CHANGELOG.md` at repo root). Use `conventional-changelog` or `release-please` for automation. Widget/distribution is out of scope: GitHub Releases serves as the distribution channel.

---

## Recommended starting position

If the team is unsure, start with **Headway free tier + CHANGELOG.md in parallel**:
- Headway for user-facing announcements (the engagement channel).
- CHANGELOG.md for the canonical technical record (the audit trail).

This gives both audiences what they need without committing to a paid platform.

---

## Anti-patterns

- Choosing Beamer for a 3-person startup: overkill, requires user-metadata wiring from day one.
- Choosing Productlane without using Linear: no integration value; just an expensive Headway.
- Not choosing anything: the changelog lives in Notion or a Slack pinned message and users never see it.
