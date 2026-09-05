---
source_url: https://developer.apple.com/support/app-privacy-on-the-app-store
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: privacy-compliance
stinger: app-store-submission-stinger
---

# App Privacy Details - App Store | Apple Developer

## Summary
Apple's canonical page on App Store privacy nutrition labels. Explains the obligation to declare data practices for both the app and all integrated third-party partners, the four optional-disclosure criteria (rarely all met), the distinction between "linked to identity" and "used for tracking," and how to update privacy responses in App Store Connect without submitting a new app version.

## Key quotations / statistics
- "You'll need to provide information about your app's privacy practices, including the practices of third-party partners whose code you integrate into your app, in App Store Connect."
- **Third-party SDKs must be declared:** "An important part of submitting your app to the App Store is explaining how your app handles user data. Two new updates make it easier to accurately provide Privacy Nutrition Labels and improve the integrity of the software supply chain: signatures for third-party SDKs and privacy manifests."
- **Four optional-disclosure criteria (ALL must be met to skip disclosure):**
  1. "The data is not used for tracking purposes."
  2. "The data is not used for your Advertising or Marketing Purposes."
  3. "Collection of the data occurs only in infrequent cases that are not part of your app's primary functionality, and which are optional for the user."
  4. "The data is provided by the user in your app's interface, it is clear to the user that data is collected, the user's name or account name is prominently displayed in the submission form alongside the data elements being submitted, and the user affirmatively chooses for collection each time."
- "You may update your answers at any time, and you do not need to submit an app update in order to change your answers."
- "You're responsible for keeping your responses accurate and up to date. If your practices change, update your responses in App Store Connect."

## Annotations for stinger-forge
- The four optional-disclosure criteria are the most important decision gate in the compliance checklist. Stinger-forge should embed them as a checklist: if even ONE criterion is not met, the data type MUST be declared.
- The ability to update privacy label answers without an app update is a frequently missed operational fact: important for the post-launch update cadence guide.
- The requirement to include third-party SDK data practices is where most developers get tripped up. Stinger-forge should recommend auditing every SDK's privacy manifest before first submission.
- Cross-reference with the PrivacyInfo.xcprivacy technical note for the binary-level enforcement layer.
