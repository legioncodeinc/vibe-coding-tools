# Clay AI Personalization

Clay is an enrichment and personalization platform that connects 150+ data sources to AI workflows, enabling 500+ contacts/hour of personalized outreach at $0.02-0.05 per contact. It is the state-of-the-art tool for scaling genuine personalization beyond what a human researcher can produce manually.

**Research grounding:** `research/external/2026-05-20-clay-ai-personalization-workflow.md`, `research/external/2026-05-20-clay-claygent-personalization-anti-slop.md`, `research/external/2026-05-20-clay-signal-based-prospecting.md`

---

## When to use Clay

Use Clay when:
- Volume is 100-500 contacts/month (high enough to need automation, low enough that quality matters)
- ACV is $10K+ (personalization ROI justifies Clay cost)
- You want to run signal-based campaigns (job change, funding, tech stack change)
- You need waterfall email verification (70-85% coverage vs 40-60% for single-source)

Skip Clay when:
- Volume exceeds 2,000/month and budget cannot scale with contact count
- No one on the team has capacity to set up and maintain Clay workflows
- ICP is too broad for signal-based targeting to be meaningful

---

## The Clay workflow

### Step 1: Build the table
Import your prospect list (from Apollo CSV or LinkedIn export) into a Clay table. Each row is one prospect.

### Step 2: Email waterfall enrichment
Clay's waterfall enrichment finds work emails through multiple providers in sequence, stopping when verified:

```
Prospeo (source 1)
→ Hunter (source 2, fallback)
→ Apollo (source 3, fallback)
→ MX validation (final check)
```

Coverage: 70-85% of contacts will have a verified email found. Better than any single-source approach (40-60%).

> TODO: Verify current Clay waterfall provider options at docs.clay.com. The specific providers listed above were current as of May 2026 per `research/external/2026-05-20-clay-ai-personalization-workflow.md`, but Clay adds and removes providers. Always check the current Clay integrations page.

### Step 3: Signal enrichment (optional but high-value)
For signal-based campaigns, add enrichment columns for:
- **Job change signal:** LinkedIn recent activity or job change data provider. VP-level job changes = 3x higher buy probability within 90 days of starting new role. (Research: `research/external/2026-05-20-clay-signal-based-prospecting.md`)
- **Funding event:** Crunchbase or PitchBook integration. New funding = budget available + need to scale.
- **Tech stack:** BuiltWith or Clearbit. Know what they already use to position your product relative to their existing stack.
- **Job postings:** LinkedIn job scrape. Companies hiring for a role you help with = active pain point.

### Step 4: Claygent personalization (the anti-slop engine)
Claygent is Clay's AI agent for generating personalization based on enrichment data.

**The SKIP rule is mandatory.** Your Claygent prompt must include an explicit instruction to return "SKIP" if no specific insight is available. Never generate a generic fallback line.

```
Prompt template (customize for your ICP):

Based on the following information about {{FirstName}} {{LastName}} at {{Company}}:
- LinkedIn summary: {{linkedin_summary}}
- Recent post or quote (if available): {{recent_post}}
- Job title: {{Title}}
- Company: {{Company}}

Write a 1-sentence opener (maximum 25 words) that references a SPECIFIC thing they have done, written, or built. Do NOT write a generic sentence that could apply to anyone. Do NOT use phrases like "I noticed", "impressive", "exciting", "I came across", or "I'd love to".

If you cannot find a specific, genuine insight, return exactly: SKIP
```

**Forbidden phrases (reject any output containing these):**
- "I noticed you..."
- "I came across your profile..."
- "I was impressed by..."
- "Your work on X is exciting..."
- "I'd love to connect..."
- Any generic industry statement ("as a [title], you probably...")

### Step 5: QA before launching
Before sending any campaign built with Claygent:
1. Sample 20 rows randomly
2. Read each opener aloud
3. Apply the 1-in-1000 test: would this be true for most people on the list?
4. Count "SKIP" results: if >40% are SKIP, the enrichment data is too thin for this campaign. Consider adding a signal step or running a non-personalized version.
5. Review the 5-10% of openers Claygent generates for any specific prospect — read them as if you were that prospect

---

## Cost benchmarks

| Method | Cost per opener | Quality | Scale |
|---|---|---|---|
| Human researcher | $3-5 | High | <50/day |
| Claygent (Clay) | $0.02-0.05 | High (with SKIP rule) | 500+/hour |
| Template personalization (variable substitution) | ~$0 | Low | Unlimited |

Clay's ROI is clear for any campaign with ACV > $5K. At $0.05/contact for 200 contacts = $10 in personalization budget. One additional booked meeting from better personalization pays for the entire campaign.

---

## Signal-based campaign design

The highest-performing cold email campaigns are triggered by a prospect signal, not sent as a batch blast. Design campaigns around:

| Signal | Why it works | Timing |
|---|---|---|
| New VP role (job change) | New leaders want to make their mark; budget authority; may switch existing vendors | Within 90 days of start date |
| Funding round | Fresh capital to spend; team scaling; problems they need to solve | Within 30 days of announcement |
| Tech stack change | Buying signal; in evaluation mode; pain with current solution visible | When detected |
| Open job posting | Active pain point; willing to spend; knows the problem | While posting is live |

For job-change triggers: use Apollo's saved search with alerts, or Clay's job change enrichment, to build a rolling list of new VPs in your ICP. Run a sequence within 30 days of their start date.

---

## Use `templates/clay-waterfall-formula.md` as the starting formula.
## See worked example in `examples/clay-personalization-worked.md`.
