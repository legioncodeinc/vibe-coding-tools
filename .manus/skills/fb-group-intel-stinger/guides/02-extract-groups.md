# Guide 02: Extracting group data (description, history, activity, admins)

Grounded in `references/research/raw/facebook-group-pages.md` and `references/research/raw/facebook-har-findings.md`.

## Input

The group list comes from the search phase: a JSON array of `{group_id, group_name, member_count}` sorted by member count descending. Process in that order so the highest-value targets are captured first if the run is interrupted. Checkpoint after every 10 groups by writing the accumulated results to disk.

## Per-group procedure

For each group, navigate to `https://www.facebook.com/groups/{group_id}/about` with `wait_until="domcontentloaded"` and a 45s timeout, then pause 3-6 seconds (randomized). Extract from the rendered DOM:

1. **Description**: the text block under the "About this group" heading.
2. **Group history**: the "Group history" section. Parse each entry into `{event, date_text}` pairs. Events seen in the wild include "Group created" and "Name changed" (with the date). Store raw date text plus an ISO-normalized date when parseable. This is the field that answers "did they rename, and when."
3. **Activity**: any visible activity stats such as "X posts in the last month" and member-growth figures. Store as raw text fragments plus parsed numbers where possible.
4. **Privacy**: the Public/Private badge.
5. **Member count**: prefer the count already captured from the search card; refresh it from the about page if visible.

Then navigate to `https://www.facebook.com/groups/{group_id}/members` and scroll to the "Admins & moderators" section. For each admin entry record: display name, whether the profile is a Page or a User (page links resolve to `/pages/` or vanity URLs with page chrome; user links resolve to `profile.php?id=` or user vanities), the profile picture `img` src (scontent CDN URL, store the URL only), the profile ID or vanity (normalize to a full link), and location text if shown.

## Output schema

Write one JSON object per group into a JSONL file (one line per group, crash-safe):

```json
{
  "group_id": "1782123636045201",
  "group_name": "Elon Musk fans Group",
  "group_url": "https://www.facebook.com/groups/1782123636045201",
  "member_count": 507000,
  "privacy": "public",
  "description": "...",
  "history": [
    {"event": "created", "date_text": "Group created on March 4, 2019", "date_iso": "2019-03-04"},
    {"event": "name_changed", "date_text": "Name last changed on June 12, 2023", "date_iso": "2023-06-12"}
  ],
  "activity": {"posts_last_month": 1200, "raw": ["1,200 posts in the last month"]},
  "admins": [
    {
      "name": "Jane Doe",
      "type": "user",
      "profile_id": "100012345678901",
      "profile_url": "https://www.facebook.com/profile.php?id=100012345678901",
      "profile_pic_url": "https://scontent.xx.fbcdn.net/...",
      "location": "Austin, Texas"
    }
  ],
  "scraped_at": "2026-08-28T11:31:11Z",
  "errors": []
}
```

## Politeness and safety

Randomize all pauses (3-6s between pages), take a 45-90s break every 25 groups, and stop immediately if a checkpoint, CAPTCHA, or "log in again" screen appears; that is the signal to pause the run and re-validate the session per guide 01. Never retry a failed group more than twice in a run; log it to the errors array and move on.
