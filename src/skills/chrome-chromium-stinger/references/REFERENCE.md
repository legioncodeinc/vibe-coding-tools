# Chrome Chromium reference

| Work | First check | Evidence |
|---|---|---|
| CDP | Target and `/json/version` metadata | Protocol version, browser product, target type |
| DevTools inspection | Protocol Monitor availability | Recorded command sequence with sensitive values removed |
| Chrome testing profile | Dedicated `--user-data-dir` | Isolated profile path, no personal profile use |
| Chromium build | Host, disk, RAM, checkout, toolchain, target | Actual configured build command and artifact |

Source basis: [distilled-chrome-chromium.md](research/distilled-chrome-chromium.md).
