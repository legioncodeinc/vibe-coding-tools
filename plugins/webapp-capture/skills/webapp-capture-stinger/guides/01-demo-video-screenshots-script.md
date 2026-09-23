# 01. Route: demo video, screenshots, and script

Produces a narrated-ready product demo from a live app: one recorded clip per scene, sharp key screenshots, a timed caption file, a narration script, and an assembly script. Read `00-foundation.md` first.

## Deliverables

Written to `<output.demo>/<demo-title-slug>/`:

| File | What it is |
| --- | --- |
| `plan.json` (copy of the approved plan) | The storyboard that was recorded |
| `script.md` | Scene by scene narration with recorded length versus needed narration time |
| `scenes/NN-<scene>.webm` | One Playwright recording per scene |
| `screenshots/NN-<scene>-<name>.png` | Key frames at the configured scale |
| `captions.vtt` | WebVTT cues timed to the recordings |
| `concat.txt`, `make-video.sh` | ffmpeg assembly |
| `demo.mp4` (after assembly) | H.264, 1920x1080, soft captions, faststart |

For a plain screenshot set with no video, run `scripts/screenshots.mjs` instead (route by route, scrolling, tabs included).

## Step 1: write the script before recording

Use the structure the research supports: hook, aha moment, walkthrough, social proof, call to action, at roughly 10 to 15s, 15 to 20s, 45 to 60s, 10s, 10s, for 60 to 90 seconds total, with no more than three features in the walkthrough [raw/demo--demo-script-structure.md] (community source).

- Pace narration at 130 to 150 words per minute; the recorder defaults to 140 and exposes `narration.wordsPerMinute` because the two archived sources overlap but do not fully agree [raw/demo--demo-script-structure.md] [raw/demo--narration-speaking-rate-wpm.md].
- Word budget per scene = seconds x WPM / 60. A 15 second hook at 140 wpm is 35 words.
- Show the product doing the job; do not describe features the viewer cannot see on screen.

## Step 2: build the plan and get it approved

Start from `scripts/demo/demo-plan.example.json`. Each scene has `route`, `narration`, and ordered `actions`:

| Action | Fields | Notes |
| --- | --- | --- |
| `wait` | `ms`, optional `screenshot` | Hold on a view |
| `hover` | `selector`, `ms` | Cursor glides to the element |
| `click` | `selector` | Guarded, see below |
| `type` | `selector`, `text`, `delay` | Demo data only; refuses secret-looking fields |
| `scroll` | `dy` | Mouse wheel |

A demo may interact with the app, unlike the read-only crawls. That is why the plan needs explicit user approval before recording (the recorder refuses to run unless the plan has `"approved": true`, which is set only after the user approves), and why the recorder aborts on any click or typing target whose text matches `safety.denyPattern` (delete, reset, revoke, restart, logout, pay, transfer, and similar) and refuses to type into fields that look like passwords, secrets, tokens, or API keys. Treat any mutation the demo does trigger (creating a sample record) as a change to that environment and tell the user.

Selectors: prefer role and text locators that survive redesigns; locate by `boundingBox()` just before moving the cursor, since coordinates are frame-relative and go stale after scrolling [raw/playwright--locators-bounding-box.md].

## Step 3: record

```bash
CAPTURE_CONFIG=library/design/capture.config.json PLAN=library/design/demo/plan.json node <skill>/scripts/demo/record-demo.mjs
```

What the recorder does, and why:

- Opens a fresh context per scene with `recordVideo: { dir, size: 1920x1080 }`. Set `size` explicitly; the default scales the viewport down to fit 800x800 [raw/playwright--browser-context-options.md] [raw/playwright--videos.md].
- Uses `recordVideo.showActions`, which outlines each interacted element, adds an action title, and draws a cursor [raw/playwright--browser-context-options.md] [raw/playwright--videos.md].
- Launches with `slowMo` (default 250ms) so actions are watchable [raw/demo--playwright-launch-slowmo.md].
- Holds each scene at least as long as its narration needs.
- Closes the context before reading the file; videos are only written on context close [raw/playwright--videos.md].
- Takes key screenshots with `animations: 'disabled'` [raw/playwright--screenshots.md].

Record at device scale 1 for video. Take hero screenshots for docs in a separate `screenshots.mjs` run at scale 2 or 3.

## Step 4: assemble

Run `make-video.sh` from the demo folder (requires ffmpeg). It encodes the documented pipeline:

1. Normalize each clip to identical streams: `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black`, then `-c:v libx264 -pix_fmt yuv420p -crf 20 -preset slow` [raw/demo--ffmpeg-scale-pad-1920x1080.md] [raw/demo--ffmpeg-webm-to-mp4-libx264.md].
2. Concatenate with the concat demuxer and `-c copy`, which requires identical codec parameters across clips, hence step 1 [raw/demo--ffmpeg-concat-demuxer.md].
3. Mux soft captions as `mov_text` and finish with `-movflags +faststart` as the last step [raw/demo--ffmpeg-mov-mp4-faststart.md]. Research gap: `mov_text` has no dedicated prose section in the official ffmpeg docs archived [raw/demo--ffmpeg-subtitles-filter-mov-text.md].
4. Burn captions in with the `subtitles` filter only for players without subtitle tracks [raw/demo--ffmpeg-subtitles-filter-mov-text.md].
5. Add narration with `-map 0:v -map 1:a -c:v copy -c:a aac -shortest`, so video is never re-encoded [raw/demo--ffmpeg-add-audio-track-map.md].
6. GIF preview: two-pass `palettegen` then `paletteuse`, commonly `fps=15,scale=480:-1` [raw/demo--ffmpeg-gif-palettegen-paletteuse.md].
7. Speed changes: keep a single `atempo` step at or below 2x and pair it with `setpts` on video [raw/demo--ffmpeg-speed-setpts-atempo.md].

## Step 5: captions and narration audio

- Captions are authored in WebVTT (`WEBVTT` header, `HH:MM:SS.mmm --> HH:MM:SS.mmm` cues) [raw/demo--webvtt-w3c-spec.md] [raw/demo--webvtt-mdn.md]. Convert to SRT only when a player requires it; SRT uses a comma before milliseconds [raw/demo--srt-basics.md].
- Recorded cue timing is scene-level. If narration is recorded or synthesized, re-time cues to the audio.
- Text to speech: ElevenLabs create speech [raw/demo--elevenlabs-tts-api.md] or OpenAI audio speech [raw/demo--openai-audio-speech-api.md]. Request `wav` or `pcm` when muxing immediately to avoid a lossy round trip, and chunk OpenAI input over 4096 characters [raw/demo--openai-audio-speech-api.md]. API keys come from the user's secret manager, never from the plan file. Hand deeper voice work to `elevenlabs-api-wasp-drone`.

## Step 6: screenshot sets for docs

Follow the archived style guidance: crop tightly to the relevant UI, keep window chrome and style consistent across a set, cover personal data with an opaque solid overlay (not blur), and write real alt text under 155 characters [raw/demo--doc-screenshots-google-style-guide.md] [raw/demo--doc-screenshots-microsoft-style-guide.md].

## Done when

- The plan was approved and nothing on the deny list was clicked.
- Every scene recorded, `demo.mp4` plays with captions, and scene lengths cover their narration.
- Screenshots contain no visible secrets or customer data.
- A short report in `library/` lists scenes, durations, any environment changes the demo caused, and anything not capturable.
