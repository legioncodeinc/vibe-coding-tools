# Clay Waterfall Formula Template

Use this as the starting structure for a Clay enrichment table. Customize the waterfall providers and Claygent prompt for your specific ICP.

Reference: `guides/04-clay-personalization.md`

---

## Table structure

| Column name | Source | Notes |
|---|---|---|
| First Name | Import | From Apollo CSV or LinkedIn export |
| Last Name | Import | |
| Company | Import | |
| Job Title | Import | |
| LinkedIn URL | Import | Required for Claygent enrichment |
| Work Email | Email waterfall (below) | Built by Clay |
| Email status | Email waterfall (below) | Valid / invalid / catch-all / SKIP |
| Personalization opener | Claygent (below) | Passes SKIP rule |
| Signal trigger | Signal enrichment (below) | Optional: job change / funding / tech |

---

## Email waterfall formula

Set up as a Clay "Waterfall" column that tries each provider in order and stops at the first verified result:

```
Step 1: Prospeo (work email lookup by LinkedIn URL)
  → If found and valid: use result

Step 2: Hunter.io (domain + name lookup)
  → If found and valid: use result

Step 3: Apollo (name + company lookup)
  → If found and valid: use result

Step 4: MX validation
  → Run final MX check on result from any step
  → If catch-all: mark as SKIP (do not include in send list)
  → If invalid: mark as SKIP
```

Expected coverage: 70-85% of contacts will have a valid email found.

> NOTE: Verify current waterfall provider options at docs.clay.com. Provider availability and pricing change. The providers above were documented in `research/external/2026-05-20-clay-ai-personalization-workflow.md` as of May 2026.

---

## Claygent personalization prompt

Replace `[YOUR ICP CONTEXT]` with your specific ICP description before using.

```
You are writing a personalized cold email opener for [FirstName] [LastName], [Title] at [Company].

Here is available context:
- LinkedIn headline: {{linkedin_headline}}
- Recent LinkedIn post (if available): {{recent_post}}
- Company description: {{company_description}}
- Job change signal (if any): {{job_change_signal}}
- Funding event (if any): {{funding_event}}

Task: Write a single sentence (maximum 25 words) that opens a cold email in a genuine, specific way.

Rules:
1. The opener must reference something SPECIFIC to this person or company.
2. It must pass the 1-in-1000 test: would this sentence be false for the majority of people in [YOUR ICP CONTEXT]? If it could apply to most people, DO NOT write it.
3. Do NOT use the following phrases: "I noticed", "I came across", "impressive", "exciting", "I'd love to", "your work on", "I was reading".
4. Do NOT reference their company in a generic way ("I saw [Company] is doing great work").
5. If you cannot find a specific, genuine insight based on the context provided, return exactly: SKIP

Output: One sentence only, or the word SKIP.
```

---

## Signal enrichment columns (optional)

Add these Clay enrichment columns for signal-based campaigns:

```
Job change signal:
  Source: LinkedIn job change data (via Clay integration)
  Filter: Title change in last 90 days + title contains target keywords
  Output: "New [Title] at [Company] since [date]" or blank

Funding event:
  Source: Crunchbase (via Clay integration)
  Filter: Funding round announced in last 30 days
  Output: "Raised [amount] [Series] on [date]" or blank

Open job postings:
  Source: LinkedIn Jobs (via Clay integration)
  Filter: Active postings for [target role] at company
  Output: "Hiring [role] as of [date]" or blank
```

---

## QA checklist before launching

Run through 20 random rows before sending any Clay-personalized campaign:

- [ ] Email waterfall coverage > 70% (if lower, enrichment data is too thin)
- [ ] SKIP rate < 40% (if higher, personalization data is insufficient — run simpler sequence)
- [ ] Read 10 openers aloud — do they pass the 1-in-1000 test?
- [ ] No forbidden phrases in any generated opener
- [ ] Catch-all addresses are excluded from the send list
- [ ] Signal triggers are current (job changes within 90 days, funding within 30 days)
