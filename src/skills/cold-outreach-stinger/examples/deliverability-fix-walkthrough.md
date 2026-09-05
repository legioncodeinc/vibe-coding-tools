# Example: Deliverability Fix Walkthrough

**Scenario:** A founder has been running cold email for 6 weeks. Reply rate has dropped from 3.1% to 0.5% over the last 2 weeks. No sequence changes were made.

**Guides used:** `guides/07-diagnostics.md`, `guides/02-infrastructure-and-deliverability.md`
**Template used:** `templates/deliverability-audit-checklist.md`

---

## Initial symptoms

- Reply rate: dropped from 3.1% to 0.5% over 2 weeks
- Bounce rate: 1.8% (normal)
- Spam complaints in platform: 0.12% (slightly elevated)
- No sequence changes in 3 weeks
- No list changes

---

## Step 1: Run deliverability audit checklist

Using `templates/deliverability-audit-checklist.md`:

| Check | Result |
|---|---|
| Sending domain separate from main | PASS |
| SPF valid | PASS |
| DKIM valid | FAIL — DKIM record missing! |
| DMARC present | PASS (p=none) |
| Google Postmaster reputation | FAIL — showing "Fail" in v2 |
| Domain on blacklists | FAIL — listed on 2 minor blacklists |
| Spam rate in Postmaster | 0.18% — above 0.10% threshold |

**Root cause identified:** DKIM record was removed when the DNS was updated 16 days ago. Without DKIM, Google began failing authentication, which elevated spam placement, which increased the spam rate, which triggered reputation degradation.

This is a cascade: DKIM failure → increased spam placement → elevated spam rate → reputation drop → more spam placement. It escalated over 2 weeks.

---

## Step 2: Fix sequence

1. **Pause all active campaigns immediately**
   - No sends until DKIM is restored and reputation recovers

2. **Restore DKIM record**
   - Generate new DKIM key from Instantly (Settings > Mailboxes > DKIM)
   - Add the new CNAME record in DNS provider (Cloudflare/Route53/Namecheap)
   - Wait 24 hours for propagation
   - Validate at MXToolbox: https://mxtoolbox.com/DKIM.aspx

3. **Request removal from blacklists**
   - Visit each blacklist listed in MXToolbox report
   - Submit removal request (most are automated for domains not on permanent block lists)
   - Timeline: 24-72 hours for most removals

4. **Wait for Google Postmaster to recover**
   - After DKIM is restored and spam rate drops, Postmaster updates approximately every 24 hours
   - Do not resume sending until Postmaster shows Pass (green) for at least 3 consecutive days

5. **Resume at 20% of previous volume**
   - Previous volume: 80 emails/day
   - Resume at: 16 emails/day
   - Ramp: +10 emails/day every 3 days if spam rate stays below 0.05%

---

## Timeline

| Day | Action |
|---|---|
| Day 0 | Pause all campaigns; restore DKIM in DNS |
| Day 1 | DKIM validated; submit blacklist removal requests |
| Day 2 | Blacklists cleared; Postmaster showing improvement |
| Day 4 | Postmaster showing Pass for 2nd consecutive day |
| Day 5 | Resume at 16 emails/day; monitor Postmaster daily |
| Day 8 | Volume at 26 emails/day; still clean |
| Day 11 | Volume at 36 emails/day; resume normal ramp to 80/day |

---

## Prevention

**Why this happened:** No monitoring was in place. The DKIM record was removed during a routine DNS update and no alert was triggered.

**Fix going forward:**
- Set up weekly automated DNS check (MXToolbox has a monitoring service)
- Add daily Google Postmaster reputation check to weekly review
- Document all DNS records before any infrastructure changes — treat DNS as infrastructure under change management

---

## Final state

- Reply rate after recovery: 2.9% (slightly below previous 3.1%, recovered within 3 weeks)
- Google Postmaster: Pass (green)
- Blacklists: 0
- Domain reputation: recovered but slightly lower than before — will continue to improve with consistent clean sending
