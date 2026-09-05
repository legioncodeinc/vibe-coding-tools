# 06: Onboarding Flow

`streamOnboardingChat()` SSE streaming, profile extraction, welcome post generation, attachment handling, tenant-configurable display name. The onboarding agent is a distinct path from the main coaching orchestrator.

> **Doc reference:** `library/knowledge/private/ai/onboarding-ai.md` is canonical.

---

## 1. The onboarding agent

A single agent ("Onboarding Strategist") running on Llama 3.3 70B via OpenRouter with OpenAI-compatible tool calls. The conversation is streamed over SSE from `streamOnboardingChat()` in `lib/onboarding-ai.ts`.

**Display name** is tenant-configurable via `Tenant.onboardingAgentName` with default `"AI Agent"`. Historically shipped as `"Sally"`, that string is preserved as the tenant-picked default for legacy tenants but must NEVER be hardcoded anywhere.

The persona ("Onboarding Strategist") and responsibilities are hardcoded; only the display name is admin-editable.

---

## 2. The endpoint

`POST /api/onboarding/chat`: `Content-Type: text/event-stream`.

**Request body:**

```typescript
{
  message:    string;           // min 1 char (required unless attachment provided)
  sessionId?: string;           // resume existing session
  attachment?: {
    url:       string;           // DO Spaces presigned URL
    filename:  string;
    mimeType?: string;
  };
}
```

Auth: required (JWT access cookie). RBAC: any authenticated member.

---

## 3. SSE event types emitted

| Event type | When | Payload |
|---|---|---|
| `text` | Streaming text tokens from the agent | `{ type: "text", content: string }` |
| `tool_call` | Agent calls a tool | `{ type: "tool_call", name: string }` |
| `welcome_post` | After `generate_welcome_post` runs | `{ type: "welcome_post", content: string }` |
| `onboarding_complete` | After `complete_onboarding` runs | `{ type: "onboarding_complete" }` |
| `done` | End of response | `{ type: "done" }` |

There is **exactly one onboarding session per member**. Session ID is returned from the route. The session is found by `coachType: "onboarding"` lookup and resumed automatically.

---

## 4. The system prompt (`buildSystemPrompt()`)

Hardcoded persona; only display name + tenant name + coach name are interpolated:

```typescript
function buildSystemPrompt(profileContext, tenantName, coachName) {
  return `**You are ${agentName}, the Onboarding Strategist for ${tenantName}.**
  ...
  **Current Member Profile Context:**
  ${JSON.stringify(profileContext, null, 2)}
  ...`;
}
```

**Seven numbered responsibilities:**

1. Micro-validation and echoing: rephrase to confirm.
2. Thought-provoking inquiry: one question at a time.
3. Iterative guidance: control pace; summarize periodically.
4. Zero overthinking: keep questions clear; offer examples.
5. Structured data collection: gather all required fields before generating a post.
6. Tool usage: `scrape_url` for URLs, `update_profile` to save data, `generate_welcome_post` once data confirmed, `complete_onboarding` when approved.
7. Welcome post generation: call `generate_welcome_post` once all fields are confirmed.

**Tone:** "Calm authority. High-vibe. Minimal words. No fluff. ⚜️ This is a premium room."

The full text is in `onboarding-ai.ts`. Modifying the persona requires updating `library/knowledge/private/ai/onboarding-ai.md` first.

---

## 5. The critical safety rule

```
⛔ CRITICAL RULE: You MUST NEVER call complete_onboarding in the same turn as
generate_welcome_post. After calling generate_welcome_post, you MUST present the post
to the member and wait for their explicit approval before calling complete_onboarding
in a separate turn.
```

This prevents accidental publishing before the member reviews. Removing or weakening this rule is a **must-fix**.

---

## 6. Profile context injected on every turn

```typescript
**Current Member Profile Context:**
${JSON.stringify(profileContext, null, 2)}
```

Serialized fresh per turn so the agent always knows which fields are filled. On session resume, this means the agent doesn't ask for fields that already exist on the user record.

---

## 7. Field collection sequence

The agent gathers these through conversation, URL scrape, or attachment extraction:

| Field | Tool arg | Prisma mapping |
|---|---|---|
| Name | `name` | `user.name` |
| Referral source | `referredBy` | `user.referralSource` |
| Location | `location` | `user.location` |
| Expertise | `expertise` | `user.expertise[]` |
| Ideal client | `idealClient` | `user.clientFocus` |
| Program/offer | `programName` | `user.productOffering` |
| Mission | `mission` | `user.mission` |
| Credibility stats | `credibility` | `user.credibilityBullets[]` |
| Case study | `caseStudy` | `user.caseStudies[]` |
| Fun facts | `funFacts` | `user.funFacts[]` |
| Social links | `linkedIn` / `instagram` / `facebook` / `twitter` / `youtube` / `tiktok` | `user.*` |
| Website | `website` | `user.website` |
| Price range | `priceRange` | `user.priceRange` |

---

## 8. The four tool handlers

### `scrape_url`

