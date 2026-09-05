---
source_url: https://mobileapp.wiki/en/store-policies/privacy-manifest-guide
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: privacy-compliance
stinger: app-store-submission-stinger
---

# Privacy Manifest Requirements: What You Need to Know in 2026 | Mobile App Wiki

## Summary
Practitioner guide to PrivacyInfo.xcprivacy privacy manifest requirements as enforced in 2026. Covers the four manifest keys (NSPrivacyTracking, NSPrivacyTrackingDomains, NSPrivacyCollectedDataTypes, NSPrivacyAccessedAPITypes), the five "required reason API" categories that must declare purposes, the pre-defined list of acceptable reasons (no custom reasons allowed), third-party SDK signature requirements, and the most common rejection patterns related to privacy manifests.

## Key quotations / statistics
- "A privacy manifest is a file called PrivacyInfo.xcprivacy that you include in your app's Xcode project. It declares what data your app collects, why it accesses certain APIs, and what tracking domains it contacts. Apple introduced this requirement in 2024, and as of 2026, it is strictly enforced for all app submissions."
- **Five required-reason API categories:**
  | API Category | Example APIs |
  |---|---|
  | File timestamp | NSFileCreationDate, NSFileModificationDate |
  | System boot time | systemUptime, mach_absolute_time |
  | Disk space | volumeAvailableCapacity |
  | User defaults | UserDefaults (shared containers) |
  | Active keyboard | activeInputModes |
- "For each API you use, you must select from Apple's predefined list of acceptable reasons. You cannot create custom reasons."
- "Starting February 12, 2025, apps you submit for review in App Store Connect must contain a valid privacy manifest file for a certain number of commonly used third-party SDKs."
- "If you integrate an unsigned version of a listed SDK, your app submission will be rejected."
- **Most common manifest rejection:** "Your app (or one of your SDKs) uses a required reason API but does not declare it in the manifest."
- **Verification checklist before submitting:**
  - PrivacyInfo.xcprivacy exists in main app target
  - All required reason API usages are declared with valid reasons
  - Tracking domains are listed if NSPrivacyTracking is true
  - Collected data types match App Store Connect privacy labels
  - All third-party SDKs include their own privacy manifests
  - All listed third-party SDKs are properly signed

## Annotations for stinger-forge
- The five required-reason API categories with examples should be reproduced as a table in `guides/02-compliance-checklist.md`. These are the binary-level privacy enforcement triggers.
- The "no custom reasons allowed" constraint is not obvious and is the source of many developer frustrations. The stinger should note this and link to Apple's predefined reasons list.
- The SDK signature requirement (not just the manifest) is an additional compliance layer that many developers miss when using older SDK versions.
- The verification checklist is directly usable as the pre-flight checklist template in the stinger's `templates/` folder.
