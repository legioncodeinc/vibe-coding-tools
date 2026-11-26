# 01. Route: demo video, screenshots, and script

Produces a narrated-ready product demo from a live app: one recorded clip per scene, sharp key screenshots, a write ledger with read-only verification, a privacy scan, an editable timeline, captions, scene titles, narration timings, Eleven v4 clip texts, and an assembly script. Read `00-foundation.md` first.

## Deliverables

Written to `<output.demo>/<demo-title-slug>/` for the first take, and `<demo-title-slug>-take-N/` for retakes:

| File | What it is |
| --- | --- |
| `plan.json` | The approved plan that was recorded (redacted) |
| `script.md` | Scene by scene status, route, recorded length, needed narration time, verify results, and errors |
| `scenes/NN-<scene>.webm` | One recording per scene, assembled from masked screenshot frames |
| `screenshots/NN-<scene>-<name>.png` | Key frames, with `redact.maskSelectors` applied |
| `failures/NN-<scene>.png` | A screenshot taken when a scene fails or does not verify |
| `timeline.json` | Every scene with id, title, clip, startMs, durationMs, status, plus `wordsPerMinute` and `tts` |
| `segments.tsv` | The edit list: one line per clip (file, in_ms, out_ms, scene) |
| `assembly.conf` | `end_hold_seconds=` for the last frame hold (from `video.endHoldMs`, default 1500) |
| `writes-report.json` | Each approved write: expected effect, the actual checks, and status verified, mismatch, failed, or skipped |
| `privacy-review.json` | Masked email, phone, and `redact.patterns` hits per scene, never raw page text |
| `captions.vtt` | WebVTT narration cues on the edited timeline |
| `titles.srt` | Scene titles as SRT, for burning in or a second subtitle track |
| `narration/cues.json`, `narration/fit.md` | Per-cue timing and the words-per-minute fit report |
| `narration/tts/NN-<scene>.txt`, `narration/tts-manifest.json` | One Eleven v4 text per cue, plus where each clip goes |
| `make-video.sh` | ffmpeg assembly, copied in with mode 700 |
| `demo.mp4` (after assembly) | H.264, 1920x1080, soft captions, faststart |

Two files live one level up, in `<output.demo>/`, because they span takes: `<slug>.ledger.json` (every take and the writes it attempted) and `findings.md` (every failure or mismatch, for a human to triage).

For a plain screenshot set with no video, run `scripts/screenshots.mjs` instead (route by route, scrolling, tabs included).

## Step 1: write the script before recording

Use the structure the research supports: hook, aha moment, walkthrough, social proof, call to action, at roughly 10 to 15s, 15 to 20s, 45 to 60s, 10s, 10s, for 60 to 90 seconds total, with no more than three features in the walkthrough [raw/demo--demo-script-structure.md] (community source).

- Pace narration at 130 to 150 words per minute; the recorder defaults to 140 and exposes `narration.wordsPerMinute` because the two archived sources overlap but do not fully agree [raw/demo--demo-script-structure.md] [raw/demo--narration-speaking-rate-wpm.md].
- Word budget per scene = seconds x WPM / 60. A 15 second hook at 140 wpm is 35 words.
- Show the product doing the job; do not describe features the viewer cannot see on screen.
- Start on the real post-login landing page (the page the app opens after sign-in), not a page you guess.

## Step 2: build the plan and get it approved

Start from `scripts/demo/demo-plan.example.json`. Each scene has `id`, `title`, `route`, `narration`, ordered `actions`, and optional read-only `verify` checks.

### Actions

| Action | Fields | Notes |
| --- | --- | --- |
| `wait` | `ms`, optional `screenshot` | Hold on a view |
| `hover` | `selector`, `ms` | Cursor glides to the element |
| `click` | `selector` | Guarded: the real control text is checked against the deny list |
| `type` | `selector`, `text`, `delay` | Demo data only; credential fields and secret-looking values are refused |
| `scroll` | `dy`, `dx` | Mouse wheel on the page |
| `select` | `selector`, `label` | Picks a native `<select>` option by its visible label; deny-listed labels are refused |
| `check`, `uncheck` | `selector` | Tick or untick a checkbox (for example untick Repeats) |
| `drag` | `from`, `to` (selector or `{x, y}`), `steps`, `holdMs` | Pointer drag with stepped moves, for libraries that listen to mouse or pointer events |
| `dragTo` | `selector`, `target` | Native HTML5 drag and drop (`draggable="true"`) |
| `scrollElement` | `selector`, then `x`, `y`, or `intoView` (+ `block`) | Scrolls a container such as a calendar grid, kanban lane, or table |
| `waitFor` | `selector` or `text`, `state`, `timeoutMs` | Waits for live state instead of a fixed delay |
| `confirmDialog` | `expect` (regex), `button`, optional `cancel` | Clicks `button` only if the dialog text matches `expect`; otherwise cancels and fails the scene |

