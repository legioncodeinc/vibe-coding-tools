# Example: B2B SaaS Channel-Fit Scorecard

**Demonstrates:** `guides/01-channel-fit-diagnosis.md` scoring process.

---

## Scenario

**Company:** Hypothetical B2B SaaS startup. Infrastructure monitoring tool for DevOps teams.
**ICP:** DevOps Engineers and Platform Engineers at companies with 50-500 employees. Buyers: VP Engineering and Head of Infrastructure. $15K-$60K ACV. 30-90 day sales cycle.
**Monthly ad budget:** $4,000/month total.
**Conversion goal:** Demo signups.
**Creative assets:** Product screenshots, 2-minute explainer video, technical blog posts.

---

## Platform scoring

| Platform | Audience density | Intent signal | CPL viability | Creative fit | Tracking feasibility | Total /15 | Verdict |
|---|---|---|---|---|---|---|---|
| **LinkedIn** | 3 (VPs, Heads of Infra are highly LinkedIn-active) | 2 (research/professional mindset) | 2 (LI CPL $75-150; target is $200; within 2x) | 3 (product screenshots + LGF) | 3 (pixel + CAPI) | **13** | **Primary: launch** |
| **Reddit** | 3 (r/devops, r/kubernetes, r/sysadmin = exact ICP) | 2 (community research, not active purchase intent) | 3 ($0.50-$2 CPC; CPL likely $25-$50; well within range) | 2 (need text-first posts; video repurposable) | 2 (pixel; CAPI beta) | **12** | **Test: $800/month** |
| **Microsoft/Bing** | 2 (ICP uses Bing less; but LPT layer adds precision) | 3 (search intent on "kubernetes monitoring" queries) | 3 (30-50% lower CPC than Google; high viability) | 3 (existing search ad copy from Google import) | 3 (UET + Enhanced Conversions) | **11** | **Test: $600/month** |
| **Quora** | 2 ("kubernetes monitoring vs datadog" type queries exist) | 3 (comparison and selection intent — exactly right stage) | 3 ($1.50-$4 CPC; strong viability) | 2 (need long-form copy; blog content repurposable) | 2 (Quora pixel) | **10** | **Hold: add Q3 if LinkedIn CPL optimizes** |
| **TikTok** | 1 (DevOps engineers are not the TikTok ICP) | 1 (entertainment context, wrong mindset) | 1 (CPL would likely be $100+; not viable) | 1 (no short-form creator content) | 3 (CAPI available) | **7** | **Misfit: do not launch** |
| **Pinterest** | 1 (no meaningful ICP presence) | 1 (wrong context entirely) | 1 (CPL not viable for B2B SaaS) | 1 (visual lifestyle platform; poor fit) | 2 (CAPI available) | **6** | **Misfit: do not launch** |
| **Spotify/Podcast** | 2 (DevOps podcast listeners exist — Kubernetes Podcast, PodRocket, Software Engineering Daily) | 1 (passive listening; low intent) | 2 (CPM viable; CPL unknown) | 2 (audio script doable; no existing creative) | 1 (promo code + vanity URL only) | **8** | **Hold: consider for Q4 brand campaign** |

---

## Recommended channel stack

**Primary: LinkedIn Ads — $2,500/month**

Rationale: Highest ICP audience density for VP Engineering and Head of Infrastructure targeting. Lead Gen Forms at 6.1% CVR will provide demo signups efficiently. Start with Thought Leader Ads boosting the founder's LinkedIn posts (low creative overhead, 2.68% CTR benchmark). Layer ABM company list upload for top 50 target accounts.

Budget note: $2,500/month is above the $1,500-$3,000 MVS for early testing. Expect CPL of $150-$300 in months 1-2 before optimization brings it to $75-$150 range.

**Test 1: Reddit Ads — $800/month**

Rationale: r/devops (1.2M members), r/kubernetes (400K), r/sysadmin (1.3M) all contain the exact ICP. $0.50-$2 CPC means $800/month buys meaningful volume. The AI citation compound value (Reddit threads feeding ChatGPT/Perplexity research queries on "kubernetes monitoring tools") adds long-term brand visibility beyond the direct CPL.

Plan: 3 targeted subreddit Promoted Post campaigns. Native-feel text posts linking to the company blog. 90-day evaluation period required.

**Test 2: Microsoft/Bing — $600/month**

Rationale: Search intent on "kubernetes monitoring", "infrastructure monitoring for devops", "datadog alternative" queries is high-value. Import Google Ads campaigns, layer LinkedIn Profile Targeting for VP Engineering + DevOps job function at the bid modifier level. 30-50% lower CPC than Google for same keywords.

**Hold: Quora — planned Q3 start**

Add Quora at $500/month in Q3 once LinkedIn CPL is below $200 and bandwidth exists to manage a fourth channel. Target "kubernetes vs prometheus" and "best monitoring tool for devops teams" question targeting.

---

## Budget allocation

| Channel | Monthly budget | % of total |
|---|---|---|
| LinkedIn Ads (primary) | $2,500 | 63% |
| Reddit Ads (test) | $800 | 20% |
| Microsoft/Bing (test) | $600 | 15% |
| Quora (hold) | $0 | 0% |
| **Total** | **$3,900** | (buffer: $100/month for tools/tracking) |

---

## Success metrics at 60 days

| Channel | CPL target | Volume target | Scale signal |
|---|---|---|---|
| LinkedIn | <$300 (working toward $150) | 8-15 demos/month | CPL below $200 → increase budget 20% |
| Reddit | <$100 | 5-10 leads/month | CPL below $75 → scale to $1,500/month |
| Microsoft/Bing | <$150 | 3-8 leads/month | LPT CVR > non-LPT → increase LPT bid modifier |
