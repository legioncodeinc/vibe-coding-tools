# Scripts for site-crawler-stinger

The deterministic script for this pair lives centrally at `shared/scripts/crawl-extract.py`
(plugin root), not duplicated here, per the build plan's "shared where the use case is genuinely
shared" instruction and `shared/scripts/README.md`'s ownership table (`crawl-extract.py` is used
only by this Stinger, but the location convention is still the shared folder so every Stinger's
`references/scripts/` stays a pointer, not a copy).

## `crawl-extract.py`

Platform-aware URL-frontier crawler. Reads `_shared/target-profile.json`, selects a seed strategy
by platform, crawls up to 100 pages same-domain, respects `robots.txt`, and writes
`site-data/<slug>.html` + `site-data/<slug>.md` per page plus the `site-data/manifest.json` index.

```
python3 shared/scripts/crawl-extract.py \
  --target-profile www.example.com-audit/_shared/target-profile.json \
  --out-dir www.example.com-audit/site-data \
  --base-url https://www.example.com \
  --max-pages 100
```

Stdlib-only (Python 3.10+, for the `str | None` union-type hints; drop those hints and it runs on
3.9 too). No third-party dependencies, no absolute paths baked in, harness-portable across Claude
Code, Cursor, Codex, and Cowork's sandboxed execution.

Read the script's own module docstring before running it. It states, in full, what it does not do:
no JavaScript execution, a heuristic (not readability-grade) Markdown extraction, a 100-**page**
budget rather than a 100-**hop** depth, and no per-page platform re-detection. Those are documented
limitations, not defects.

See `guides/04-storage-and-manifest-convention.md` for the slugify algorithm and manifest contract
this script implements, and `references/templates/manifest-schema.md` plus
`references/templates/site-data-manifest.example.json` for the manifest's exact shape.
