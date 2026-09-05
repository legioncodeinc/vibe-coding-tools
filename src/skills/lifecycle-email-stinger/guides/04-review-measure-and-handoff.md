# Guide 04: review, measure, and hand off

Use this guide after a hot or warm sequence is drafted.

## 1. Run content QA

Open `../references/qa-checklist.md` and complete all six gates:

1. Truth and evidence.
2. Sender and white-label voice.
3. Message usefulness.
4. Lifecycle behavior.
5. Compliance and deliverability.
6. Merge and rendering tests.

Return `HOLD` for any unresolved live-send blocker. Do not silently repair a missing fact by writing a plausible substitute.

## 2. Verify compliance boundaries

For covered United States commercial email, the FTC guide includes accurate routing and subjects, a postal address, a clear opt-out method, and timely opt-out handling. This is outside-window evergreen guidance and not legal advice. [../references/research/raw/outside-window-ftc-can-spam.md]

Google's current sender page requires authentication and adds alignment plus one-click unsubscribe duties for covered bulk marketing traffic. This is also outside-window evergreen guidance. [../references/research/raw/outside-window-google-email-sender-guidelines.md]

Do not declare the sequence compliant across jurisdictions. Record the owner who approved message class, permission basis, and launch readiness.

## 3. Build the platform handoff

This stinger does not configure a CRM or sending platform. Produce an implementation handoff with:

```text
Sequence name and version:
Entry state and verified trigger:
Audience and exclusions:
Step delays and approved send window:
Thread behavior:
Field mapping and safe fallbacks:
Reply owner:
Stop-on-reply behavior:
Other exit events:
Suppression and re-entry rules:
Reply-route test:
Link and opt-out test:
Plain-text and mobile test:
Reporting fields:
Launch approver:
```

HighLevel documents threaded steps, delays, conditions, stop-on-reply, and step-level reporting. Implementation belongs to `gohighlevel-stinger`, not this content skill. [../references/research/raw/2026-06-11-highlevel-email-sequences.md]

## 4. Define measurement before launch

Open `../references/measurement-framework.md`.

- Name one primary business outcome.
- Name opt-out, complaint, and bounce guardrails.
- Segment by entry state and trigger.
- Version every sequence and every material copy change.
- Set the evaluation date and sample rule with the responsible operator or analyst.
- Keep opens and clicks diagnostic.
- Label observational attribution honestly.

Belkins measures cumulative sequence contribution, while current community evidence cautions against treating raw engagement telemetry as verified human action. [../references/research/raw/2026-06-26-belkins-sales-follow-up-statistics.md] [../references/research/raw/2026-06-29-reddit-highlevel-bot-engagement.md]

## 5. Final output

```text
QA result: PASS | HOLD
Send readiness: READY | DRAFT_WITH_GAPS | HOLD
Approved sequence version:
Blocking items:
Platform handoff owner:
Primary outcome:
Guardrails:
Evaluation date:
Notes on evidence strength:
```

Customer-facing emails must remain fully white-label as `{agency}`. Research vendors, communities, and internal help sources belong only in internal provenance and never in the message body or footer.

