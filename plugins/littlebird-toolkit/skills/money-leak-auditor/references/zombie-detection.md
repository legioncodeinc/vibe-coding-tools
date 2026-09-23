# Zombie detection

The signature capability. For every paid tool on the ledger, determine whether the user
has actually opened it, using the capture itself as the usage record.

This is only possible because Littlebird sees the screen. A finance tool knows the charge
cleared. It does not know whether the user ever logged in. Absence of an app from 90 days
of screen capture is a measurable observation, and the MCP reference names this pattern
explicitly: `filters.app` is how absence gets proven
[littlebird-mcp-reference.md, Retrieval patterns, item 4].

## The claim this produces, stated precisely

Read `evidence-standards.md` rule 2 before writing a single line of output. The rule
that governs this entire guide:

> "no evidence of X in the last 90 days" and "X did not happen" are different claims, and
> only the first one is supportable.

So the finding is never "you do not use Descript." The finding is:

> No evidence of Descript on screen in 94 days of capture, across 3 query families and
> 2 filter strategies. Last observed [Tuesday, May 12, 2026 14:22 EDT | chrome]. You are
> paying an observed $65 per month against zero observed use.

That is defensible. The first version is not. Every zombie finding in the output carries
the sweep that produced it, so the user can see what was actually looked for.

## Prerequisite: the vendor confirmation gate has passed

Do not run usage sweeps against unconfirmed vendors. A vendor the user does not pay for
generates a false zombie, and a false zombie in a cancel list is the fastest way to lose
the user's trust. See `vendor-ledger-construction.md`, step 6.

## The three windows

Run the sweep at 30, 60, and 90 days. The windows are nested, so run 90 first and derive
the shorter ones from the timestamps of what comes back, rather than running three
separate queries per vendor.

| Window | Interpretation |
|---|---|
| Seen inside 30 days | Active. No action. |
| Seen 31 to 60 days ago | Fading. Candidate for downgrade, not cancellation. |
| Seen 61 to 90 days ago | Dormant. Candidate for pause or downgrade. Ask before cancelling. |
| Not seen in 90 days | Zombie candidate. Highest-value finding. |

**These windows are conventions, not researched thresholds.** The research archive
contains no source establishing how long a paid tool must go unopened before cancellation
is justified [research/distilled-saas-spend-leakage.md, section 9, gap 4]. Present them
as the skill's operating convention and let the user move them.

## The sweep, per vendor

Three query families per vendor, because each catches a different way the tool shows up.

**Family 1, the app filter.** Where the vendor has a desktop or mobile application, use
`filters.app` with the application's process or window name, `date_range` covering 90
days, no search constraint beyond a generic one.

```json
{
  "search_queries": ["application window content"],
  "filters": {"app": "descript"},
  "date_range": {"start": "2026-05-19", "end": "now"}
}
```

A negative here is meaningful only if the app name is right. Try the variants recorded in
the ledger's `variants` column before concluding absence.

**Family 2, the domain sweep.** Most SaaS is used in a browser, so the app filter reads
`chrome` for everything and is useless alone. Query the vendor's domain and its
distinctive UI strings instead, with `filters.app: "chrome"`.

```json
{
  "search_queries": [
    "descript.com",
    "Descript project timeline overdub",
    "Descript editor transcript"
  ],
  "filters": {"app": "chrome", "data_source": "snapshots"},
  "date_range": {"start": "2026-05-19", "end": "now"}
}
```

Include at least one string from the product's working interface, not just the brand name.
Brand-name-only queries match marketing pages, ads, and articles about the tool, which is
exactly the false positive this guide is trying to avoid.

**Family 3, the activity summary sweep.** `filters.data_source: "summaries"`. Littlebird's
own daily digests describe what the user worked on, and a tool used heavily inside a
session often appears there even when individual snapshots scored below the retrieval
cutoff.

## Reading the results honestly

Four traps, in order of how often they will bite.

**Trap 1: reading about a tool is not using it.** A pricing page, a changelog email, a
Reddit thread, a competitor comparison, a YouTube tutorial, and an ad all put the vendor
name on screen. None of them are use. Check what surrounds the match. The attribution
guardrail applies: capture shows what was viewed
[evidence-standards.md, rule 4]. A match inside the product's authenticated interface is
use. A match on a marketing page is not.

