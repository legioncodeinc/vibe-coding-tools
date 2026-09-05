# Plan and prompt an AI Studio project

Use this guide after AI Studio has been selected as the correct product.

## 1. Confirm access before planning a build

Confirm the target sub-account, Labs enablement, and `View & Manage AI Studio` permission. If AI Studio is hidden or unavailable, resolve access with Guide 07 before writing a prompt. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/labs-overview.md]

## 2. Complete the project brief

Use [../references/ai-studio-project-brief.md]. At minimum, capture:

- Business, audience, offer, and primary conversion goal
- Required pages, sections, and interactive behavior
- Brand voice, colors, typography, and layout direction
- Approved logos, images, copy, and reference URLs
- Required form fields and existing calendar
- Domain, SEO, social preview, and approval owner
- Explicit exclusions and sensitive data that must not be collected

AI Studio can ask guided questions about color, typography, layout, and conversion goal, but a deliberate brief prevents hidden assumptions and unnecessary generations. [../references/research/raw/ai-studio-overview.md]

## 3. Choose a starting method

Start with one of the documented inputs:

- A detailed natural-language prompt
- A template
- A public URL for structure or style direction
- A screenshot or uploaded image
- Other supporting files or brand assets

Documented template families include landing pages, dashboards, ecommerce storefronts, and portfolios. URL and image references are inspiration, not a cloning guarantee. [../references/research/raw/ai-studio-overview.md]

## 4. Write a bounded first prompt

Use the build pattern in [../references/prompt-patterns.md]. Name the pages, goal, required behavior, brand direction, approved assets, form and calendar intent, and exclusions. Ask AI Studio to request only missing details that materially change the result.

Do not promise undocumented source export, external hosting, arbitrary server-side code, database provisioning, authentication, or secret storage. Search for newer official documentation if one of those capabilities is essential. [../references/research/raw/ai-studio-code-editor.md], [../references/research/raw/ai-studio-overview.md]

## 5. Build in reviewable increments

For a complex project:

1. Generate the structure and design direction.
2. Review routes, navigation, and shared layout.
3. Add approved copy and assets.
4. Add forms, booking surfaces, or interactive behavior.
5. Connect HighLevel forms and calendars only after their front ends are accepted.
6. Configure publishing and SEO after content and routes stabilize.

AI Studio can build multi-page projects, forms, booking experiences, CMS-style collections, and interactive front ends. The pricing examples also show that generated media and repeated refinements can materially affect usage, so incremental prompts improve reviewability and cost awareness. [../references/research/raw/ai-studio-pricing.md]

## 6. Preserve source and approval boundaries

- Use only approved or licensed assets.
- Treat reference sites as direction, not content to copy.
- Do not invent testimonials, credentials, guarantees, statistics, prices, or legal claims.
- Mark placeholders visibly.
- Require human review of factual, legal, compliance, and accessibility-sensitive content.

Current HighLevel guidance explicitly requires licensed assets and link and compliance review for AI-generated email work. AI Studio documentation does not claim generated output is automatically production-safe. [../references/research/raw/email-ai.md], [../references/research/raw/ai-studio-overview.md]

## 7. Define proof before editing

Decide which evidence will prove completion: device previews, route checks, build success, published URL, form contact record, workflow execution, calendar booking, social preview, sitemap, and domain redirect. Use [../references/publish-qa-checklist.md] as the acceptance checklist.

