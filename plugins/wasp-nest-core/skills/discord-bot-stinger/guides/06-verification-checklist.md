# 06: Bot Verification Checklist

Step-by-step guide to the Discord bot verification process for bots approaching or exceeding 100 server installations.

*Sources: `research/external/2026-05-20-discord-privileged-intents.md`, `research/external/2026-05-20-discord-privileged-intents-best-practices.md`*

---

## When to start

| Milestone | Action |
|-----------|--------|
| **75 guilds** | Begin the application immediately. Process takes 1-5 business days. |
| **100 guilds** | Hard block: Discord stops allowing new guild joins until verification is approved. |

Do not wait until 90 guilds. Start the process at 75.

---

## Pre-requisites before applying

Complete all of these before submitting the application:

- [ ] Bot has a **support server** (a publicly joinable Discord server for bot support).
- [ ] Bot has a **Privacy Policy URL**: a publicly accessible page describing what data you collect, how long you retain it, and how users can request deletion.
  - If you're requesting `GUILD_MEMBERS` or `GUILD_PRESENCES`, the privacy policy must specify a maximum data retention window. Discord typically requires **30 days or less** for member/presence data.
- [ ] Bot has a **Terms of Service URL** (recommended, not strictly required, but improves approval odds).
- [ ] The Developer Portal entry for your bot has all required fields filled: description, tags, support server, policy URLs.
- [ ] You have documented which **Privileged Intents** you need and have clear justification for each.

---

## Privileged Intent justifications

For each privileged intent your bot uses, prepare a one-paragraph justification:

| Intent | Justification template |
|--------|----------------------|
| `MESSAGE_CONTENT` | "The bot reads message content to [specific feature, e.g., 'detect and delete spam messages matching a regex pattern']. Content is not stored beyond [time window]." |
| `GUILD_MEMBERS` | "The bot uses member join/leave events to [specific feature]. Member data is retained for [max 30 days] and deleted when the member leaves the server." |
| `GUILD_PRESENCES` | "The bot displays user activity status in [specific feature]. Presence data is not stored; it is only read in real-time." |

Vague justifications ("We need it for full functionality") are rejected. Be specific about the feature and the data lifecycle.

---

## Submission steps

1. Open the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select your application.
3. Navigate to **Bot** → scroll to **Privileged Gateway Intents** → enable only the ones you need.
4. Navigate to **OAuth2** → **General** → fill in Support Server, Privacy Policy URL, Terms of Service URL.
5. Navigate to **Bot** → scroll to **Verification** → click **Verify**.
6. Complete the verification form:
   - Describe your bot's purpose.
   - Justify each privileged intent (see above).
   - Provide support server invite, privacy policy URL.
7. Submit. Discord reviews within 1-5 business days.

---

## While waiting for approval

- You can still operate in guilds you are already in.
- New guild joins are blocked only if you are already at 100 guilds. If you are below 100, new joins continue while the application is pending.
- If rejected, Discord provides rejection reasons. Common reasons:
  - Vague intent justifications.
  - Privacy policy missing or insufficient.
  - Support server not joinable.

---

## After approval

- Approval grants the privileged intents permanently for that application.
- If you add a new privileged intent later, you must submit a new application.
- Removal of a previously approved intent does not require reapplication.

---

*See `templates/bot-verification-checklist.md` for a fillable version of this checklist.*
