# Deliverability Audit Checklist

Run this checklist before launching any new campaign and whenever deliverability problems are suspected. Each check is independent — fix failures before proceeding.

Reference: `guides/02-infrastructure-and-deliverability.md`

---

## Section 1: Domain setup (BLOCKING — fix before any sends)

| Check | How to verify | Pass criteria | Status |
|---|---|---|---|
| Sending domain is NOT the primary company domain | Inspect the From address domain | From address must not be `company.com` | [ ] |
| Sending domain forwards to main domain | Send a test email to the cold domain; confirm it arrives | Email received at main inbox | [ ] |
| MX records point to sending platform | MXToolbox > MX Lookup | MX records match Instantly/Smartlead guidance | [ ] |
| SPF record exists | MXToolbox > SPF Lookup | `v=spf1 include:[platform.com] ~all` | [ ] |
| DKIM record exists and is valid | MXToolbox > DKIM Lookup | Signature valid, 2048-bit key | [ ] |
| DMARC record exists | MXToolbox > DMARC Lookup | At minimum `v=DMARC1; p=none` | [ ] |
| No conflicting SPF records (max 1 per domain) | MXToolbox | Only 1 SPF TXT record | [ ] |

MXToolbox SuperTool: https://mxtoolbox.com/SuperTool.aspx

---

## Section 2: Warmup status

| Check | How to verify | Pass criteria | Status |
|---|---|---|---|
| Domain age >= 4 weeks | WHOIS lookup on sending domain | Domain registered >= 28 days ago | [ ] |
| Warmup running (if domain < 8 weeks old) | Check sending platform warmup settings | Warmup is active and has been running since domain setup | [ ] |
| Current sending volume <= 50-100/mailbox/day | Check sending platform dashboard | Volume within limit | [ ] |
| Warmup reply rate > 30% | Check warmup dashboard | Warmup pool is sending replies back | [ ] |

---

## Section 3: Reputation and spam rate

| Check | How to verify | Pass criteria | Status |
|---|---|---|---|
| Google Postmaster domain reputation | postmaster.google.com | Pass (green) — not Fail (red) | [ ] |
| Google Postmaster spam rate | postmaster.google.com | Below 0.10% | [ ] |
| Domain not on major blacklists | MXToolbox > Blacklist Check | 0 blacklist listings | [ ] |
| Sending IP not blacklisted | MXToolbox > Blacklist Check on IP | 0 blacklist listings | [ ] |

---

## Section 4: Sending platform configuration

| Check | How to verify | Pass criteria | Status |
|---|---|---|---|
| From name is a real person (not "Sales Team") | Check campaign settings | Human first + last name | [ ] |
| Mailbox has profile photo and complete signature | Check Google Workspace / M365 settings | Photo and signature set | [ ] |
| Unsubscribe mechanism is active | Check campaign footer settings | Unsubscribe link present and functional | [ ] |
| Physical address in email footer | Check campaign footer | CAN-SPAM compliant address | [ ] |
| Timezone-aware sending enabled | Check campaign settings | Sending at recipient local time | [ ] |

---

## Section 5: List quality (run before each campaign)

| Check | How to verify | Pass criteria | Status |
|---|---|---|---|
| List verified with ZeroBounce or NeverBounce | Verification tool report | Verification completed after list was built | [ ] |
| Catch-all addresses removed | Verification tool report | 0 catch-all addresses in send list | [ ] |
| Invalid addresses removed | Verification tool report | 0 invalid addresses in send list | [ ] |
| Suppression list applied | Check sending platform | Previous unsubscribers excluded | [ ] |
| Hard-bounced addresses excluded | Check sending platform bounce list | 0 previously-bounced addresses | [ ] |

---

## Results summary

| Section | Checks | Pass | Fail | Blocking? |
|---|---|---|---|---|
| Domain setup | 7 | | | Yes |
| Warmup | 4 | | | Yes (if < 4 weeks) |
| Reputation | 4 | | | Yes |
| Platform config | 5 | | | No |
| List quality | 5 | | | No (but fix before sending) |

**Do not launch campaign if any blocking section has failures.**
