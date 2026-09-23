This Stinger's deterministic script lives centrally at the plugin root, not duplicated here, per
`shared/scripts/README.md`'s "shared where the use case is genuinely shared" rule.

**`shared/scripts/fingerprint.py`** applies the signature table documented in
`../fingerprint-signature-table.md` against a fetched or already-captured landing page (HTML,
headers, cookies) and, when given a second, post-headless-load HTML capture, compares the two to
produce the render-mode call. It emits a `target-profile.json`-shaped record; see
`../templates/target-profile.template.json` for the field-by-field shape and
`guides/01-fetch-and-collect-signals.md` / `guides/03-render-mode-detection.md` for how to invoke it
inside the full procedure.

```
python3 shared/scripts/fingerprint.py --url https://example.com
python3 shared/scripts/fingerprint.py \
  --raw-html-file page.html --headers-file headers.json --cookies-file cookies.json \
  --rendered-html-file rendered.html --out target-profile.json
```

Stdlib-only, no absolute paths, safe inside any of the four target harnesses' sandboxed execution
environment.
