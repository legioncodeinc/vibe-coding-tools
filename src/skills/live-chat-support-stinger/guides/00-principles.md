# Guide 00: Principles

The five non-negotiables for `live-chat-support-worker-bee`. Every output must respect all five. No exceptions.

---

## 1. HMAC or JWT, always server-side

Never produce a client-only signing snippet. The HMAC secret or JWT private key must live in a server-side environment variable, signed per-request in a Server Action or API Route, and delivered to the widget via a server-to-client call.

**Why:** A secret loaded in browser JavaScript is visible to every visitor who opens DevTools. One exposed secret compromises every user's widget identity indefinitely.

**Test:** Grep the front-end bundle for the secret value. If it appears, the integration is broken.

---

## 2. Human-fallback rule on every AI deflection config

Every AI bot config (Fin 2.0, Ari, Crisp Bot) must include a fallback rule: if the bot cannot resolve after N attempts, escalate to a human immediately. There must be no configuration path where a user is trapped in a bot loop indefinitely.

**Why:** Bot loops destroy support trust faster than slow response times. A 10-minute wait for a human beats a 2-minute conversation with a bot that cannot help.

**Implementation:** Configure a "tried X times, no resolution" escalation rule before deploying AI deflection to production. Test it manually before launch.

---

## 3. Data-export setup on day one

Raise the data-export question on every platform-selection call. Before the team signs a contract, confirm: (a) what formats the platform exports (JSON, CSV), (b) whether export is self-service or requires a support ticket, (c) whether the API provides full conversation history export, and (d) what the retention period is.

**Why:** Teams that skip this get locked in. The cost of switching grows 10x after 12 months of conversation history accumulates. GDPR Article 20 makes data portability a legal right; an inability to export makes compliance incidents expensive.

---

## 4. Validate identity before attributing identity

Never recommend using a user attribute (name, email, plan tier) in a widget without confirming that HMAC or JWT identity verification is wired. Unverified attributes can be set by any visitor who edits the JavaScript initialization call.

**Why:** A support inbox that displays "Mario, Pro plan" based on unverified JS attributes is trivially spoofed. Agents may apply incorrect discounts or share sensitive plan information to an attacker.

---

## 5. Platform recommendation, not just comparison

When asked to "compare platforms," always produce a recommendation with a 2-sentence rationale, calibrated to the team's stated context. Do not produce only a comparison table and stop.

**Why:** A comparison table without a recommendation defers the decision back to the user, who asked the question because they wanted a recommendation. The stinger's value is opinionated expertise.

**Template:** "For [team type] I recommend [platform] because [1-sentence primary reason]. The main trade-off is [1-sentence limitation], which matters for you if [condition]."
