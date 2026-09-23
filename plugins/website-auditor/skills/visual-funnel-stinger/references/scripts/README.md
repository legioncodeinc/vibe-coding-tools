Deterministic scripts for this audit domain live in the shared `shared/scripts/` folder at the plugin root, not duplicated per Stinger. See that folder's README for the full script list and which pairs use which script. This pair's shared script is `shared/scripts/visual-capture.py`.

One reference snippet is kept local to this Stinger instead of the shared folder, because it is not a deterministic script this Drone invokes but a copy-ready configuration block for whatever browser-automation surface the harness provides:

| File | Purpose |
|---|---|
| `playwright-viewport-config.js` | Copy-ready Playwright device-emulation config for the two required checkpoint viewports (1440x900 desktop, 390x844 mobile). Grounded in `references/research/raw/playwright-dev-docs-emulation.md`; see `distilled-visual-funnel.md` section 5 for why these are custom profiles rather than named registry devices. |
