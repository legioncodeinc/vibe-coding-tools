# Guide 01: Pipeline Stage Design

Source: `research/internal/command-brief-summary.md`, `research/external/2026-05-20-ats-platform-comparison.md`

---

## The canonical stage taxonomy

A well-designed pipeline maps each stage to a clear intent. The six-stage canonical taxonomy below works for most engineering roles:

| Stage | Intent | Typical owner |
|---|---|---|
| **Application / Sourced** | Candidate has entered the pipeline (applied organically or was sourced outbound) | ATS / sourcing tool |
| **Recruiter Screen** | 20-30 min phone/video; filters for baseline fit, compensation alignment, logistics | Recruiter |
| **Hiring Manager Screen** | 30-45 min; assesses motivation, role-level fit, team dynamics | Hiring manager |
| **Technical Screen / Take-Home** | Evaluates role-specific skills; live coding or take-home assessment | Technical panel or async |
| **On-site / Final Loop** | 3-5 structured interviews with scorecards; covers depth across domains | Full panel |
| **Offer / Background Check** | Offer extended; background check in progress; reference checks if required | Recruiter / TA ops |

---

## Anti-patterns

### Stage bloat
More than 7-8 stages signals process confusion. Every stage should have a clear decision point (pass/advance/reject). If two adjacent stages have the same decision owner and the same information goal, merge them.

### No SLA targets
Without time-to-advance SLAs per stage, pipelines stall and candidates ghost. Typical SLA targets:
- Recruiter screen to Hiring Manager screen: 3-5 business days
- Technical screen to On-site: 5-7 business days
- On-site to Offer: 2-3 business days

Document these in the ATS as stage-level reminders or workflow automations.

### Missing decline reasons
Every declined candidate should have a tagged decline reason (role fit, compensation, technical assessment, team dynamics, etc.). This data feeds D&I funnel analysis (who is being declined at which stage and why) and process improvement (high-decline-rate stages indicate upstream problems).

### No-decision limbo stages
Avoid stages named "In Progress" or "Pending" without a defined decision point. These become holding zones where candidates age out silently.

---

## Role-specific variations

**Internship / entry-level roles:**
- Remove Hiring Manager Screen; go directly from Recruiter Screen to a shorter technical screen.
- Limit take-home to 1-2 hours maximum.

**Staff / Principal engineering roles:**
- Add a "Leadership Panel" or "Cross-functional Interview" stage.
- May require a presentation or portfolio review stage.

**Go-to-market / Sales roles:**
- Often include a "Mock Pitch" or "Business Case" stage instead of a technical screen.

---

## Configuring stages in common ATS platforms

**Ashby:** Pipeline stages are configurable per job. Ashby supports stage-level SLA automation (reminders at X days without stage movement). Use Ashby's pipeline analytics to monitor time-in-stage across roles.

**Greenhouse:** Job stages are configured in the job setup. Greenhouse supports "stage-specific email templates" — automate candidate status communications at key stages to reduce recruiter overhead.

**Workable:** Pipeline stages are configurable per job. Workable's collaborative mode lets hiring managers see pipeline movement without requiring a full seat.

---

## Output

When a user asks to audit or design their pipeline stages, produce a stage table (like the canonical taxonomy above) with:
1. Stage name
2. Intent (one sentence)
3. Owner
4. SLA target
5. Decision criteria (advance / reject / hold)
6. Decline reason taxonomy for that stage

Flag anti-patterns (stage bloat, no SLAs, limbo stages) as findings in the audit report. Use `templates/ats-audit-report.md` (Pipeline Stages section).
