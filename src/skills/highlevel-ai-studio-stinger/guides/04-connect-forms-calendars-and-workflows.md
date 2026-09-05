# Connect forms, calendars, and workflows

Generated lead and booking interfaces are front-end drafts until their HighLevel connections are completed and tested.

## 1. Connect an AI Studio form

1. Finish and review the visible form layout and fields.
2. Ask AI Studio to connect the form to CRM tracking, or use the `Connect` action when shown.
3. Confirm the target sub-account and field mapping.
4. Publish the project.
5. Submit a real entry through the published URL.
6. Confirm the expected contact exists.
7. Confirm the submission appears under `Sites > Forms > Submissions > External Forms` where applicable.

A visible form alone does not collect into HighLevel. The connection step is explicit, and the connected CRM stores the resulting contact and submission data rather than the AI Studio project. [../references/research/raw/ai-studio-forms-calendars.md], [../references/research/raw/ai-studio-overview.md]

## 2. Configure the dedicated form workflow trigger

Before opening the workflow builder, confirm:

- AI Studio is enabled.
- The project contains the intended form.
- The form is connected to CRM tracking.
- The project is published.
- A fresh test entry has been submitted.

Then:

1. Open `Automation > Workflows`.
2. Create or open the workflow.
3. Add `AI Studio Form Submitted`.
4. Add only the filters needed: AI Studio Project, AI Studio Form, Page Path, or Domain.
5. Add the follow-up actions.
6. Publish the workflow.
7. Submit another live test and inspect execution evidence.

Selecting the project first narrows other filter values. With no filters, the trigger can accept submissions from all AI Studio projects in the account. [../references/research/raw/ai-studio-form-trigger.md]

## 3. Migrate an older connected form only when needed

Existing forms can continue on External Tracking. If the user wants the dedicated trigger:

1. Open the AI Studio project.
2. Prompt `Re-trigger form integration`.
3. Reconnect CRM tracking.
4. Republish the project.
5. Submit a fresh live entry.
6. Refresh the workflow builder.
7. Configure and test `AI Studio Form Submitted`.

Do not reconnect every existing form by default. The current documentation says External Tracking remains supported. [../references/research/raw/ai-studio-form-trigger.md]

## 4. Connect a calendar

1. Confirm the intended calendar already exists in the target sub-account.
2. Ask AI Studio to create or refine the booking experience.
3. Select the existing calendar when prompted.
4. Connect it.
5. Preview the experience.
6. Publish.
7. Book a real test slot.
8. Confirm the meeting, timezone, availability, reminders, and follow-up behavior.

The connected HighLevel calendar remains the source of availability, confirmations, reminders, meetings, and calendar automation. AI Studio supplies the front-end experience. [../references/research/raw/ai-studio-forms-calendars.md]

## 5. Protect data and consent

- Collect only fields required for the stated purpose.
- Review consent text, privacy links, and downstream use.
- Keep sensitive personal data out of screenshots and reports.
- Do not claim a connection works without a live test.
- Use a dedicated test identity and clean it up according to the user's data policy.
- Send implementation-level API or webhook work to `gohighlevel-stinger`.
- Send PII, consent, script, and security review to `security-stinger`.

## 6. Record proof

Record project, route, form or calendar, domain, publish time, test time, redacted contact or booking identifier, workflow execution result, and tester. Use the forms and calendars sections in [../references/publish-qa-checklist.md].

