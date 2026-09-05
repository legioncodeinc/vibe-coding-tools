# Guide 01: Platform Selection

Decision matrix for choosing among the five active live chat / helpdesk platforms in 2026. Read `guides/00-principles.md` before this guide.

> **2026 update:** Drift was sunset on March 6, 2026 (Salesloft acquisition). Do NOT recommend Drift for new projects. Redirect B2B sales-chat use cases to Intercom with proactive messaging or Qualified.

---

## The primary decision split

Before applying the matrix, answer two questions:

1. **Is your support delivered primarily through Slack Connect channels?** (B2B SaaS with enterprise or mid-market customers who expect Slack-based support)
   - Yes → Evaluate **Plain vs Pylon** first. Skip the widget platforms.
   - No → Evaluate **Intercom, Crisp, Help Scout** based on the secondary questions below.

2. **Do you need a chat widget embedded in your app?** (in-app messaging, proactive nudges, user onboarding flows)
   - Yes → **Intercom** is the market leader. Crisp is the flat-cost alternative.
   - No, email-first → **Help Scout** is the simplest.

---

## Plain vs Pylon (Slack-native B2B)

| Dimension | Plain | Pylon |
|---|---|---|
| Entry price | $35/seat/month | $59/seat/month (+$50/seat AI add-on) |
| AI | Ari — included on every plan, no per-resolution fee | $50/seat/month add-on |
| Free trial | 14-day, no credit card | None (annual only) |
| API | GraphQL, no rate limits | REST, 10 requests/minute on Issues |
| UI speed | ~100ms, keyboard-driven | 2–5 second load times reported |
| Knowledge base | Horizon plan ($269/month base) | All plans |
| Bulk Slack messaging | No | Yes |
| CSAT in Slack | No | Yes |
| Account health scoring | No | $10/account/month add-on |
| Discord support | Yes | No |
| MS Teams | Yes | Yes |
| Typical customers | Vercel, Clerk, Resend, Railway, n8n | Deel, Hightouch, Merge, Temporal |
| Best for | Dev-tool cos, API-first teams, budget-aware | Ops-led B2B, 50+ Slack channels, non-technical admins |

**API rate limit warning:** Pylon's Issues endpoint is limited to 10 requests/minute — the lowest published rate limit in the category. This makes AI agent automation and programmatic integrations at production scale infeasible. If you need to build custom automation on top of your support platform, choose Plain.

**Recommendation template:**
- Developer tool or API-first B2B, team thinks in code: **Plain**
- Operations-led, 50+ Slack Connect channels, visual workflow builder preferred: **Pylon**

---

## Widget-based platforms

### Intercom

**When to recommend:** PLG SaaS, B2C consumer apps, products with in-app onboarding and proactive messaging needs, teams that want the best AI deflection in the category (Fin 2.0, 51% resolution rate).

**When NOT to recommend:** Bootstrapped teams without budget discipline. Intercom's per-seat + per-resolution cost model compounds. A 5-seat team with 2,000 conversations/month + Fin resolving 50% = $29×5 + $0.99×1,000 = $1,135/month. That is a common sticker-shock scenario.

**Early Stage program:** If the team is under 2 years old, fewer than 15 employees, and under $10M funding, Intercom's Early Stage program offers 90% off year one. At those rates, Intercom is competitive with Crisp. Always ask about Early Stage eligibility before dismissing Intercom on cost grounds.

**Identity verification:** Intercom is migrating from HMAC to JWT. New implementations should use JWT. See `guides/03-identity-verification.md`.

---

### Crisp

**When to recommend:** Bootstrapped or early-stage teams that want unlimited agents at a predictable flat cost. Teams with diverse channel needs (WhatsApp, Instagram, LINE) at this price point. Teams that want co-browsing and screen sharing without enterprise pricing.

**Pricing:**
- Free: 2 seats, basic features (genuinely usable for very early stage)
- Mini: €45/month workspace — multi-agent inbox, integrations, identity verification
- Unlimited: €95/month workspace — unlimited agents, Crisp Bot, knowledge base

**Identity verification:** HMAC-SHA256, signed on user email (not user_id). Available from Mini plan. See `guides/03-identity-verification.md`.

---

### Help Scout

**When to recommend:** Email-first support teams that value simplicity. Content-heavy products where a well-maintained knowledge base deflects most tickets. Teams that do not need in-app chat and find Intercom's complexity excessive.

**Pricing (2026):** $22/user/month (Standard), $44 (Plus), $65 (Pro). AI via Beacon at $0.75/resolution.

**Beacon:** Help Scout's embeddable chat widget. Functional but not as feature-rich as Intercom's Messenger for in-app scenarios.

---

## Recommendation decision tree

```
Is support primarily Slack-based B2B?
├── Yes, need bulk Slack messaging + account health → Pylon
├── Yes, API-first or budget-conscious → Plain
└── No
    ├── Need in-app messaging, AI deflection, outbound campaigns? → Intercom (Early Stage program?)
    ├── Bootstrapped, unlimited agents, flat cost? → Crisp Unlimited (€95/month)
    └── Email-first, simplicity first? → Help Scout Standard
```

---

## Migration note for Drift customers

Drift is sunset. The only migration path officially supported is to 1mind. For practical alternatives:
- B2B conversational sales chat: Intercom with proactive messaging
- B2B support that needs AI: Plain or Intercom
- No hard end-of-life date published (as of May 2026), but feature development has ceased. Export conversation data immediately via Drift's export API before the window closes.
