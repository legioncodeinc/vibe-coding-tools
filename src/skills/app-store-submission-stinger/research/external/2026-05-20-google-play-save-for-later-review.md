---
source_url: https://developer.android.com/blog/posts/try-using-play-consoles-new-save-for-later-feature
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: medium
topic: google-play-review-process
stinger: app-store-submission-stinger
---

# Ready to Review Some Changes But Not Others? Try Using Play Console's New Save for Later Feature | Android Developers Blog

## Summary
Official Google announcement of a new "Save for later" feature in Play Console's Publishing overview, allowing developers to hold back specific groups of changes from a review submission while sending other changes through. Launched in early 2026. This enables separating marketing metadata changes from critical bug fixes, preventing bundle-and-delay problems that previously forced teams to choose between delaying urgent fixes or publishing unready changes.

## Key quotations / statistics
- "In the past, changes to your app were bundled together before being sent for review. This presented challenges if you needed to reprioritize changes, or if the changes were no longer relevant."
- "You have the ability to hold back the changes you're not ready to have reviewed."
- **Save for later + pre-review checks interaction:**
  - "If issues are isolated to an individual track, we'll show you an error beside that change, so you know what to save for later in order to proceed to review with your other changes."
  - "If you have issues that affect your whole app, for example, App content issues, Save for later will be unavailable and you will need to fix them before you can send any changes for review."
- "Save for later also works with our pre-review checks. Pre-review checks look for issues in your changes that may prevent your app from being published, so that you can fix them before you send changes for review."
- "With this feature you can manage what changes you send for review, and address issues affecting individual tracks without holding up ready-to-release changes, so you can iterate faster and minimize the impact of rejections on your release timeline."

## Annotations for stinger-forge
- This is a 2026 workflow improvement that reduces the pain of Google Play's bundled-review model. Stinger-forge should note it in `guides/05-timeline-and-process.md` as a pro tip for release engineering.
- The distinction between track-level issues (save-for-later works) and app-level issues (must fix before any submission) is operationally important for teams managing multiple release tracks.
- This feature makes Google Play's review process more granular and less all-or-nothing, closing a workflow gap that previously made Play more painful than App Store for teams iterating rapidly.
- No contradictions with other sources.
