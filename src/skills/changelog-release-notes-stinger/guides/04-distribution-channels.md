# Guide 04: Distribution Channels

> Use after drafting an entry. Always produce a distribution checklist alongside the entry.

*Derived from: `research/external/changelog-copy-craft.md`*

---

## The distribution hierarchy

Not every release warrants every channel. Use this hierarchy:

```
Every release
  └── In-app widget badge update (always)
  
Minor / regular releases (2+ user-visible changes)
  └── In-app widget badge update
  └── Email digest (if subscribers exist; weekly or per-release depending on cadence)

Significant releases (major feature, breaking change, major milestone)
  └── In-app widget badge update
  └── Email digest (send immediately, not batched)
  └── Community post (Slack, Discord, Twitter/X, LinkedIn, where the audience lives)
  └── Blog post / dedicated announcement page (for milestone releases)

Breaking changes (API deprecations, behavior changes requiring user action)
  └── ALL of the above
  └── Direct email to affected users (not a digest: a targeted message)
  └── In-product banner or modal (not just the changelog widget)
```

---

## Channel-by-channel guidance

### In-app widget (always)

Every published entry automatically increments the unread badge count. Users who open the widget see the entry. This is the minimum viable distribution step: no team should skip it.

**Action:** Publish to your chosen platform (Headway / FeatureBase / Productlane / Beamer). The badge updates automatically.

### Email digest

Best for: Users who don't log in frequently but want to stay informed.

- **Weekly digest:** Best for teams shipping continuously (multiple releases/week). Batch entries into one "here's what shipped this week" email. Headway and FeatureBase support automatic weekly digests.
- **Per-release email:** Best for teams with planned releases (biweekly sprint). One email per entry. Use for significant releases even if you also send weekly digests.
- **Direct targeted email:** For breaking changes or migrations. Write as a personal email ("Hi [name], something changed that you need to know about..."), not a marketing blast.

### Community post (Slack / Discord / Twitter / LinkedIn)

Best for: Developer tools, B2B products with active communities.

Tailor the message per channel:
- **Slack/Discord (community server):** Short, conversational. "We just shipped [X]. Here's the changelog link: [URL]. Happy to answer questions in #general."
- **Twitter/X:** One-liner + screenshot/GIF + link. Lead with the user benefit. Max 280 characters; use a thread for more detail.
- **LinkedIn:** Slightly more formal. One paragraph (3-5 sentences) + link.

### Blog post

Best for: Major feature launches, milestone releases, or changes that require context/story.

The blog post is NOT the changelog entry. It is the narrative around the entry:
- Why you built this.
- Who asked for it.
- What you learned.
- What's coming next.

The changelog entry is the "what." The blog post is the "why." Both should link to each other.

---

## Cadence strategy

| Shipping frequency | Recommended cadence |
|---|---|
| Continuous deployment (many/day) | Weekly digest email, per-release widget; no per-release email |
| Sprint releases (biweekly) | Per-release widget + email; community post for significant items |
| Major releases only (monthly+) | Per-release widget + email + blog + community |

**Key rule:** Match your distribution cadence to your users' attention budget. If you email on every minor fix, users unsubscribe. If you only email on major releases, users forget the changelog exists.

---

## Distribution checklist template

Include this after every drafted entry:

```markdown
## Distribution checklist for [version/date]

- [ ] Published to changelog platform (Headway / FeatureBase / Productlane / Beamer / CHANGELOG.md)
- [ ] In-app widget badge updated (automatic on publish, but verify)
- [ ] Email digest queued or sent (if significant release or weekly digest day)
- [ ] Community post drafted for [Slack/Discord/Twitter] (if significant release)
- [ ] Blog post scheduled (if milestone release)
- [ ] Direct email sent to affected users (if breaking change)
- [ ] In-product banner added (if breaking change requiring user action)
```

Drop the unchecked items that don't apply. The checklist should be completed, not aspirational.
