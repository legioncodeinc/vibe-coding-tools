# Verify AI-generated images, videos, and audio — Gemini Apps Help
- URL: https://support.google.com/gemini/answer/16722517
- Fetched: 2026-08-17
- Source type: official-docs

Google describes **two** distinct provenance technologies:

## 1. SynthID (verbatim)
> uses "invisible watermarks to determine if images, videos, and audio were generated or edited
> specifically by Google's AI models."

Detection can identify when "all or part of the image or video was created or edited by Google's
AI models."

## 2. Content Credentials / C2PA (verbatim)
> "a technology that acts like a digital passport, documenting the digital content's origin and
> history, and is used for both AI and non-AI content."

## Robustness statement (VERBATIM — the key sentence)
> "The digital watermark will usually still exist even if the image, video, or audio is re-scaled,
> re-colored, compressed or altered in other ways."

Caveat (verbatim):
> "there's still a chance that after many alterations the watermark won't be detected."

## Limitations (verbatim)
- "Gemini can currently only recognize content created by Google AI tools."
- If a watermark isn't detected, "it could have been created by other AI systems."
- The system sometimes cannot determine conclusively whether content was AI-generated,
  particularly with "very simple or abstract content" lacking sufficient details.

## Practical reading
- SynthID = durable, in-pixel, survives rescale / recolor / compression → metadata stripping does
  not defeat it.
- Content Credentials (C2PA) = in the file container → fragile; a screenshot or re-encode removes it.
