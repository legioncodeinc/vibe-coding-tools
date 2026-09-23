# External sweep and source grading

The outward half. What exists publicly on this topic, what postdates the user's exposure,
and how much weight each source has earned.

Domain claims trace to `references/research/distilled-research-synthesis-method.md`.

## Tooling

**List the web and search tools available in this session and use the real names.** Sessions
differ. A search tool and a fetch tool are both commonly present under several different
names, and more than one of each may be available. Do not assume a specific tool exists
because a guide mentions one.

If no web tool is available: produce the internal half in full, mark the external sections,
the disagreement section, and the delta as unrun with the reason, and say plainly that the
delta is the section that needed both halves. Do not substitute training-data knowledge of a
topic for a fetched source. If it was not fetched, it is not a finding.

## Why the search itself is a declared limitation

The one documented failure mode named for AI-composed searches in the archive: "AI-generated
searches miss a large proportion of relevant studies and lack transparency and
reproducibility" (distillation section 7). The consequence is not that results are wrong. It
is that **coverage is unknown and the search is not reproducible** (distillation section 7).

Therefore: record every query run, verbatim, in the output. A reader who can see the queries
can see the shape of the hole. A reader who cannot has no way to judge coverage at all.

## The sweep

### Order of operations

1. **Primary and official sources first.** The thing itself: documentation, a specification,
   a filing, a paper, a release note, the originating announcement.
2. **Then independent coverage.** Journalism, analysis, and practitioner writing with no
   stake in the outcome.
3. **Then vendor material.** Read it for what it claims, not for what is true.
4. **Then community.** Forums, threads, issue trackers, discussion. Useful for what practice
   actually looks like and for failure reports that never appear in vendor material.

### Query construction

Build from the alias list in the scoping block. For each alias run at minimum:

| Query shape | What it surfaces |
|---|---|
| The term alone | Baseline and definitional material |
| The term plus a recency marker (the current year, "changelog", "release", "update") | What moved |
| The term plus "criticism", "problems with", "limitations" | The disconfirming half, which vendor-dominated searches bury |
| The term plus "alternative to" or "versus" | Category boundaries and competitors |
| The term plus the specific sub-question from scoping | The decision-relevant material |

**Run the criticism query every time, on every topic, without being asked.** A sweep that
only runs the topic term returns the material with the most search-optimized incentive behind
it, and non-publication of unfavourable findings is documented behaviour rather than
suspicion (distillation section 5).

### Recency scoping against the user's exposure

For a currency check, the pivot is the latest date the user has captured exposure on this
topic. Scope the external sweep to prioritize what postdates it. Everything found that
predates it is a candidate for the already-in-your-context section instead, on the reasoning
that it existed while the user was reading.

That reasoning is a heuristic, not a fact. The user may not have seen a thing that existed
when they were reading. Present overlap as overlap, never as "you already knew this".

## Verify every URL before it enters the output

Non-negotiable, and this is the one place where this skill has a specific duty to model good
behaviour.

1. **Fetch every URL you intend to cite.** Do not cite a URL a search result showed you and
   you did not open. In one measurement of eight AI search products across 1,600 queries,
   "More than half of responses from Gemini and Grok 3 cited fabricated or broken URLs", and
   154 of one tool's 200 citations led to error pages (distillation section 8).
2. **Cite the original, not the syndication.** Content is frequently credited to a
   republisher rather than the originating outlet, including where a licensing partnership
   exists (distillation section 8). If you landed on a republished copy, find the original
   and cite that, or say which one you are citing and why.
3. **A citation string is not a citation.** Fabricated citations in the published literature
   rose roughly 12-fold in three years, from 1 in 2,828 papers in 2023 to 1 in 277 in the
   first seven weeks of 2026 (distillation section 8). The absolute rate is low, around 0.36
   percent; the slope is the alarming part (distillation section 8). The harm named by the
   study's lead author: the person relying on the evidence "has no way of knowing that the
   evidence they are relying on does not exist" (distillation section 8).
4. **If a URL will not resolve, drop the claim.** Not "reportedly". Drop it, and if the claim
   matters, name it in open questions as something you could not source.

## Source grading

Every source in the output carries a type and a reliability note. Stated, never assumed.

### The type ladder

