# AI Studio project brief template

Gather this information before the first build prompt. Mark an item `not applicable` instead of silently guessing it.

## Project identity

- Project name:
- Business or organization:
- Industry or niche:
- One-sentence purpose:
- Primary audience:
- Primary conversion goal:
- Secondary conversion goal:

## Required experience

- Required pages or routes:
- Required sections on each page:
- Required interactive behavior:
- Required form fields:
- Existing HighLevel calendar to connect:
- Workflow follow-up required after form submission:
- CMS-style collections or repeated content:
- Required integrations that are explicitly documented in AI Studio:

## Content and brand

- Offer, services, or products:
- Proof points and approved claims:
- Primary call to action:
- Secondary call to action:
- Brand voice:
- Color palette:
- Typography direction:
- Layout direction:
- Accessibility requirements:
- Supplied logos, photos, screenshots, or reference URLs:
- Assets that AI may generate:
- Assets that must not be generated:

## Publishing and governance

- Target preview URL:
- Target custom domain:
- Primary domain form, apex or `www`:
- SEO title and description owner:
- Social preview image owner:
- Sitemap required:
- Advanced SEO required:
- Approval owner:
- Rollback point to bookmark before changes:
- Spending limit and behavior at the limit:

## Explicit exclusions

- Features not in this release:
- Pages not in this release:
- Unapproved claims:
- Third-party scripts not permitted:
- Sensitive data the form must not collect:
- Other constraints:

## First prompt pattern

```text
Build a [project type] for [business] serving [audience].

Goal: [primary conversion goal].
Pages or routes: [list].
Required sections: [list].
Required interactions: [list].
Brand direction: [voice, colors, typography, layout].
Use these supplied assets: [list].
Create placeholders only for: [list].
Add a front-end form with these fields: [list], but do not claim it is connected until we complete CRM tracking.
Add a booking section for this existing calendar: [calendar name], but wait for the explicit connection step.
Do not add: [exclusions].
Before building, ask only for missing information that materially changes the result.
```

The documented builder can ask guided questions when the brief is broad. More detail helps AI Studio shape a better first version, but it does not justify claiming undocumented backend, export, or hosting capabilities. [research/raw/ai-studio-overview.md], [research/raw/ai-studio-code-editor.md]
