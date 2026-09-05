# Guide 04: Profile picture download pass (optional, unauthenticated)

Grounded in `references/research/raw/facebook-group-pages.md`.

## Why this is separate

Recording a profile picture URL during the group/admin passes costs nothing: the URL is already in the HTML. Downloading the image bytes is a separate decision with a separate risk profile, so it runs as its own pass, after all authenticated work is complete.

## Method

Facebook profile pictures are served from signed `scontent.*.fbcdn.net` CDN URLs that are fetchable without any session cookie. A plain HTTP GET with no cookies and a generic browser User-Agent looks identical to the billions of image embeds Facebook serves daily. Do not route these downloads through the authenticated Oxylabs browser session; that would tie bulk image fetches to the persona.

Optionally route the downloads through Oxylabs residential proxies (`OXY_RES_USERNAME` / `OXY_RES_PASSWORD`) with a rotating session per request for tidiness, but for a few hundred images this is optional rather than necessary.

## Rules

Download in the same run or within a few days, because CDN URL signatures expire (days to weeks). Throttle to a request every 1-3 seconds. Name files `{profile_id}.jpg` so they join cleanly to the admin JSONL. Record success/failure per URL; on a 403/expired-signature response, mark the URL expired in the dataset and move on. Never retry expired URLs through the authenticated session to "refresh" them; instead re-capture the URL on the next scheduled group pass.

## Skip condition

If the user only needs URLs for identification, skip this pass entirely and note `image_download: skipped` in the run manifest.
