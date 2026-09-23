# Diagnostics: When Something Is Broken

Use this guide when reply rate has dropped, emails are landing in spam, bounce rate is climbing, or the program has stalled. Start with infrastructure, then move to list, then copy.

**Research grounding:** `research/external/2026-05-20-cold-email-deliverability-2026-rules.md`, `research/external/2026-05-20-cold-email-reply-rate-benchmarks-2026.md`

---

## Benchmarks (are you actually broken?)

| Metric | Healthy | Degraded | Broken |
|---|---|---|---|
| Reply rate (positive replies / sent) | >3.43% | 1-3% | <1% |
| Bounce rate | <2% | 2-5% | >5% |
| Spam complaint rate | <0.1% | 0.1-0.3% | >0.3% |
| Open rate (ignore MPP) | N/A — unreliable since 2021 | N/A | N/A |
| Google Postmaster reputation | Pass (green) | — | Fail (red) |

If reply rate is below 2%: run the full diagnostic.
If bounce rate is above 3%: run the deliverability diagnostic.
If Google Postmaster shows Fail: stop sending immediately.

---

## Diagnostic decision tree

### Step 1: Check infrastructure (5 minutes)

Run `templates/deliverability-audit-checklist.md`.

Check:
- SPF, DKIM, DMARC valid (MXToolbox)
- Google Postmaster reputation (postmaster.google.com)
- Sending volume within limit (50-100/mailbox/day)
- Warmup still running if domain is <4 weeks old
- No new MX changes to the sending domain

**If any check fails:** stop campaign, fix the infrastructure issue. See `guides/02-infrastructure-and-deliverability.md`.

### Step 2: Check list quality (10 minutes)

- Bounce rate above 3%? Re-verify the list. Remove catch-alls.
- Are you sending to job titles that match the ICP? Spot-check 20 contacts.
- Are you sending to the right companies (size, industry)?
- Did you recently add a new lead source that was not verified?

**If list is dirty:** clean with ZeroBounce or NeverBounce before resuming.

### Step 3: Check copy and sequence (15 minutes)

- Read the sequence aloud as if you were the prospect. Does the first email get to the point in 80 words? Does it name a specific problem?
- Is the subject line deceptive, clickbait, or spammy (!, ?, "URGENT")?
- Is the personalization genuine or generic? Apply the 1-in-1000 test.
- Is there more than one CTA in any email?
- Is the sequence more than 5 steps?

**If copy is weak:** rewrite the initial email using `templates/sequence-5-step.md`. A/B test the new version against the current.

### Step 4: Check for account-level issues

If all of the above checks pass and reply rate is still broken:
- Check if your sending domain or IP is on a blacklist (MXToolbox blacklist checker)
- Check sending platform (Instantly/Smartlead) for account warnings or deliverability alerts
- Check if you have been flagged for a spam rate violation in Smartlead Smart-Adjust or Instantly dashboard

---

## Common failure patterns

### Pattern 1: Suddenly everything lands in spam
**Likely cause:** spam rate exceeded 0.10% threshold, or DMARC/DKIM record was changed

**Diagnosis:** Google Postmaster spam rate + check DNS records

**Fix:** Pause all campaigns. Fix DNS records if changed. Wait 24-48 hours for Google to process. Resume at 20% of previous volume and ramp up.

### Pattern 2: High bounce rate on a previously clean list
**Likely cause:** list has decayed (25% per year), or catch-all addresses mixed in

**Diagnosis:** Export bounce report from sending platform. Check what percentage are hard bounces vs catch-all

**Fix:** Re-verify entire list. Remove all catch-alls. Remove all hard-bounced addresses permanently.

### Pattern 3: Reply rate drops suddenly on a working sequence
**Likely cause:** prospect fatigue in the ICP, sequence has saturated the list, or subject line/copy is now overused in the market

**Diagnosis:** Calculate what percentage of your ICP has already received this sequence. Check A/B test data for subject line performance trends.

**Fix:** Refresh subject lines first (highest leverage, easiest to change). Then refresh opener personalization. Finally, if the sequence has run for >6 months, rebuild the entire sequence from scratch.

### Pattern 4: Zero positive replies despite healthy deliverability
**Likely cause:** ICP is wrong, or the problem statement in the email does not resonate

**Diagnosis:** Can you describe the problem in one specific sentence? Does it match something the prospect has said publicly or written about? Test the pitch on 3 real humans who fit the ICP before running it to 500 people.

**Fix:** Return to ICP definition (`templates/icp-definition-worksheet.md`). Narrow the target. Validate the problem statement before re-running.

---

## When to call it and reset

If you have:
- Run 3 different sequences to the same list
- Tried 3 different subject line variants
- Verified the list is clean and deliverability is healthy
- Reply rate is still below 1%

...the ICP or problem statement is fundamentally wrong. Do not optimize further. Go back to first principles: narrow the ICP, find the real problem, validate it manually with 10 prospects before rebuilding the sequence.
