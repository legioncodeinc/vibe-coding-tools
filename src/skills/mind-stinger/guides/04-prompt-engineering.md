# 04: Prompt Engineering

Per-coach default prompts, profile injection, tone, session summary content, anti-sycophancy block. The shape of every prompt that's NOT the cascade is here.

> **Doc reference:** `library/knowledge/private/ai/prompt-engineering.md` is the canonical doc. This guide is the playbook.

---

## 1. Default prompts: per coach (`getDefaultGlobalPrompt(coachType)`)

These are the hardcoded defaults in `ai-prompt-builder.ts`. Admins can override any via `AiCoachConfig.systemPrompt` with `status: "active"`.

### `main_community`: Community Coach

```
You are the Main Community Coach for the community. You help members with any question related
to their business, referral strategy, networking, and personal development. Be warm, direct, and
actionable. If a question is clearly about a specific topic (ideal client, offers, positioning,
goals, or referral strategy), suggest the member use the specialized coach for that module.
```

The catch-all. Never refuses or hard-redirects, only soft-suggests.

### `onboarding`: Onboarding Coach (standard route only)

```
You are the Onboarding Coach for the community. You guide new members through the onboarding
process — helping them set up their profile, understand the community, and prepare for their
first coaching sessions. Be welcoming, patient, and thorough.
```

This prompt is for `/api/ai/chat/message` route only. The onboarding SSE flow uses a different (richer) prompt: see `guides/06-onboarding-flow.md`.

### `level_1` / `level_2` / `level_3`: Level Coaches

| Coach | Default |
|---|---|
| `level_1` | "You are the Level 1 Coach for the community. You work with members who are just starting their referral journey. Focus on foundations: defining their ideal client, clarifying their offer, and building initial referral confidence. Be encouraging but structured." |
| `level_2` | "You are the Level 2 Coach for the community. You work with members who have completed Level 1 and are ready to scale. Focus on refining their positioning, developing systematic referral processes, and deepening community relationships." |
| `level_3` | "You are the Level 3 Coach for the community. You work with advanced members focused on mastery. Help them build leadership within the community, mentor others, and create high-value referral partnerships at scale." |

### `offer_doc`: Offer Document Coach

```
You are the Offer Document Coach for the community. You help members craft and refine their
offer document — the core description of what they sell, who they serve, and why they're unique.
Be precise, help them cut unnecessary words, and ensure their offer is referrable in one sentence.
```

### `special_gift_strategist`: Special Gift Strategist

```
You are the Special Gift Strategist for the community. You help members identify the distinctive
strengths, perspective, or approach they bring that makes them memorable and referrable. Ask
probing questions, reflect patterns you hear, and help them name their gift in clear, confident
language. Be warm but direct; avoid generic praise.
```

> Added April 2026. Source: `getDefaultGlobalPrompt()` in `ai-prompt-builder.ts`.

---

## 2. Module coach default prompts (`getDefaultSystemPrompt()` in `coaching-llm.ts`)

Used when `moduleType` is provided. Admin-overridable via `CoachModuleConfig.systemPrompt`.

| Module | Tone shape |
|---|---|
| `goals` | Goal setting + 90-day planning. **One question at a time.** Direct, warm, action-oriented. |
| `ideal_client` | Demographics + psychographics + pain points + buying triggers. **One question at a time.** Move from vague to referrable. |
| `offer` | Offer design + packaging. **One question at a time.** Single-sentence referrability. |
| `positioning` | Competitive landscape + unique mechanism + brand voice + "only" statement. **One question at a time.** |
| `referral_strategy` | Identifying ideal partners + creating a referral pitch + tracking + reciprocal relationships. **One question at a time.** |

The "one question at a time" discipline is universal across modules. Removing it from a module prompt is a must-fix.

---

## 3. Profile context injection (`buildUserContextSection()`)

Both `composeSystemPrompt` and `buildCoachingPrompt` inject the member profile into `[USER_CONTEXT]`:

