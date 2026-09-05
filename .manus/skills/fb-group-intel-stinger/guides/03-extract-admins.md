# Guide 03: Extracting admin profile about-page data

Grounded in `references/research/raw/facebook-group-pages.md`.

## Input

The unique set of admin profiles collected during the group pass (guide 02), deduplicated by `profile_id`. Many admins run multiple groups, so dedupe before this pass; expect the unique admin count to be well below the raw admin-entry count.

## The about sub-sections

Facebook user about pages follow the template `https://www.facebook.com/profile.php?id={profile_id}&sk=about_{section}`. The known sections are:

| Section key | Content |
|---|---|
| `about` / `about_overview` | Overview: current city, hometown, workplace, relationship, featured |
| `about_work_education` | Work and education history |
| `about_places` | Places lived, check-ins |
| `about_contact_basic_info` | Contact info, basic info (birthday, gender, links) |
| `about_family_relationships` | Family and relationships |
| `about_details` | Details (bio, other names, quotes) |
| `about_life_events` | Life events timeline |

## The cardinal rule

**Only request sub-sections that are visible in that specific profile's about navigation.** Profiles expose different sub-sections depending on what the user has filled in and their privacy settings. Hitting an endpoint the profile does not offer is both wasted traffic and an abnormal request pattern. Procedure: load `sk=about` first, scrape the about-nav link list from the rendered page, then visit only those links.

## Per-profile procedure

1. Navigate to `profile.php?id={profile_id}&sk=about`, pause 3-6 seconds.
2. Record which about sub-sections the nav offers.
3. For each offered sub-section, navigate and extract the visible fields as raw label/value pairs. Do not infer structure; store what is shown.
4. From the overview, capture friends count if shown and check-ins if shown.
5. Record the profile picture URL (store only; image bytes are a separate pass per guide 04).
6. For Page-type admins, the about surface differs (page About tab); capture the analogous visible fields and mark `type: "page"`.

## Output schema

```json
{
  "profile_id": "100012345678901",
  "profile_url": "https://www.facebook.com/profile.php?id=100012345678901",
  "type": "user",
  "display_name": "Jane Doe",
  "profile_pic_url": "https://scontent.xx.fbcdn.net/...",
  "sections_available": ["about_overview", "about_places", "about_contact_basic_info"],
  "sections": {
    "about_overview": {"fields": [{"label": "Lives in", "value": "Austin, Texas"}], "friends_count": 512},
    "about_places": {"fields": [{"label": "Current city", "value": "Austin, Texas"}], "checkins": []}
  },
  "admin_of_groups": ["1782123636045201"],
  "scraped_at": "2026-08-28T12:00:00Z",
  "errors": []
}
```

## Politeness

Same pacing as guide 02: 3-6s between pages, 45-90s break every 25 profiles, stop on any checkpoint or login redirect. This pass runs after the group pass, never interleaved, so a session problem here does not corrupt group data.