Both ends of a `drag` must be on screen together, or the scene fails before the mouse button goes down.

Every action can take `screenshot`. The actions `drag`, `dragTo`, `select`, `check`, `uncheck`, and `confirmDialog` can change data, so the validator requires their scene to be declared in `writes[]`.

### Verify checks

`verify` runs after a scene's actions and never clicks or types:

| Type | Fields | Passes when |
| --- | --- | --- |
| `visible`, `hidden` | `selector` or `text` | The element reaches that state |
| `text` | `selector` or `text`, `expect` (regex) | The element text matches |
| `count` | `selector`, `equals` or `atLeast` | The number of matches is right |

### The write ledger

A demo may change the app, unlike the read-only crawls. Every scene that can write is declared up front:

```json
"writes": [{ "id": "book-tuesday-slot", "scene": "book", "description": "Creates one non-recurring appointment ...", "effect": "The Tuesday column shows one Lawn care card ...", "approved": true }]
```

- The recorder refuses to run unless `plan.approved` is `true` and every entry in `writes[]` has `approved: true`. Set both only after the user approves this exact plan and these exact writes.
- Every write scene needs at least one `verify` check. `writes-report.json` lists the expected effect next to the actual checks.
- A write is recorded as attempted in `<slug>.ledger.json` before that scene's actions run, so a crash midway still counts.
- After any write mismatch or failure, later write scenes are skipped (status `skipped`), while read scenes keep running. One bad drop does not cascade into more bad data.
- Each failure or mismatch gets a screenshot in `failures/` and an entry in `<output.demo>/findings.md`.

The guard rails stay on for every action: the built-in deny list (delete, remove, reset, revoke, restart, logout, pay, purchase, transfer, publish, and similar) always applies, and `safety.denyPattern` only adds to it. The guard reads the real control text (labels, `aria-label`, `aria-labelledby`, `autocomplete`, placeholder) from the DOM, not the selector you wrote. Credential fields and secret-looking values are always refused. Navigation off the app origin is blocked, a redirect to the login page aborts the run, and `redact.maskSelectors` covers every screenshot and video frame. Requests other than safe reads stay blocked unless an exact local or seeded `safety.requests` grant (method, path, body SHA256, `approved: true`) is declared; grants are active only while an action runs, and only in scenes listed in `writes[]`, so a scene that clicks Save must be declared there too. A `{x, y}` drag end is checked against the control under that point, and the `confirmDialog` cancel button is checked like any other click. A guardrail refusal aborts the whole run; other scene errors are recorded and the run continues.

### Pick slots from live state

Do not hardcode a time like "Tuesday 9:00". The slot may be taken, and a retake would double book it. Instead:

1. `waitFor` the free slot by a state selector, for example `[data-day=tue] [data-slot][data-free=true]`.
2. Use the same selector as the `drag` target, so the drop lands on whatever is free now.
3. `verify` the outcome by counting, for example exactly one matching card in that column.

### Scroll time-based grids to the target

Calendar and timeline grids often render 6:00 at the top and scroll inside their own container, so a page wheel does nothing and a drop target can be off screen. Use `scrollElement` with `intoView` to bring the target time into the grid's viewport before you drag:

```json
{ "type": "scrollElement", "selector": "[data-testid=calendar-grid]", "intoView": "[data-time='08:00']", "block": "start" }
```

Selectors: prefer role, text, and data attributes that survive redesigns. The recorder locates by `boundingBox()` just before moving the cursor, since coordinates are frame-relative and go stale after scrolling [raw/playwright--locators-bounding-box.md].

## Step 3: record

```bash
CAPTURE_CONFIG=library/design/capture.config.json PLAN=library/design/demo/plan.json node <skill>/scripts/demo/record-demo.mjs
```

