# ManyChat Help: Instagram Post and Reel Comments trigger

- **Title:** Instagram Post and Reel Comments trigger
- **URL:** https://help.manychat.com/hc/en-us/articles/14281316989724-Instagram-Post-and-Reel-Comments-trigger
- **Fetched:** 2026-08-17
- **Source type:** official-docs (ManyChat product documentation, first-party for the
  product being described)

## Why this source matters here

ManyChat is the category leader for comment-to-DM automation. Its own documentation is
the cleanest available statement of what these tools structurally cannot capture, which
is exactly the gap `lead-harvester` exists to close.

## Extracted content

**Core function**

The trigger fires when someone comments on an Instagram post or reel. It can send a
public reply under the comment and a private direct message to the commenter.

**The first-comment-only rule**

> "The Instagram Post and Reel Comments trigger only activates for the first comment a
> user leaves under a post or reel."

Repeated comments from the same user do not trigger the automation.

**Post selection**

- specific posts or reels
- all posts or reels
- only future posts or reels published after setup

**Keyword filtering**

Automations can target specific keywords or exclude certain words.

**Private message restrictions**

> Sending a private DM "does not automatically opt the user into your Instagram channel
> and does not open the 24-hour messaging window."

Users become opted-in contacts only after they "interact with your message, for example,
by replying or clicking a regular button or quick reply."

The initial private reply can contain "only a single content block (text or an image,
with buttons or Quick Replies)" and cannot include user input blocks, typing delays, or
dynamic blocks.

**Post type coverage**

- Collaborative posts: supported
- Remix posts: supported only if you own both the original and the remixed content
- Boosted posts: supported as of June 11, 2024

## Claims this source supports

1. Comment automation is scoped to a configured set of posts. Anything a hand-raiser
   writes on a post outside that set is invisible to the tool.
2. Only the FIRST comment from a user fires the automation. The person who comments the
   keyword, then comes back and adds "so excited for this, been waiting all year" is
   recorded once, and the second comment, which is the more qualifying signal, is not
   captured as a trigger.
3. The automated DM does not opt the person in and does not open a messaging window. A
   hand-raiser who receives the automated DM and does not click stays outside the
   automated channel entirely.
4. The first message is a single content block. Real qualification cannot happen in it.
5. There is no capture at all of DMs, friend requests, connection requests, or reactions.
   Those hand-raise signals sit entirely outside the tool's scope.
