# Reference: Field Tables and Connection Parameters

## Oxylabs Headless Browser connection parameters

| Parameter | Value for this project | Purpose |
|---|---|---|
| `p_cc` | `US` | Country geolocation |
| `p_state` | `ohio` | State geolocation (overrides p_cc) |
| `solve_captcha` | `true` | Automatic CAPTCHA solving (default on) |
| `o_profile` | `john` | Persistent profile (cookies/localStorage; needs account activation) |
| `proxy_resi_ses_id` | `johnohio1` | Pin residential exit IP across sessions |
| `proxy_resi_ses_time` | `1440` | Hold pinned IP for 24h |
| `session_name` | `john-fb-run` | Fallback sticky session when o_profile unavailable (24h TTL) |
| `keep_alive` | `true` | Keep cloud browser alive across client disconnects |

Endpoints: global `wss://USER:PASS@ubc.oxylabs.io`, US `wss://USER:PASS@ubc-us.oxylabs.io`. Limits: 100 concurrent sessions, 10 new sessions/second.

## Web Unblocker headers (fallback transport only)

| Header | Value | Purpose |
|---|---|---|
| `x-oxylabs-render` | `html` | JS-rendered HTML |
| `x-oxylabs-force-cookies` | `1` | Enable cookie passthrough |
| `X-Oxylabs-Session-Id` | any stable string | Sticky IP |
| `X-Oxylabs-Geo-Location` | `United States,Ohio` | Geotargeting |

Endpoint: `https://unblock.oxylabs.io:60000`, Basic Auth, SSL verification disabled client-side.

## Facebook URL patterns

| Target | URL |
|---|---|
| Group search | `https://www.facebook.com/search/groups/?q={query}` |
| Group about | `https://www.facebook.com/groups/{group_id}/about` |
| Group members/admins | `https://www.facebook.com/groups/{group_id}/members` |
| User about | `https://www.facebook.com/profile.php?id={profile_id}&sk=about` |
| User about sub-section | `...&sk=about_{overview,work_education,places,contact_basic_info,family_relationships,details,life_events}` |

## Group JSONL schema fields

`group_id, group_name, group_url, member_count, privacy, description, history[{event,date_text,date_iso}], activity{posts_last_month,raw[]}, admins[{name,type,profile_id,profile_url,profile_pic_url,location}], scraped_at, errors[]`

## Admin JSONL schema fields

`profile_id, profile_url, type(user|page), display_name, profile_pic_url, sections_available[], sections{key:{fields[{label,value}]}}, admin_of_groups[], scraped_at, errors[]`

## Environment variables

`OXY_UNBLOCKER_USERNAME`, `OXY_UNBLOCKER_PASSWORD` (headless browser auth; legacy aliases `OXY_HB_USERNAME`/`OXY_HB_PASSWORD`), `OXY_RES_USERNAME`, `OXY_RES_PASSWORD` (residential proxies for the optional image pass). Facebook persona credentials are supplied interactively at login time, never stored in the repo.
