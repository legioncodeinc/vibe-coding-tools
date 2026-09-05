# Rejection Playbook: Diagnosis and Remediation

*Source: `research/external/2026-05-20-app-store-rejection-reasons-index.md`, `research/external/2026-05-20-google-play-rejection-patterns-2026.md`*

---

## When a rejection arrives: the first 10 minutes

1. **Do not re-submit immediately.** Re-submitting before you understand the rejection restarts the review queue timer and burns a submission cycle.
2. **Read the full rejection text.** Copy it into a document. Note: every guideline code mentioned, every phrase that could be ambiguous.
3. **Identify the rejection type** (taxonomy below).
4. **Produce two interpretations** if the note is ambiguous. Build two remediation plans. Choose one only after ruling out the other.

---

## Rejection taxonomy

### iOS rejection types

#### Type A: Metadata rejection

The rejection is about what your store listing claims, not about the app binary.

**Common codes:**
- **2.3.1**: "Your screenshots do not sufficiently reflect your app in use" (screenshots don't match actual functionality)
- **2.3.3**: "Your app name contains content that is not appropriate"
- **2.3.4**: "Your app contains placeholder text"
- **2.3.7**: "Your binary contains non-public API usage described in metadata" (usually: your description mentions a feature that needs a special entitlement)

**Remediation pattern:** Fix the metadata to match the app, or fix the app to match the metadata. Never try to hide functionality.

#### Type B: Policy rejection

The app's functionality or business model violates a guideline.

**Common codes:**
- **3.1.1**: "Your app uses features that require customers to make in-app purchases, but your app does not offer in-app purchasing" (you have premium features with no IAP), or the reverse: "Your app uses a non-approved external payment method"
- **3.1.2**: Subscription-specific: incorrect subscription terms disclosure, missing restoration flow
- **4.3**: "This app is a duplicate of apps already in the App Store": this is the most dangerous rejection; it usually means the app is too simple or too similar to a common utility app
- **5.1.1**: Privacy policy missing or inadequate
- **5.1.2**: Permissions not justified with purpose strings, or requesting unnecessary permissions
- **5.3.4**: Inaccurate age rating relative to content

**Remediation pattern:** The guideline section number tells you exactly which part of the App Review Guidelines to read. Read that section completely, not just the heading.

#### Type C: Binary / quality rejection

The app crashed, a feature didn't work during review, or the app is below quality bar.

**Common codes:**
- **2.1**: "We discovered one or more bugs": attach screenshots, device info, and reproduction steps in your reply; request a call with the reviewer if needed
- **2.4.1**: Battery, performance, or power issues
- **2.4.5**: "Your app is not compatible with the currently supported devices", often an Xcode build settings issue, not a code issue

**Remediation pattern:** Build the fix, retest on a clean simulator with the specific OS version mentioned in the rejection, upload a new build.

#### Type D: Legal / rights rejection

- **5.2.1**: Intellectual property: using trademarked terms, character likenesses, or brand assets without authorization
- **5.2.2**: Design / patent concerns (rare but escalating)
- **5.5**: Developer code of conduct violation

**Remediation pattern:** Remove the offending content. IP rejections often require you to prove ownership or obtain a license. These cannot be workaround-engineered.

#### Type E: 2026-specific rejections

- **AI-generated content disclosure**: Apple is increasingly requiring disclosure when an app uses AI to generate content displayed to users. The rejection note typically references guidelines 1.1.6 or a custom note. Remediation: add an in-app disclosure and update the privacy label to include the AI inference provider.

> **TODO: open question**: Apple has not published a specific guideline section for AI-generated content disclosure as of research date. Treat any note mentioning "AI-generated content" as a good-faith compliance requirement and add disclosure language. (See `research/research-summary.md` open question #4.)

---

### Android rejection types

Google Play rejections are more mechanistic and usually cite a specific policy section.

#### Data safety mismatch

The declared data types in your data safety form do not match what automated scanning found in the APK.

**Remediation:** Update the data safety form to accurately reflect all data collected, shared, and stored. Run a network trace in an Android emulator to verify what your SDKs actually send.

#### Permissions policy violation (2026 priority)

Related to the April 2026 policy changes:
- Contacts permission without Contact Picker integration
- Precise location without Location Button
- Geofencing in a foreground service

**Remediation:** See `guides/02-compliance-checklist.md` for the migration paths.

#### Target API level violation

Google requires apps to target the current-year API level by August each year. Running below target triggers a policy warning, then a rejection for updates.

**Remediation:** Update `compileSdkVersion` and `targetSdkVersion` in `build.gradle`. Test all permission flows, as behavior-sensitive APIs change semantics with each API level.

#### Content policy violation

- Spam, low-quality content, or deceptive behavior
- Sexually explicit content outside designated adult section
- Dangerous goods or services

**Remediation:** Remove the violating content and update the app listing and privacy policy.

---

## The appeal process

### iOS appeal

1. After receiving a rejection, open App Store Connect > Resolution Center (or App Review portal)
2. Click "Reply to Review Team"; do not create a new submission yet
3. Write a professional, concise reply that either:
   a. Explains why the review was incorrect with specific evidence (screenshots, video), or
   b. Describes the specific change you are making to resolve the stated issue
4. Attach supplementary documentation: test credentials, demo video, step-by-step instructions
5. If after two exchanges you cannot resolve, request a call via "Schedule a Call With the Review Team"

**Escalation path:** App Review Board → use this for genuine policy ambiguity cases, not "we disagree with the ruling." The Board upholds most standard rejections. Use it when you have a novel use case not covered by the guidelines.

**Expedited review (iOS):**
- Available via App Review > Contact Us > Request Expedited Review
- Qualifying criteria: serious bug fix, app is down/broken in production, critical time-sensitive feature
- Approval is not guaranteed and is being approved less frequently in 2026 (research shows ~30% approval rate vs ~55% in 2023)
- Treat as scarce; use only when genuinely critical

### Android appeal

1. Google Play Console > Policy and programs > Policy status
2. Submit an appeal with a specific description of what you changed
3. Appeals are reviewed by a human policy team, typically within 3-5 business days

Android has no equivalent of the App Review Board call. For serious disputes, contact a Google Developer Relations partner (only available for enrolled partners).

---

## Decision tree: appeal vs fix vs abandon

```
Rejection received
    │
    ├─ Is the rejection clearly correct? → Yes → Fix it and re-submit
    │
    ├─ Is the rejection ambiguous?
    │       → Yes → Produce 2 interpretations + 2 fix plans
    │                    → If one interpretation requires 3+ days of work
    │                         → Reply to review explaining interpretation A,
    │                            ask for clarification before implementing B
    │
    ├─ Is the rejection factually wrong? (Your app does not do what they claim)
    │       → Yes → Reply with evidence (video + screenshots)
    │                    → Wait 48h for response before building a fix
    │
    └─ Is this Guideline 4.3 (spam / low value)?
            → Yes → This is serious. Apple is questioning the app's entire
                     value proposition. Schedule a call with the review team.
                     A minor fix will not resolve a 4.3; you need to demonstrate
                     differentiated value.
```

---

## Template reference

Use `templates/rejection-remediation-plan.md` to structure your response to any rejection.
