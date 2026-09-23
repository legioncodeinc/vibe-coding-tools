# Guide 02: De-duplication Discipline

The single biggest failure mode in feedback systems is not collecting too little feedback — it is collecting the same request in 14 slightly different forms and scoring them independently. This guide establishes the canonical merge workflow, the semantic tagging taxonomy, and the anti-patterns that cause de-duplication debt to accumulate.

## Why de-duplication precedes scoring

Scoring 14 variants of "export to CSV" as separate items:

1. **Wastes prioritization budget** — the team scores each variant individually.
2. **Inflates apparent demand** — if each variant has 5 votes, you see "5 votes" not "70 votes for CSV export."
3. **Fragments the signal** — customers who voted for one variant never see the other 13; their true weight is invisible.
4. **Blocks "not planned" decisions** — you cannot close a request when duplicates are still open.

The canonical merge step must precede any RICE/ICE run. De-duplicate first, score second.

## The canonical merge workflow

### Step 1: Weekly de-duplication session (30 minutes)

Use the `templates/dedup-triage-template.md` to run a weekly session. The session has three objectives:

1. Review new submissions since last session.
2. Identify pairs or clusters with high semantic overlap.
3. Merge duplicates into the canonical request (master record).

### Step 2: Identify candidates

Look for duplicates along three axes:

- **Semantic overlap:** "Export to CSV", "Download as spreadsheet", "Save as CSV file" — same underlying job.
- **Platform/integration overlap:** "Slack integration", "Notify in Slack", "Post to Slack channel" — same integration at different specification levels.
- **Phrasing variation:** "Dark mode", "Night mode", "Dark theme" — same feature, different terminology.

Most feedback platforms (Canny Pro, Featurebase) offer AI-powered duplicate detection. Use it as a first pass, then apply human judgment.

### Step 3: Merge into the canonical request

The canonical request is the **most clearly stated, most upvoted, or earliest version** of the request. On merge:

- Transfer all votes from duplicate(s) to the canonical record.
- Add a comment to the duplicate: "Merged into [canonical request URL]."
- Add the canonical record's URL to the duplicate's description so voters can find it.
- Close the duplicate (do not delete; preserve the audit trail).
- Notify voters of the duplicate that their vote now counts toward the canonical request.

### Step 4: Apply semantic tags

Each canonical request gets exactly **one primary tag** from the top-level taxonomy (see below). Secondary tags are allowed but should be used sparingly.

## Semantic tagging taxonomy

Keep the taxonomy to 5-10 top-level categories maximum. More categories create fragmentation; fewer categories make segment analysis meaningless.

**Recommended starter taxonomy for a B2B SaaS product:**

| Tag | Includes |
|-----|---------|
| `integrations` | API connections, webhooks, third-party sync |
| `exports` | CSV, PDF, Excel, data portability |
| `notifications` | Email, Slack, in-app alerts |
| `permissions` | RBAC, sharing, access control |
| `analytics` | Reporting, dashboards, metrics |
| `onboarding` | Setup, tutorials, getting-started flows |
| `performance` | Speed, reliability, uptime |
| `mobile` | iOS, Android, responsive web |
| `ui-ux` | Design, navigation, layout changes |
| `billing` | Pricing, plans, invoices |

Adapt to your product. The key constraint: **one tag per request as primary**. If you cannot assign a primary tag, the taxonomy needs a new top-level category.

## Anti-patterns

| Anti-pattern | Why it happens | Fix |
|-------------|---------------|-----|
| Too many categories (> 15) | Team adds a new tag for every new request type | Merge tags quarterly; enforce the 10-category ceiling |
| No merge authority | No one person owns de-duplication | Designate one PM as the "de-dup owner" for each weekly session |
| Voting inflation via duplicates | Same request split across multiple entries inflates apparent demand | Merge before scoring every time |
| Deleting duplicates | Removes the paper trail of why a merge happened | Close, never delete; add a "merged into" comment |
| Merging without notifying voters | Voters don't know their vote transferred | Use the platform's merge notification; write a comment on the closed duplicate |
| Tags on only 20% of requests | Tagging feels optional | Tag is required before a request can advance past "under review" |

## De-duplication SLA

Every new submission should be:

1. **Reviewed for duplicates** within 5 business days of submission.
2. **Merged** if a duplicate is found. The merge should be complete (votes transferred, comment added, duplicate closed) in the same session.
3. **Tagged** with at least one primary semantic tag before the end of the review session.

A request that has sat un-reviewed for > 10 business days is a de-duplication backlog item. The weekly session should clear the backlog before scoring new items.
