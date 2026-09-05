# Messenger Platform Policy Overview

- **Title:** Messenger Platform Policy Overview
- **URL:** https://developers.facebook.com/docs/messenger-platform/policy/policy-overview/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (Meta Platforms)

## Why this source matters here

This is the governing document for what a business can and cannot send to a Facebook or
Instagram user who raised a hand on a post. It sets the outer boundary that any
comment-to-DM workflow lives inside, and it is the reason `lead-harvester` drafts rather
than sends.

## Extracted content

**24-hour standard messaging window**

> "Businesses will have up to 24 hours to respond to a user. Messages sent within the 24
> hour window may contain promotional content."

The window opens when the user initiates contact through one of these:

- a message
- a call-to-action button
- a Click-to-Messenger ad
- a plugin
- a message reaction

Note what is absent from that list: a comment on a post does not by itself open the
standard 24-hour window. Comments are handled through the separate Private Replies
feature, archived in
`leadharvest--platform-rules--meta-private-replies-devdocs-2026.md`.

**Message tags**

Message tags let a business send personally relevant updates outside the standard window
for approved use cases only. Some tags apply to both Messenger and Instagram, others are
Messenger-only.

**Human agent tag**

A business can respond manually to a user communication within a 7-day period using the
human agent tag, extending engagement past the standard 24-hour window. This is the tag
that covers a real person following up by hand, which is the workflow `lead-harvester`
supports.

**One-Time Notification opt-in**

One-Time Notification requires an explicit user request. The user receives a single-use
token, valid up to 1 year, only after requesting notification for a time-sensitive
scenario such as a back-in-stock alert.

**Promotional content**

Promotional messages are permitted inside the 24-hour window. Outside it they are
restricted, except through Sponsored Messages or approved Message Tags. News publishers
cannot use news messaging for promotional purposes such as subscriptions, deals, or
discounts.

**Unsolicited messages**

Users can block or mute conversations at any time, and messaging outside approved
channels risks policy restrictions.

## Claims this source supports

1. On Meta platforms, a business reply window is opened by the USER, not by the business.
2. A comment is not the same trigger as a message. Do not assume a commenter can be DM'd
   freely.
3. Manual human follow-up has a documented 7-day lane (human agent tag) that bulk
   automation does not.
4. Promotional content is legal inside the window and restricted outside it.
