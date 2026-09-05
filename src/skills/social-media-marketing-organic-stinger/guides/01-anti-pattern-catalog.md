# Guide 01: Anti-Pattern Catalog

Ten organic social anti-patterns with diagnosis, cost, and concrete before/after remediation.

Run this audit when: the founder has existing content to review, the founder says "it's not working," or the engagement is suspiciously low relative to posting frequency.

---

## Anti-Pattern 1: Pure AI-generated posts

**Diagnosis:** Posts with no personal data anchors, zero contractions, generic vocabulary, em-dashes everywhere, no specific details that couldn't have been written by anyone.

**Cost:** LinkedIn 360Brew: 20-40% reach reduction. Audiences: 30% of consumers are less likely to engage with brands that use AI-generated content (Storrito 2026). Creates self-reinforcing low-quality loop — AI post attracts AI-generated comments, which signals low quality to the algorithm.

**Test:** Apply the LinkedIn 360Brew audit: count personal data points (names, dates, client situations, specific moments) and contractions in your last 10 posts. Under 3 personal data points + under 4 contractions per post = likely flagged.

**Before:**
> "Authenticity is the key to success on social media. Here are 5 ways to build genuine connections with your audience: 1. Listen actively. 2. Share your story. 3. Be consistent."

**After:**
> "Three weeks ago a customer told me they almost cancelled. We'd shipped the wrong priority for 60 days. I wrote the thread about what we got wrong. 847 comments. Nothing I've published about what we got *right* has come close."

**Research grounding:** `research/external/2026-05-20-ai-content-detection-linkedin.md`, `research/external/2026-05-20-anti-ai-backlash-algorithms.md`

---

## Anti-Pattern 2: Cross-post automation ("share everywhere")

**Diagnosis:** Identical post text appearing simultaneously on LinkedIn, X, Threads, and Bluesky at the same timestamp. Often includes platform-specific formatting artifacts (LinkedIn line breaks that look odd on X, hashtag stacks native to Instagram but unused on Bluesky).

**Cost:** Platform-native content performs 3-5x better than cross-posts. X suppresses external links 30-50%. LinkedIn audiences notice when the post "feels like" it was written for somewhere else. Audiences who follow the founder on multiple platforms feel like the relationship isn't real.

**The distinction:** Cross-post automation = bad. Thoughtful repurposing = good. Repurposing means rewriting the core insight in each platform's native register (LinkedIn: long-form, analytical; X: punchy thread or single observation; Bluesky: direct, dev-community tone; Threads: short, conversational).

**Before:** Copy-pasting a LinkedIn post to X with no edits.

**After:** LinkedIn post becomes a 5-tweet thread on X with numbers and a cliffhanger structure; the same insight becomes a 2-sentence Bluesky post that drops the context (because the community already has it).

**Research grounding:** `research/external/2026-05-20-indie-hacker-x-strategy.md`, `research/external/2026-05-20-platform-algorithm-comparison.md`

---

## Anti-Pattern 3: Bought followers / engagement pods

**Diagnosis:** Follower count grew 5x in a month without a visible viral post; engagement rate is below 0.5% with "large" audience; comment section filled with generic one-liners from accounts with foreign-language names.

**Cost:** 37.2% of influencer accounts already show fraudulent activity (SociaVault 2026). Bought followers destroy the engagement rate metric that actually predicts business outcomes. Algorithm recovery is extremely slow — you're fighting an artificial follower base every time the platform calculates distribution.

**The only path:** Slow down. Build the real audience. A 400-follower account with 7% engagement produces more qualified conversations than a 40,000-follower account with 0.01%.

**Research grounding:** `research/external/2026-05-20-engagement-benchmarks-2026.md`

---

## Anti-Pattern 4: Brand voice over founder voice

**Diagnosis:** Posts sound like they came from a marketing department, not a human. "We're excited to announce," "our team believes," "our mission is to..." Founder's personality is nowhere.

**Cost:** LinkedIn data consistently shows personal profiles outperform company pages dramatically in 2026. The platform rewards people, not logos. Founders who outsource their voice to a "brand" create content that no algorithm or audience wants to boost because it is indistinguishable from corporate noise.

**Before:**
> "Our platform delivers enterprise-grade security for modern development teams. Learn more about how we protect your workflow."

**After:**
> "I shipped a feature for 6 months that nobody used. Talked to 12 customers last week. None of them mentioned it. Found out they'd been working around it with spreadsheets. Deleting the feature next week."

**Research grounding:** `research/external/2026-05-20-founder-led-content-wins.md`, `research/external/2026-05-20-linkedin-vs-threads-founders.md`

---