What the recorder does:

- Uses masked screenshot frames, then the installed ffmpeg assembles each scene into WebM. It never writes an unmasked continuous recording. Configured selectors and password fields are masked in every frame, including overflowing paint and dynamically inserted elements. The guard restores page styles after each capture.
- Uses `video.fps` from 1 to 15, default 5. Repeated masked frames preserve wall-clock duration when screenshots take longer than the interval, or when a frame is dropped because the page was navigating (a page that stays uncapturable for 15 seconds fails the run). This is a reference/demo recording, not a high-frame-rate game recorder. `showActions` is not supported by this privacy path; use `video.cursor` for a visible pointer.
- Holds a scene for its narration, uses actual encoded scene duration for captions, and produces key screenshots, VTT, script and the assembly shell.
- Resolves the actual input type/name/autocomplete/labels before typing and refuses credential fields and values. Built-in destructive-label refusal cannot be weakened by a custom deny pattern.
- Allows only safe reads unless exact local/seeded request grants were approved with the scene. Redirects stop the capture.
- Never waits for `networkidle`. Realtime pages (polling, long poll, streams) never go idle, and a Playwright timeout of 0 means wait forever, so the recorder passes `idleMs: 0` and relies on `waitFor` actions.
- After every action, scans the visible page text for emails, phone numbers, and `redact.patterns`, and stores only masked hits in `privacy-review.json`.

### Cursor and parking

Video is built from masked screenshots, and headless Chromium draws no cursor. Set `video.cursor: true` and the recorder injects a DOM cursor with `context.addInitScript`, so it appears in every masked frame. It follows real mouse events, never takes pointer events, and is restored to the last position after every navigation.

After click, drag, dragTo, select, check, uncheck, and confirmDialog the cursor moves to `video.parkAt` (default the bottom right corner) so hover cards and tooltips close before the next frame. Set `"park": false` on an action to keep the cursor where it is.

### Retakes

Takes never overwrite each other. The first take writes `<slug>/`, the next `<slug>-take-2/`, and so on, recorded in `<slug>.ledger.json`. If an earlier take attempted writes, the recorder refuses and prints which writes would repeat. Reset the data or pick new free slots from live state, then rerun with `--retake` (or `RETAKE=1`). The warning is printed again at the start of the retake.

Use device scale 1 for video. Separate documentation screenshots can use another configured scale; the inventory records observed scale instead of assuming 3x.

## Step 4: review for privacy

```bash
CAPTURE_CONFIG=... DEMO_DIR=<output.demo>/<slug> node <skill>/scripts/demo/review-demo.mjs
```

This tiles each scene clip into a contact sheet (one frame every `EVERY_SECONDS`, default 2) in `review/`, growing the grid to fit the clip length, and writes `review/REVIEW.md` listing the masked text hits per scene and the action after which each appeared. A person checks every tile: pixels can show a name or email in a hover card that the text scan cannot read. Fix the data or mask it, and retake before you publish.

## Step 5: edit the timeline

`timeline.json` is the record of what was captured: scene id, title, clip, start offset, duration, and status. `segments.tsv` is the edit list that assembly follows:

```text
scenes/01-hook.webm	0	6400	hook
scenes/02-book.webm	300	14200	book
```

- Reorder lines to reorder scenes, delete a line to cut a scene, or change `in_ms` and `out_ms` to trim.
- Splice in a clip from another take by copying it into `clips/` and adding a line such as `clips/02-book-take-2.webm	0	9000	book`. The last column names the scene whose title and narration the spliced clip carries.
- Failed, aborted, and mismatched scenes stay in `timeline.json` but are left out of `segments.tsv`, so they do not reach the video unless you add them back.

After editing, rebuild captions, titles, and narration timings so they match the new cut:

```bash
CAPTURE_CONFIG=... DEMO_DIR=<output.demo>/<slug> node <skill>/scripts/demo/build-cues.mjs
```

## Step 6: assemble

Run `make-video.sh` from the demo folder (requires ffmpeg). It preflights every input and output first: it refuses symlinked or hard-linked inputs and any output that already exists, and it only reads clips under `scenes/` or `clips/`. Then:

1. Cut each segment to its in and out points and normalize it to identical streams: `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black`, then `-c:v libx264 -pix_fmt yuv420p -crf 20 -preset slow` [raw/demo--ffmpeg-scale-pad-1920x1080.md] [raw/demo--ffmpeg-webm-to-mp4-libx264.md]. The last segment holds its final frame for `end_hold_seconds` with `tpad`.
2. Concatenate with the concat demuxer and `-c copy`, which requires identical codec parameters across clips, hence step 1 [raw/demo--ffmpeg-concat-demuxer.md].
3. Mux soft captions as `mov_text` and finish with `-movflags +faststart` as the last step [raw/demo--ffmpeg-mov-mp4-faststart.md]. Research gap: `mov_text` has no dedicated prose section in the official ffmpeg docs archived [raw/demo--ffmpeg-subtitles-filter-mov-text.md].
4. Burn in `titles.srt` or captions with the `subtitles` filter only for players without subtitle tracks [raw/demo--ffmpeg-subtitles-filter-mov-text.md].
5. Add narration with `-map 0:v -map 1:a -c:v copy -c:a aac -shortest`, so video is never re-encoded [raw/demo--ffmpeg-add-audio-track-map.md].
6. GIF preview: two-pass `palettegen` then `paletteuse`, commonly `fps=15,scale=480:-1` [raw/demo--ffmpeg-gif-palettegen-paletteuse.md].
7. Speed changes: keep a single `atempo` step at or below 2x and pair it with `setpts` on video [raw/demo--ffmpeg-speed-setpts-atempo.md].

To rebuild, assemble into a fresh copy of the folder or move the old outputs aside first.

## Step 7: captions, titles, and narration audio

- Captions are WebVTT (`WEBVTT` header, `HH:MM:SS.mmm --> HH:MM:SS.mmm` cues) on the edited timeline [raw/demo--webvtt-w3c-spec.md] [raw/demo--webvtt-mdn.md]. `titles.srt` uses SRT, which puts a comma before milliseconds [raw/demo--srt-basics.md].
- `narration/fit.md` compares each cue's word count at the plan pace with the time its scene is on screen, and marks it fits, tight, or OVERRUN. The recorder and `build-cues.mjs` log every overrun. Shorten the line, add a `wait` to the scene, or lengthen its segment.
- Text to speech: ElevenLabs create speech [raw/demo--elevenlabs-tts-api.md] or OpenAI audio speech [raw/demo--openai-audio-speech-api.md]. Request `wav` or `pcm` when muxing immediately to avoid a lossy round trip, and chunk OpenAI input over 4096 characters [raw/demo--openai-audio-speech-api.md]. API keys come from the user's secret manager, never from the plan file. Hand deeper voice work to `elevenlabs-api-wasp-drone`.

### Eleven v4 rules

`narration/tts/` holds one text file per cue, already formatted for Eleven v4:

- Expressive cues are bracketed audio tags such as `[pause]`, `[short pause]`, `[long pause]`, or `[warm]`. They are kept, and they do not count as spoken words in the fit report or appear in captions. `narration.tts.style` adds a leading tag such as `[warm]`.
- SSML `<break>` is not supported. The formatter converts it to a pause tag and records a warning in `tts-manifest.json`; other markup is removed.
- Generate one clip per cue, not one long read. Each manifest entry gives the clip's start time and the most time it may take, so a clip that runs long shows up as an overrun instead of drifting every later line.
- Domains are spelled out for speech: `app.example.com/docs` becomes `app dot example dot com slash docs`.
- The manifest has no hardcoded model id or voice. Set `narration.tts.model` and `narration.tts.voice` from your own ElevenLabs account.

## Step 8: screenshot sets for docs

Follow the archived style guidance: crop tightly to the relevant UI, keep window chrome and style consistent across a set, cover personal data with an opaque solid overlay (not blur), and write real alt text under 155 characters [raw/demo--doc-screenshots-google-style-guide.md] [raw/demo--doc-screenshots-microsoft-style-guide.md].

## Done when

- The plan and every write were approved, and nothing on the deny list was clicked.
- `writes-report.json` shows every write verified, or each mismatch and failure is in `findings.md` with a decision.
- `review/REVIEW.md` was checked by a person and the contact sheets show no customer data.
- `narration/fit.md` has no overruns, `demo.mp4` plays with captions, and the end frame holds.
- A short report in `library/` lists scenes, durations, takes, the writes the demo made to that environment, and anything not capturable.