| Type | What it is | Default weight |
|---|---|---|
| **Primary** | The thing itself: the specification, the filing, the dataset, the release note, the original announcement, the paper | Highest. It is the object under discussion, not a report about it |
| **Official documentation** | The maintainer's or issuer's own reference material | High for what the thing does. Not evidence about how well it works |
| **Independent research** | Peer reviewed work, or research from an organization with no stake in the answer | High, with the funding checked |
| **Journalism** | Reported work by an outlet with editorial standards | Medium to high. Check whether the piece reports or repackages |
| **Practitioner writing** | Someone with hands-on experience and no product to sell | Medium. Strong on what practice is actually like, weak on generality |
| **Vendor content** | Anything published by a party that sells something in the category | Reported as a claim, never as a fact |
| **Community** | Forums, threads, comments, issue trackers | Low individually, useful in aggregate for failure reports and real usage |
| **Aggregator or listicle** | Content assembled from other content, usually for search traffic | Lowest. Trace to the original and cite that instead |

### Grading a source you do not recognize

Use lateral reading. Do not evaluate a source from its own presentation.

In the founding study, 10 professional fact checkers, 10 PhD historians and 25
undergraduates were compared on the same credibility tasks. The fact checkers were "fastest
and most accurate"; the historians and students were readily deceived, misled by
"professional appearance, logos, and nonprofit status" while staying on the page
(distillation section 4). **The historians were subject experts and still lost**
(distillation section 4).

The procedure (distillation section 4):

1. Leave the page. Open other tabs.
2. Look up, in this order of usefulness: the publication, the funding organization, the
   author, the content.
3. "Read a minimum of 3 to 5 new sources to see what they have to say about your original
   source."
4. "If you can't find 3 to 5 sources, that is information in itself. It means your original
   source doesn't have an established reputation."

Point 4 is a graded outcome, not a dead end. Record it as such: source unlocatable, treated
as low weight.

There is no single evaluation framework. A university guide names six and matches each to a
source type, separating academic sources from "news, websites, or AI-generated content" and
from grey literature (distillation section 4). Pick by source type rather than applying one
checklist to everything.

## Commercial interest

Flag it, quantify the direction, and do not pretend to quantify the magnitude.

### The three checks

1. **Who paid.** Funding organization is one of the four things lateral reading says to look
   up (distillation section 4). Look for it explicitly. Its absence is itself worth noting.
2. **What they sell.** A source publishing on a category it sells into has an interest in the
   category's importance, not only in its own product.
3. **What is missing.** Non-publication of unfavourable results is documented: of 36
   antidepressant trials with negative or questionable results, "22 (61%) were not published,
   11 (31%) were published with narrative 'spin', and only 3 (8%) were accurately represented
   as negative", inflating published effect sizes by roughly 30 percent (distillation section
   5).

### What the evidence actually shows

| Measure | Finding |
|---|---|
| Efficacy results favouring the sponsor | Risk ratio 1.27 (95% CI 1.17 to 1.37) |
| Conclusions favouring the sponsor | Risk ratio 1.34 (95% CI 1.19 to 1.51) |

(distillation section 5)

**The conclusions figure exceeds the results figure. Sponsored work is skewed more in what it
concludes than in what it measures** (distillation section 5).

The operational form of that: in vendor content, the data table is more trustworthy than the
summary paragraph above it. Read the numbers, discount the framing.

Affiliation predicts conclusion strongly. Among second-hand smoke reviews, "Of authors with
no ties to industry, 87% (65/75) found negative health effects; whereas, only 6% (2/31) of
authors with industry ties drew similar conclusions" (distillation section 5).

### The transfer caveat, and state it in the output when it comes up

All of that evidence is clinical and pharmaceutical. Applying those magnitudes to vendor
content in a non-clinical field is an unsupported extrapolation. What transfers is the
direction and the mechanism (distillation section 5). Say "vendor sources skew toward
favourable conclusions" and do not attach a risk ratio to a marketing blog.

### When the whole field is commercial

Some topics have no independent literature. Every substantial source is published by someone
selling into the category.

**Say so, as a named finding, in the source list header.** Not as a caveat at the end.
Something like: "Seven of the nine substantial sources on this topic are published by vendors
in the category. There is no independent research in this sweep. Treat every performance
claim below as a claim."

That statement is more useful to the user than any individual source in the sweep.

## Report a claim as a claim

"Their documentation as of DATE states X", not "X". "The vendor's site says the product does
Y", not "the product does Y". An external claim is reported as "their site says X", not as
"X" (`references/evidence-standards.md`, rule 10).

This applies to numbers hardest. A vendor percentage is a vendor percentage on every line it
appears on.

## Recording the sweep

The output carries a method block listing, for each pass: the query text verbatim, the tool
used, the date run, and the number of sources kept against the number reviewed. Four things
must be recorded for an AI-assisted synthesis to be auditable: which tool, which task, which
model version and prompts, and how the output was verified (distillation section 7).

A synthesis that does not record its own method is not auditable by the person acting on it
(distillation section 7).
