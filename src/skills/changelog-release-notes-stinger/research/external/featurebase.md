---
source: external
type: tool-profile
authority: high
relevance: high
topic: changelog-tooling-saas
url: https://featurebase.app
---

# Source: FeatureBase

**URL:** https://featurebase.app  
**Category:** Feedback + changelog + roadmap platform  
**Why it matters:** One of the most complete "customer communication" platforms; changelog is one component of a broader feedback loop including feature voting and roadmap.

## Feature set (as of 2026)

- **Public changelog page**: dedicated hosted page with search, labels, category filters.
- **In-app widget**: embeddable popup with unread count.
- **Email digest**: automated weekly or per-entry email to subscribers.
- **Feedback portal**: feature voting, bug reports, NPS.
- **Roadmap**: public/private roadmap tied to the feature vote backlog.
- **Integrations**: Slack, Jira, Linear, Intercom, Segment.
- **Custom domain**: available on all paid plans.
- **SSO/private portals**: control who sees what.

## Pricing (2026 approx.)

- **Free tier**: up to 50 feedback posts, 1 changelog, basic widget.
- **Startup ~$49/mo**: unlimited posts, email digests, custom domain.
- **Growth/Enterprise**: SSO, API access, priority support.

## Integration pattern

```javascript
// React / Next.js example
import { FeaturebaseWidget } from '@featurebase/react';

<FeaturebaseWidget
  organization="yourorg"
  placement="right"
  theme="light"
/>
```

## Strengths

- Ties changelog to the feedback loop: close a feature vote → auto-post a changelog entry.
- Email subscriber management built-in.
- Clean public portal UX.

## Weaknesses

- Heavier than Headway for teams that just want a widget; onboarding the full feedback portal may be overkill.
- Free tier limited to 50 feedback posts.

## Applicability

- `guides/01-tool-selection.md`: best for: teams with active user feedback programs who want changelog + roadmap + NPS in one place.
- `guides/02-tool-setup.md`: React widget snippet above.