Delegates to `scrapeUrl()` in `scrape-tool.ts`. Fetches URL, strips HTML, truncates to 8,000 chars, returns plain text.

### `update_profile`

Writes confirmed fields directly via `prisma.user.update()` synchronously within the tool call loop. Persisted before the welcome post.

Field mapping (excerpt):

```typescript
if (args.expertise)   updates.expertise         = [args.expertise];
if (args.idealClient) updates.clientFocus        = args.idealClient;
if (args.programName) updates.productOffering    = args.programName;
if (args.referredBy)  updates.referralSource     = args.referredBy;
if (args.credibility) updates.credibilityBullets = [args.credibility];
if (args.caseStudy)   updates.caseStudies        = [args.caseStudy];
if (args.funFacts)    updates.funFacts           = [args.funFacts];
```

### `generate_welcome_post`

Reads current profile from Postgres, assembles the template-based welcome post:

```
☀️ Welcome New Member {name}!

@everyone let's give a warm welcome to our newest member @{name} ({expertise})

Big shout out to @{referralSource} for referring them to our Dream Team 💯

**Expertise:** {expertise}
**What They Do:** {productOffering}
**Mission:** {mission}
☀️ {credibilityBullets[0]}
📍 Located in {location}
😄 Fun Facts: {funFacts[0]}

🔗 {website}
🔗 {instagram}
🔗 {linkedIn}

**Why they're a powerful addition:**
I believe {name}'s expertise in {expertise} and passion for {mission} is a powerful
addition to our Dream Team — let's show them some love in the comments 👏🏼
```

Saves to `user.welcomePostBody`. Streams as `welcome_post` SSE event.

### `complete_onboarding`

Three sequential Prisma writes:

1. Create `FeedItem` with `type: "welcome"`, `status: "published"`, body = approved post.
2. `user.onboardingProgress = { step: "complete" }`, set `user.welcomePostBody`.
3. Create `ActivityEvent` with `type: "onboarding_completed"`.

Emits `onboarding_complete` SSE event.

---

## 9. Attachment handling

When `attachment` is provided, `streamOnboardingChat()` fetches the file content via `extractText()` from `document-extractor.ts` and prepends it to the user message:

```typescript
enrichedUserMessage = `The user has shared a document: ${attachment.filename}\n\n${docText}${userMessage ? `\n\n---\n${userMessage}` : ""}`;
```

Supported: PDF, DOCX, DOC, CSV, images (JPEG/PNG/GIF/WebP), Markdown, HTML, plain text.

On extraction failure, a graceful message is sent: `[User attached a file: {filename} — could not read content]`.

---

## 10. The opening message (hardcoded in code)

```typescript
const OPENING_MESSAGE = `Welcome to ${tenantName}! ⚜️\n\nTo help the community easily refer you and for ${coachName} to craft your personalized Welcome Post, please share your Website, Offer Doc, or Social Bio link.\n\nThis helps us understand your unique brilliance right from the start.`;
```

Injected into history before the first user message so the agent has context from turn one without an LLM call.

---

## 11. Onboarding agent IS NOT RAG-active

Per `library/knowledge/private/ai/README.md` RAG status table:

> Onboarding (onboarding agent): **No**, hardcoded system prompt, no KB retrieval

This is intentional. The onboarding agent's job is profile extraction + welcome post generation, not knowledge retrieval. If a feature request asks for RAG in onboarding, push back: it's the wrong tool. Use `scrape_url` for URL-based extraction; document attachments handle document-based extraction.

---

## 12. Conversation history persistence

```typescript
{ role: "user",      content: "..." }
{ role: "assistant", content: "...", tool_calls?: [...] }
{ role: "tool",      content: "...", tool_call_id: "..." }
```

The system prompt is **not** stored: rebuilt fresh each turn from live profile state and tenant config.

---

## 13. Open risks (per the doc)

| Risk | Severity | Status |
|---|---|---|
| Onboarding system prompt (beyond display name) hardcoded; no admin customization | Medium | Intentional for now; deeper persona customization planned |
| No rate limiting on the SSE endpoint | Medium | Add per-user rate limiting (handed to `security-worker-bee`) |
| Server-side URL scraping with no sandboxing: SSRF possible | High | Add allowlist or proxy through safe external service (handed to `security-worker-bee`) |

mind-worker-bee flags the SSRF concern and hands the audit to `security-worker-bee`.

---

## 14. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Onboarding agent display name hardcoded ("Sally" or other) | must-fix | this guide §1 |
| Critical safety rule (`complete_onboarding` not in same turn) removed or weakened | must-fix | this guide §5 |
| `update_profile` writes async (after welcome post generation) | must-fix | this guide §8 |
| Onboarding agent path adds RAG retrieval without doc update | must-fix | this guide §11 |
| Field collection sequence diverges from §7 without doc update | should-refactor | `onboarding-ai.md §1` |
| Attachment handling drops the user message | must-fix | this guide §9 |
| Opening message edited in code without an admin path | should-refactor | this guide §10 |
| SSE endpoint lacks rate limiting | should-refactor (security handoff) | this guide §13 |
