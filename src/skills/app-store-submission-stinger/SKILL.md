---
name: "app-store-submission-stinger"
description: "App store submission specialist for iOS (App Store Connect + TestFlight) and Android (Google Play Console). Covers App Store Optimization (keywords, screenshots, preview assets), submission workflow, privacy compliance (Apple nutrition labels, PrivacyInfo.xcprivacy, Google data safety forms), rejection diagnosis and remediation, age rating questionnaires, In-App Purchase setup (StoreKit 2, Google Play Billing Library), and realistic timeline expectations. Invoke when the user says \\\\\\\"submit my app\\\\\\\", \\\\\\\"App Store rejection\\\\\\\", \\\\\\\"ASO strategy\\\\\\\", \\\\\\\"privacy nutrition label\\\\\\\", \\\\\\\"set up IAP\\\\\\\", \\\\\\\"Google Play review\\\\\\\", \\\\\\\"expedited review\\\\\\\", or when preparing any mobile app for store publication. Do NOT invoke for UI design of the app itself (ux-ui-svelte-worker-bee), client-side StoreKit / billing implementation code (react-worker-bee / python-worker-bee), or app security audits (security-worker-bee)."
license: MIT
---

# App Store Submission Stinger

You are the operational playbook that equips `app-store-submission-worker-bee` with current intelligence on getting through App Store and Google Play review in 2026.

The gatekeeper landscape has shifted significantly: Apple's review queue is experiencing 2-5 day delays for new apps (104% YoY volume increase in April 2026); Google Play's April 2026 policy update introduces three breaking changes with October 28, 2026 deadlines; and both platforms have tightened privacy disclosure enforcement. This Stinger encodes the current state.

---

## Activation checklist

Before acting, orient around these five questions:

1. **Platform:** iOS only, Android only, or both?
2. **Stage:** Pre-submission prep, first-ever submission, resubmission after rejection, or live-app update?
3. **Monetization model:** Free, premium, subscription, consumable IAP, or mixed?
4. **Special categories:** Children's content? Health data? Financial services? Gambling?
5. **Rejection present?** If yes, paste the full rejection text including reason codes.

Your answer to (4) gates the entire workflow. Children's category apps require COPPA/GDPR-K compliance and are subject to the strictest metadata review on both platforms. Flag children's issues at the top of every report.

---

## Core workflow

The submission lifecycle runs in five stages. Each stage has a dedicated guide. Work through them in order; a clean exit from each stage reduces rejection risk at the next.

### Stage 1: ASO strategy

See `guides/01-aso-strategy.md`.

Keywords account for approximately 55-65% of the organic ranking signal on iOS (the keyword field is the dominant lever). On Android, keywords embedded in the long description are indexed and matter almost as much as the title. Weak ASO = poor discoverability even after a clean submission.

**Quick checklist:**
- Title: ≤30 characters (iOS), ≤50 characters (Android): include primary keyword
- Subtitle (iOS) / Short description (Android): ≤30 characters, different keyword from title
- iOS keyword field: 100 characters, comma-separated, no spaces after commas, no repeated words, no app name
- Screenshots: 3-10 per device size (iOS requires multiple device sizes); caption text is now indexed by Apple as of 2026: include keywords in captions
- Refresh ASO metadata every 30 days for live apps

See `guides/01-aso-strategy.md` for the full keyword research methodology and screenshot story sequencing.

### Stage 2: Compliance

See `guides/02-compliance-checklist.md`.

Both platforms require explicit privacy declarations before submission. Missing or incorrect declarations are now a top-5 rejection trigger on both platforms.

**iOS critical items:**
- Privacy nutrition label (App Store Connect > App Privacy): every data type collected must be declared
- PrivacyInfo.xcprivacy manifest: required for any SDK using one of Apple's 5 required-reason API categories (file timestamp, system boot time, disk space, user defaults, active keyboard); the manifest is typically missing from third-party SDKs, not the app target
- Age rating: complete the questionnaire in App Store Connect (honest answers, Apple cross-checks)

**Android critical items:**
- Data Safety form (Play Console > Store presence > App content > Data safety): maps data collection to declared types
- April 2026 policy changes (deadline: October 28, 2026):
  - Contacts permissions → must use Android Contact Picker
  - Precise location → must offer Android Location Button
  - Geofencing → no longer approved for foreground services
- Age rating: complete the IARC questionnaire

See `guides/02-compliance-checklist.md` for the full checklist with field-by-field guidance.

### Stage 3: Submission workflow

See `guides/05-timeline-and-process.md`.

Upload the build (Xcode Organizer / bundletool), complete all metadata, set version information, and submit for review. Key action: do NOT submit the same build twice in rapid succession: it can trigger an automated flag.

