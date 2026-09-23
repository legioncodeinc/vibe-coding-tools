# Sequence Design

The sequence is the cadence of touchpoints you send to a prospect from first contact to either a positive reply or a polite conclusion. Most founders default to the wrong structure: too many steps, too many words, too much about the product, not enough about the prospect's problem.

**Research grounding:** `research/external/2026-05-20-cold-email-sequence-length-benchmarks.md`, `research/external/2026-05-20-cold-email-reply-rate-benchmarks-2026.md`, `research/external/2026-05-20-b2b-cold-email-sequence-build.md`, `research/external/2026-05-20-cold-email-follow-up-sequences-guide.md`

---

## Step count by segment

| Segment | Recommended steps | Research basis |
|---|---|---|
| SMB / founder outreach | 3-4 | Belkins: 3-step sequences generate 9.2% reply rate (highest per-sequence) |
| Mid-market | 5-7 | 4-7 steps optimal per Backlinko 12M email study |
| Enterprise | 7-9 | Longer cycles, lower volume, more personalization |

**Never recommend more than 5 steps for SMB cold outreach.** Steps 6+ produce near-zero positive replies and burn sender reputation. If the user wants more steps, surface the data and document the override decision.

---

## Cadence spacing

| Step | Channel | Delay from previous | Purpose |
|---|---|---|---|
| 1 | Email | Day 0 (initial send) | Problem hypothesis, one ask |
| 2 | Email | Day 2-3 | Reply frame ("wanted to follow up on this") |
| 3 | LinkedIn | Day 4-5 | Connection request or message (optional) |
| 4 | Email | Day 7-10 | Reframe or case study approach |
| 5 | Email | Day 14 | Breakup email |

Spacing rule: 2-3 days for early follow-ups, widening to 5-7 days and then 7-14 days for later steps. Tight follow-ups signal desperation; long gaps lose momentum.

---

## Email construction rules

### Length
- Under 80 words per email. (Research: most high-performing cold emails are 50-125 words, shorter for follow-ups)
- If you cannot explain the value proposition in 80 words, the pitch is not tight enough.
- Every word that does not advance toward a positive reply should be cut.

### Structure (every email)
1. **Opening line:** specific personalization OR a direct statement of the problem. NOT "My name is..." or "I'm reaching out because..."
2. **Problem statement:** one sentence naming the exact problem they likely have. Research their situation first.
3. **Bridge to your solution:** one sentence connecting the problem to what you do. Do NOT explain features.
4. **Single CTA:** one ask. Not "Would love to schedule a call to discuss how we can help you achieve your goals." Rather: "15 minutes Thursday or Friday?"

### Subject lines
- 3-7 words, no spammy punctuation (!, ?, ALL CAPS)
- Use the prospect's name, company name, or a specific signal when available
- Test curiosity-based vs benefit-based vs name-drop: the only way to know is to A/B
- Avoid: "Quick question", "Following up", "Did you see my last email?" (overused)
- Best-performing formats in 2026: "{{FirstName}} - [specific company/role context]", direct question, "Re:" (use sparingly, only for genuine reply threading)

### Follow-up step 2 rule
Step 2 should read like a reply in a real email thread, not like a reminder that you sent an email. Example approach:
- Reference something new (a thought, a relevant piece of news, a question)
- Do not start with "Just following up on my previous email"
- Keep it shorter than step 1

### Breakup email (final step)
- Frame it as the last touch: "I won't keep reaching out after this one."
- Sometimes generates the highest reply rate in a sequence because it removes pressure
- One sentence: offer to close their file or ask if this is simply not a priority right now

---

## Timing

| Dimension | Recommendation | Research basis |
|---|---|---|
| Day of week | Wednesday peak; Tuesday-Thursday window | `research/external/2026-05-20-b2b-cold-email-sequence-build.md` |
| Time of day | 7-11 AM recipient local time | Most email platforms support timezone-aware sending |
| Avoid | Monday (inbox flood), Friday (weekend mindset) | Standard industry guidance |

Configure your sending platform for timezone-aware delivery. Sending at 9 AM your time to recipients in different timezones reduces effectiveness.

---

## Copy patterns

### Problem-hypothesis (recommended for most cases)
> "Most [job title] I talk to are struggling with [specific problem]. Is that on your radar?"

Works when: the problem is specific, well-validated, and the prospect is likely experiencing it.

### Predictable Revenue (Aaron Ross)
Short, direct, curiosity-creating. 2-3 sentences, no pitch, ask to refer to the right person if they're not the right contact.

> "Hi {{FirstName}}, I help {{Company}} sales teams reduce time-to-first-meeting by 40%. Not sure if this is relevant for you — who would be the right person to speak with?"

Works when: validating fit quickly at high volume with low personalization budget.

### Challenger / problem-hypothesis
> "Most VPs of Sales we speak with are unaware their reps are spending 40% of time on tasks that have no impact on quota. We built a tool that eliminates that. Worth a conversation?"

Works when: you have data to cite and the prospect is senior enough to care about that data.

---

## Multi-channel rules

Multi-channel sequences (email + LinkedIn + phone) consistently outperform email-only. However:
- Email should account for 50% or less of total touchpoints (the rest: LinkedIn, phone, video)
- Do not add LinkedIn steps unless you have capacity to actually engage there
- Phone steps are high-effort but generate disproportionate positive signal

For founder-led outreach with limited time: email-only 3-step sequences are the correct tradeoff.

---

## Use `templates/sequence-5-step.md` as the scaffold.
## See example in `examples/saas-founder-sequence.md`.
