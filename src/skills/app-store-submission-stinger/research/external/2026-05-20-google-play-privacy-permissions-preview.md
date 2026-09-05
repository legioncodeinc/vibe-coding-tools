---
source_url: https://developer.android.com/blog/posts/boosting-user-privacy-and-business-protection-with-updated-play-policies
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: google-play-policy
stinger: app-store-submission-stinger
---

# Boosting User Privacy and Business Protection with Updated Play Policies | Android Developers Blog

## Summary
Official Android Developer Blog post explaining the April 2026 policy updates in developer-facing language. Details the new Android Contact Picker and Location Button features alongside the policy changes requiring their use. Explains the account transfer feature with its mandatory 7-day security cool-down period. Also introduces the new pre-review checks in Play Console (available October 27, 2026) that will flag contacts and location permission issues before submission.

## Key quotations / statistics
- **Android Contact Picker:** "This picker lets users share only the specific contacts they want to, helping build trust and protect privacy... We are updating our policy to require that all applicable apps use the picker, or other privacy-focused alternatives like Sharesheet, as the primary way to access users' contacts."
- **READ_CONTACTS reserved:** "`READ_CONTACTS` will be reserved for apps that can't function without it." Requires a Play Developer Declaration if full contact access is essential.
- **Location Button:** "This feature replaces complex permission dialogs with a single tap, helping users make clearer choices about how much information they share and for how long."
- **Pre-review checks (October 2026):** "New pre-review checks in the Play Console will be available starting October 27 to flag potential contacts or location permissions policy issues so you can fix them before you submit your app for review."
- **Account Transfer cool-down:** "Every transfer will include a mandatory 7-day security cool-down period. This gives your team time to spot and cancel any unauthorized attempts to take over your account."
- **Play Policy Insights in Android Studio:** "By October, Play policy insights in Android Studio can help you proactively identify if your app should use these new features and guide you on the exact steps to take."

## Annotations for stinger-forge
- The pre-review check announcement (October 27, 2026) is a significant workflow change: Play Console will auto-flag certain permission issues before developers submit. Stinger-forge should note this as a tool in the compliance checklist guide.
- The Play Policy Insights integration in Android Studio is a developer-tooling signal: the ecosystem is moving toward in-IDE policy compliance feedback, not just post-submission rejection.
- The 7-day cool-down for account transfers is operationally important for business acquisitions / team handoffs: note in `guides/05-timeline-and-process.md`.
- This source resolves the "what does READ_CONTACTS require now?" question: a Play Developer Declaration form, not just a permission request.
