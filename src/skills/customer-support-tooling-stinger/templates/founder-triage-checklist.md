# Founder Support Triage Checklist

**Team size:** {{1-3 people}}
**Tool:** {{Plain Starter / Help Scout Free / other}}
**Last updated:** {{YYYY-MM-DD}}

---

## Daily triage (twice daily, 20 min each)

**Morning (9am):**
- [ ] Open inbox. Flag any P1 (customer down) threads for immediate action.
- [ ] Assign reason code tag to all untagged threads from yesterday.
- [ ] Reply to P1 and P2 threads first.
- [ ] Process P3 threads if time allows.

**Afternoon (3pm):**
- [ ] Check for new P1/P2 threads since morning.
- [ ] Reply to any threads from morning triage that needed investigation time.
- [ ] Close resolved threads.

---

## Triage decision guide

| Situation | Action | Time target |
|---|---|---|
| Customer can't log in / data missing | Tag `p1`, create Linear issue, reply in 30 min | 30 min |
| Feature is broken, no workaround | Tag `p2`, create Linear issue, reply same day | 2 hours |
| Feature request | Tag `feature-request`, acknowledge, add to tracker | 1 business day |
| How-to question | Tag `how-to`, answer + write help article | 1 business day |
| Billing / payment issue | Tag `billing`, resolve or escalate | 4 hours |
| GDPR deletion request | Tag `gdpr`, escalate to security-worker-bee IMMEDIATELY | 30 min |

---

## Saved reply shortcuts

**Bug acknowledgment:** (copy and adapt)
> "Thanks for flagging this — I've reproduced it and opened a bug internally. I'll keep this thread updated. Expected timeline: [X]."

**Feature request:**
> "Really appreciate this suggestion — adding to our roadmap. I'll reach out when it ships."

**How-to (with article link):**
> "[Direct answer]. I've documented this at [link] so the next person who asks gets it instantly."

**P1 acknowledgment:**
> "I see you're experiencing [issue]. I've escalated this internally and we're working on it right now. I'll update you every 30 minutes until resolved."

---

## Weekly tasks

- [ ] Review reason-code distribution (bug / feature-request / how-to breakdown).
- [ ] Write 1 new help article from last week's most-asked `how-to` thread.
- [ ] Review CSAT scores if configured.
- [ ] Check Linear for any `waiting-on-eng` threads with closed Linear issues — resolve them.

---

## First support hire handoff checklist

When ready to hand off:

- [ ] Inbox moved to shared tool (not founder's personal email)
- [ ] >= 30 help articles published
- [ ] Saved replies for top 10 question types configured
- [ ] SLA policy documented (use `templates/support-audit-report.md`)
- [ ] Linear escalation integration configured and tested
- [ ] Tag taxonomy documented and shared with new hire
- [ ] One week of shadowing scheduled

---

*Source: `ai-tools/skills/customer-support-tooling-stinger/guides/06-founder-as-support.md`*
