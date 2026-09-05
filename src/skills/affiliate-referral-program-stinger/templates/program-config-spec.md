# Affiliate/Referral Program Configuration Spec

*Fill in one of these per engagement. Delivered inline to the user as part of the final report.*

---

## 1. Program classification

- **Program type:** Affiliate / Referral / Both
- **Maturity stage:** Pre-launch / Early (< 6 months) / Established (6+ months, active affiliates)
- **Primary goal:** Volume (new customer acquisition) / Revenue (high-ARPU customers) / Brand (reach / SEO backlinks)

## 2. Product context

- **ARPU:** $___/month or $___/year
- **Average customer retention:** ___ months
- **Customer LTV:** $___ (ARPU × retention)
- **Refund window:** ___ days
- **Payment stack:** Stripe / Paddle / Chargebee / Recurly / Other: ___
- **Current attribution setup:** UTM only / Cookie (JS-set) / Cookie (server-set) / S2S postback / None

## 3. Platform selection

- **Selected platform:** ___
- **Rationale (top 3 reasons):**
  1. ___
  2. ___
  3. ___
- **Break-even verified:** YES (at $___/month affiliate revenue) / N/A (enterprise contract)
- **Pricing verified on current platform docs:** YES / NO -- verify before signing

## 4. Attribution architecture

- **Primary attribution method:** Cookie (JS-set) / Cookie (server-set) / S2S postback / Hybrid
- **Cookie duration configured:** ___ days
- **Effective Safari duration:** ___ days (7 days max for JS-set; full duration for server-set)
- **S2S postback endpoint:** Configured / Not yet / Planned for: ___
- **UTM parameter handling:** Stripped server-side / Passed client-side (note: reduces Safari cookie to 24h)
- **EU cookie consent coverage:** Required / Not required / In progress

## 5. Commission configuration

- **Commission type:** Percentage / Flat-fee
- **Commission rate:** ___%  or $___
- **Recurrence:** One-time / Recurring (cap: ___ months / Lifetime)
- **Hold period:** ___ days
- **Minimum payout threshold:** $___
- **Payout mechanism:** Stripe Express / Manual (PayPal / bank) / Platform-managed (PartnerStack)

## 6. Economics model

| Metric | Value |
|---|---|
| Commission cost per customer (1-year) | $___ |
| Commission cost as % of LTV | ___%  |
| Break-even commission rate | ___%  |
| Estimated EPC (at ___% conversion rate) | $___ |
| Platform cost (monthly) | $___ base + ___% transaction fee |
| Estimated affiliate CAC | $___ vs paid CAC $___  |
| Program economics assessment | Affordable / Marginal / Not affordable |

## 7. Fraud controls

- [ ] Self-referral detection (IP + subnet): Platform-native / Custom / Not configured
- [ ] Conversion rate anomaly monitoring: Automated / Manual / Not configured
- [ ] Velocity alerts: Automated / Manual / Not configured
- [ ] Click-to-conversion time monitoring: Configured / Not configured
- [ ] Disposable email block list: Configured / Not configured
- [ ] Supplemental fraud tool: IPQS / Fingerprint.com / None (reason: ___)
- [ ] Hold period sufficient for fraud review: ___ days

## 8. Tax compliance

- **US 1099-NEC required:** YES (Stripe Express handles W-9 collection) / NO (non-US program)
- **W-9/W-8BEN collection method:** Stripe Express (automatic) / Manual / Platform-managed
- **EU GDPR data obligations:** Documented / Not yet / N/A

## 9. Handoffs to peer Angels

- **payments-worker-bee:** Stripe Express / payout integration required: YES / NO
- **security-worker-bee:** Platform API key management review required: YES / NO
- **db-worker-bee:** Custom attribution table schema required: YES / NO
- **cold-outreach-worker-bee:** Outbound affiliate recruitment campaign planned: YES / NO

## 10. Launch checklist status

- [ ] Platform account created, billing integration connected
- [ ] Commission rules configured per this spec
- [ ] Attribution architecture implemented (cookie / S2S)
- [ ] Affiliate portal page published
- [ ] Minimum 3 promotional assets created
- [ ] Fraud controls configured
- [ ] Tax compliance (W-9 collection) verified
- [ ] 90-day review scheduled

---

*Template version: 2026-05-20. Refresh annually or when platform pricing changes.*
