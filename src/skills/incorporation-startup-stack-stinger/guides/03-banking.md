# Guide 03: Startup Banking (2026)

Step 4: Open a business bank account after the entity is formed and the EIN is in hand.

*Derived from: `research/external/mercury-vs-brex-banking-2026.md`*

---

## 2026 FDIC pass-through update

Mercury and Brex both offer FDIC pass-through insurance significantly above the $250K base limit by sweeping deposits across multiple FDIC-member banks:

| Bank | FDIC pass-through coverage | Notes |
|---|---|---|
| Mercury | **$5M** | Through sweep network across multiple FDIC banks |
| Brex | **$6M** (Brex Vault) | Premium account tier |
| Relay Financial | $250K (standard) up to $3M (sweep) | Emerging Mercury alternative |
| Traditional banks | $250K | Chase, Bank of America, etc. |

> **Updated from Command Brief:** The Command Brief listed Mercury's coverage as $3M. Research confirms it is now $5M as of 2026. Source: `research/external/mercury-vs-brex-banking-2026.md`.

---

## Mercury

**Best for:** Early-stage startups, bootstrapped founders, international founders (with caveats below).

**Features (2026):**
- No minimum balance, no monthly fees
- Instant account opening after EIN verification
- $5M FDIC pass-through coverage
- Mercury Treasury (yield on cash balances)
- Stripe Atlas and Clerky integration (bank account opened as part of formation flow)
- Multi-user access, team permissions, virtual cards
- International wire support

**International founder warning:** Mercury executed mass account closures for founders holding passports from sanctioned countries in August 2024. If the founder's passport country is on the OFAC sanctions list or if there is any complexity around citizenship/residency, use **Relay Financial** instead. Source: `research/external/mercury-vs-brex-banking-2026.md`.

---

## Brex

**Best for:** VC-backed startups with a headcount, larger cash balances, or teams that want corporate cards as a primary product.

**Features (2026):**
- Brex Vault: $6M FDIC coverage
- Corporate charge cards (not debit cards) with rewards
- Expense management built-in
- Requires: proof of VC backing OR $50K+ in balance (in practice)
- Integrates with Stripe Atlas as a bank account option

**Minimum requirements:** Brex has historically required either VC backing or a minimum balance. Bootstrapped solo founders with no VC backing may find Mercury easier to open.

---

## Relay Financial

**Best for:** International founders who cannot use Mercury; cost-sensitive teams; secondary account.

**Features (2026):**
- $0–$30/month (free tier available)
- 50 physical/virtual cards
- Multi-user access
- FDIC pass-through up to ~$3M through IntraFi sweep network
- No restrictions based on founder passport country

> **Open question (stinger-forge):** Verify current Relay pricing and international founder onboarding requirements at https://relayfi.com.

---

## Recommended stack

| Profile | Primary bank | Why |
|---|---|---|
| US solo founder, VC-backed | Mercury | Stripe Atlas integration, $5M FDIC, no minimums |
| US founding team, VC-backed, headcount | Mercury + Brex | Mercury for operating, Brex for expenses |
| International founder (non-sanctioned country) | Mercury | Same as US |
| International founder (sanctioned-country passport) | Relay Financial | No account closure risk |
| Bootstrapped, cost-sensitive | Mercury | Free tier, no minimums |

---

## What you need to open the account

1. EIN (IRS confirmation letter or online session confirmation)
2. Articles of Incorporation (Delaware Certificate of Incorporation)
3. Organizational resolution or board consent authorizing account opening
4. Founder's government-issued ID
5. Formation platform credential (if using Atlas/Clerky bank intro flow)

---

## After opening the account

1. Set up multi-user access for co-founders with appropriate permissions.
2. Connect bookkeeping platform (Pilot, Bench, or DIY) to the bank feed.
3. Add the bank account details to your investor data room / cap table tool.
4. Set up initial deposit / transfer of startup capital.
