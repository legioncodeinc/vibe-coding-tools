# UTM Naming Convention Template

Define your UTM schema here and share with all team members who create ad campaigns. Inconsistent UTMs produce a fragmented analytics picture.

---

## The schema

`utm_source` | `utm_medium` | `utm_campaign` | `utm_content` | `utm_term`

---

## Platform codes (utm_source)

| Platform | `utm_source` value |
|---|---|
| LinkedIn Ads | `linkedin` |
| TikTok Ads | `tiktok` |
| Reddit Ads | `reddit` |
| Microsoft/Bing Ads | `bing` |
| X/Twitter Ads | `twitter` |
| Pinterest Ads | `pinterest` |
| Quora Ads | `quora` |
| YouTube (standalone) | `youtube` |
| Spotify Ad Studio | `spotify` |
| Podcast (host-read) | `podcast-[showname]` (e.g., `podcast-devops-weekly`) |
| Programmatic podcast network | `acast`, `podcorn`, etc. |

---

## Medium codes (utm_medium)

| Channel type | `utm_medium` value |
|---|---|
| Paid social (LinkedIn, TikTok, Reddit, X, Pinterest, Quora) | `paid-social` |
| Paid search (Bing/Microsoft) | `paid-search` |
| Video advertising (YouTube) | `video` |
| Audio advertising (Spotify, podcast) | `audio` |
| Display / banner | `display` |

---

## Campaign naming (utm_campaign)

Follow the same naming convention as the ad platform campaign name (see `guides/11-campaign-architecture.md`):

`[PlatformCode]-[ProductLine]-[AudienceSegment]-[Format]-[Objective]-[YYYY-MM]`

**Examples:**
- `LI-ProductA-VPEng-LGF-LeadGen-2026-05`
- `TT-ProductA-D2C25-35-InFeedSmart-Conv-2026-05`
- `RD-ProductA-rDevops-PromPost-Traffic-2026-06`
- `BING-ProductA-JobTitle-Search-Leads-2026-05`
- `SPOT-Brand-Podcast-TechAudio-Awareness-2026-05`

---

## Content identifier (utm_content)

Use this to differentiate ad variants within a campaign:

Format: `[CreativeType]-[VariantLabel]-[YYYY-MM-DD]`

**Examples:**
- `LGF-v1-headline-a-2026-05-01`
- `video-hook-b-2026-05-15`
- `text-post-v2-2026-05-20`

---

## Term / audience (utm_term)

Use this to distinguish audience segments or keywords (especially useful for Microsoft/Bing search campaigns):

**For search campaigns:** The matched keyword.
**For audience campaigns:** A short audience identifier.

**Examples:**
- `kubernetes-monitoring` (search keyword)
- `vp-engineering` (LinkedIn audience segment)
- `r-devops` (Reddit subreddit target)

---

## Filled example

URL before UTMs: `https://yourproduct.com/demo`

With UTMs:
```
https://yourproduct.com/demo
  ?utm_source=linkedin
  &utm_medium=paid-social
  &utm_campaign=LI-ProductA-VPEng-LGF-LeadGen-2026-05
  &utm_content=LGF-v1-headline-a-2026-05-01
  &utm_term=vp-engineering
```

---

## Auto-tagging complement

Enable auto-tagging in each platform's settings (LinkedIn, TikTok, Microsoft, Pinterest all support click IDs). Auto-tags append platform-specific click parameters (`li_fat_id`, `ttclid`, `msclkid`) that enable server-side attribution reconciliation alongside UTMs.

UTMs handle Google Analytics and custom analytics. Auto-tags handle platform-native attribution reports. Both are needed for complete attribution.

---

## UTM builder worksheet

| Field | Your value |
|---|---|
| `utm_source` | |
| `utm_medium` | |
| `utm_campaign` | |
| `utm_content` | |
| `utm_term` | |
| **Final URL** | |
