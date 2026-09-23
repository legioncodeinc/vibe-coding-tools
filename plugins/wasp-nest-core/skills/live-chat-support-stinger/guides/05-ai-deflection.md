# Guide 05: AI Deflection

Configuration guide for AI-powered conversation deflection. Covers Intercom Fin 2.0, Plain Ari, Crisp Bot, handoff escalation rules, knowledge base seeding strategy, and resolution rate optimization.

---

## What "deflection" means (and doesn't mean)

AI deflection means the AI resolves a customer's question without a human agent ever joining the conversation. A 50% deflection rate means one in two conversations is fully handled by AI. This is the target for well-optimized setups.

Deflection is not about blocking customers from reaching humans. An AI that prevents customers from escalating is not deflection — it is a hostile bot. Always implement a clear human-escalation path. See Principle 2 in `guides/00-principles.md`.

---

## Platform AI comparison (2026)

| Platform | AI product | Cost model | Resolution rate | Handoff model |
|---|---|---|---|---|
| Intercom | Fin 2.0 | $0.99/resolution | ~51% (avg) | Escalation Rules + Guidance |
| Plain | Ari | Included (all plans) | Not published; 60% at n8n with BYOA | Machine User handoff |
| Crisp | Crisp Bot | Included (Unlimited) | Not published | Hard timeout + agent assign |
| Help Scout | Beacon AI | $0.75/resolution | Not published | Fallback to inbox |
| Pylon | AI add-on | $50/seat/month | Not published | Workflow escalation |

---

## Intercom Fin 2.0 — configuration

Fin 2.0 is the most capable off-the-shelf AI agent in the live chat category as of 2026.

### The automation rate formula

```
Automation rate = Involvement rate × Resolution rate
```

- **Involvement rate:** % of conversations Fin participates in (configurable — you can target Fin at all conversations or specific intent types).
- **Resolution rate:** % of conversations Fin fully resolves without human involvement.
- A 75% involvement rate × 68% resolution rate = 51% overall automation rate (Intercom's published average).

### Escalation Rules vs Escalation Guidance

This is the most important configuration principle in Fin 2.0:

**Escalation Rules** (prefer these): Hard-coded conditions that trigger immediate handoff.
- Example: `IF conversation_tag = "billing" AND user.plan = "enterprise" THEN escalate immediately`
- Example: `IF customer_sentiment = "angry" THEN escalate immediately`
- Deterministic; Fin follows them exactly.

**Escalation Guidance** (use sparingly): Natural-language instructions about when to escalate.
- Example: "Escalate if the customer seems frustrated."
- Non-deterministic; Fin interprets these. The more Escalation Guidance you add, the more Fin escalates. (Official Intercom doc: "The more escalation guidance you add, the more often Fin escalates.")

**Recommended approach:** Start with 2–3 hard Escalation Rules for your highest-risk scenarios (billing disputes, cancellations, anger signals). Add Escalation Guidance only for genuinely ambiguous cases.

### Fin Attributes

Fin can use user attributes from the Intercom record to personalize responses and make routing decisions. Example attributes to wire:
- `plan` (free / pro / enterprise) — Fin gives different answers based on plan.
- `days_since_signup` — Fin explains onboarding steps only for new users.
- `feature_flags` — Fin answers questions about features the user actually has access to.

### Recommendations engine (weekly AI gap analysis)

Intercom's Recommendations tab shows Fin the top questions it failed to answer, grouped by theme. Use this weekly to prioritize new knowledge base articles. Do not try to manually predict all content — use the Recommendations engine to discover the gaps empirically.

---

## Plain Ari — configuration

Ari is Plain's built-in AI agent, included on every plan. It reads your help center articles and connected integrations (GitHub, Jira, etc.) to answer questions.

For a custom AI agent (BYOA), Plain supports "Machine Users" — programmatic API actors that can respond to conversations, create follow-ups, and escalate. This is how n8n achieved 60% deflection with a 10-person team.

**Machine User setup (GraphQL):**
```graphql
mutation {
  createMachineUser(input: { fullName: "Support AI Agent", publicName: "Aria" }) {
    machineUser { id apiKey { secret } }
  }
}
```

Use the returned API key to authenticate outgoing API calls from your AI agent. The agent should use `createThread`, `replyToThread`, and `changeThreadStatus` mutations for conversation management.

---

## Crisp Bot — configuration

Crisp Bot is included in the Unlimited plan (€95/month). It works through a visual scenario builder.

### Scenario structure

```
Trigger: Conversation starts (OR keyword match, OR time delay)
  ↓
Action: Send message ("Hi! What can I help you with?")
  ↓
Condition branches:
  - Button click: "Technical issue" → Go to Technical scenario
  - Button click: "Billing question" → Go to Billing scenario
  - Timeout: No response in 5 minutes → Assign to agent
```

### Mandatory: Timeout + fallback

Every Crisp Bot scenario must have a timeout path. If the user does not click a button or respond within a configured window, assign the conversation to an agent. Without this, conversations wait in the bot indefinitely.

---

## Knowledge base seeding strategy (all platforms)

Do not try to populate the knowledge base manually before launch. Start with:

1. **5 foundational articles** — the 5 most common questions from pre-support channels (email, Discord, Slack).
2. **After launch:** use the platform's AI recommendation engine (Intercom Recommendations, or query your conversation tags) to identify the top 10 unanswered questions each week.
3. **Target:** 50 articles by month 3. Most teams hit acceptable deflection rates with 30–50 well-written articles.

### Article format that maximizes AI deflection

- **Title:** The exact question the user asks. ("How do I reset my password?" not "Password management.")
- **Answer in first paragraph.** Fin/Ari reads the first 200 words first. Put the answer there, not the background.
- **One article per question.** Do not try to cover 5 related questions in one article. Deflection accuracy degrades.
- **Keep articles under 500 words.** Longer articles confuse the AI and produce partial answers.

---

## Handoff escalation checklist

Before enabling AI deflection in production:

- [ ] Hard escalation rule for billing disputes: immediate human handoff.
- [ ] Hard escalation rule for cancellation intent: immediate retention team assignment.
- [ ] Hard escalation rule for anger/frustration signals: immediate human handoff.
- [ ] Bot timeout: conversation assigned to agent if no resolution within X minutes.
- [ ] Fallback message: "I'm connecting you with a team member who can help."
- [ ] Working hours: outside business hours, bot sets expectation ("Our team will respond within X hours").
- [ ] Resolution rate baseline measurement: check the AI's automation rate after first 100 conversations and adjust.
