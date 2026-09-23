# Guide 04: Run the content sweep and completeness check

## What this guide covers

Turning the public-data collection (guide 02) and any authenticated data (guide 03) into the specific checks the plugin roster names for this pair: 7-day content sweep, voice consistency, cadence, and profile completeness.

## Procedure

1. **7-day content sweep.** From the visible post history (guide 02), identify every post in the last 7 days per platform. If there are none, that is itself a cadence finding (a dormant-looking recent window), not an absence of data to report.
2. **Cadence.** Compare the 7-day count and the broader visible post-history frequency against general platform posting-frequency benchmarks [raw/posteverywhere-ai-blog-social-media-audit-checklist.md]. Note this Drone's archive does not carry a specific numeric per-platform cadence benchmark beyond the general framing; label a cadence judgment `[subjective]` if it isn't anchored to a specific cited number.
3. **Voice consistency.** Compare caption tone, vocabulary, and formatting across the visible posts and across platforms. This is inherently a `[subjective]` judgment (no source in this archive supplies a quantified voice-consistency metric); keep it in the report's subjective section, not the scored table.
4. **Completeness, per platform, using the mechanics from guide 02:**
   - Instagram: since the fixed field set can't be hidden by the owner, an Instagram completeness check audits field QUALITY (is the bio filled in well, does the link resolve to the right destination), not field visibility [raw/www-facebook-com-help-347751748650214.md].
   - LinkedIn: because visibility itself is owner-toggled, treat an apparently sparse public LinkedIn profile as ambiguous, genuinely incomplete versus complete-but-toggled-private, rather than scoring it as incomplete outright. State this ambiguity explicitly in the finding rather than resolving it silently in either direction [raw/www-linkedin-com-help-linkedin-answer-a518980.md].
   - Facebook: apply the general completeness checklist (profile image, bio, contact info, category, pinned post) from `references/templates/platform-profile-checklist.md` without the Instagram-style "cannot be hidden" confidence, since no source in this archive confirms an equivalent fixed-field guarantee for Facebook Pages.
5. Content-mix ratio: categorize visible posts as educational/promotional/entertaining/conversational. An 80/20 value-to-promotion split is named as a common baseline, explicitly flagged in the source as something to verify against the account's own stated goals rather than assume as a universal target [raw/posteverywhere-ai-blog-social-media-audit-checklist.md]. Do not treat deviation from 80/20 alone as a finding without checking whether it fits the account's own apparent strategy.
6. Write results to `references/templates/social-report-template.md`'s public-data findings table (or the subjective-findings section, for voice consistency and any unanchored cadence judgment).
