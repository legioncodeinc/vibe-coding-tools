# ASO Strategy: Keywords, Screenshots, and Metadata

*Source: `research/external/2026-05-20-aso-keyword-strategy-2026.md`, `research/external/2026-05-20-aso-screenshot-strategy-2026.md`*

---

## Why ASO matters before submission

Submission and ASO are not sequential; they are parallel. A clean app that no one finds generates the same revenue as an app that never shipped. More immediately: keyword violations (trademark terms, misleading titles) are a top-10 rejection trigger on both platforms. Fixing ASO before submission prevents metadata rejections.

---

## iOS keyword mechanics

### The ranking signal breakdown (2026 research consensus)

- iOS keyword field: ~55-65% of organic ranking signal
- App name (title + subtitle): ~20-25%
- In-app events and product page sections: ~10-15%
- Reviews and ratings: indirect signal via conversion rate

The keyword field is your dominant lever. Everything else is secondary.

### Keyword field rules

```
Format:   keyword1,keyword2,keyword3
Limit:    100 characters total (including commas; no spaces after commas)
Language: English field applies globally unless you have localized versions
```

**Do NOT include:**
- Your own app name or brand name (they are already indexed)
- Competitor app names (policy violation, will trigger rejection)
- Trademarked terms you do not own
- Duplicate words appearing in title or subtitle

**Do include:**
- Synonyms for your core action ("budget tracker", "expense log", "spending diary")
- Adjacent category terms ("personal finance", "money manager")
- High-volume single words that don't fit in title/subtitle

### Title and subtitle construction

```
Title:    ≤30 characters — primary keyword must appear here
Subtitle: ≤30 characters — secondary keyword; must differ from title keyword
```

Formula: `[Primary keyword] - [Brand differentiator]`
Example: `Budget Tracker - Personal Finance` (30 chars)

### Screenshot caption indexing (2026 update)

Apple now indexes caption text in app screenshots as a search ranking signal. This is a significant 2026 change. Include your primary and secondary keywords in screenshot captions: they count.

See `examples/happy-path-ios-submission.md` for an end-to-end ASO setup walkthrough.

---

## Android (Google Play) keyword mechanics

Google Play embeds keyword indexing into natural-language text fields.

### Short description
```
Limit: 80 characters
Role:  First text Google indexes; include primary keyword naturally
```

### Long description
```
Limit:    4000 characters
Indexing: Google NLP indexes the full long description
Strategy: Mention your primary keyword 3-5× naturally; secondary keywords 2-3×
          Do NOT keyword-stuff — it reads as spam and triggers policy review
```

### Title
```
Limit:     50 characters
Guideline: Primary keyword in first 30 characters; brand in remainder
Example:   "Budget Tracker - Money Manager"
```

---

## Screenshot strategy

Screenshots are the highest-conversion element in your store listing. On iOS, they are also compliance-checked during review.

### iOS screenshot requirements

- **Device sizes required:** 6.7" (iPhone 15 Pro Max scale) and 12.9" iPad Pro scale for universal apps
- **Count:** 3 minimum, 10 maximum per device size
- **Format:** PNG or JPEG; no transparency

**Compliance rules (policy-enforced):**
- Screenshots must accurately reflect the app as it functions on the stated device
- Do NOT show pricing in screenshots (guideline 2.3.1)
- Do NOT show device hardware UI that implies premium features the app doesn't have
- Locale-appropriate screenshots required for localized listings

**Conversion-optimized story sequence:**
1. Frame 1: Core value proposition (what does this app do in one action?)
2. Frame 2: The most compelling feature or moment of delight
3. Frame 3: Secondary feature or social proof element
4. Frames 4-10: Supporting use cases; end with a strong call to action or lifestyle frame

### Android screenshot requirements

- **Minimum:** 2 screenshots
- **Recommended:** 8 (Google's internal data shows 8 maximizes conversion)
- **Sizes:** 320px minimum per side; 3840px maximum

Android is less strict on screenshot content compliance, but your screenshots are subject to the same "no misleading claims" policy as the rest of the listing.

---

## Preview video (App Preview on iOS)

iOS allows one App Preview video per device size. App Preview policies:
- Maximum 30 seconds
- Must capture actual device screen recording (not rendered animations of things the app cannot do)
- No pricing, no competitor logos
- No voiceover of guideline claims

A well-made App Preview boosts conversion by approximately 25% (RevenueCat benchmark). It is worth the production investment for any app where the core experience is difficult to convey in static screenshots.

---

## ASO refresh cadence

Live apps should refresh ASO metadata every **30 days**. The App Store algorithm weights recency of optimization activity. A listing that has not been touched in 6 months will gradually lose ranking to competitors who are actively iterating.

Refresh protocol:
1. Check competitor keyword fields via ASO tools (AppFollow, MobileAction)
2. Identify high-volume, low-competition keywords your competitors are missing
3. Rotate 20-30% of the keyword field; A/B test if eligible (requires enrollment in Product Page Optimization)
4. Update at least one screenshot if visual trends have shifted in your category
