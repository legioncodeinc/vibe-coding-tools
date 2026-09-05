# Reply Handling and Disqualification

Handling replies is where the meeting gets booked or the relationship gets damaged. Most founders under-invest in reply handling — they focus all their attention on the initial sequence and then improvise when a reply actually comes in. The result: interested prospects fall through, neutral replies get pushed off, and angry replies turn into reputation damage.

> NOTE: This guide synthesizes from first principles and practitioner knowledge. No 2026 external sources were found specifically covering reply classification taxonomy. The framework below reflects industry-standard practice as described in the Command Brief and cold email practitioner community. (`research/research-summary.md` open question 5)

---

## Reply taxonomy

Every inbound reply falls into one of five categories. Classify correctly before responding.

### 1. Interested (positive)
**Signals:** "Yes, tell me more", "Happy to chat", "Send me a time", "Intro me to someone?", "This looks relevant"

**Response goal:** Book the meeting within 24 hours.

**How:**
- Respond within 4 hours during business hours (every hour of delay reduces conversion)
- Offer specific calendar availability or a Calendly link (not "let me know when you're free")
- Keep the response short: 2-3 sentences confirming the meeting and setting expectations
- Do not over-explain the product in the reply — save that for the call

### 2. Not now (conditional positive)
**Signals:** "Not the right time", "Check back in Q3", "We're in the middle of a platform migration", "This is on our roadmap for next year"

**Response goal:** Get permission to follow up at the right time, then actually follow up.

**How:**
- Acknowledge the timing without pushing ("Completely understand — timing is everything")
- Ask for a specific time to reconnect: "Would it make sense to touch base in Q3? I can set a reminder."
- If they say yes, mark for follow-up in your CRM with a specific date
- Do NOT put them back into the cold email sequence — they responded and deserve a manual touch at the right time

### 3. Wrong person (redirect)
**Signals:** "You should talk to [name]", "I'm not the decision-maker for this", "This sits with our IT team"

**Response goal:** Get a warm intro to the right person.

**How:**
- Thank them for the redirect
- Ask for an introduction: "Would you mind introducing me, or should I reach out directly? Happy for you to forward this if easier."
- A warm intro from an internal referral converts 3-5x better than a fresh cold email to the same person

### 4. Unsubscribe (administrative)
**Signals:** "Please remove me from your list", "Unsubscribe", "Stop emailing me"

**Response goal:** Remove immediately, no damage to relationship.

**How:**
- Remove from all active sequences within the hour
- Add to master suppression list
- Send a brief acknowledgment: "Done — you've been removed and won't hear from us again. Apologies for the interruption."
- Do NOT argue or ask why — any engagement with an unsubscribe request beyond acknowledgment creates risk

### 5. Angry (negative)
**Signals:** "This is spam", "How did you get my email?", threatening language, CC'ing their legal team, reporting as spam

**Response goal:** Deescalate, remove, do not escalate.

**How:**
- Remove from all sequences immediately
- Respond once with an apology and removal confirmation: "I apologize for the unwanted outreach. You've been removed from all communication and won't receive any further emails."
- Do NOT defend your approach, explain your business, or ask for feedback
- Log the complaint. If you're receiving multiple angry responses from the same company, add the entire company domain to your suppression list
- If they threaten legal action regarding GDPR or CAN-SPAM: escalate to `security-worker-bee` with the specific complaint details

---

## ICP disqualification criteria

Not everyone who responds positively should receive the same follow-through. Apply ICP disqualification before investing in a discovery call.

Disqualify (or deprioritize) if:
- Company size is outside your ICP range (too small = no budget, too large = wrong sales motion)
- Job title does not match buying authority (SDR manager interested, but the VP you need won't engage)
- No buying trigger visible (they're curious but not in pain)
- Competitor (never sell to competitors — they are doing research)
- Geography you cannot serve
- Industry you do not serve

For borderline cases: run a short qualification email before booking a call. "Before we set time, quick question: are you currently [experiencing the specific problem you solve]?" This respects your time and theirs.

---

## Forward-to-decision-maker playbook

When a reply indicates you've reached the wrong level, the forward-to-DM approach works better than starting cold with the senior contact.

**Email to wrong-level responder:**
> "Thank you for the redirect. Would you be open to forwarding this email to [name/title they mentioned] with a brief note? Or would it be easier for me to reach out to them directly mentioning your name?"

If they offer to forward: provide a short, forwarding-friendly email they can attach. Keep it 3 sentences — the referrer does not want to send a wall of text on your behalf.

If they say reach out directly: now you have a warm name-drop. Subject line: "Referred by [Name] at [Company]". Body starts: "[Name] suggested I reach out directly — wanted to share this with you."

---

## CRM tracking

Every reply should update a contact record in your CRM:
- Reply category (interested / not-now / wrong-person / unsub / angry)
- Date of reply
- Follow-up date (for not-now)
- Notes on context (what they said, what deal stage they're in)

Without CRM hygiene, follow-up discipline breaks down within weeks. Even a lightweight setup (Notion database, Airtable, HubSpot free) is better than tracking in email threads.

Route CRM schema design to `db-worker-bee` if the user needs a formal data model.
