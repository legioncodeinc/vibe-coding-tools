# Schedule actions in Gemini Apps

- **URL:** https://support.google.com/gemini/answer/16316416?hl=en&co=GENIE.Platform%3DDesktop
- **Fetched:** 2026-08-17
- **Source type:** official-docs (Google Gemini Apps Help)
- **Why archived:** A second independent product data point on scheduled AI agents.
  Confirms the slot limit and auto-pause patterns seen in ChatGPT, and adds an explicit
  statement of which workloads a scheduled agent is unsuited for.

## What they are

Recurring automation where Gemini prepares content at a specified interval. The user sets a
delivery time and Gemini processes the content in the background beforehand.

## Active limit

Quoted: "You can have up to 10 active scheduled actions at a time."

## Creation

Enter the prompt in the normal text box and submit; Gemini confirms the scheduled action.
There is no separate authoring surface.

## Prompt guidance

The only guidance given: "In your prompt, provide details about when and how often you want
to schedule the action." Nothing about content, scope, output length, memory across runs,
or escalation. This is a documented gap in the vendor guidance, not a statement that those
things do not matter.

## Suited and unsuited workloads

Suited: recurring summaries such as daily digests, weekly rollups, and topic tracking.

Unsuited: rapidly changing data such as stock prices and cryptocurrency. The reason is
structural, given below.

## Auto-pause

Scheduled actions do not expire from disuse, but they pause automatically after inactivity.
Users resume them manually in Settings.

## Key limitation, stated

Responses are pre-prepared ahead of the delivery time to ensure timely delivery, so the
content may not reflect the most current information at the moment it is delivered. The
freshness of a scheduled report is bounded by when the work ran, not by when the report
arrived.