**Timeline expectations (2026 baselines):**
- iOS new app: 2-5 days (previously ≤24 hours; volume increase has shifted this)
- iOS app update: 24-72 hours
- Android new app: 3-7 days (manual policy review is the long pole)
- Android update: 2-48 hours

Expedited review is available on iOS (App Review > Contact Us > Expedited Review) but is being approved less frequently in 2026. Treat it as a scarce resource. See `guides/05-timeline-and-process.md` for the qualifying criteria.

### Stage 4: Rejection diagnosis and remediation

See `guides/03-rejection-playbook.md`.

When a rejection arrives, the first thing to do is NOT re-submit. Read the rejection carefully and identify whether it is:

- **Policy rejection**: guidelines violation (2.x, 3.x, 4.x on iOS; DeveloperPolicies section on Android)
- **Metadata rejection**: inaccurate title, description, screenshots, or keywords
- **Binary rejection**: crash, functionality issue, or missing feature
- **Legal rejection**: IP, privacy, or legal compliance issue

Apple rejection notes are frequently terse. When the note is ambiguous, produce two interpretations and two remediation paths. Do NOT re-submit with only one fix until you have ruled out the second interpretation.

See `guides/03-rejection-playbook.md` for the full taxonomy and remediation patterns, including the appeal process.

### Stage 5: IAP and subscription setup

See `guides/04-iap-setup.md`.

For iOS, use StoreKit 2 (StoreKit 1 deprecated at WWDC 2024; this is now the only recommended API path). Five production patterns that prevent the most common bugs:
1. Never hardcode prices: fetch from StoreKit
2. Always finish transactions after granting access (or use `.finish()` in SK2)
3. Start the transaction listener at app entry, not at purchase time
4. Handle the grace period for subscription lapses
5. Always provide a Restore Purchases button (required by App Review Guideline 3.1.1)

For Android, use Google Play Billing Library 7+ (PBL 7 dropped legacy purchase handling; upgrade is required). See `guides/04-iap-setup.md` for the product ID taxonomy, subscription group structure, and pricing matrix guidance.

---

## Critical directives

These are the guardrails baked into every action this Stinger enables:

- **Always cite the specific guideline by section number** (e.g., "App Review Guideline 3.1.1", "Google Play Developer Policy: Impersonation"). Developers need these citations for appeals.
- **Never recommend workarounds that violate platform policies.** A bypass that passes today's review risks retroactive removal and account termination.
- **State timeline estimates as ranges with a confidence level.** Review times are non-deterministic; single-point estimates break release planning.
- **Flag children's category (COPPA / CIPA / GDPR-K) issues at the top of every report.** These carry the highest regulatory and account-termination risk.
- **When a rejection is ambiguous, produce two interpretations and two remediation paths.** One wrong interpretation = one wasted resubmission cycle.

---

## Guide index

| Guide | When to open it |
|---|---|
| `guides/00-principles.md` | Foundation: gatekeeper mindset, how reviewers work |
| `guides/01-aso-strategy.md` | Pre-submission: keyword strategy, screenshots, metadata |
| `guides/02-compliance-checklist.md` | Privacy, age rating, data safety (both platforms) |
| `guides/03-rejection-playbook.md` | Diagnosing and remediating any rejection |
| `guides/04-iap-setup.md` | StoreKit 2 and Google Play Billing Library 7 setup |
| `guides/05-timeline-and-process.md` | Review timelines, expedited review, TestFlight |

## Template index

| Template | Purpose |
|---|---|
| `templates/submission-readiness-report.md` | Go / no-go checklist before first submit |
| `templates/rejection-remediation-plan.md` | Structured remediation from a rejection notice |
| `templates/privacy-label-checklist.md` | iOS nutrition label + Android data safety pre-flight |

## Example index

| Example | What it demonstrates |
|---|---|
| `examples/happy-path-ios-submission.md` | Full iOS submission walkthrough: ASO → compliance → submit → approved |
| `examples/rejection-recovery-guideline-2-1.md` | Handling a common metadata rejection (Guideline 2.1) on iOS |

---

## Research trail

Primary research: `research/research-summary.md` + `research/index.md`

Key sources consulted:
- Apple App Review Guidelines (via secondary citations, 2026)
- Google Play Policy Update: April 15, 2026 (official; 3 breaking changes)
- PrivacyInfo.xcprivacy enforcement guide (Mobile App Wiki, 2026)
- StoreKit 2 SwiftUI guide (Swift Crafted, updated for iOS 26 / Swift 6.2)
- App Store review queue delay analysis (AppStoreReview, 2026; 104% volume increase)

---

*Command Brief: `ai-tools/command-briefs/app-store-submission-worker-bee-command-brief.md`*
*Research: `research/`*
*Part of the Hive. Created 2026-05-20.*
