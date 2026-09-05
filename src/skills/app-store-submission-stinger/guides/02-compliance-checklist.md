# Compliance Checklist: Privacy, Age Rating, Data Safety

*Source: `research/external/2026-05-20-privacy-manifest-requirements-2026.md`, `research/external/2026-05-20-apple-privacy-nutrition-labels-2026.md`, `research/external/2026-05-20-google-play-policy-updates-april-2026.md`*

---

## iOS compliance

### 1. Privacy Nutrition Label (App Store Connect > App Privacy)

Complete the privacy label BEFORE submission. It is required: the submit button is blocked until the label is filled in.

#### Data type mapping

For each of the following data types, declare YES if your app (or any SDK the app links to) collects, transmits, or stores it:

| Category | Data types | Common sources to check |
|---|---|---|
| Contact info | Name, email, phone, address | Auth SDK, CRM integrations |
| Health & fitness | Health data, fitness data | HealthKit, any fitness tracking |
| Financial info | Credit card, payment info, bank account | Stripe, payment SDKs |
| Location | Precise location, coarse location | Maps, geolocation features |
| Identifiers | User ID, Device ID | Analytics SDKs, ad networks |
| Usage data | Product interaction, advertising data | Analytics (PostHog, Mixpanel, Firebase) |
| Diagnostics | Crash data, performance data | Sentry, Crashlytics |

**For each declared type, answer:**
1. Is it linked to the user's identity?
2. Is it used for tracking (cross-app tracking)?
3. Is it used for app functionality / analytics / product personalization / third-party advertising?

#### PrivacyInfo.xcprivacy manifest

Required if your app uses any API in one of Apple's five required-reason API categories:

| API category | Example APIs | Required-reason codes |
|---|---|---|
| File timestamp | `NSFileCreationDate`, file attribute timestamps | C617.1, 16A8F.1, etc. |
| System boot time | `NSProcessInfo.systemUptime` | 35F9.1, 8FFB.1, etc. |
| Disk space | `NSFileSystemFreeSize`, `volumeAvailableCapacityForImportant` | E174.1, 85F4.1, etc. |
| User defaults | `UserDefaults` | CA92.1, 1C8F.1, etc. |
| Active keyboard | Third-party keyboard extensions | 54BD.1 only |

**Critical 2026 finding:** The most common PrivacyInfo.xcprivacy rejection is caused by a **third-party SDK** using a required-reason API without shipping its own manifest. Check your major SDKs:
- Firebase / Google Analytics
- Meta Audience Network
- AppsFlyer / Adjust
- RevenueCat

If the SDK does not ship a manifest, you must either wait for the vendor to ship one or add a declaration for the SDK's usage in your own `PrivacyInfo.xcprivacy`.

**Pre-flight verification:**
```bash
# Xcode 15+: check for manifest before archiving
Product > Archive > Validate App > Check Privacy Report
```

If Xcode reports missing manifests, address them before upload to App Store Connect. Apple's automated pre-review will also flag this, but better to catch it locally.

### 2. Age Rating Questionnaire

Access: App Store Connect > App Information > Content Rights > Age Rating

Complete every applicable section honestly. Apple's reviewers verify against the actual app content. Common sections:

- Cartoon or fantasy violence
- Realistic violence
- Sexual content or nudity
- Mature/suggestive themes
- Horror/fear themes
- Medical/treatment information
- Gambling / contests / sweepstakes
- Alcohol, tobacco, or drug references

**If your app is for children (age rating 4+):**
- No third-party analytics SDKs that track users (COPPA restriction)
- No behavioral advertising
- No IAP without parental approval mechanism (iOS 18+ Screen Time enforced)
- No links to external websites without age-gating
- Apple holds children's apps to a higher metadata accuracy standard: every screenshot must reflect exactly what the app does at the targeted age level

---

## Android compliance

### 1. Data Safety Form (Play Console > Store presence > App content > Data safety)

The data safety form is separate from your privacy policy but must be consistent with it. Google uses automated scanning to verify declarations against the actual APK.

**Key sections:**
- **Data collection:** Does your app collect or share any of the listed data types?
- **Data handling:** Is it required (cannot be declined by user), optional, or ephemeral (never stored beyond session)?
- **Security practices:** Is data encrypted in transit? Can users request deletion?

Do NOT underdeclare. Google's Play Protect scanner detects data transmissions and will flag discrepancies between your declaration and your app's actual behavior. Underdeclaration is a policy violation; overdeclaration merely creates a slightly worse store listing.

### 2. IARC Age Rating Questionnaire

Access: Play Console > Store presence > App content > App ratings

Google uses IARC (International Age Rating Coalition). Complete the questionnaire: it is mandatory. The questionnaire generates ratings for 35+ rating bodies (ESRB, PEGI, USK, etc.) simultaneously.

**After completing:** Download the IARC certificate. If a regulator ever queries your rating, this certificate is your documentation.

### 3. April 2026 Policy Changes (Deadlines: October 28, 2026)

Three breaking policy changes landed on April 15, 2026. Any Android app in the affected categories must comply by October 28, 2026:

#### 1. Contacts permissions → Android Contact Picker required

**Affected apps:** Any app that requests `READ_CONTACTS` or `WRITE_CONTACTS`

**What changed:** Apps must now use Android's Contact Picker API instead of requesting direct contacts access. The user chooses which contacts to share; the app cannot enumerate the full contacts list.

**Migration path:**
1. Replace `READ_CONTACTS` permission with Contact Picker intent
2. Update Data Safety form: remove "Contacts" if you were only reading, or reclassify as "user-selected" if you still write contacts
3. Update your privacy policy to reflect the narrower access

#### 2. Precise location → Android Location Button required

**Affected apps:** Any app that requires `ACCESS_FINE_LOCATION`

**What changed:** Apps must present the system Location Button that clearly communicates "precise location will be shared." This is required in addition to the runtime permission dialog.

**Note:** Apps that use `ACCESS_COARSE_LOCATION` only are not affected.

#### 3. Geofencing removed from foreground service use cases

**Affected apps:** Any app using geofencing in a foreground service

**What changed:** Geofencing is no longer on the approved list of `foregroundServiceType` values. Apps doing geofencing must move to a background location approach or eliminate the foreground service.

> **TODO: open question**: Does the Google Play account transfer policy (May 27, 2026) affect pending informal transfers? Research flagged uncertainty about whether transfers in progress before that date are grandfathered. Recommend completing any pending transfers through the official Console transfer tool before May 27, 2026. (See `research/research-summary.md` open question #5.)

---

## Children's apps: special handling

Children's apps on both platforms are subject to materially stricter compliance requirements. These must be surfaced at the top of any submission report.

| Requirement | iOS | Android |
|---|---|---|
| Third-party analytics | Prohibited | Restricted (must be declared in data safety; behavioral tracking prohibited) |
| Advertising | No behavioral/targeted advertising | Contextual only; no interest-based ads |
| IAP | Allowed but must have parental approval mechanism | Allowed; must comply with COPPA |
| External links | Prohibited without age-gating | Restricted |
| Data sharing with third parties | Prohibited except for core functionality | Restricted; COPPA consent required |

COPPA (US), CIPA, and GDPR-K (EU) all apply to children's apps and have independent enforcement mechanisms beyond the store platforms. Consult legal counsel for apps targeting under-13 users.
