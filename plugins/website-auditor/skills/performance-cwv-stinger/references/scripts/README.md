Most deterministic scripts for this plugin live in the shared `shared/scripts/` folder at the plugin root, per the build plan's "shared where the use case is genuinely shared" instruction. See that folder's README for the full centrally-planned list.

`cwv-collect.py` is this pair's centrally-planned Core Web Vitals collection script (lab-data collection, per the build plan's per-website-category script list). As of this Stinger's stage 4/5/6 forge pass, that shared script is still a step-3 folder-tree placeholder (`raise NotImplementedError`), it is not this pair's own stage-4 deliverable, implementing it is a plugin-wide effort shared with other Wave-5 pairs' own CWV-adjacent needs. Do not duplicate CWV lab-collection logic in this folder; when `shared/scripts/cwv-collect.py` is implemented, this Stinger consumes it rather than re-implementing it.

This folder carries one local script specific to this pair's own scope, the half of this Stinger's audit that `cwv-collect.py` does not cover:

| Script | Purpose |
|---|---|
| `cdn-header-scan.py` | Read-only HTTP header capture (`Cache-Control`, `CDN-Cache-Control`, `Server`, and other CDN-identifying headers) against a sampled page set. Mechanical capture only, it does not judge caching-strategy adequacy, that judgment is out of scope pending a dedicated research pass, per `references/research/distilled-performance-cwv.md` section 7 and `references/templates/cdn-header-checklist.md`. |

Do not extend `cdn-header-scan.py` to render a "good vs bad caching strategy" verdict from general knowledge. Per this Stinger's own research gap note, no primary source in this archive documents caching-strategy audit methodology; a dedicated research pass is required first.
