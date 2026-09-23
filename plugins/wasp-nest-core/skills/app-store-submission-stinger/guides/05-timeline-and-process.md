# Timeline, Process, and Expedited Review

*Source: `research/external/2026-05-20-app-store-review-times-2026.md`, `research/external/2026-05-20-eu-dma-app-store-compliance-2026.md`*

---

## 2026 review time baselines

Apple's historically stated "approximately 24 hours" average is no longer representative for new app submissions. The 104% YoY increase in submission volume in April 2026 has systematically increased baseline times.

| Scenario | 2026 baseline | Confidence |
|---|---|---|
| iOS new app (first submission) | 2-5 business days | High |
| iOS app update | 24-72 hours | High |
| iOS critical bug fix (no expedited) | 24-72 hours | Medium |
| Android new app (new publisher) | 3-7 business days | High |
| Android app update (established publisher) | 2-48 hours | High |
| Android new app (new publisher + manual policy review) | 5-14 business days | Medium |

**Release planning rule:** Add 5 business days to your timeline for first submissions, 3 business days for updates.

---

## iOS: submission workflow

### Before submission

1. **Finalize the build** in Xcode:
   - Archive: `Product > Archive`
   - Validate App: runs local checks before upload
   - Upload to App Store Connect via Xcode Organizer or `altool` / `notarytool`

2. **Complete App Store Connect metadata:**
   - Version information (what's new text)
   - Screenshots for all required device sizes
   - Privacy label (must be complete before submission button is active)
   - Age rating (complete questionnaire)
   - Support URL and marketing URL
   - App Review Information: demo account credentials if app requires login (reviewers will be locked out without these)

3. **Check the App Review Information section**: provide:
   - Contact information
   - Demo account username and password (mandatory if any flow requires login)
   - Notes for the reviewer explaining any non-obvious features
   - Attachment: demo video if the core flow is hard to access

### Submission states

```
Developer uploads build
    │
    └── Waiting for Review    (in queue; 2-5 days for new, 24-72h for updates)
            │
            └── In Review     (reviewer is active; typically 1-4 hours)
                    │
                    ├── Ready for Sale (approved)
                    │
                    └── Rejected    → Resolution Center for response
```

### After rejection: response etiquette

- Reply within 24 hours to maintain your queue position
- Be concise, professional, and specific about what changed
- Attach evidence (video, screenshots) for quality/crash rejections
- Do not argue without evidence; appeals are won on facts, not assertions

---

## iOS: TestFlight beta review

TestFlight builds also require App Review, but the standard is lower:
- Beta reviews typically complete within 1-2 days
- Beta apps must still comply with most App Review Guidelines
- App Store privacy labels are NOT required for TestFlight-only apps (until App Store submission)
- PrivacyInfo.xcprivacy IS required if the app uses required-reason APIs: this catches many developers by surprise

**Beta groups:**
- Internal testers (up to 100, Apple ID employees): no review required
- External testers (up to 10,000): requires beta app review before first invitation

---

## iOS: expedited review

Expedited review is a real escalation path, but treat it as a scarce resource.

**Qualifying criteria (Apple's stated criteria):**
- Serious bug fix for a production app that is broken for users
- Legal or regulatory requirement (e.g., court order, regulatory deadline)
- Time-sensitive feature tied to a real-world event (e.g., election result, sports event)

**How to request:**
1. Go to App Review > Contact Us > Request Expedited App Review
2. Fill in: app name, App Store Connect link, version, reason for urgency, impact if delayed
3. Apple's response is typically within 24 hours (approval or denial)

**2026 reality:** Approval rate is down significantly. Research documents ~30% approval rate in 2026 vs ~55% in previous years. Use expedited review only when truly critical. See `research/external/2026-05-20-app-store-review-times-2026.md`.

> **TODO: open question**: The "twice a year" hard limit for expedited review is cited in community sources but not confirmed in Apple's documentation, which says only "extenuating circumstances." Treat expedited review as effectively rate-limited regardless of the exact cap. (See `research/research-summary.md` open question #2.)

---

## Android: submission workflow

### Before submission

1. **Build the release:**
   ```bash
   # Build signed AAB (recommended over APK for Play Store)
   ./gradlew bundleRelease
   ```

2. **Play Console steps:**
   - Create a new release in the target track (Internal > Closed > Open > Production)
   - Upload the signed AAB
   - Complete release notes for each supported language
   - Complete the data safety form (required before publication)
   - Complete IARC age rating questionnaire

3. **Release tracks:**

| Track | Who sees it | Review required |
|---|---|---|
| Internal testing | Up to 100 specified Google accounts | No review |
| Closed testing (alpha/beta) | Specified groups up to 20,000 | Minimal automated review |
| Open testing | Public opt-in beta | Automated + policy review |
| Production | All Play Store users | Full review |

### Play Store review: what triggers manual review

Google Play applies automated scanning to all releases. A human reviewer is assigned when:
- New app from a publisher with <3 apps
- App requests sensitive permissions (location, contacts, camera, microphone in combination)
- Data safety form declares significant data collection
- The app's target country list includes markets with special compliance requirements

---

## EU DMA compliance (iOS, EU only)

The EU Digital Markets Act required Apple to open iOS distribution in the EU. Key 2026 state:

- **Alternative marketplace apps** are available in the EU but adoption is low
- **Alternative payment providers:** EU apps under Apple's Alternative Terms Addendum can offer third-party payment options for digital goods
- **"No mix & match" rule:** Apps using Apple's Alternative Terms cannot offer both App Store IAP and an alternative PSP on the same storefront. The exact definition of "storefront" (per-country vs per-platform) has not been fully clarified.

> **TODO: open question**: The EU DMA "no mix & match" storefront scope definition is not definitively clarified in Apple's public documentation as of research date. Until this is clarified, assume "per country" scope, i.e., if you offer an alternative PSP in Germany (EU), you must also remove App Store IAP in Germany. (See `research/research-summary.md` open question #1.)

For apps NOT using the Alternative Terms, behavior is unchanged. The EU App Store operates with the same submission process as all other regions.

---

## App lifecycle update cadence

After launch, maintain submission hygiene:

- **Annual target API level update (Android):** Required each year or updates are blocked
- **Privacy label update:** Required within 30 days whenever data collection changes
- **ASO refresh:** Every 30 days for live apps (see `guides/01-aso-strategy.md`)
- **SDK audit:** After any dependency update that adds a new third-party SDK, re-audit the PrivacyInfo.xcprivacy and data safety form
