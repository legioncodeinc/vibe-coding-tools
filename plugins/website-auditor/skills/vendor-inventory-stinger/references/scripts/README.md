This Stinger's deterministic script lives centrally at the plugin root, not duplicated here, per
`shared/scripts/README.md`'s "shared where the use case is genuinely shared" rule.

**`shared/scripts/vendor-census.py`** classifies a captured network-request log, DOM script-src
list, and/or rendered HTML against the vendor lookup table documented in
`../vendor-lookup-table.md`, produces a dedicated Google Tag Manager section, and flags
content-injection/metadata-manipulation tooling (Search Atlas and peers) as its own category. See
`../templates/vendor-entry.template.json` for the per-vendor row shape and
`guides/04-vendor-classification.md` for how to invoke it inside the full procedure.

```
python3 shared/scripts/vendor-census.py \
  --network-log-file requests.json --dom-scripts-file scripts.json --html-file rendered.html \
  --out vendor-census.json
```

Running it with only `--html-file` (no `--network-log-file`) still works but is labelled
`static-only` in the output, with an explicit caveat that a GTM-hydrated vendor list needs the real
network log to be complete, per the GTM-hydration research
[raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. Stdlib-only, no absolute paths, safe inside
any of the four target harnesses' sandboxed execution environment.
