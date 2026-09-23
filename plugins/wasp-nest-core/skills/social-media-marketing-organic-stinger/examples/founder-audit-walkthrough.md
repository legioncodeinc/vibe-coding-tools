# Example: Full Anti-Pattern Audit + Remediation

**Scenario:** A solo developer has been posting for 4 months on LinkedIn and X with disappointing engagement. They've tried posting daily but are burning out. Engagement rate has been stuck at 0.4%.

---

## Step 1: Anti-pattern audit findings

Running the anti-pattern catalog from `guides/01-anti-pattern-catalog.md`:

**Anti-pattern 1: Pure AI-generated posts (FOUND)**
Last 20 posts examined. Average personal data anchors per post: 0.8 (below the 3-point threshold). 14 of 20 posts contained no dates, no specific numbers, no personalized situations. All 14 posts could have been written by any developer about any product.

**Anti-pattern 4: Brand voice over founder voice (FOUND)**
Posts read as corporate press releases. "We're excited to share," "our platform enables," "our team believes." The founder's actual Slack messages (reviewed) are direct, funny, and include strong opinions. None of that appears in the social posts.

**Anti-pattern 2: Cross-post automation (FOUND)**
Same post text appearing on LinkedIn and X at the same timestamp. X posts include LinkedIn's line-break formatting, which renders as walls of text on X.

**Anti-pattern 5: Inconsistent cadence (FOUND)**
Week-by-week analysis: 7 posts, 0 posts, 8 posts, 0 posts, 1 post, 6 posts. No week had 3-5 posts consistently. The "daily posting" attempt was bunched over 2 days then abandoned.

**Anti-patterns NOT found:**
- No evidence of bought followers (engagement rate is low, but account is young)
- No engagement bait specifically (posts don't ask questions, but that's a different problem)

---

## Step 2: Voice mining

Pulled raw material from founder's Slack and customer email replies.

**Three voice anchors extracted:**

1. "Every time we try to make the onboarding 'simpler' we break it for power users. The two audiences literally want opposite things and I'm stuck in the middle." (Slack)

2. "The pricing page is a disaster and I've rewritten it 7 times. Still not happy. Customers are confused but they're buying anyway so maybe I'm overthinking it." (Email to advisor)

3. "I shipped the export feature because 3 customers asked for it. Those same 3 customers haven't used it. I should have talked to 10 customers first." (Slack)

These three sentences are more interesting than all 20 posts combined. They are specific, human, and contain problems no AI could fabricate.

---

## Step 3: Remediation plan

**Platform selection adjustment:**
- Drop daily posting ambition immediately. 3x/week LinkedIn only for 60 days.
- Put X on hold — the account is too young and the cross-posting approach has diluted both platforms.
- Reason: LinkedIn has 3-5 day content lifespan; 3 posts/week maintains presence without burnout.

**Voice adjustment:**
- All posts for the next 30 days must be written in first-person Slack-voice (casual, direct, specific).
- Remove "we" from all posts. This is a solo founder; "I" is accurate.
- Remove "excited to," "thrilled to," and "proud to" permanently.

**Sample post rewrites using voice anchors:**

*From:* "Our onboarding experience has been updated to deliver a simpler, more intuitive first-run experience for all users."

*To:* "Rewrote the onboarding for the fourth time last week. Made it simpler for new users. Immediately got an angry email from a power user who said I'd 'ruined it.' Both are right. I have no idea how to solve this."

---
*From:* "Excited to announce our new CSV export feature! Download your data in just a few clicks."

*To:* "Three customers asked for CSV export. I shipped it in a week. Those same three customers haven't used it. If I'd talked to 10 customers before building it, I would have known it wasn't actually a priority. Now I talk to 10 customers before shipping anything."

---

## Step 4: Growth expectations reset

With the corrected strategy (3x/week LinkedIn, authentic voice, engaged commenting):

- 30 days: engagement rate should rise from 0.4% to 2-3%
- 90 days: 150-300 followers expected, ER stable at 2-4%
- 6 months: 400-1,000 followers, with one or two posts having significantly higher distribution if voice is consistent

The founder's previous "0 followers gained" weeks were partly an algorithm cold shoulder from inconsistent cadence and partly from AI-style content scoring low on authenticity. Both are correctable.

---

**Guides used:** `guides/01-anti-pattern-catalog.md`, `guides/03-founder-voice.md`, `guides/02-platform-selection.md`, `guides/07-growth-benchmarks.md`
**Template used:** `templates/social-audit-report.md`
