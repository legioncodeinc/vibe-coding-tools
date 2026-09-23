# Per-platform public-profile checklist template

Copy one block per platform (Facebook, LinkedIn, Instagram) found for the target site. These checks require no authentication; run them regardless of whether the user opts into the authenticated flow (guide 03).

```markdown
## {Platform}: {profile/page URL}

- **Found via:** {on-site link | structured data | search, per guide 01}
- **Status:** {found, active | found, dormant (exists but empty/stale) | not found}
  - Found-but-dormant scores as a finding. Not-found is a no-op, excluded from score entirely. These are different outcomes, do not conflate them [build plan Q7].
- **Account inventory check:** any other accounts for this brand on this platform (rogue, imposter, or forgotten accounts)? [raw/blog-hootsuite-com-social-media-audit.md]

### Profile/branding fields (public, no login required)

- Profile/cover image: current, on-brand, not pixelated or badly cropped. Floor: at least 400x400px for profile-photo clarity (attributed to Sprout Social) [raw/posteverywhere-ai-blog-social-media-audit-checklist.md].
- Bio/profile text: value clear to a first-time reader in under 10 seconds; includes at least one keyword the audience would actually search [raw/posteverywhere-ai-blog-social-media-audit-checklist.md].
- Bio link: resolves, points to the intended destination (homepage vs. a more specific landing page) [raw/posteverywhere-ai-blog-social-media-audit-checklist.md].
- Username consistency with the brand's other platforms [raw/blog-hootsuite-com-social-media-audit.md].
- Contact info (phone, email, address, website URL) correct and current, on platforms that support it [raw/blog-hootsuite-com-social-media-audit.md].
- Pinned post relevance: current best-performing content, an active promotion, or an evergreen brand intro; staleness threshold 3 months [raw/posteverywhere-ai-blog-social-media-audit-checklist.md].
- Verification status, where applicable [raw/blog-hootsuite-com-social-media-audit.md].
- Category/business details correctness (Facebook, Instagram both use a business category field; a wrong category is a discoverability harm) [raw/posteverywhere-ai-blog-social-media-audit-checklist.md].

### Platform-specific field-visibility note

- **Instagram:** name, username, profile picture, bio, links, follower/following counts, avatar, Threads username, and created channels are fixed always-public fields per Meta's own Help Center, not hideable by the owner on public or private accounts alike [raw/www-facebook-com-help-347751748650214.md]. This means an Instagram completeness check audits field QUALITY, not visibility.
- **LinkedIn:** photo, headline, summary, experience, skills, and articles/activity are individually owner-toggled; the logged-out view may show fewer fields than a logged-in visitor sees [raw/www-linkedin-com-help-linkedin-answer-a518980.md]. Treat an apparently-sparse public LinkedIn profile as ambiguous (could be genuinely sparse, or complete-but-toggled-private) rather than scoring it as incomplete outright; note the ambiguity in the finding.
- **Facebook Page:** no official-docs source in this Stinger's archive states an equivalent fixed-field list for Facebook Pages specifically (distilled research section 8, gap). Apply the general checklist above without the Instagram-style "cannot be hidden" confidence.

### Content visible without login

- Post history: caption, hashtags, media type, media URL, permalink, timestamp, and public like/comment counts, confirmed structurally public for Instagram [raw/www-getphyllo-com-post-social-media-public-data.md]; treat as the same visibility class for Facebook/LinkedIn post history absent a platform-specific source stating otherwise.
- Top and bottom performing posts by visible engagement (not precise engagement RATE, which needs reach, a number that is not public) [raw/blog-hootsuite-com-social-media-audit.md] [raw/posteverywhere-ai-blog-social-media-audit-checklist.md] [raw/www-getphyllo-com-post-social-media-public-data.md].
- Posting frequency against general platform benchmarks [raw/posteverywhere-ai-blog-social-media-audit-checklist.md].
- Content-mix by visible category (educational/promotional/entertaining/conversational); note the 80/20 value-to-promotion split named as common but flagged as something to verify per-account, not assume [raw/posteverywhere-ai-blog-social-media-audit-checklist.md].

### Findings

- {finding, evidence pointer (screenshot or captured page text), one-line justification}
```
