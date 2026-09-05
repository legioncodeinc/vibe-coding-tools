# Need help automating a workflow that starts from an inbound email

- URL: https://www.reddit.com/r/gohighlevel/comments/1w0z1x0/need_help_automating_a_workflow_that_starts_from/
- Fetched: 2026-09-04
- Source type: community
- Published at source: 2026-08-28
- Window role: recent workflow and inbox-routing issue

## Captured signal

The user wanted an inbound email with an owner, prospect, and copied team members to create or update the correct contact and trigger follow-up. The difficulty was reliably identifying the prospect from headers and preventing the automated response from reaching an internal participant.

The thread advised deterministic header parsing and an explicit internal-address exclusion list rather than asking an AI text extractor to infer envelope roles from the message body. The response catalog treats this as an architecture and identity-routing case that may require an integration specialist, not a normal workflow setting change.
