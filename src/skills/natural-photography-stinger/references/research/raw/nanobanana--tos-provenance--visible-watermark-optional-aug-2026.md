# Google makes Gemini's visible AI watermark optional (Aug 2026)
- URL: https://techcrunch.com/2026/08/14/google-will-now-allow-users-to-remove-visible-watermark-from-its-ai-generations/
- Fetched: 2026-08-17
- Source type: practitioner (tech press reporting a Google statement)
- Date of change: 2026-08-14

## What changed
Google will allow users to turn off the **visible** watermark (the Gemini sparkle badge) on
AI-generated images, videos and songs.

Scope: applies to **Nano Banana, Omni, and Lyria** models, in the **Gemini app** and the **Flow**
video editor; Search support "coming soon."

Setting path: **Settings > Media Watermark**.

## Google's statement (VERBATIM)
> "We're striking a balance here between creative control and safety: while the visible watermarks
> are now optional, invisible SynthID watermarks and C2PA metadata are still being used for
> transparency."

## Reading
- The **visible** sparkle badge is now user-removable at generation time (previously only Ultra
  subscribers and AI Studio developer output were unbadged).
- The **invisible SynthID** watermark and **C2PA metadata** remain applied and are NOT optional.
- Detection continues to work via Gemini and via Google Search / Chrome right-click provenance
  checks (shipped after Google I/O 2026).

## Relevance to API/Replicate users
API and Google AI Studio output has never carried the visible sparkle badge. So for a Replicate
`google/nano-banana-pro` call: **no visible watermark, SynthID always present, C2PA manifest
present in the file container (and lost on re-save/screenshot).**
