# How the Twitter/X Algorithm Works in 2026 (Source Code)

- **Title:** How the Twitter/X Algorithm Works in 2026 (Source Code)
- **URL:** https://posteverywhere.ai/blog/how-the-x-twitter-algorithm-works
- **Published:** 2026-03-23
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog, reporting on a published open-source repository

## Evidence quality, layered

This piece mixes two very different kinds of claim and the distinction has to be preserved.
Some claims are attributed to X's open-sourced ranking code, which is a checkable primary
artifact. Others are format assertions with no attribution at all. The archive keeps both
and labels which is which. The underlying repository was not independently retrieved in this
sweep, so even the code-attributed claims are second-hand.

## Extracted content

### Attributed to the open-sourced code

Stated engagement weights, described as "From the open-sourced algorithm code" and
"confirmed in both the 2023 release and the January 2026 xAI release":

| Signal | Weight |
|---|---|
| Reply engaged by the author | +75 |
| Reply | +13.5 |
| Bookmark | +10.0 |
| Dwell time, 2 minutes or more | +10.0 |
| Retweet | +1.0 |
| Like | +0.5 |

**External links:** "The open-sourced code shows 30-50% reach reduction for external
links."

Separately attributed to a Buffer analysis rather than to the code: "Since March 2025, link
posts from free accounts have zero median engagement."

### Stated without code attribution

- Text-only posts outperform video by 30%.
- Recommended 4 to 8 post threads, 1 to 2 per week.
- "no specific long-form bonus beyond dwell time benefits".
- A March 2026 update claiming long-form posts are "now treated more favourably than
  multi-tweet threads", with no source given.

### Character limits stated

- Free: 280.
- Premium: 4,000.
- Premium+: 25,000.

## Claims this source supports

1. **Link handling is a real, differential format constraint on X.** A repurposed pack that
   puts the same link on every surface is materially worse on X than elsewhere. The
   reported remedy in common practice is to keep the link out of the primary post.
2. Replies and bookmarks are weighted far above likes in the published ranking code, which
   means a thread that invites a genuine reply is structurally different from a thread that
   invites a like. Relevant to how the thread piece in a pack is built.
3. Dwell time is a ranked signal, which is the mechanical argument for a post that stands
   alone and is worth reading rather than one that teases a click.

## Conflicts recorded

X Premium tier limit: 4,000 here, 25,000 in
[repurpose--platform-limits--buffer-help-center-2026.md]. Unresolved. Verify against the
user's own account before sizing a draft.

## Named gap

The X ranking repository itself was not fetched in this sweep. Every code-attributed claim
above is one publisher's reading of it.