**Trap 2: the billing page is not the product.** Visiting a vendor's billing dashboard is
how the vendor got onto the ledger in the first place. It is evidence of paying, not
evidence of using. Exclude billing, invoice, and account settings surfaces from usage
evidence, and say so in the sweep description.

**Trap 3: background and API use leaves no screen.** This is the most important false
positive to guard against, and it is where a careless cancel list does real damage. A tool
can be delivering full value with zero screen time:

- Infrastructure and databases, running behind an application.
- API-metered services called by code, not by a human.
- Email deliverability, DNS, monitoring, backup, and CDN services.
- Scheduled automations and background workers.
- Gateways and proxies sitting in a request path.
- Anything consumed by another tool rather than by the user.

Before flagging any of these as a zombie, check for indirect evidence: a usage graph on
its dashboard, an invoice whose amount varies with consumption, an error or alert from it,
a mention in the user's own code or config on screen. A metered invoice that changes month
to month is direct evidence of use even with zero logins.

Mark this class `background-suspected` rather than `zombie` and route it to a question,
never to a cancel list.

**Trap 4: the retrieval cutoff hides weak positives.** Items scoring below 3 are omitted
from results entirely [littlebird-mcp-reference.md, search_user_context return shape]. An
absence therefore means "nothing scored 3 or above", not "nothing exists". State the sweep
so the reader understands the limit.

## The AI bundling case

Give this its own pass. Around 70% of employee AI interaction now happens through features
embedded inside already-approved SaaS
[research/distilled-saas-spend-leakage.md, section 4]. Organizations without central AI
governance carry up to 5 times more redundant AI subscriptions [same], and a solo operator
has no governance by construction.

The pattern to hunt: the user pays for a standalone AI tool, gets the same value from an AI
feature bundled into a tool they already pay for, and capture shows the bundled surface in
use while the standalone tool sits idle. That is simultaneously a zombie and a duplicate,
and it is the highest-yield finding available in 2026.

## Verdict values

Write one of these into the ledger's `usage_verdict` column.

| Verdict | Meaning |
|---|---|
| `active` | Product interface observed inside 30 days. |
| `fading` | Product interface observed 31 to 60 days ago. |
| `dormant` | Product interface observed 61 to 90 days ago. |
| `no-evidence-90d` | No product-interface evidence in 90 days. The zombie candidate. |
| `background-suspected` | No screen evidence, but the service plausibly runs without a UI. Ask, do not cancel. |
| `billing-only` | The only evidence is billing or account pages. Paying, not using. |
| `not-swept` | The sweep could not run, usually because no distinctive query string exists. |

`not-swept` is a real and honest verdict. Use it rather than defaulting an unswept vendor
to `no-evidence-90d`.

## What each verdict is worth in dollars

Cross the verdict with the amount confidence from the ledger.

- `no-evidence-90d` plus High amount confidence: the strongest cancel candidate. Quote the
  monthly and annual figure.
- `no-evidence-90d` plus Medium or Low amount confidence: still a cancel candidate, but
  the savings figure carries the lower confidence. Say so in the same sentence as the
  number.
- `fading` or `dormant`: route to downgrade or pause, not cancel. The archive is clear
  that underutilization is the larger bucket, at 51% against 14% entirely unused, and that
  right-sizing is the bigger savings pool
  [research/distilled-saas-spend-leakage.md, section 1].
- `background-suspected`: no dollar claim. A question.

## Reporting the sweep itself

Every zombie finding ships with its sweep, in this shape:

```
Vendor: Portkey
Verdict: no-evidence-90d
Amount: $49 / month, confidence Medium (one receipt, 2026-06-03)
Windows swept: 2026-05-19 to 2026-08-17
Queries run: filters.app "portkey"; chrome + "portkey.ai";
  chrome + "Portkey gateway config"; summaries + "Portkey"
Last observation of any kind: [Wednesday, June 3, 2026 09:14 EDT | chrome]
  and that observation was a billing page, not the product.
Caveat: Portkey is an AI gateway and may be serving requests from code with
  no screen presence. Classified background-suspected on review. Ask before cancelling.
```

That last line is the difference between a useful audit and an expensive mistake.

## Empty sweep

If usage sweeps return nothing for every vendor including ones the user certainly uses
daily, the sweep is broken, not the stack. Suspect a wrong date window or a bad filter
value. Report the malfunction and stop rather than declaring an entire stack dead
[evidence-standards.md, rule 9].
