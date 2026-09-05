# Private Replies (Instagram Messaging API)

- **Title:** Private Replies
- **URL:** https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (Meta Platforms)

## Why this source matters here

Private Replies is the exact mechanism every comment-to-DM tool is built on. Its limits
are the real limits of the whole "comment KEYWORD to get it" category, and they are much
tighter than the marketing for those tools implies.

## Extracted content

**Eligibility window**

> "The message must be sent within 7 days from when the comment was created for comments
> on a post, ads post, or reel."

Live comments are the exception: replies are only possible during the broadcast itself.

**Message quantity**

The system restricts a business to "only one message" per comment. That limit is escaped
only if the commenter answers, because "only when a person responds to the private
message can you continue the conversation within the 24-hour messaging window."

**Messaging window behavior**

A single private reply opens no automatic conversation thread. Further dialogue requires
the original commenter to respond first, which then activates the standard 24-hour
messaging window.

**Restrictions**

- Applies exclusively to Instagram Professional accounts.
- Works for posts, ads, reels, and live stories, with live-only timing limits.
- "Private replies for IGTV comments are not supported."
- Requires specific permissions and page access tokens.
- Apps with Standard Access can only reach users who hold app roles.
- The commenter does not need to follow the account.

## Claims this source supports

1. A comment-to-DM tool gets exactly ONE shot per comment, and only for 7 days.
2. If the hand-raiser does not answer that one automated DM, the automated channel is
   closed. Everything after that is manual work, which is the gap `lead-harvester` fills.
3. The 7-day expiry means a campaign roster reviewed a week late has already lost the
   automated lane, making the human first touch the only remaining option.
