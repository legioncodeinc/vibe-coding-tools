# Review Request UX: review-funnels-g2-stinger

## The two-step ask pattern (mandatory)

Never ask for a public platform review without first checking happiness. The two-step pattern:

**Step 1 — In-product happiness check (NPS micro-survey)**
> "How satisfied are you with [Product] today?" [1-5 stars]

- 4-5 stars → advance to Step 2 (public review ask)
- 1-2 stars → route to customer success or a feedback form
- 3 stars → optionally ask "What would make this a 5-star experience?" before deciding to route

**Step 2 — Public review ask (promoters only)**
> "We're glad you're having a great experience! Would you mind sharing a quick review on G2? It takes less than 3 minutes and helps other teams find us."
[Button: "Leave a review on G2" → deep link to G2 write-review page]

Why: Batch-sending review requests without the happiness filter yields response rates under 3%. Adding the happiness filter and targeting promoters lifts response rates to 12-18%.

Source: `research/external/2026-05-20-review-request-timing-ux.md`

---

## The 7 trigger moments (ranked by response rate)

| Trigger moment | Response rate | Why it works |
|---------------|--------------|-------------|
| After resolving a support ticket (CSAT 4-5) | 18-22% | User just experienced competence; emotion is high |
| After completing onboarding / first value moment | 15-18% | "Aha moment" is fresh |
| After a user manually upgrades/expands | 14-17% | Committed user = high satisfaction |
| After milestone (first export, 100th task, etc.) | 12-15% | Tangible win = positive emotion |
| NPS promoter identified (score 9-10) | 12-15% | Already stated they love the product |
| After annual renewal | 10-13% | Renewed = implicitly satisfied |
| Time-based (e.g., 90 days of active use) | 6-8% | No emotion anchor; weaker trigger |
| Batch email blast (no trigger logic) | 1-3% | Lowest; avoid for quality platform reviews |

**Preferred implementation stack (in order):**
1. In-product modal triggered by the event (highest response rate)
2. In-app chat/banner message
3. Transactional email triggered within 24h of the event
4. Standalone review-request email (lowest, use only for NPS promoter list)

Source: `research/external/2026-05-20-review-request-timing-ux.md`

---

## Channel mix

| Channel | When to use | Copy approach |
|---------|------------|--------------|
| In-product modal | High-value trigger moments (milestone, upgrade, NPS 4-5) | Short, contextual, single CTA |
| In-product banner | Ongoing low-friction nudge for active promoters | Non-intrusive, dismissable, not modal |
| Transactional email | Within 24h of trigger event | Personal tone, 3-4 sentences, one link |
| Dedicated review-request email | NPS 9-10 promoter segment | Slightly longer, explain why reviews matter |
| Customer success / CSM ask | Enterprise accounts, high-touch relationships | Direct personal ask, offer support |

---

## Copy templates (brief)

### In-product happiness check

**Heading:** How's [Product] working for you?
**Scale:** 1-5 stars (or emoji: 😞 😕 😐 🙂 😍)
**One follow-up (optional):** "What's working well? (optional)"

### In-product review ask (after 4-5 star happiness check)

**Heading:** Glad to hear it! 🎉
**Body:** You're exactly the kind of power user we built [Product] for. Would you take 2 minutes to share your experience on G2? It helps other teams like yours find us.
**CTA button:** Share on G2
**Subtext:** Takes ~2 minutes. No account required — just your work email.

### Review-request email (promoter trigger)

Subject: Quick favor? (your experience with [Product])
Body:
> Hi [FirstName],
>
> I noticed you've been getting great results with [Product] — [specific milestone or usage fact if available].
>
> Would you mind leaving a quick review on G2? It takes about 2 minutes and helps other [ICP description] teams find us.
>
> [Leave a G2 review →]
>
> As a thank-you, I'll send you a [$10 Amazon gift card] after you post — offered regardless of your rating. G2's guidelines ask that you mention receiving this in your review.
>
> Thanks in advance,
> [Name]

Full templates with variants in `templates/review-request-email.md`.

---

## A/B test ideas for review-request copy

| Variable | Option A | Option B |
|----------|----------|---------|
| Subject line | "Quick favor?" | "2 minutes to help other [ICP]s?" |
| CTA copy | "Leave a review" | "Share my experience" |
| Incentive presence | With $10 gift card | Without incentive |
| Timing | Within 24h of trigger | 3 days after trigger |
| From name | Founder name | [Product] team |

Track: email open rate, click-to-review-page rate, review completion rate.
