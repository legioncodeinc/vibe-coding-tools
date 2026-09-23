# Example: Live SEV1 Incident Walkthrough

*Demonstrates: `guides/02-incident-communication.md`, `guides/04-post-incident-discipline.md`*

---

## Context

Acme API experiences an SEV1 incident: their REST API returns 500 errors for 40% of requests. The on-call engineer is paged at 14:23 UTC.

---

## 14:23 UTC: Alert fires, on-call paged

On-call is investigating. The monitoring shows elevated 500 error rate starting at 14:20 UTC.

---

## 14:28 UTC: Initial post (within 5 minutes of page)

**Status: Investigating**
**Incident name:** [INVESTIGATING] REST API - Elevated Error Rate

> We are investigating elevated error rates affecting REST API v2. Approximately 40% of API requests are returning 500 errors. Our engineering team is actively working to identify and resolve the cause.
>
> **Next update:** 15:00 UTC (in ~30 minutes)

*Subscriber notification fires. Email sent to all subscribers. Slack webhook fires.*

---

## 14:52 UTC: Root cause identified

On-call finds the cause: a bad configuration deploy at 14:18 UTC introduced an unhandled null pointer exception in the request validation layer.

---

## 14:58 UTC: Update post

**Status: Identified**
**Update [14:58 UTC]:**

> We have identified the root cause: a configuration change deployed at 14:18 UTC introduced an error in the request validation layer. We are rolling back the configuration change now. ETA for recovery: 15:10 UTC.
>
> **Workaround:** Requests with all required fields present are unaffected. If you are seeing consistent errors, ensure no null values are passed in required parameters.
>
> **Next update:** 15:10 UTC or sooner.

*Subscriber update notification fires.*

---

## 15:07 UTC: Rollback completes, monitoring returns green

Error rate drops to 0%. On-call confirms stability for 5 minutes.

---

## 15:12 UTC: Resolution post

**Status: Resolved**

> **Resolved [15:12 UTC]:** REST API error rate has returned to normal. The configuration rollback was completed at 15:07 UTC.
>
> **Duration:** 52 minutes (14:20 UTC to 15:12 UTC)
>
> **Root cause:** A configuration change deployed at 14:18 UTC introduced a null pointer exception in the request validation layer, causing ~40% of API requests to fail.
>
> **Preventative action:** We are adding configuration change validation to our deployment pipeline to prevent invalid configurations from reaching production. We will publish a post-mortem at https://acme.com/blog/incident-2026-05-20 by 2026-05-21 14:00 UTC.
>
> We apologize for the disruption. Thank you for your patience.

*Final subscriber notification fires. Incident closed.*

---

## 2026-05-21 12:00 UTC: Post-mortem published

Full technical post-mortem published at https://acme.com/blog/incident-2026-05-20.

The incident record on the status page is updated with the post-mortem link in the `postmortem_body` field (Statuspage) or linked document (Instatus/Better Stack).

---

## Communication audit

| Criterion | Result |
|---|---|
| 5-minute acknowledge rule honored? | Yes (14:28, 5 min after page) |
| Next-update time in every message? | Yes (all three posts) |
| Passive voice / hedge language? | None |
| Workaround included? | Yes (update post) |
| Duration in resolution? | Yes (52 minutes) |
| Root cause in plain language? | Yes |
| Post-mortem commitment + deadline? | Yes |
| Post-mortem published on time? | Yes (next day) |

This is the target communication pattern. See `guides/02-incident-communication.md` for the template set used.