```
MEMBER PROFILE:
Name: {name}
Company: {company}
Expertise: {expertise.join(", ")}
Ideal Client: {idealClient || aiWhoYouHelp}
Offer: {productOffering}
Tagline: {tagline}
Mission: {mission}
Elevator Pitch: {aiElevatorPitch}
Level: {level}
Membership Tier: {membershipTier}
```

For level coaches (`coachType.startsWith("level_")`), level completion dates are appended:

```
Journey Progress: Level 1 completed {date}, Level 2 completed {date}
```

For the `referral_strategy` module, referral counts are appended (built in `buildCoachingPrompt`):

```
MEMBER REFERRAL ACTIVITY:
Referrals Sent: {count}
Referrals Received: {count}
Closed Won: {count}
Conversion Rate: {X}%
```

Conditional notes:
- Zero activity → "focus on identifying their first referral targets"
- Conversion rate > 50% → "consider pivoting toward scaling strategies"

**The profile is rebuilt fresh on every turn.** Profile updates are immediately visible in the next turn without session management.

---

## 4. Knowledge context format

When `buildKnowledgeContextWithMeta()` returns context, it appears inside `[USER_CONTEXT]` after the member profile:

```
KNOWLEDGE BASE:
--- Company Context: {title} ---
{body}

--- Methodology: {title} ---
{body}

[COACHING HISTORY]
[Session {date}]
{episodic summary}
```

Total knowledge budget: **8,000 characters** (`TOTAL_CHAR_BUDGET` in `knowledge-context.ts`). Documents are truncated at the boundary with `...(truncated)`.

---

## 5. Anti-sycophancy `[COACHING_QUALITY]` block

Hardcoded, **not** configurable:

```
[COACHING_QUALITY]
When coaching, provide genuine value by:
- Challenging assumptions when you spot gaps in the member's reasoning
- Asking probing questions rather than defaulting to agreement
- Offering alternative perspectives even when the member seems confident
- Being direct about potential risks or overlooked factors
Do not be sycophantic. A great coach says "have you considered..." not "that's a great idea!"
[/COACHING_QUALITY]
```

Decision-log rationale: "Core coaching quality requirement; should not be disableable." Removing or downgrading this block is a must-fix.

---

## 6. Tenant prompt customization

Admins customize via `Tenant.promptBlocks`:

| Field | Tag | Purpose |
|---|---|---|
| `brandVoice` | `[TENANT_BRAND_VOICE]` | Tone and style |
| `topicRestrictions` | `[TENANT_RESTRICTIONS]` | Topics to avoid |
| `overrideInstructions` | `[TENANT_OVERRIDES]` | Custom rules |

Platform safety rules (Layer 1) always take priority. The `[INSTRUCTION_HIERARCHY]` declares this explicitly.

---

## 7. Onboarding agent prompt: `buildSystemPrompt()` in `onboarding-ai.ts`

Hardcoded persona ("Onboarding Strategist"); only the **display name** is configurable per tenant via `Tenant.onboardingAgentName` (default `"AI Agent"`, historically `"Sally"`).

Key sections:
1. **Identity:** `"You are {agentName}, the Onboarding Strategist for {tenantName}."`
2. **Seven numbered responsibilities**: micro-validation, single-question discipline, structured data collection, tool usage rules.
3. **Critical safety rule:** `⛔ CRITICAL RULE: You MUST NEVER call complete_onboarding in the same turn as generate_welcome_post.`
4. **Tone:** "Calm authority. High-vibe. Minimal words. No fluff. ⚜️ This is a premium room."
5. **Current member profile context:** Full JSON serialization on every turn.
6. **Onboarding flow:** Step-by-step field collection sequence.

The full agent specification lives in `onboarding-ai.ts`. Modifying this prompt requires updating `onboarding-ai.md` first. See `guides/06-onboarding-flow.md`.

---

## 8. Matching prompt: pure classifier

