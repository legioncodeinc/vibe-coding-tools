# Principles: The Gatekeeper Mindset

*Source: synthesized from `research/external/2026-05-20-app-store-rejection-reasons-index.md`, `research/external/2026-05-20-app-store-review-times-2026.md`*

---

## The fundamental mental model

When you submit an app to App Store or Google Play, you are asking a human (and increasingly an automated pre-checker) to spend 30-60 seconds understanding a stranger's app and deciding whether it meets a very large, frequently updated rulebook. The reviewer is not an adversary; they are a quality gate operating under time pressure with imperfect information.

**Consequence for you:** Your app must be self-explanatory. The reviewer will not read your support docs. They will open the app, try the core flow, look at your metadata, and check a policy checklist. If anything is unclear, confusing, or missing, the safe default is rejection with a generic reason code.

---

## Apple vs Google: divergent philosophies

Understanding the rejection philosophy of each platform prevents you from applying the wrong remediation.

### Apple's rejection philosophy

Apple's reviewer is primarily checking:

1. **Metadata accuracy**: does the app actually do what the metadata claims? Screenshots match functionality? Title not misleading?
2. **Privacy compliance**: are all data collection types declared? Is PrivacyInfo.xcprivacy present for all required-reason APIs?
3. **Quality bar**: does the app crash? Are there placeholder screens? Does it function on the stated OS version?
4. **Policy compliance**: IAP for digital goods, no private APIs, content ratings match content.

Most Apple rejections are fixable in 1-2 iterations. The dangerous ones are Guideline 4.3 (spam/low value) and Guideline 3.1.1 (mandatory IAP for digital goods); these require substantive app changes.

*Key insight from research:* The most common source of PrivacyInfo.xcprivacy rejections in 2026 is a **third-party SDK** that uses a required-reason API without shipping its own manifest. The app developer must either wait for the SDK to ship a manifest or audit and declare the SDK's usage themselves.

### Google Play's rejection philosophy

Google's reviewer is primarily checking:

1. **Policy compliance**: permissions policy, data safety accuracy, content policy.
2. **Data safety accuracy**: the declared data types must match what the APK/AAB actually does (Google uses automated scanning).
3. **Target API level**: app must target the current-year API requirement.
4. **Content policy**: harmful content, impersonation, misleading behavior.

Google rejections are more frequently driven by automated policy scanning than by human review. This means the rejection reason is often more specific and actionable than Apple's, but it also means the automated scanner can flag false positives.

---

## The "literal reading" trap

Apple's rejection notes are frequently terse and sometimes misleading when read literally. For example:

- "Your app did not perform as expected" often means the reviewer tried a feature and encountered something they did not expect, not that the app crashed.
- "Your app contains deprecated / no longer supported content" on a fresh app often means the reviewer is on a device configuration that exposes a layout issue, not that you are using deprecated APIs.

**Protocol:** When a rejection note is ambiguous, produce TWO interpretations and TWO remediation paths before re-submitting. One wrong interpretation = one wasted resubmission cycle. See `guides/03-rejection-playbook.md` for the decision tree.

---

## Timeline reality in 2026

Do not plan releases around Apple's stated "approximately 24 hours" average. As documented in `research/external/2026-05-20-app-store-review-times-2026.md`:

- New app submissions: 2-5 days (104% YoY volume increase in April 2026)
- App updates: 24-72 hours
- Expedited review: available but being approved less frequently; treat as scarce; qualifying criteria in `guides/05-timeline-and-process.md`

Google Play new apps: 3-7 days (manual policy review is the long pole for new publishers).

**Practical consequence:** Build at least 5 business days into your launch timeline for first submissions and 3 days for updates.

---

## Non-negotiables (carry into every report)

1. **Cite guideline sections by number.** Not "your privacy policy is insufficient": "App Review Guideline 5.1.1 (Privacy) requires..." Developers need the citation for appeals.
2. **Never recommend policy workarounds.** Clever bypasses that pass today's review can trigger retroactive removal.
3. **Flag children's category issues first.** COPPA / CIPA / GDPR-K failures carry the highest regulatory and account-termination risk. Always surface them at the top of any report.
4. **Timeline estimates are ranges.** "Probably 2-4 business days, 80% confidence" beats "24-48 hours."
