# Guide 06: OS-Level Input Rig (Undetectable, Accessibility-First)

## When to use this instead of the Oxylabs headless browser

Use this rig when the target platform (Facebook, TikTok) fingerprints the automation channel itself. CDP, Playwright, and Puppeteer all leave detectable traces (`navigator.webdriver`, synthetic event timing). The OS-level rig moves input below the browser so events are indistinguishable from real hardware. It is also the accessibility-first option: the operator never touches a keyboard or mouse.

## Core principle

Never send an event through the browser. Move the physical cursor and press physical keys via X11 (`pyautogui`, `xdotool`, `pynput`). Launch Chrome normally (no `--remote-debugging-port`). Perceive the screen with screenshots + OCR instead of reading the DOM.

## Stack

- Manus Cloud Computer, Standard tier ($30/mo, 4 GB RAM), US East or West.
- Xfce4 + Xvfb + x11vnc for the display.
- `pyautogui`/`pynput` for input; `opencv` + `tesseract` for perception.
- One Chrome profile per Facebook account, each bound to one sticky residential proxy in the same locality.
- systemd units for auto-start on reboot.

## Human realism requirements

- Bezier-curve mouse movement with jitter, 0.4-1.1s per move.
- Dwell 50-180ms before press; press duration 40-110ms.
- Per-key typing latency 50-220ms with ~2% typo-and-correct.
- 3-6s between page loads; 45-90s break every 25 entities.

## Identity rules

- One account per profile, one proxy per profile, never crossed.
- 3 to 5 identities maximum; more makes warmup the risk.
- Warm each account 3-7 days (scroll, like, join a group) before collecting.
- Prefer mobile proxies (CGNAT) for the highest-value accounts.

## Escalation

If OS-level input still trips detection on a high-value account, add a PiKVM (KVM-over-IP) so input is electrically genuine USB HID.

## Full runbook

See `OS_INPUT_RUNBOOK.md` in the project for the complete spec, install commands, and code for the human-realism layer.
