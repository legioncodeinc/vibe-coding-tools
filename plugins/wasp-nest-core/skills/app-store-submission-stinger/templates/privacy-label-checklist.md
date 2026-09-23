# Privacy Label Checklist

Pre-flight checklist for iOS Privacy Nutrition Label and Android Data Safety Form. Complete this before any first submission or any update that adds new data collection.

---

## iOS: Privacy Nutrition Label

Access: App Store Connect > My Apps > [App] > iOS > [Version] > App Privacy

### Step 1: Audit actual data collection

List every data type your app (and all linked SDKs) collects, transmits, or stores:

| Data type | Collected by | Linked to identity? | Used for tracking? | Purpose(s) |
|---|---|---|---|---|
| Email | [your auth / SDK] | [ ] Yes  [ ] No | [ ] Yes  [ ] No | [app functionality / analytics / etc.] |
| User ID | | | | |
| Crash data | [Sentry / Crashlytics] | [ ] Yes  [ ] No | [ ] No | Diagnostics |
| Product interaction | [PostHog / Mixpanel] | | | |
| Coarse location | | | | |
| Precise location | | | | |
| [add rows] | | | | |

### Step 2: SDK inventory

Check each SDK for its own PrivacyInfo.xcprivacy manifest:

| SDK | Ships PrivacyInfo.xcprivacy? | Required-reason APIs used | Action needed |
|---|---|---|---|
| Firebase | [ ] Yes  [ ] No  [ ] Unknown | UserDefaults, system boot | Verify v10.x+ |
| Sentry | [ ] Yes  [ ] No  [ ] Unknown | File timestamps | Verify v8.x+ |
| RevenueCat | [ ] Yes  [ ] No  [ ] Unknown | None (as of v4.32+) | None |
| Meta SDK | [ ] Yes  [ ] No  [ ] Unknown | Disk space, user defaults | Verify latest |
| AppsFlyer | [ ] Yes  [ ] No  [ ] Unknown | File timestamps | Verify latest |
| [add SDK] | | | |

### Step 3: PrivacyInfo.xcprivacy validation

```
Xcode: Product > Archive > Validate App > Privacy Manifest check
```

- [ ] All five required-reason API categories accounted for
- [ ] No "missing reason" warnings in Xcode validation
- [ ] Reasons chosen from Apple's predefined list (custom reasons are not accepted)

### Step 4: Complete the label in App Store Connect

For each declared data type, confirm:
- [ ] Correct category selected
- [ ] "Data linked to you" / "Data not linked to you" correctly classified
- [ ] "Used to track you" accurately reflects cross-app tracking status
- [ ] All declared purposes (app functionality, analytics, product personalization, etc.) are accurate

---

## Android: Data Safety Form

Access: Play Console > Store presence > App content > Data safety

### Step 1: Audit actual data collection (same audit as above)

Use the same table from iOS Step 1. The declarations should be consistent with your iOS nutrition label.

### Step 2: Complete the form

| Section | Status |
|---|---|
| Does your app collect or share any of the listed user data? | [ ] Yes  [ ] No |
| Is all data encrypted in transit? | [ ] Yes  [ ] No (explain) |
| Do you provide a way for users to request data deletion? | [ ] Yes  [ ] No (explain) |

For each data type collected:
- [ ] Category correctly identified
- [ ] Purpose(s) declared (account management, analytics, advertising, etc.)
- [ ] Required vs. optional correctly classified
- [ ] Sharing with third parties declared if applicable

### Step 3: Consistency check

- [ ] Data Safety form declarations match app's privacy policy
- [ ] Data Safety form declarations match what APK/AAB actually transmits (run network trace to verify)
- [ ] No data types omitted because "we don't think users care": declare everything

---

## Sign-off

- [ ] iOS Privacy Label: complete and accurate
- [ ] Android Data Safety: complete and accurate
- [ ] Consistency between both platforms confirmed
- [ ] Privacy policy updated to match current declarations

**Completed by:** [name]
**Date:** [YYYY-MM-DD]
**Version:** [x.y.z]
