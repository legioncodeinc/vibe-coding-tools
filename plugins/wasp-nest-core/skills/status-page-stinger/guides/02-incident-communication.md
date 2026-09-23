# Guide 02: Incident Communication

*Source: `research/external/2026-05-20-incident-communication-templates.md`*

---

## The trust contract

A status page is a trust surface. Users who visit it during an incident are already stressed. What they want (in order) is:

1. Acknowledgment that something is wrong
2. What they should do (retry? wait? use a workaround?)
3. When they'll hear from you again
4. Evidence that someone is working on it

The biggest single driver of user trust loss during incidents is **radio silence**. The second biggest is **vague copy that doesn't answer #2 or #3**. Every template below is designed to address these four needs explicitly.

---

## The 5-minute acknowledge rule

When a P0/SEV0 or P1/SEV1 incident is declared, post an incident notice on the status page within **5 minutes** of declaration. The content of this initial post does not need to be complete: a short acknowledgment with a next-update commitment is more valuable than a thorough explanation that takes 20 minutes to write.

"We are aware of an issue affecting [service]. We are investigating. Next update in 15 minutes." This is better than silence for 20 minutes while the team drafts a perfect message.

**Source:** Runframe incident communication research (February 2026): identified as the single highest-impact practitioner norm for user trust preservation.

---

## Severity taxonomy and cadence

| Severity | Definition | Initial post SLA | Update cadence |
|---|---|---|---|
| SEV0 | Complete outage; all users affected | 5 minutes | Every 15 minutes |
| SEV1 | Major partial outage; significant user impact | 5 minutes | Every 30-60 minutes |
| SEV2 | Degraded performance; subset of users affected | 15 minutes | Every 60-120 minutes |
| SEV3 | Minor issue; minimal user impact | 30 minutes | Every 2-4 hours |

**The cadence commitment must appear in the initial post.** Do not commit to a cadence you cannot keep. If the team is under-resourced, commit to 60-minute updates rather than 15-minute ones; a missed update is worse than a slower cadence.

---

## The three templates

### Template 1: Initial notice (Investigating/Acknowledged)

```
**[INVESTIGATING] [Component name] - [One-line description]**

We are aware of an issue affecting [component/feature]. [One sentence on observed impact: what users cannot do right now.] 

Our team is actively investigating. We will provide the next update by [TIME] [TIMEZONE].

Affected components: [list]
```

**Rules for this template:**
- Use "Investigating" as the status, not "Resolved" or "Identified": you have not yet found the cause
- The impact sentence must be specific: "Users may be unable to load dashboards" beats "Some users may experience issues"
- Always include the next update time with timezone; UTC is preferred for international audiences
- Do not speculate on cause; write only observed impact

---

### Template 2: Live update (Identified/Monitoring)

```
**[IDENTIFIED] [Component name] - [One-line description]**

**Update [HH:MM UTC]:** [One to two sentences on what was found and what is being done.] 

[Optional: workaround] If you need to [do X], you can [workaround Y] as a temporary measure.

We expect to have more information by [TIME] [TIMEZONE]. Next update in [N] minutes.
```

**Rules for this template:**
- Change status to "Identified" once the root cause is known; leave at "Investigating" if still unknown
- Include the workaround sentence ONLY if there is an actual workaround that users can take: do not pad the update
- Keep the next-update commitment; repeat it even if it doesn't change
- Do not use passive voice: "a bug was found" → "we identified a memory leak in the payment service"

---

### Template 3: Resolution

```
**[RESOLVED] [Component name] - [One-line description]**

**Resolved [HH:MM UTC]:** This incident has been resolved. [One to two sentences on what was fixed.]

**Duration:** [X hours Y minutes]
**Root cause:** [Brief, jargon-free explanation]
**Preventative action:** [What will prevent recurrence, or "We are investigating preventative measures and will publish a post-mortem at [LINK] by [DATE]."]

We apologize for the disruption. Thank you for your patience.
```

**Rules for this template:**
- Duration is mandatory: it gives users context for the impact
- Root cause should be in plain language. "A database connection pool exhaustion caused by an unthrottled batch job" is appropriate. Internal code names, PR numbers, and team jargon are not.
- Preventative action must not be empty. If you don't know yet, commit to a post-mortem deadline.
- The post-mortem link should be the live URL that will be updated once the post-mortem is published

---

## Five golden rules

1. **Always name the next update time.** Include timezone. UTC is preferred.
2. **Never use passive voice or corporate hedge language.** "Users may experience some issues" is not acceptable. "Users cannot load dashboards" is.
3. **Include the workaround if one exists.** A workaround reduces customer support load by up to 40%.
4. **Separate what you know from what you're investigating.** "We've identified the cause and are deploying a fix" vs "We are still investigating: we do not yet know the root cause" are different states; say which one you're in.
5. **End every update with either a next-update time or a resolution.** Never end an update on an open-ended note.

*See `examples/live-incident-walkthrough.md` for a worked example applying all three templates through an SEV1 incident.*
