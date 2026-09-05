# Template: Incident Resolution

*Status: Resolved*
*Triggers subscriber notification: YES (final notification)*

---

**Resolved [HH:MM UTC]:** This incident has been resolved. [One to two sentences on what was fixed and confirmed stable.]

**Duration:** [X hours Y minutes] ([START TIME] UTC to [END TIME] UTC)
**Root cause:** [Plain-language explanation of what caused the incident. No jargon, no internal service names unless they are customer-visible.]
**Preventative action:** [What specific action will prevent this recurrence. OR: "We are investigating preventative measures and will publish a post-mortem at [URL] by [DATE] UTC."]

We apologize for the disruption. Thank you for your patience.

---

<!-- Fill-in guide:
- [HH:MM UTC]: Time the incident was confirmed resolved (monitoring green + manual verification)
- [One to two sentences]: "Service has returned to normal. All components are operational."
- [Duration]: Calculate from when the incident STARTED (first user impact) to when it was resolved, not from when you created the incident post. Round to nearest minute.
- [Root cause]: Must be present. Acceptable: "A misconfigured load balancer rule caused 40% of requests to route to a degraded server." Not acceptable: "An infrastructure issue."
- [Preventative action]: Commit to something specific OR commit to a post-mortem URL + deadline. Never leave this blank.
  - If post-mortem: "We will publish a post-mortem at [your-blog/status-page-url] by [DATE]."
  - If immediate fix: "We have deployed [X] to prevent this class of issue. We will monitor for 24 hours."

Do NOT:
- Skip the root cause field
- Leave preventative action as "we are committed to reliability" (this says nothing)
- Post the resolution before the service is confirmed stable for at least 5-10 minutes
-->
