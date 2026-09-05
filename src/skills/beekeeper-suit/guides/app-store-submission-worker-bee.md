# app-store-submission-worker-bee

## Domain
Owns mobile app publication for iOS (App Store Connect + TestFlight) and Android (Google Play Console) from the point the binary is ready to the point the app is live with optimized metadata, accurate compliance declarations, and working IAP. Covers App Store Optimization, privacy compliance (Apple nutrition labels, PrivacyInfo.xcprivacy, Google data safety forms), rejection diagnosis via a two-interpretation protocol, age rating questionnaires, In-App Purchase configuration (StoreKit 2, Google Play Billing Library 7+), and realistic 2026 review-timeline expectations. Every guideline citation includes a section number.

## Paired Stinger
[app-store-submission-stinger](../../app-store-submission-stinger) - ASO strategy per platform, the full compliance checklist including April 2026 Android policy changes, the rejection playbook, and IAP setup patterns.

## Trigger phrases
- "help me submit my app to the App Store"
- "we got an App Store rejection, Guideline 2.1"
- "write our ASO strategy, keywords and screenshots"
- "fill out the privacy nutrition label"
- "set up in-app purchases with StoreKit 2"
- "why did Google Play reject our data safety form"
- "is expedited review worth requesting"
- "what's PrivacyInfo.xcprivacy and do we need it"

## Do NOT route when
- The request is UI design of the app itself; that is ux-ui-svelte-worker-bee.
- The request is client-side StoreKit or Play Billing implementation code; that is react-worker-bee or python-worker-bee. This Bee specifies the IAP configuration, not the code.
- The request is a security audit of the app binary; that is security-worker-bee.
- The app is in a children's category and COPPA/GDPR-K compliance has not been reviewed by counsel; flag this and stop rather than proceeding.
- The rejection is a Guideline 4.3 (spam/low value) case requiring a fundamental product change; escalate rather than treating it as a routine remediation.

## Inputs the Bee needs
- Platform (iOS/Android/both), stage (pre-submission, first submit, resubmission, update), and monetization model.
- Special category flags: children's content, health data, financial services, gambling.
- Full rejection text, if a rejection is present.

## Outputs
- A submission-readiness report with a go/no-go verdict per category and prioritized blockers.
- ASO metadata (title, subtitle, keywords, screenshot captions) per platform.
- A rejection-remediation plan with two interpretations and a drafted reply to the review team, when applicable.

## Commonly sequenced with
- react-worker-bee / python-worker-bee: implement the StoreKit 2 or Play Billing code this Bee specifies.
- ux-ui-svelte-worker-bee: owns the app UI that ASO screenshots and previews showcase.
- security-worker-bee: audits the binary separately from this Bee's compliance-declaration work.
