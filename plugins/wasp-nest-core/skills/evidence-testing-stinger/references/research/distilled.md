# Distillation: evidence-testing

Research window: 2026-10-05. Sources archived in `raw/`. Body authored fresh;
the protocol design below traces to the archived source.

| Claim | Source |
|---|---|
| Evidence means the agent tests hands-on while a recording captures the session; a video without the agent's own live session has no evidentiary value | raw/michaelshimeles--evidence-driven-testing-SKILL.md |
| Artifact set: recording (evidence.mp4), report.md, manifest.json in the session folder | raw/michaelshimeles--evidence-driven-testing-SKILL.md |
| Annotation types: setup, test_start (Jest-style testable statement), assertion with result passed, failed, or untested | raw/michaelshimeles--evidence-driven-testing-SKILL.md |
| Assertion rules: one per meaningful state change, under 80 characters, timestamp records when asserted not that it was true, untested with reason instead of silent skip | raw/michaelshimeles--evidence-driven-testing-SKILL.md |
| Revision stamping (commit, branch, deployment URL) goes into the report | raw/michaelshimeles--evidence-driven-testing-SKILL.md |
| Headless environments use scripted screenshots and probes as full evidence with an assertions file | raw/michaelshimeles--evidence-driven-testing-SKILL.md |
| Posting goes to the PR and tracker issue when present | raw/michaelshimeles--evidence-driven-testing-SKILL.md |
| Source's recorder supports Linux X11 and Wayland, macOS, Windows, with doctor checks and crash-safe MPEG-TS raw capture | raw/michaelshimeles--evidence-driven-testing-SKILL.md |

Deliberate divergence: the source bundles a recorder script we do not
redistribute (no license in the source folder, checked 2026-10-05). Our
component defines the artifact contract and annotation protocol instead, and
accepts any recorder honoring them, including OS-native ones.

License status of the source: no LICENSE file in the source folder; the
bundled scripts are not copied.
