# Raw Source: Facebook group page data locations (target structure)

- URL: n/a (structural knowledge of facebook.com group UI as of 2026-08)
- Fetch date: 2026-08-28
- Source type: practitioner knowledge, to be verified live during first extraction run

## Where each target field lives (logged-in desktop web)

| Field | Location | Notes |
|---|---|---|
| Group description | `/groups/{id}/about` "About this group" section | Also partially on group landing page |
| Member count | Search result cards ("507K members") and group header/about | Card counts are rounded |
| Group history (name changes) | `/groups/{id}/about` "Group history" section | Shows "Group created on <date>" and "Name last changed on <date>" entries; some groups show multiple rename events |
| Activity stats | About page: "posts in the last month", growth figures | Public groups show more; private groups show less |
| Privacy (public/private) | About page badge | |
| Admins/moderators | `/groups/{id}/members` "Admins & moderators" section | Each entry: name, profile link (user profile.php?id= or /pages/ or vanity), profile picture img src (scontent CDN URL), sometimes location/label |
| Admin profile about data | `facebook.com/profile.php?id={id}&sk=about` and sub-sections: sk=about_overview, about_work_education, about_places, about_contact_basic_info, about_family_relationships, about_details, about_life_events | Only load sub-sections that are visible in the profile's about nav for that user; never hit endpoints not offered |
| Friends / check-ins | sk=about_overview and sk=about_places | Friends count visible if not hidden; check-ins under places |

## Risk notes

- Recording profile picture URLs is zero extra exposure (URLs are in HTML already loaded).
- Downloading image bytes: scontent/fbcdn CDN URLs are signed and fetchable without session cookies; plain CDN GETs look like ordinary image embeds. Do NOT bulk-download through the authenticated facebook.com session; do it as a separate unauthenticated pass.
- CDN URLs expire (signature TTL days to weeks); download in the same run if images are wanted.
- Unauthenticated access to group pages is unreliable: login wall after 1-2 pages, faster from datacenter IPs. Public group previews sometimes show name, cover, member count via search-engine cache.
