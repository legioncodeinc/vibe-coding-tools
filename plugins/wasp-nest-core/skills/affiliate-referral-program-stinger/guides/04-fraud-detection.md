# Fraud Detection: Thresholds, Platform Controls, and Supplemental Layers

*Grounded in: `research/external/2026-05-20-affiliate-fraud-prevention-saas-guide.md`, `research/external/2026-05-20-rewardful-affiliate-fraud-tactics-2026.md`, `research/external/2026-05-20-fraud-detection-software-vendor-guide-2026.md`*

## The minimum viable fraud stack (launch requirement)

Programs without minimum controls are abused within days of launch. These controls are mandatory before any commission runs:

1. **Self-referral detection** (IP + subnet match)
2. **Conversion rate anomaly monitoring** (flag outside 2 std dev)
3. **Velocity alerts** (flag at 3-5x daily baseline)
4. **Click-to-conversion time distribution** (flag clustering)
5. **Disposable email block list**

## The three primary fraud types

### 1. Self-referral

**Mechanism:** Affiliate creates a new account using their own affiliate link to collect commission on their own purchase. The simplest and most common fraud type.

**Detection signals:**
- Exact IP address match between affiliate account and referred customer account.
- Same /24 subnet (first 3 IP octets): same office/network.
- Device fingerprint match (browser characteristics: user agent, screen resolution, fonts, timezone, language) -- catches VPN evasion.

**Detection thresholds:**
- Exact IP match = almost certainly self-referral.
- /24 subnet match = investigate before paying.
- Device fingerprint match with IP mismatch = VPN-assisted self-referral.

**Platform controls:**
- FirstPromoter: has native self-referral detection.
- Rewardful: basic IP check.
- Tolt: no native self-referral detection (weakest).
- PartnerStack: native self-referral and fraud controls.

### 2. Cookie stuffing

**Mechanism:** Affiliate places tracking cookies on browsers without user knowledge via:
- Hidden iframe loading the affiliate link.
- 1x1 pixel images that trigger cookie setting.
- JavaScript redirects embedded in third-party pages.
- Malicious browser extensions that inject cookies.

When the user later converts organically, the affiliate collects unearned credit.

**Detection signals:**
- High click count with session bounce rate under 5 seconds OR session duration under 5 seconds.
- High click volume from single affiliate with abnormally low visit-to-click ratio.
- Click source IP in data-center or known proxy range (not residential).

**Detection approach:** Monitor session quality alongside click volume. A legitimate blogger's traffic has session durations of 30+ seconds and meaningful page views. Cookie-stuffed traffic has near-zero engagement.

### 3. Velocity fraud (click fraud)

**Mechanism:** Automated click generation to inflate EPC metrics or trigger payout thresholds without real conversions.

**Detection thresholds (from research):**
- Legitimate blog: 50-200 clicks/day during peak traffic.
- **Flag:** 10,000+ clicks/hour = automated tools or bots.
- **Alert threshold:** 3-5x the affiliate's typical daily click volume in a single period.
- **Conversion velocity alert:** an affiliate who normally generates 2-3 conversions/month suddenly shows 20 conversions in a single day -- flag before payout.

## Conversion rate monitoring

**Normal range:** 1-10% conversion rate (channel-dependent).

**Automated flagging thresholds:**
- Flag any affiliate whose rate falls outside 2 standard deviations from the program average.
- Very low (<0.01%): click fraud (fake click generation with no real traffic).
- Very high (>90%): self-referral fraud or pre-committed buyers referred to collect commission.

**Click-to-conversion time clustering:**
- Legitimate traffic: conversion time distribution spans seconds to weeks.
- Self-referral indicator: ALL conversions within seconds of click (automated pipeline).
- Cookie window gaming: ALL conversions clustered at the exact cookie expiry boundary (attribution theft).

## Churn and refund rate analysis by affiliate

If an affiliate's referred customers churn at 2x+ the program average, investigate:
- Low-quality traffic (mismatched audience, misleading promotional content).
- Churn-and-resubscribe scheme: affiliate refers people who subscribe, cancel, and resubscribe to generate repeat commissions.

Track 30/60/90-day retention rates segmented by affiliate and flag affiliates with anomalous churn rates before processing commission escalation.

## Disposable email detection

- Maintain a blocklist of known disposable email providers.
- Flag signups from free email services with suspicious sequential patterns (e.g., user001@, user002@).
- Sequential character patterns across multiple signups from a single affiliate = fake lead batch.

## Per-platform native fraud controls

| Control | Rewardful | FirstPromoter | Tolt | PartnerStack |
|---|---|---|---|---|
| Self-referral detection | Basic IP check | Yes (stronger) | No | Yes |
| Conversion rate monitoring | Manual review | Alerts available | No | Yes |
| Velocity alerts | No native | Basic | No | Yes |
| Churn rate analysis | No | No | No | Yes |
| Device fingerprinting | No | No | No | No (supplemental needed) |

**Verdict:** For programs on Rewardful or Tolt, supplemental fraud tooling is recommended from launch. FirstPromoter covers the basics. PartnerStack has the most comprehensive native suite.

## Supplemental fraud tools

When platform-native controls are insufficient, add:

- **IPQS (IPQualityScore):** Real-time IP reputation, proxy/VPN detection, email validation, device fingerprinting. API-based; integrates with any platform via webhook.
- **Fingerprint.com:** Device fingerprinting for self-referral detection at the device level. High accuracy, browser-privacy-aware.

Both are appropriate when the program reaches a scale where manual fraud review is impractical (typically 100+ affiliates or $5K+/month in commissions pending).

## Fraud response playbook

When a fraud signal triggers:

1. **Pause payout** for the flagged affiliate (do not delete; preserve evidence).
2. **Pull audit trail:** all click IDs, conversion events, IP addresses, and device fingerprints for the affiliate.
3. **Compare** affiliate registration data (IP, email, device) against referred customer data.
4. **Decision:**
   - Clear self-referral or velocity fraud: cancel commissions, terminate affiliate account.
   - Ambiguous signal: hold payout, email affiliate for explanation within 48 hours.
   - False positive (legitimate high-performer): release hold, whitelist affiliate for future monitoring.
5. **Document** the decision and update block lists (email domain, IP range) to prevent recurrence.
