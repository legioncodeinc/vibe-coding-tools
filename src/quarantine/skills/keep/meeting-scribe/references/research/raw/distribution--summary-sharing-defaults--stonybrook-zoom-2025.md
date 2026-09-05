# Sharing Zoom AI Companion meeting summaries

- **Title:** Sharing Zoom AI Companion Meeting Summaries
- **Publisher:** Stony Brook University, Division of Information Technology
- **URL:** https://it.stonybrook.edu/help/kb/sharing-zoom-ai-companion-meeting-summaries
- **Fetched:** 2026-08-17
- **Content reviewed:** 2025-05-13
- **Source type:** institutional IT documentation restating vendor product behavior. Close
  to official-docs for the product behavior it describes, with local policy layered on top.

## Default recipient

Quoted: "By default, the meeting host will get the initial email with a link to the meeting
summary once the meeting ends."

## The distribution options the host can set

- Only the meeting host
- Host, co-hosts, and alternative hosts
- Host and internal meeting invitees
- All meeting invitees, including external participants

The product ships a switch that broadcasts the generated summary to every invitee,
external parties included, with no editing step between generation and delivery.

## Local restriction

Quoted: "Only Stony Brook users with access to the Meeting Summary tool can access a
meeting summary you send them, so we currently *cannot* share these with external guests,
external email addresses, or Stony Brook users with Basic Zoom accounts."

That is a local licensing constraint at this institution, not a product-wide guarantee.

## Editing

The host can change the automatic sharing setting after the meeting via the AI Companion
settings panel. The documentation describes changing WHO receives the summary. It
describes no step for reviewing or editing WHAT the summary says before automatic delivery.

## Direct implication for the skill

This is the concrete shape of the auto-forward default that the MLT Aikins advisory warns
about. The all-invitees option exists, is one click, and delivers unreviewed generated text
to external parties. The skill's outbound artifact is the deliberate alternative: a
document written for a named audience, reviewed by the user, sent by the user.
