# Capture protocol: turning a partial roster into a near-complete one

This is the power move of `lead-harvester`, and it should be presented to the user that
way. It is not a workaround for a limitation. It is a workflow no comment-to-DM tool can
perform, because it operates on the pixels the operator can already see rather than on an
API the platform rations.

## The problem it solves, stated plainly

Littlebird reads what was on screen. Social notification UIs collapse rosters into "X, Y
and 4 others commented on your post" and "12 people reacted"
(`references/littlebird-mcp-reference.md`, Known limitations). A roster built only from
ambient notification capture is partial by construction and stays partial no matter how
good the retrieval is.

The names are not missing from the internet. They are missing from the CAPTURE. They sit
in the expanded comment thread, one tap away, on a screen the operator never opened while
Littlebird was watching.

The fix is mechanical: open the thread, scroll it slowly once, let capture read it. Thirty
to sixty seconds of the operator's time converts a partial roster into a near-complete
one.

## When to run it

Run the capture protocol BEFORE the harvest, not after. Ordering matters:

| Timing | Result |
|---|---|
| During the campaign window, once per day | Best. Catches the thread as it grows, and catches people who later delete a comment. |
| Within 7 days of the post | Good. Still inside the Private Replies eligibility window, so the automated lane is technically still open for anyone the tool missed [research/raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md]. |
| After 7 days | Still worth it. The roster is recoverable, the automated lane is not, and every touch is now manual anyway. |

If the user is asking for a harvest and has never run the capture protocol for this
campaign, say so, offer the protocol, and let them choose. Do not run a harvest and
present a thin roster without telling them a 60-second action would have doubled it.

## The instruction to give the user

Give this verbatim, adapted to their platform. Keep it short. The operator is going to do
this on their phone between other things.

> Open the post. Tap into the comments so the full thread expands. Scroll from the top to
> the bottom at reading speed, roughly one screen every two seconds. Where you see "View
> more comments", "See previous comments", or "N replies", tap it and keep scrolling.
> Then go back and do the same on the reactions list and your notifications page. Thirty
> to sixty seconds total. Do not rush it: capture reads what stays on screen long enough
> to be legible, so a fast flick produces motion blur and nothing usable.

## Per-platform steps

### Facebook (page post or personal profile post)

1. Open the post in the browser or the app. Browser capture is richer, so prefer desktop
   browser if the user has the choice.
2. Click the comment count to expand the thread.
3. Click "View more comments" repeatedly until it stops appearing. Facebook loads
   comments in pages and the default view shows a small fraction.
4. Change the comment sort to "All comments" if the selector offers it. The default is a
   ranked subset, which is a second source of silent truncation.
5. Expand reply chains: click every "N replies" link. Keyword campaigns generate reply
   chains where the operator answered one person and three more piled on.
6. Scroll the whole expanded thread top to bottom at reading speed.
7. Open the reactions list by clicking the reaction summary. Scroll that list.
8. Open your notifications page and scroll back through the campaign window.
9. If the campaign drove friend requests, open the friend requests screen and scroll it.

### Instagram

1. Open the post or reel. Tap the comment icon.
2. Tap "View all N comments" and every "View replies (N)" link.
3. Scroll top to bottom at reading speed.
4. Back out and open the likes list. Scroll it.
5. Open the DM inbox and scroll the thread list far enough back to cover the campaign
   window. Message requests are a separate tab and are the single most commonly missed
   surface: open it explicitly.
6. Open Activity and scroll the campaign window.

### LinkedIn

1. Open the post. Click the comment count.
2. Click "Load more comments" repeatedly. LinkedIn truncates aggressively and the button
   reappears several times.
3. Switch the sort from "Most relevant" to "Most recent". The relevance sort hides
   comments and is a silent truncation.
4. Expand every reply thread.
5. Open the reactions modal from the reaction count. It has tabs per reaction type.
   Scroll each tab.
6. Open "My network" and scroll the pending invitations list.
7. Open the messaging inbox and scroll the campaign window.

### X

1. Open the post. Replies load beneath it.
2. Scroll the full reply tree. Click "Show more replies" and "Show additional replies,
   including those that may contain offensive content" where they appear. The second one
   hides real people routinely.
3. Open the reposts and quotes lists from the engagement counts.
4. Open the likes list and scroll it.
5. Open the DM inbox including the "Message requests" tab.

## What to tell the user about what capture will and will not get

Be honest about this at the point of instruction, not afterwards.

- Capture reads what renders. A name that never rendered on screen is not recoverable by
  any amount of scrolling.
- Profile photos are not identity. Two people with the same display name are two rows
  until proven otherwise.
- Lists that are virtualized (rows recycled as you scroll) still capture correctly, since
  each row is on screen at some point, but only if the scroll is slow enough for a frame
  to land on it.
- A comment deleted before the scroll is gone. This is the argument for running the
  protocol DURING the campaign window rather than after.

## Wiring the protocol into a routine

Where the user runs campaigns constantly, the reminder to scroll is worth automating even
though the scroll itself is not. See the routine wiring section of `SKILL.md`. The routine
does not scroll. It reports what it can see, states the size of the unnamed gap, and
tells the user to run the 60-second protocol. That is the correct division of labor: the
routine observes, the human acts, the Cowork session harvests
(`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts pattern).

## Verifying the protocol worked

After the user reports they have scrolled, re-run the retrieval with a date window
starting at the scroll time. Compare:

- Count of distinct named hand-raisers before and after.
- Whether "and N others" strings still dominate the snapshots, which means the thread was
  never actually expanded.
- Whether reply-chain names appear, which is the clearest proof the expansion clicks
  happened.

Report the delta to the user in plain numbers: "before the scroll I could name 14 of an
estimated 62, after the scroll I can name 55 of an estimated 62." That number is the
skill's entire value proposition and the user should see it.
