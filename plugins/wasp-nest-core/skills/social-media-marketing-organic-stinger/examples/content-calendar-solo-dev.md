# Example: 4-Week Content Calendar for a Solo Developer

**Profile:** Solo developer, building a dev tooling SaaS (database query analyzer), 3 months since launch, 280 LinkedIn followers, 180 Bluesky followers. Available time: 3-4 hours/week. Primary platform: LinkedIn. Secondary: Bluesky (repurposed).

---

## Week 1: Baseline-setting

**Monday — Insight post (LinkedIn)**
> Topic: The problem I didn't know I was solving until the third customer told me the same thing.
>
> Draft (in founder voice): "Three customers in a row told me they use our product to catch a specific type of query pattern before it hits production. I built the tool to help teams optimize queries after they deploy. The customers don't care about post-deploy optimization. They care about catching mistakes before review. It took me three months of product analytics to see what three conversations surfaced in one week."

Authenticity check: ✓ specific number (three customers), ✓ time specifics (three months, one week), ✓ learning, ✓ opinion about process

**Wednesday — Build update (LinkedIn)**
> Topic: Month 3 numbers update
>
> Draft: "Month 3 numbers: 41 paying customers. $2,847 MRR. Churn: 2 customers (one outgrew us, one never used it). NPS: asked 15, got 7 responses, averaged 8.1. The 2 churns bother me more than the growth. Writing a postmortem on both this week."

Authenticity check: ✓ specific numbers throughout, ✓ emotion ("bother me more"), ✓ next action specified

**Friday — Engagement post (LinkedIn)**
> Topic: Genuine question about developer tooling adoption
>
> Draft: "For developer tools: do you buy based on a compelling trial, or do you buy after you've already been using the free tier for months? Trying to understand whether my 14-day trial is too long, too short, or irrelevant."

Authenticity check: ✓ specific timeframe, ✓ genuine question the founder actually needs answered, ✓ will reply to all responses

---

**Bluesky repurpose (same week):**
Insight post → Bluesky: Condensed to 2 paragraphs, more direct tone ("I spent 3 months looking at analytics when I could have just talked to customers sooner"), no hashtags.
Build update → Bluesky: Numbers post works on Bluesky as-is, slightly shorter.
Engagement → Bluesky: Same question, shortened.

---

## Week 2: Depth

**Monday — Insight post (LinkedIn)**
> Topic: Why "just talk to customers" advice is useless without the specific questions
>
> Draft: "Everyone says 'talk to your customers.' Here's what nobody tells you: asking 'what do you think of the product?' gets you politeness. Asking 'walk me through the last time you used X feature' gets you the truth. Discovered this after 18 calls where I learned nothing useful and 3 calls where a specific question changed our entire roadmap."

**Wednesday — Build update (LinkedIn)**
> Topic: A specific decision and its reasoning
>
> Draft: "We're removing the 'export to PDF' feature next release. Shipped it 2 months ago because 4 customers asked for it. 2 have used it. The maintenance cost (every query engine change breaks the PDF renderer) is not worth 2 active users. Lesson: 4 requests is not enough signal for a feature that creates ongoing maintenance. 10 is the new floor."

**Friday — Engagement post (LinkedIn)**
> Topic: Counterintuitive opinion about developer productivity tools
>
> Draft: "Unpopular opinion: most developer tooling is over-featured. The best tools do one thing well and get out of the way. The tools that try to be platforms end up being used for one specific use case by 80% of their users anyway. What's the 'one thing' your team's most-used tool actually does for you?"

---

## Week 3: Process

**Monday — Insight post (LinkedIn)**
> Topic: Failure + learning: the feature that took 6 weeks and nobody uses
>
> Draft: "Six weeks of engineering time went into 'query performance recommendations.' It worked technically. Nobody uses it. In the last 30 days: 0 users interacted with it. What I got wrong: I designed it for what I thought users wanted to optimize (performance), not what they actually care about in their workflow (preventing slow queries before they get deployed). It's being deprecated. The right feature design takes another few weeks and I'm frustrated but it's the right call."

**Wednesday — Build update (LinkedIn)**
> Topic: MRR and a transparent conversation about growth rate
>
> Draft: "Month 4 MRR: $3,621 (+27% from last month). 51 paying customers. Growth rate is misleading me — it looks good but 26 of those customers came from one company. If that company churns, we're at $1,800 MRR overnight. Building a customer concentration risk dashboard this week. It's uncomfortable to look at."

**Friday — Engagement post (LinkedIn)**
> Topic: Ask for genuine perspective on a real decision
>
> Draft: "Genuine question for people who evaluate B2B dev tools: does the pricing page matter before the trial? Or do most evaluations just start with the free trial regardless of price? I'm trying to figure out if I should simplify my pricing page or accept that it doesn't matter until post-trial."

---

## Week 4: Community

**Monday — Insight post (LinkedIn)**
> Topic: What a specific customer conversation changed about the product
>
> Draft: "A customer told me last week that they use our query analyzer primarily during code review, not in production. We had no idea. That one detail changed where we're putting the VS Code extension we've been delaying. It goes into the IDE diff view, not the standalone dashboard. One conversation, 2 hours of design work saved."

**Wednesday — Build update (LinkedIn)**
> Topic: What we're shipping next and why
>
> Draft: "Shipping next: VS Code extension with diff-view integration. Why now: 4 customers in the last 6 weeks mentioned code review as their primary use case unprompted. Why not earlier: we assumed production monitoring was the main use case. Cost of that assumption: 3 months of lower adoption in the customer segment that actually wanted this most. ETA: 2 weeks."

**Friday — Engagement post (LinkedIn)**
> Topic: Opinion on a trend in the dev tooling space
>
> Draft: "The AI-assisted query optimization trend: most of the new tools I've seen are building AI that suggests query rewrites. Our users don't trust AI-suggested rewrites for production SQL. They want to understand why a query is slow. There's a difference between 'here's the fix' and 'here's what's happening.' Which do you prefer in your tooling?"

---

## Calendar performance metrics to track

At the end of 4 weeks, review:
- Engagement rate per post (aim: 2.5%+ for LinkedIn)
- Which post type got the highest engagement (insight / build update / engagement)
- Average comments per post (aim: 3+ substantive comments)
- Net followers gained (secondary metric — don't optimize yet)
- Bluesky engagement vs LinkedIn engagement per piece of content

**Guides used:** `guides/06-content-calendar.md`, `guides/03-founder-voice.md`, `guides/04-build-in-public.md`, `guides/05-authenticity-checklist.md`
