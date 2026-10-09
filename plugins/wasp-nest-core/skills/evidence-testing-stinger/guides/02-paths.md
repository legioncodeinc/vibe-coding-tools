# Choosing and running a path

Grounded in `../references/research/distilled.md`, which cites the archived
sources in `../references/research/raw/`.

## Path selection

| Situation | Path |
|---|---|
| GUI available, agent can drive it (computer use tools) | Live recording |
| GUI exists but the harness has no computer-use tools | Live via a driver CLI or manual instruction to the user |
| Headless machine (macdev, CI) | Headless screenshots and probes |
| Non-UI change (performance, output correctness) | Measured numbers |

## Live path

1. Prepare the screen: maximize the app window, close popups and
   notifications, navigate to the starting state before recording begins
   (unless setup itself is under test).
2. Start the recorder against the whole screen (a region crop only when the
   situation demands it). On macOS `screencapture -v` or ffmpeg
   `avfoundation` works; on Linux X11 `x11grab`, Wayland `wf-recorder`
   where the compositor supports wlr-screencopy. Verify capture works
   before the first real take.
3. Record the revision (see the protocol guide).
4. Drive the app at a watchable pace: let the UI settle after each action so
   state changes are visible.
5. Emit annotations per the protocol guide as you go: if the recorder cannot
   burn them into the video, keep them as an `assertions.md` file listing
   each annotation with its type, result, and approximate timestamp.
6. Stop, review the artifact end to end, write `report.md` and
   `manifest.json`, then post.

Crash safety: prefer recorders that write a recoverable stream (MPEG-TS) so
a hard kill still leaves reviewable footage; if the recorder died, say so in
the report rather than presenting partial footage as complete.

## Headless path

1. Verify the app is running and reachable from the script environment.
2. Script the browser (Playwright via npx is the default): navigate, act,
   screenshot at each meaningful state, and probe state (DOM assertion,
   response code, task output).
3. Save screenshots as `screenshots/NN-<step>.png` in task order.
4. Write `assertions.md` with one line per assertion: timestamp, statement,
   result, and the probe or screenshot that backs it.
5. Package per the artifact contract: the screenshot set stands in for
   `evidence.mp4`; label the run headless in report and manifest.

## Measured path (non-UI changes)

1. Define the metric before measuring (p95 latency, output bytes, pass
   count).
2. Capture the before number on the unmodified state and the after number
   on the changed state, same method, same environment.
3. Output pair and method go into `report.md`; numbers and deltas into
   `manifest.json`. A number without its method is not evidence.

## Verification of the run itself

Before posting: re-watch (or re-walk) the artifacts against the assertion
list. Every `passed` must be visible in the artifact. Fix or downgrade
anything that is not.
