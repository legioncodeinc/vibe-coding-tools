# Worked example: AI Studio lead-capture site

## Request

> Build a HighLevel vibe-coded site for a neighborhood dental practice. It needs online booking, a new-patient form, and a custom domain.

## Product selection

Select AI Studio because the user asked for a HighLevel Vibe site that publishes from AI Studio. Confirm they do not need a standard `Sites > Websites` asset or a WordPress page. [../references/research/raw/ai-studio-form-trigger.md], [../references/research/raw/ai-studio-overview.md]

## Inputs to collect

- Practice name and location
- Approved services and claims
- Primary audience and conversion goal
- Required routes
- Brand voice, colors, fonts, logo, and licensed photos
- Exact form fields and consent text
- Existing calendar name
- Workflow actions after form submission
- Preview URL, custom domain, and primary domain choice
- Approval owner and spending-limit behavior

Use [../references/ai-studio-project-brief.md] to capture these inputs.

## Build sequence

1. Confirm AI Studio is enabled and the operator has `View & Manage AI Studio`.
2. Generate the route structure, shared navigation, footer, and design direction without connecting any form or calendar.
3. Review the approved copy, images, calls to action, routes, and device previews.
4. Add the new-patient form and booking section as front-end experiences.
5. Connect the form to CRM tracking and the booking section to the approved existing calendar.
6. Publish to the preview domain.
7. Submit a real test form and confirm the contact, submission, and workflow execution.
8. Book a real test slot and confirm the selected calendar, timezone, confirmations, and reminders.
9. Connect the custom domain, set the primary URL, and test redirects.
10. Configure Advanced SEO if required, republish, test social metadata, and verify the sitemap.

The connection, test, and publish order follows HighLevel's current form, calendar, workflow, domain, and SEO documentation. [../references/research/raw/ai-studio-forms-calendars.md], [../references/research/raw/ai-studio-form-trigger.md], [../references/research/raw/ai-studio-overview.md], [../references/research/raw/ai-studio-advanced-seo.md]

## Example first prompt

```text
Create a responsive multi-page website for [Practice Name], a dental practice serving [Audience] in [Location].

Primary goal: book a new-patient appointment.
Routes: Home, Services, About, New Patients, Contact.
Required sections: [approved list].
Brand direction: [approved voice, colors, typography, and layout].
Use only these supplied assets: [approved assets].
Add a front-end new-patient form with [approved fields] and a booking section for [calendar name], but do not claim either is connected until we complete the explicit HighLevel connection steps.
Do not add unapproved medical claims, testimonials, prices, insurance promises, stock logos, or third-party scripts.
Ask for missing information that materially changes the result before building.
```

## Required completion evidence

- Final route list and version
- Desktop, tablet, and mobile review
- Successful build after the final save
- Preview-domain URL and final primary URL
- Redacted form contact and submission evidence
- Workflow execution evidence
- Calendar booking evidence
- Social preview and sitemap evidence when enabled
- Known limitations and deferred items

Use [../references/publish-qa-checklist.md] for the full review.

