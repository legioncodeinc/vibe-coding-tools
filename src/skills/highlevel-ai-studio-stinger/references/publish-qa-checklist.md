# HighLevel AI creation publish QA checklist

Use the applicable sections before publishing an AI Studio project, standard Funnel or Website, WordPress AI page, blog, social post, or email template. Record evidence for every checked item. `Looks right in preview` is not complete verification.

## 1. Product and state

- [ ] The selected HighLevel product matches the intended output.
- [ ] The account, sub-account, Labs state, and user permissions are correct.
- [ ] The current artifact is the intended draft, route, version, and domain.
- [ ] A rollback version is available or bookmarked before a risky change.
- [ ] The spending limit and limit behavior are known.

AI Studio, Funnel & Website AI, and the WordPress AI-Powered Page Builder create different artifacts. Labs visibility and enablement can also differ. [research/raw/ai-studio-overview.md], [research/raw/funnel-website-ai.md], [research/raw/wordpress-ai-page-builder.md], [research/raw/labs-overview.md]

## 2. Content and brand

- [ ] Business facts, prices, statistics, testimonials, and legal claims have a human source.
- [ ] Placeholder copy and AI disclaimers have been removed or approved.
- [ ] Brand voice, names, capitalization, contact details, and calls to action are consistent.
- [ ] Images are owned, licensed, or approved for this use.
- [ ] Reference assets were used as direction, not copied beyond authorization.
- [ ] Links, phone numbers, email addresses, and buttons reach the intended targets.
- [ ] Email compliance content and social platform details are present where applicable.

HighLevel's Email AI guidance requires licensed assets, working links, and compliance review. AI Studio's current URL guidance treats sources as inspiration rather than exact copies. [research/raw/email-ai.md], [research/raw/ai-studio-overview.md]

## 3. Visual and accessibility review

- [ ] Desktop, tablet, and mobile views were reviewed.
- [ ] Navigation and every route were exercised.
- [ ] Headings have a logical order and only one clear page title where appropriate.
- [ ] Text contrast, focus visibility, labels, alt text, and keyboard operation were checked.
- [ ] No content clips, overlaps, or becomes unreachable at narrow widths.
- [ ] Loading, empty, success, validation, and error states were exercised where present.
- [ ] Motion does not hide content or block task completion.

AI Studio supplies device previews, route selection, Visual Edits, and image alt-text controls, but the sources do not promise automatic accessibility compliance. [research/raw/ai-studio-overview.md], [research/raw/ai-studio-visual-edits.md]

## 4. Forms and calendars

- [ ] Every visible form intended for production is connected to CRM tracking.
- [ ] A live submission was sent through the published page.
- [ ] The expected contact and submission appeared in the target sub-account.
- [ ] Required field mapping and consent text are correct.
- [ ] The intended workflow triggered exactly once and completed the expected actions.
- [ ] Workflow filters match the intended project, form, page path, and domain.
- [ ] Every booking surface is connected to the intended existing calendar.
- [ ] Availability, timezone, confirmations, reminders, and follow-up behavior were tested.

Forms and calendars begin as front-end experiences and require explicit connection. The dedicated form trigger needs a published project and a test submission before filters populate. [research/raw/ai-studio-forms-calendars.md], [research/raw/ai-studio-form-trigger.md]

## 5. Code and behavior

- [ ] The latest save built successfully.
- [ ] Build details contain no unresolved error.
- [ ] Manual code changes are limited to the intended files and behavior.
- [ ] Every interactive feature was tested in preview and on the published URL.
- [ ] No secret, private credential, or sensitive internal value appears in client-side files.
- [ ] Third-party scripts and dependencies have an explicit owner and review.
- [ ] The public site was republished after the final Code Editor save.

Code Editor save updates preview and creates a version. A later publish is required to update the public project. [research/raw/ai-studio-code-editor.md]

## 6. Domains and SEO

- [ ] The preview-domain build was published and tested first.
- [ ] Custom-domain DNS records were verified.
- [ ] The intended domain is primary and redirect behavior is correct.
- [ ] Title, description, favicon, social image, and per-page metadata are correct.
- [ ] Advanced SEO is enabled only after a custom domain is primary.
- [ ] The project was republished after enabling Advanced SEO or changing SEO output.
- [ ] Social previews were tested on a supported validator or platform.
- [ ] The sitemap exists, lists intended routes, and was submitted where required.
- [ ] Schema, if required, was reviewed as code because Advanced SEO does not add it automatically.

AI Studio requires a preview-domain publish before custom-domain connection. Advanced SEO requires a published project and primary custom domain and supports up to 150 routes. [research/raw/ai-studio-overview.md], [research/raw/ai-studio-advanced-seo.md]

## 7. Release evidence

- [ ] Record the sub-account, project, version, publish time, preview URL, primary URL, and tester.
- [ ] Record screenshots or exports of device views and success states when appropriate.
- [ ] Record the test contact or submission identifier without exposing sensitive data.
- [ ] Record workflow execution evidence and booking evidence.
- [ ] Record known limitations and deferred work.
- [ ] Confirm the live URL serves the intended final version after cache and DNS propagation.

