# Submission Readiness Report

Fill in this template before first submission or any major update submission. Every section marked [REQUIRED] blocks submission if blank.

---

## App: [App Name]
## Platform: [ ] iOS  [ ] Android  [ ] Both
## Version: [x.y.z]
## Submission type: [ ] First submission  [ ] Update  [ ] Resubmission after rejection
## Date: [YYYY-MM-DD]

---

## ASO Metadata

| Field | Completed | Notes |
|---|---|---|
| Title (iOS ≤30 / Android ≤50 chars) | [ ] | |
| Subtitle / Short description (≤30 chars) | [ ] | |
| iOS Keyword field (≤100 chars, no spaces after commas) | [ ] | |
| Android Long description (keyword-embedded, no stuffing) | [ ] | |
| Screenshots (all required device sizes) | [ ] | |
| Screenshot captions include keywords (iOS 2026) | [ ] | |
| App Preview / Promo Video (optional but recommended) | [ ] | |

**Go/No-go:** [ ] PASS  [ ] FAIL, blockers: [list]

---

## Privacy Compliance

### iOS [REQUIRED]

| Item | Status | Notes |
|---|---|---|
| Privacy Nutrition Label completed in App Store Connect | [ ] | |
| Every data type collected by app AND its SDKs declared | [ ] | |
| PrivacyInfo.xcprivacy present in app target | [ ] | |
| PrivacyInfo.xcprivacy present in all third-party SDKs using required-reason APIs | [ ] | Major SDKs to check: Firebase, Meta, AppsFlyer, RevenueCat |
| Xcode privacy report reviewed (Product > Archive > Validate App) | [ ] | |

### Android [REQUIRED]

| Item | Status | Notes |
|---|---|---|
| Data Safety form completed in Play Console | [ ] | |
| Data Safety form matches APK/AAB actual data transmissions | [ ] | |
| Contacts permission → Contact Picker used (if applicable) | [ ] | Deadline: Oct 28, 2026 |
| Location → Location Button used (if applicable, precise location) | [ ] | Deadline: Oct 28, 2026 |
| Geofencing not in foreground service (if applicable) | [ ] | Deadline: Oct 28, 2026 |

**Go/No-go:** [ ] PASS  [ ] FAIL, blockers: [list]

---

## Age Rating [REQUIRED]

| Item | Status |
|---|---|
| iOS Age Rating questionnaire completed (App Store Connect > App Information > Content Rights) | [ ] |
| Android IARC questionnaire completed (Play Console > App content > App ratings) | [ ] |
| Rating result matches actual content | [ ] |
| Children's app (under 13 target)? If yes, COPPA/GDPR-K audit complete | [ ] N/A  [ ] Yes, audited |

**Result rating (iOS):** [4+ / 9+ / 12+ / 17+]
**Result rating (Android):** [Everyone / Everyone 10+ / Teen / Mature 17+]

---

## IAP and Subscriptions

| Item | Status | Notes |
|---|---|---|
| All IAP products created in App Store Connect / Play Console | [ ] N/A  [ ] | |
| All products have localized prices and descriptions | [ ] N/A  [ ] | |
| Sandbox / test environment purchase tested end-to-end | [ ] N/A  [ ] | |
| Restore Purchases button present and functional (iOS, required) | [ ] N/A  [ ] | Required: Guideline 3.1.1 |
| Subscription terms visible at point of conversion | [ ] N/A  [ ] | Price, period, renewal, cancel instructions |
| No external payment references in UI or description | [ ] | |

**Go/No-go:** [ ] PASS  [ ] N/A  [ ] FAIL, blockers: [list]

---

## App Review Information (iOS)

| Item | Status | Notes |
|---|---|---|
| Demo account credentials provided | [ ] N/A  [ ] | Required if any flow needs login |
| Notes for reviewer on non-obvious features | [ ] | |
| Demo video attached (if needed) | [ ] | Recommended for complex flows |
| Contact info current | [ ] | |

---

## Build Quality

| Item | Status |
|---|---|
| App tested on minimum supported OS version | [ ] |
| App tested on latest OS release | [ ] |
| No crashes in main user flow | [ ] |
| No placeholder UI or "Coming Soon" screens visible in review flow | [ ] |
| All in-app links and URLs functional | [ ] |

---

## Overall verdict

| Category | Status |
|---|---|
| ASO Metadata | [ ] PASS  [ ] FAIL  [ ] WARN |
| Privacy Compliance | [ ] PASS  [ ] FAIL  [ ] WARN |
| Age Rating | [ ] PASS  [ ] FAIL  [ ] WARN |
| IAP | [ ] PASS  [ ] N/A  [ ] FAIL |
| App Review Information | [ ] PASS  [ ] FAIL  [ ] WARN |
| Build Quality | [ ] PASS  [ ] FAIL  [ ] WARN |

**Final verdict:** [ ] GO: submit now  [ ] NO-GO: resolve blockers first

**Blockers (if any):**
1. [blocker 1]
2. [blocker 2]

**Warnings (non-blocking but should be addressed before next submission):**
1. [warning 1]

**Timeline estimate:** [X-Y business days, confidence: high/medium/low]
Basis: [new app / update; platform; special category flags]
