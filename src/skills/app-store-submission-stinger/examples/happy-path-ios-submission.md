# Example: Happy Path iOS Submission

*Demonstrates: ASO setup, compliance checklist, submission workflow, approval*
*Guides referenced: `guides/01-aso-strategy.md`, `guides/02-compliance-checklist.md`, `guides/05-timeline-and-process.md`*

---

## Scenario

**App:** "FocusFlow", a productivity timer app with a 7-day free trial subscription
**Category:** Productivity
**Monetization:** Auto-renewable subscription ($4.99/month, $29.99/year)
**Target audience:** Adults (17+)
**Platform:** iOS only, first submission

---

## Step 1: ASO metadata (3 days before submission)

### Title and subtitle

```
Title:    Focus Timer - Deep Work Planner    (33 chars)
Subtitle: Pomodoro & Time Blocking           (28 chars)
```

**Keyword field (98 chars):**
```
pomodoro,time block,productivity,deep work,focus,concentration,work timer,study,task
```

Verification:
- No app name in keywords ✓
- No competitor names ✓
- No trademark violations ✓
- No spaces after commas ✓
- Under 100 chars ✓

### Screenshots (3 required, 8 produced)

Device sizes: 6.7" iPhone 15 Pro Max + 12.9" iPad Pro

Story sequence:
1. Hero: "Deep work starts here" (timer active state)
2. Feature: "Block schedule your day" (time block calendar view)
3. Feature: "Stay in the zone" (focus score tracking)
4. Social: "Join 50,000+ focused professionals" (not misleading, verified user count)
5-8: Edge features and settings

Caption text (2026 indexed by Apple):
- Frame 1 caption: "Deep focus timer & Pomodoro tracker"
- Frame 2 caption: "Time blocking for deep work"

---

## Step 2: Compliance (2 days before submission)

### Privacy nutrition label

FocusFlow data collection audit:

| Data type | Collected? | Linked to identity? | Used for tracking? |
|---|---|---|---|
| User ID | Yes (auth) | Yes | No |
| Email | Yes (auth) | Yes | No |
| Usage data: product interaction | Yes (analytics: PostHog) | Yes | No |
| Diagnostics: crash data | Yes (Sentry) | No | No |

Nutrition label declarations:
- "Contact Info > Email Address": linked to identity, analytics + app functionality
- "Identifiers > User ID": linked to identity, app functionality
- "Usage Data > Product Interaction": linked to identity, analytics
- "Diagnostics > Crash Data": not linked, analytics

### PrivacyInfo.xcprivacy audit

Libraries in use: PostHog iOS SDK, Sentry iOS SDK, StoreKit 2 (system), RevenueCat iOS SDK

RevenueCat SDK check: RevenueCat ships `PrivacyInfo.xcprivacy` as of SDK v4.32+. Verify with `pod spec cat RevenueCatUI` or in Xcode Package navigator.

Required-reason API exposure in FocusFlow:
- `UserDefaults` (used for settings storage): required by app, declare reason `CA92.1` (app-owned defaults only)
- No system boot time, file timestamps, disk space, or active keyboard APIs in use

Result: No SDK-level PrivacyInfo.xcprivacy gap. Manifest complete.

### Age rating questionnaire

FocusFlow questionnaire answers:
- Cartoon violence: None
- Mature/suggestive themes: None  
- Gambling: None
- Health/medical: None (productivity timer)
- Infrequent/mild simulated gambling: None

Result: **4+** (no age-restricted content)

### Subscription terms (required for IAP)

Displayed in paywall view:
```
FocusFlow Premium
• 7-day free trial
• $4.99/month after trial, billed monthly
• $29.99/year (save 50%) after trial, billed annually
• Cancel anytime in iOS Settings > Apple ID > Subscriptions
• Payment charged to your Apple ID account at confirmation
• Subscription automatically renews unless canceled 24 hours before the current period ends
```

---

## Step 3: Build and upload

```bash
# Archive in Xcode
Product > Archive
# Validate in Organizer
Validate App > run validation pass
# Upload
Distribute App > App Store Connect > Upload
```

Upload completes. Build appears in App Store Connect > TestFlight within 15 minutes.

---

## Step 4: App Store Connect metadata completion

In App Store Connect > My Apps > FocusFlow > iOS > (new version):

- [x] Version string: 1.0.0
- [x] What's new: (first submission, leave blank or write intro text)
- [x] Screenshots: uploaded for 6.7" and 12.9" sizes
- [x] App Preview: none for first submission
- [x] Age Rating questionnaire: completed (result: 4+)
- [x] App Privacy: completed
- [x] App Review Information:
  - Demo account: `reviewer@focusflow.test` / `ReviewTest2026!`
  - Notes: "Main flow: Create an account → start a focus session (25 min timer) → view focus report. IAP: tap 'Try Premium Free' button on homescreen."
- [x] Pricing: Free (subscription handles revenue)

Submit for Review.

---

## Step 5: Review period

Timeline: 3 business days (consistent with 2026 baseline for new app)

Status progression:
- Day 0 12:00pm: "Waiting for Review"
- Day 2 9:30am: "In Review"
- Day 2 2:45pm: "Ready for Sale"

---

## Approval

FocusFlow approved. Release immediately (pre-selected manual release date passed; set phased release to 7 days).

**Total wall-clock time from submission to approval: 2 days 2.75 hours**

---

## Lessons for this submission

1. Screenshot captions with keywords provided an immediate ranking boost in "productivity" and "deep work" categories
2. RevenueCat's bundled PrivacyInfo.xcprivacy prevented what would otherwise have been a compliance rejection
3. Providing demo credentials eliminated the chance of "we could not complete review" rejection
4. The 7-day free trial was accepted without issue under Guideline 3.1.2 (subscription terms visible at point of conversion)
