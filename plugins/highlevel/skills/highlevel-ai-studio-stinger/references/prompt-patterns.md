# AI Studio prompt patterns

These patterns are starting points. Replace brackets with verified project details and keep one major change per prompt when precise review matters.

## Build from a brief

```text
Create a responsive [site or experience] for [business] and [audience].
Its primary goal is [goal]. Build these routes: [routes].
Use [brand direction] and these supplied assets: [assets].
Include [required sections and interactions].
Do not include [exclusions].
Treat [URL or screenshot] as inspiration for [specific structure or style], not as an exact copy.
```

AI Studio supports prompts, templates, URLs, screenshots, images, and files as starting material. Current guidance treats reference recreation as inspiration rather than guaranteed cloning. [research/raw/ai-studio-overview.md]

## Focused structural revision

```text
On the [route] page, replace only the [section name] section.
Keep the navigation, footer, design tokens, form wiring, and every other route unchanged.
The new section must [requirements].
Summarize the files and behavior changed before I review the preview.
```

## Targeted Visual Edit prompt

```text
For the selected elements only, [specific change].
Preserve the current spacing rhythm, responsive behavior, and all unselected elements.
```

Use direct Visual Edit controls for deterministic copy, spacing, color, icon, and image changes. Direct controls do not use AI tokens, while sending a prompt invokes the model. [research/raw/ai-studio-visual-edits.md]

## Code Editor repair prompt

```text
The saved code produced this build error: [exact error].
Identify the smallest responsible file and explain the cause.
Fix only that cause, preserve unrelated behavior, and confirm the preview builds before proposing any refactor.
```

The Code Editor exposes build details and a `Try to fix` action. Saving creates a version and updates the preview, not the public site. [research/raw/ai-studio-code-editor.md]

## Form connection prompt

```text
Connect the [form name] form on [route] to this sub-account's CRM tracking.
Map these fields: [field mapping].
Do not change form copy or layout.
After connection, tell me what must be published and how to submit a live test entry.
```

A generated form is only a front-end layout until CRM tracking is connected. [research/raw/ai-studio-forms-calendars.md]

## Existing form trigger migration

```text
Re-trigger form integration.
```

Use this exact documented prompt only when an existing form should move from External Tracking to the dedicated `AI Studio Form Submitted` trigger. Reconnect, republish, and submit a fresh test entry afterward. [research/raw/ai-studio-form-trigger.md]

## Calendar connection prompt

```text
Connect the booking experience on [route] to the existing HighLevel calendar named [calendar].
Preserve its current availability, confirmations, reminders, and automations.
Do not create a different calendar.
```

AI Studio connects to an existing sub-account calendar, which remains the scheduling source of truth. [research/raw/ai-studio-forms-calendars.md]

## Social preview and sitemap workflow

Use the `Copy prompt` controls under `More > SEO & AI search` rather than inventing HighLevel's internal prompt. Paste the copied prompt into the project chat, review the generated changes, and republish. [research/raw/ai-studio-advanced-seo.md]

## Copy and content review prompt

```text
Review this page for factual accuracy, unsupported promises, missing calls to action, broken links, placeholder content, and inconsistent brand voice.
List findings before changing anything.
Do not rewrite approved legal, pricing, testimonial, or compliance text without explicit confirmation.
```

Generated content remains a draft. HighLevel's current Email AI guidance explicitly requires licensed assets, link checks, and compliance review, and the same release discipline is appropriate for AI Studio output. [research/raw/email-ai.md]
