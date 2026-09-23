# Chrome DevTools and Chromium workflow

The Chrome DevTools Protocol documentation describes Protocol Monitor as a way to observe requests, responses, and methods from the DevTools frontend. Use it to learn a live sequence before writing direct protocol calls. [raw/chrome-devtools-protocol.md]

The protocol endpoint `GET /json/version` yields browser metadata and a browser WebSocket debugger URL. Treat that URL as a local control capability. Do not copy it into logs, tickets, or a remotely accessible service. [raw/chrome-devtools-protocol.md]

Chromium documentation states that Chromium supports Windows, macOS, and Linux host systems and directs developers to platform build instructions. It also documents `depot_tools` as essential to development flow and signals substantial storage needs. This is a planning prerequisite, not a promise that a consumer machine is ready to build Chromium. [raw/chromium-development.md]

Use a separate `--user-data-dir` for development. Chromium guidance recommends a separate data directory so development, extension, browser modification, or testing work does not use an everyday profile. [raw/chrome-development-profile.md]
