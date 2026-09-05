# External monitoring and reconciliation

The outward-facing half. What changed publicly on the tracked entities, cited to URLs, and
then held against what the user's own market is saying about them.

Domain claims trace to `references/research/distilled-competitive-intelligence.md`.

## Tooling

**List the web tools available in this session and use the real names.** Sessions differ.
A search tool and a fetch tool are both commonly present under several different names.
Do not assume a specific tool exists because a guide mentions one.

If no web tool is available: produce the internal half in full, mark the external sections
and the reconciliation section as unrun with the reason, and say plainly that reconciliation
is the section that needed both halves. Do not substitute training-data knowledge of a
competitor for a fetched source.

## What to check, per tracked entity

The three intelligence categories are product, pricing, and positioning (distillation
section 1). The external source list adds personnel and hiring, PR and news, and review
sites (distillation section 2). Combined, the standing checklist per Tier 1 entity:

| Dimension | What counts as a change | Where it shows |
|---|---|---|
| Pricing | New tier, price move, packaging change, model change (per seat to usage), free tier change | Pricing page, changelog, launch post |
| Positioning | Homepage headline, category self-description, target buyer, claims | Homepage, about page, recent posts |
| Product and launches | New product, major feature, deprecation, platform support | Changelog, release notes, launch announcements |
| Funding | Round, amount, investors, date | Announcement, press, filings |
| Personnel | Executive change, notable hire or departure, hiring pattern | Announcements, job postings, public profiles |
| Public claims | Customer counts, growth numbers, benchmark claims, awards | Marketing pages, posts, press |

Job posting patterns (location, count, role types, posting duration) and executive
background changes are named as readable indicators of growth and strategic direction
(distillation section 2). Funding announcements, product launches, and management
transitions are named market-entry and market-move signals (distillation section 6).

## Scope discipline

Tier 1 gets the full checklist every period. Tier 2 gets a lighter pass: funding, launch,
and positioning only, unless a Tier 2 entity produced internal sightings this period, in
which case run the full checklist on it and note why.

Tracked topics get a category-level scan rather than an entity scan.

Do not run the full checklist on every name every week just because it is possible. Alert
volume is the named failure of the whole monitoring category, with one surveyed product
producing "hundreds of alerts" and "unrelated information" and another producing "incorrect
tagging" and "irrelevant alerts" (distillation section 3).

## Sourcing rules

1. **Every external claim carries a URL and a date.** No URL, no claim
   (`references/evidence-standards.md`, rule 2).
2. **Report a vendor claim as a claim.** "Their pricing page as of DATE lists X", not "they
   charge X". "Their site says they serve 10,000 customers", not "they serve 10,000
   customers" (`references/evidence-standards.md`, rule 10).
3. **Change requires a before and an after.** A pricing page you have never seen before is
   a baseline, not a change. Say which one it is. On the first run, most of the external
   section is baseline, and the digest should say so rather than presenting the standing
   landscape as news.
4. **Triangulate before you conclude.** Analysis should rest on information triangulated
   across source types (distillation section 7.4). One blog post is one blog post.
5. **Collection is not analysis.** "Collection without analysis reverts the analyst to the
   role of a librarian" (distillation section 1). A list of links is a librarian's output.

## Ethical limits on external collection

The full treatment is in `references/ethics-and-boundaries.md`. The short version for this
guide:

- Public sources are legitimate: competitor websites, pricing pages, job postings,
  regulatory filings, patents, earnings calls, review platforms, news, conference talks
  (distillation section 7.3).
- Do not misrepresent identity or purpose to obtain anything, including gated content that
  requires registration (distillation section 7.3, section 7.4).
- Do not access anything credentialed, paywalled without entitlement, or protected. Using a
  former employee's credentials to reach a password-protected site produced a 15.5 million
  dollar settlement in Air Canada v. WestJet (distillation section 7.5).
- Liability follows whoever acts for you: vendors and contractors operating under your name
  make their conduct your problem (distillation section 7.8). An agent running searches on
  the user's behalf sits inside that principle.

## Reconciliation: internal versus external

This is the section that justifies fusing the two halves, and it is the section a
monitoring tool structurally cannot write.

The three-layer model: the visible layer is public marketing and feature comparisons, the
shadow layer is the positioning shifts and unofficial narratives that surface during real
deals, and the strategic layer is the pattern across deals (distillation section 2.2).
External monitoring reads the visible layer. Sightings read the shadow layer.

For each Tier 1 entity with both internal sightings and external findings this period,
produce a short reconciliation:

| Row | Content |
|---|---|
| What they say about themselves | External, cited, dated |
| What your market says about them | Internal, receipted, with context types |
| Agreement | Where the two match |
| Divergence | Where they do not |
| Reading | What each divergence could mean, marked as inference |

### Divergence patterns worth naming

These are readings to consider, each stated as a possibility rather than a conclusion:

- **They announce, nobody mentions it.** A launch with no internal echo. Possible readings:
  the launch has not reached this market segment, the announcement is louder than the
  substance, or the user's field of view does not cover where it landed.
- **Everyone mentions it, they never announced it.** Pricing behavior, discounting, or
  positioning showing up in deals and threads that appears nowhere public. This is the
  shadow layer, and it is the reason win-loss analysis exists (distillation section 2.2).
- **Their claim and the buyer report disagree.** Marketing says one thing, a prospect on a
  call says another. Present both. Do not resolve it by picking the more interesting one
  (`references/evidence-standards.md`, rule 10).
- **Silence on both sides.** Nothing internal and nothing external. Report as no evidence
  of movement, not as stability.

Never smooth a conflict into a single confident claim. Conflicts stay conflicts.

## The so-what

One short section, clearly separated from every observation above it, explicitly marked as
inference.

Rules:

1. **Maximum three points.** If everything is important, nothing is.
2. **Each point names the observations it rests on.** By receipt for internal, by URL for
   external.
3. **Each point says what it would take to be wrong.** The disconfirming evidence, named.
4. **No point becomes a recommendation to act irreversibly on Low confidence**
   (`references/evidence-standards.md`, rule 3).
5. **A quiet period gets one line.** "Nothing this period changes the read on positioning
   or roadmap" is a complete and correct so-what. Manufacturing analysis to fill the
   section is the behavior that makes a recurring digest get ignored.

The separation is the point. Collection without analysis produces a librarian (distillation
section 1), and undifferentiated content that ignores what the reader needs is a named
cause of program failure (distillation section 8.1). But an inference presented in the same
voice as an observation is worse than either, because it cannot be checked.