## Anti-Pattern 5: Inconsistent cadence (feast-famine)

**Diagnosis:** Posts 8 times in one week after a product launch, then nothing for 5 weeks, then 3 posts after a feature update. No rhythm.

**Cost:** Every platform algorithm distributes more to accounts with consistent posting cadence. An irregular account trains the algorithm that it is an unreliable signal. Audience trust also suffers — followers who see a burst-then-silence pattern disengage.

**Remedy:** Default to 3 posts/week. That is the minimum viable cadence for LinkedIn and Bluesky. Don't post 8 times in a week after a launch — post consistently the weeks before and after. The launch post lands harder in an account with consistent presence.

**Research grounding:** `research/external/2026-05-20-linkedin-vs-threads-founders.md`, `research/external/2026-05-20-build-in-public-x-playbook.md`

---

## Anti-Pattern 6: Engagement bait with no follow-through

**Diagnosis:** Posts asking "what's your biggest challenge with X?" followed by zero replies to the responses. Polls that go unanswered. Questions with no comments addressed.

**Cost:** Audiences notice when questions are not genuine. The engagement loop breaks — followers stop commenting because they've learned responses will be ignored. Worse: platforms clock early reply velocity as a quality signal; ignoring your own post's comments tanks distribution.

**Remedy:** Never post a question you won't spend 15 minutes replying to. Engage with every comment in the first hour of a post's life. That first-hour velocity is the X algorithm's primary quality signal.

**Research grounding:** `research/external/2026-05-20-build-in-public-x-playbook.md`

---

## Anti-Pattern 7: Highlights-only content (no process, no failure)

**Diagnosis:** Every post is a win announcement, a milestone, or a feature launch. Nothing goes wrong. The founder's journey is suspiciously smooth.

**Cost:** Failure posts outperform success posts 3-5x on X (Founder Distro 2026). Authenticity in the build-in-public community is built by vulnerability and specificity, not achievement broadcasts. An audience that only sees wins disengages — they don't trust it.

**Remedy:** 70/30 rule: 70% useful insights for anyone + honest process documentation, 30% product updates. Document your process, not just your highlights. "We shipped this" posts are the weakest content type. "Here's what we got wrong and why" posts are the strongest.

**Research grounding:** `research/external/2026-05-20-build-in-public-x-playbook.md`, `research/external/2026-05-20-founder-led-content-wins.md`

---

## Anti-Pattern 8: Vanity-metric obsession (follower count over engagement rate)

**Diagnosis:** Founder optimizes for follower growth, not engagement. Treats 1,000 followers as a milestone more meaningful than 50 substantive conversations.

**Cost:** At the nano tier (1K-10K followers), LinkedIn median engagement rate is the highest it will ever be. A post generating 50 substantive comments outranks one with 500 passive likes (Storrito 2026). Follower count is a lagging indicator; engagement rate is the leading one.

**Remedy:** Track engagement rate (substantive comments + saves + DM shares) per post. This is the metric that predicts whether the social presence will generate actual business outcomes.

**Research grounding:** `research/external/2026-05-20-engagement-benchmarks-2026.md`, `research/external/2026-05-20-anti-ai-backlash-algorithms.md`

---

## Anti-Pattern 9: "Be everywhere" at minimum viable volume

**Diagnosis:** Posting once a week on 5 platforms. Below-threshold volume on all of them, significant cognitive load on the founder, no clear platform identity.

**Cost:** Below-threshold volume prevents meaningful algorithmic distribution on any platform. Threads requires 5-7x/week minimum for meaningful reach; Bluesky 3-5x. One post/week on 5 platforms produces worse results than 4 posts/week on 1 platform.

**Remedy:** Ruthlessly narrow. One platform for 90 days. Build consistent presence. Add a second only when the first is sustainable.

**Research grounding:** `research/external/2026-05-20-bluesky-vs-threads-founders.md`, `research/external/2026-05-20-platform-algorithm-comparison.md`

---

## Anti-Pattern 10: No-reply culture

**Diagnosis:** Founder posts but never replies to comments, never comments on peer posts, and treats social as a broadcast channel.

**Cost:** X algorithm prioritizes replies over likes (2026). LinkedIn rewards comment depth over reaction volume. The engagement strategy is what activates distribution — posting without engaging is posting into a void.

**Remedy:** 15-20 minutes/day replying to peer posts in your niche. Reply to every comment on your own posts within the first hour. See `guides/08-engagement-strategy.md` for the practical implementation.

**Research grounding:** `research/external/2026-05-20-indie-hacker-x-strategy.md`, `research/external/2026-05-20-build-in-public-x-playbook.md`
