# How to prompt Gemini 2.5 Flash Image Generation for the best results
- URL: https://developers.googleblog.com/en/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/
- Fetched: 2026-08-17
- Source type: vendor-blog
- Published: 2025-08-28 (written for Nano Banana / 2.5 Flash Image; the same prompting doctrine
  is carried forward into the Nano Banana Pro docs)

## Core doctrine (verbatim)
> "Describe the scene, don't just list keywords."

The model "excels with a narrative, descriptive paragraph" rather than disconnected terms.

## Hyper-specificity
Instead of "fantasy armor," write:
> "ornate elven plate armor, etched with silver leaf patterns, with a high collar and pauldrons
> shaped like falcon wings."

## Photographic & cinematic language (the terms Google names explicitly)
`wide-angle shot`, `macro shot`, `low-angle perspective`, `85mm portrait lens`, `Dutch angle`

Google's framing: these terms give "compositional control" and "direct the final result."

## Photorealistic scene template
Google says the template should carry: **shot type, subject, action, environment, lighting, mood,
camera details, and aspect ratio.** (This is the checklist behind the one-line template in the
API docs.)

## Editing
"Provide image plus descriptive change request." Example:
> "Using the provided image of my cat, please add a small, knitted wizard hat..."

## Practical implication for a natural-photography prompt builder
The eight documented slots to fill, in Google's own order:
1. shot type  2. subject  3. action  4. environment  5. lighting  6. mood
7. camera/lens details  8. aspect ratio
