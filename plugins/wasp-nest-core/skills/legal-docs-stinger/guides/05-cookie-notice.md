# Cookie Notice and Cookie Consent

**Source:** `research/external/2026-05-20-termly-vs-iubenda-comparison.md` + `research/external/2026-05-20-generator-landscape-2026.md`

---

## Cookie category taxonomy (4 categories)

All cookie notices must categorize cookies into these four types and allow granular consent by category (GDPR requirement):

| Category | Description | Consent required (GDPR)? | Consent required (CCPA)? |
|---|---|---|---|
| **Strictly necessary** | Login sessions, shopping cart, CSRF tokens, load balancing | No (legitimate interest) | No |
| **Functional / preference** | Language preference, theme, remembered user settings | Yes (or legitimate interest + opt-out) | No |
| **Analytics / performance** | Google Analytics, Mixpanel, Hotjar, session recording | Yes | Opt-out (not opt-in) |
| **Advertising / targeting** | Google Ads, Meta Pixel, LinkedIn Insight, retargeting | Yes (explicit consent required) | Opt-out (or opt-in for sensitive) |

---

## Consent banner mechanics (GDPR / ePrivacy)

A GDPR-compliant cookie consent banner must:

1. **Pre-consent:** no non-necessary cookies may fire before consent is given. Verify this technically (most CMPs support blocking until consent).
2. **Granular choice:** user can accept all, reject all, or configure by category. A banner that only offers "Accept All" is non-compliant.
3. **Equal prominence:** "Accept All" and "Reject All" / "Manage Preferences" buttons must be equally prominent. Dark-pattern banners (small greyed-out decline button) draw DPA enforcement.
4. **No pre-ticked boxes:** categories are unchecked by default; the user opts in.
5. **Withdrawal of consent:** user can withdraw consent at any time via a preference center (often a persistent floating button).
6. **Consent record:** store consent timestamp, user identifier, CMP version, choices made. Iubenda stores for 5 years; Termly stores by plan.

---

## CCPA/CPRA consent standard (different from GDPR)

CCPA/CPRA uses an opt-out (not opt-in) standard for most cookies. Key difference:

- Analytics and advertising cookies may fire by default; user can opt out via "Do Not Sell or Share My Personal Information" link
- **GPC signal (Global Privacy Control) — required as of CPRA 2026:** California treats the GPC browser signal as a valid opt-out. Your CMP must detect and honor the GPC signal automatically. Termly (IAB TCF v2.3) supports GPC; verify Iubenda's GPC support before deploying.
- Sensitive personal information (SPI) has a higher bar: user can limit its use/disclosure

---

## IAB TCF v2.3 note (2026)

The IAB Transparency & Consent Framework (TCF) version 2.3 is the current EU standard as of 2026:

- **Termly:** on TCF v2.3
- **Iubenda:** on TCF v2.2 (gap — verify current status before deploying for EU AdTech)

If your SaaS involves any programmatic advertising or AdTech integrations, verify your CMP's TCF version and update to v2.3 before launch.

---

## Cookie audit workflow

Before publishing the Cookie Notice:

1. Run a cookie scan (Termly, Iubenda, Cookiebot, or CookieYes all include scanners)
2. Classify every cookie found into the 4 categories
3. Verify that no non-necessary cookies fire before consent is given (test in incognito with network tab open)
4. Publish the Cookie Notice with the categorized list
5. Re-run the scan after every major release (new integrations add new cookies)

---

## Recurring refresh triggers

- Adding a new analytics tool or pixel (immediate)
- New CPRA/GDPR enforcement guidance on banner patterns
- IAB TCF version update
- GPC browser support expansion to new jurisdictions
