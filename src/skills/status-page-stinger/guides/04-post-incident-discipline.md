# Guide 04: Post-Incident Discipline

*Source: `research/external/2026-05-20-post-incident-discipline.md`*

---

## Why post-incident discipline matters

Incidents end when services recover. The trust deficit from an incident ends only when three things happen: the resolution is clearly communicated, a post-mortem explains what happened, and evidence of prevention is visible. Teams that skip the post-incident cycle lose more trust from the absence of a post-mortem than from the incident itself.

---

## Resolution communication

When the incident is resolved, update the status page within **5 minutes** of confirming stability. Use the resolution template in `templates/incident-resolved.md`.

**Required fields in the resolution update:**
1. Duration (time from incident creation to resolution)
2. One-sentence plain-language root cause
3. Preventative action commitment (or post-mortem deadline)
4. Subscriber notification (the resolution triggers a final notification push)

If the post-mortem is not yet written, include: "We will publish a post-mortem at [URL] by [DATE]." This pre-commits you to delivery and signals accountability.

---

## Post-mortem publication norms

### When to publish

| Severity | Post-mortem publication deadline |
|---|---|
| SEV0 (complete outage) | Within 24 hours of resolution |
| SEV1 (major partial outage) | Within 48-72 hours of resolution |
| SEV2 (degraded performance) | Within 1 week, if root cause is non-obvious |
| SEV3 (minor) | Optional; internal only is acceptable |

### Who can see the post-mortem

**Default recommendation by audience:**
- **B2B SaaS** → Public post-mortem linked from the status page. Enterprise customers expect transparency; a public post-mortem is a competitive differentiator and reduces churn-risk follow-up calls.
- **Consumer product** → Summary post-mortem on status page, detailed technical post-mortem internal. Consumer audiences care about "what happened and is it fixed?" more than technical depth.
- **Regulated industry (finance, healthcare)** → Internal post-mortem, brief public summary on status page that does not disclose security vulnerability details. Legal review before publishing.
- **Security-related incident** → Internal post-mortem only until CVE/vulnerability is fully remediated and a responsible disclosure timeline has been honored. Link to the public advisory once it is published.

### How to cross-link the post-mortem

On Atlassian Statuspage, the incident record has a `postmortem_body` field (API) and a dedicated post-mortem section in the UI. Populate this field with the post-mortem URL or the full text once published.

On Better Stack and Instatus, the post-mortem is a linked external URL or an attached document on the incident record. Set this link when the post-mortem is ready.

Update the incident record's post-mortem link BEFORE the post-mortem deadline passes. If the post-mortem deadline passes without an update, the status page record shows a broken commitment.

---

## Maintenance window announcements

Maintenance windows (scheduled downtime, major releases, database migrations) require a distinct announcement cadence.

### Announcement cadence

| Timing | Channel |
|---|---|
| 7 days before | Status page maintenance incident, email to subscribers |
| 24 hours before | Reminder notification to subscribers |
| 1 hour before | Final reminder + preparation instructions if applicable |
| At start | Status change to "Under Maintenance" |
| At completion | Resolution notice |

**Do not surprise subscribers with a maintenance window.** Teams that skip the 7-day notice and announce only 1 hour before receive disproportionately higher support ticket volume and negative social mentions.

### Maintenance window template

See `templates/maintenance-window.md` for the ready-to-use template.

**Window sizing rule:** Announce a maintenance window that is 50-100% longer than your expected completion time. If the migration takes 1 hour, announce a 1.5-2 hour window. Completing early is a positive surprise; extending beyond the announced window is a trust-damaging negative surprise.

---

## Trust recovery checklist after a major incident

For SEV0 incidents, complete these steps within 72 hours:

- [ ] Resolution notice posted with duration, root cause, and preventative action
- [ ] Post-mortem drafted or deadline committed and visible on status page
- [ ] Post-mortem cross-link populated on the incident record
- [ ] Account team or customer success notified (for enterprise customers)
- [ ] Support team briefed with approved language for inbound questions
- [ ] Engineering action items created from the post-mortem
- [ ] First preventative action (the easiest one) completed within 2 weeks to show momentum

*See `examples/live-incident-walkthrough.md` for a worked example of the full post-incident workflow.*
