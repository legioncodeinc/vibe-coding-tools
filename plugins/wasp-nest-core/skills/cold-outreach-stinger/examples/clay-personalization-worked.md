# Example: Clay Personalization Workflow for Job-Change Trigger Campaign

**Scenario:** A founder selling a team onboarding platform targeting new VP of Sales hires (job changes in the last 60 days at SaaS companies with 50-300 employees).

**Guides used:** `guides/04-clay-personalization.md`, `guides/01-tool-decision-matrix.md`
**Template used:** `templates/clay-waterfall-formula.md`

**Research basis:** `research/external/2026-05-20-clay-claygent-personalization-anti-slop.md`, `research/external/2026-05-20-clay-signal-based-prospecting.md`

---

## Why this trigger

New VP Sales hires (within 90 days of start date) are 3x more likely to purchase new tools because:
- They want to put their stamp on the sales organization
- They are still evaluating the existing stack and open to changes
- They have fresh budget authority and a new boss to impress

**Trigger window:** 30-90 days from job start date. Before 30 days = too new, likely still learning. After 90 days = evaluation window closes.

---

## Clay table setup

### Input columns (from Apollo CSV)
- First Name, Last Name, Company, Job Title (VP of Sales), LinkedIn URL

### Enrichment columns added in Clay

**1. Email waterfall**
- Prospeo → Hunter → Apollo
- Filter: exclude catch-all domains
- Expected coverage: 72-80% of contacts

**2. Job change signal**
- Source: LinkedIn job change enrichment
- Column value: "Started as VP of Sales at {{Company}} [X weeks] ago"
- Filter: 30-90 days since start date only

**3. Previous company (optional)**
- Source: LinkedIn work history
- Column value: Previous employer name and role
- Use case: "Having been at [Previous Company] before, you've probably seen what good [category] looks like..."

**4. Claygent personalization opener**
- Prompt used:

```
You are writing a 1-sentence opener for a cold email to {{FirstName}} {{LastName}}, the new VP of Sales at {{Company}}.

Available context:
- LinkedIn summary: {{linkedin_summary}}
- Job change: Started as VP Sales at {{Company}} {{weeks_since_start}} weeks ago (came from {{previous_company}})
- Recent LinkedIn post (if any): {{recent_post}}

Task: Write a sentence (max 25 words) that acknowledges their new role in a way that shows you've done your research on them or their previous company — not just "congrats on the new role."

Rules:
1. Reference something specific: their previous company, a post they made, their background, or what {{Company}} is known for in their market.
2. Pass the 1-in-1000 test: this sentence must be FALSE for most other new VP Sales hires.
3. Do NOT write: "Congrats on your new role", "I noticed you recently joined", "I came across your profile", "I'd love to connect"
4. If you cannot find a specific insight, return exactly: SKIP
```

---

## Before/after comparison

### Before (generic opener — slop):

> "I noticed you recently joined Acme as VP of Sales. Congratulations on the new role! I wanted to reach out because we help sales leaders like yourself..."

**Why this fails:** "I noticed you recently joined" is the exact forbidden phrase. "Sales leaders like yourself" could apply to any VP Sales. Passes zero 1-in-1000 tests. Any prospect reading this knows immediately it is an automated blast.

### After (Claygent output — genuine):

> "Having scaled the SMB team at Zendesk to 40 reps, you've probably noticed the onboarding gap that slows down the first 90 days."

**Why this works:** References a specific, verifiable fact from their background. Implies you know what their previous scale looked like. The problem statement follows directly from their experience. Only a handful of new VP Sales hires would have this exact background.

### SKIP example:

For a prospect with no LinkedIn activity, no interesting previous company, and no job postings as context, Claygent returns:

> SKIP

This contact gets either:
- The non-personalized version of the sequence (problem-hypothesis opening, no custom line)
- Removed from this campaign if volume is low enough to maintain quality

---

## QA results for this campaign (sample of 20)

| Opener type | Count | % |
|---|---|---|
| Genuine (passes 1-in-1000) | 13 | 65% |
| SKIP (not enough context) | 6 | 30% |
| Generic slop (rejected, rerun or removed) | 1 | 5% |

Decision: acceptable. 65% genuine personalization with 30% SKIP (non-personalized fallback) is better than 100% slop.

---

## Performance vs template version

Same ICP, same sequence, two versions run simultaneously:
- **Claygent personalized:** 5.2% reply rate
- **Template (no personalization):** 2.8% reply rate
- **Lift:** 1.86x higher reply rate from genuine personalization

Consistent with `research/external/2026-05-20-clay-claygent-personalization-anti-slop.md` benchmark (1.5-2x lift).
