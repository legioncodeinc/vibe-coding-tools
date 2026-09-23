# Rejection Remediation Plan

Use this template when an App Store or Google Play rejection arrives. Complete it before re-submitting.

---

## Rejection details

**App:** [App Name]
**Platform:** [ ] iOS  [ ] Android
**Version:** [x.y.z]
**Rejection received:** [YYYY-MM-DD]
**Guideline code(s):** [e.g., 2.1 / 3.1.1 / Google Play: Impersonation]

**Full rejection text:**
```
[paste verbatim rejection notice here]
```

---

## Rejection type classification

- [ ] Type A: Metadata rejection (what the listing claims vs. what the app does)
- [ ] Type B: Policy rejection (app functionality or business model violates guidelines)
- [ ] Type C: Binary / quality rejection (crash, missing feature, quality bar)
- [ ] Type D: Legal / rights rejection (IP, trademark, privacy law)
- [ ] Type E: 2026-specific (AI content disclosure, April 2026 Android policy)

---

## Ambiguity check

Is the rejection note unambiguous? 

- [ ] Yes, the issue is clear: proceed directly to remediation
- [ ] No, the note could mean two things: complete both interpretations below

### Interpretation A:
[describe what you think the reviewer meant]

**Remediation A:**
1. [specific change 1]
2. [specific change 2]
**Estimated effort:** [hours / days]

### Interpretation B:
[describe the alternative reading]

**Remediation B:**
1. [specific change 1]
2. [specific change 2]
**Estimated effort:** [hours / days]

**Resolution decision:**
Before re-submitting, we will: [ ] Reply to the review team for clarification  [ ] Implement interpretation [A/B] based on: [evidence/reasoning]

---

## Remediation plan

**Chosen approach:** [A / B / both / new approach]

| # | What changes | File / location | Who | ETA |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Testing checklist (before re-submitting)

- [ ] Reproduce the original issue in a fresh environment (clean install, correct OS version)
- [ ] Verify the fix resolves the issue
- [ ] Regression test the affected feature on minimum and maximum supported OS
- [ ] No new crashes introduced

---

## Reply to review team

Draft reply message (send before or at the same time as re-submitting):

```
Hi App Review Team,

[Acknowledge the issue]

[Explain what you found / what caused it]

[Describe the specific fix made, cite guideline section if relevant]

[Optional: attach evidence video / screenshots]

Thank you,
[Dev Team Name]
```

---

## Resubmission

- [ ] New build uploaded (if binary change needed)
- [ ] Metadata updated (if metadata change needed)
- [ ] Reply sent in Resolution Center
- [ ] Resubmission date: [YYYY-MM-DD]

**Expected review time:** [X-Y business days] (update review baseline: 24-72 hours iOS, 2-48 hours Android)