```
System: "You are a referral matching algorithm. Return only valid JSON arrays."

User: "You are a referral partnership matching engine.

A great referral match means:
- Their ideal clients overlap
- Their services are COMPLEMENTARY, not competing
- There is a natural opportunity to refer each other's clients

Do NOT match based on:
- Journey level or membership tier
- Join date or seniority
- Geographic proximity (unless explicitly mentioned)
- Generic similarity

REQUESTING MEMBER:
{compact profile}

CANDIDATE PROFILES:
{up to 200 compact profiles, one per line}

Return ONLY a JSON array of exactly 10 objects:
[{\"userId\":\"<ID>\",\"score\":<0-100>,\"reason\":\"<one sentence referral opportunity>\"}]"
```

Parameters:
- `temperature: 0.3`: consistent scoring with slight reasoning diversity.
- `max_tokens: 1000`: sufficient for 10 results.

See `guides/18-matching.md`.

---

## 9. Session summary generation (`generateSessionSummary()`)

Two-step pipeline in `coaching-llm.ts`:

**Step 1: Structured extraction** (`fast` model, `temperature: 0.1`, `response_format: json_object`):

```json
{
  "goals_discussed":     [],
  "decisions_made":      [],
  "commitments_made":    [],
  "blockers_identified": [],
  "next_session_focus":  ""
}
```

**Step 2: Narrative summary** (`chat` model, `temperature: 0.4`):

```
You are a coaching session summarizer. Write a concise 200–300 word summary in
third-person past tense. Be specific and factual. Cover: main topics, key decisions,
commitments, and next actions.
```

The narrative is grounded in the structured extraction. If extraction fails, narrative runs directly against the transcript. Minimum 2 user messages: shorter sessions return `"Session too brief to summarize."`

---

## 10. Routing classifier prompt

See `guides/02-coach-architecture.md §3`: `temperature: 0`, `max_tokens: 20`.

---

## 11. Module opening message: `generateOpeningMessage()`

```
Generate a warm, personalized opening message for {name} to begin a coaching session on
{moduleName}. Keep it to 2-3 sentences. Do not use their name more than once. Be direct
and inviting.
```

`chat` model at `temperature: 0.8`. Cached in Valkey under `coaching:opening:{tenantId}:{module}:{memberId}` for 1 hour.

---

## 12. Temperature & max_tokens reference (must-fix on drift)

| Use case | Model | Temperature | max_tokens |
|---|---|---|---|
| Routing classification | fast (8B) | 0 | 20 |
| Coaching response (global, module) | chat (70B) | 0.7 | 500 |
| Matching | chat (70B) | 0.3 | 1000 |
| Session summary: structured extract | fast (8B) | 0.1 | (json_object) |
| Session summary: narrative | chat (70B) | 0.4 | (default) |
| Module opening message | chat (70B) | 0.8 | (default) |
| Image description | vision | (default) | (json_object) |
| Media chunk summary | fast (8B) | 0.2 | 500 |

Drift from any of these without a doc update is a **must-fix** finding.

---

## 13. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Default prompt missing for an active coach type | must-fix | this guide §1 |
| "One question at a time" discipline removed from module prompt | must-fix | this guide §2 |
| Profile context injected via conversation history (instead of system prompt) | must-fix | `prompt-engineering.md decision log` |
| `[COACHING_QUALITY]` block edited or downgraded | must-fix | this guide §5 |
| Tenant block overrides `[PLATFORM_SAFETY_RULES]` | must-fix | this guide §6 + `[INSTRUCTION_HIERARCHY]` |
| Onboarding agent display name hardcoded ("Sally" or other) instead of `Tenant.onboardingAgentName` | must-fix | this guide §7 |
| `temperature` / `max_tokens` drift from §12 table | must-fix | this guide §12 |
| Coach prompt edit not recorded in `PromptVersion` | must-fix | `guides/05-prompt-versioning.md` |
