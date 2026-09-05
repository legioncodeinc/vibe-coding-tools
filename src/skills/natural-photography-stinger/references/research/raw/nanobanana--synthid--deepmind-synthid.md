# SynthID — Google DeepMind
- URL: https://deepmind.google/models/synthid/ (also https://deepmind.google/science/synthid/)
- Fetched: 2026-08-17
- Source type: official-docs

## What it is (verbatim)
> "SynthID is our new watermarking tool, designed specifically for AI-generated content. It
> empowers users to identify AI-generated (or altered) content, helping to foster transparency
> and trust in generative AI."

## How it is applied to images (verbatim)
- SynthID adds "an invisible digital watermark" to an AI-generated image (or video segment).
- "The watermark doesn't change the image or video quality."
- "It's added the moment content is created." (i.e. embedded at generation time, in the pixels —
  NOT in the file's metadata container)

## Robustness (verbatim)
> "designed to stand up to modifications like cropping, adding filters, changing frame rates,
> or lossy compression."

For audio: "can't be altered by common modifications like adding noise, MP3 compression, or
changing the speed of the track."

For text: "SynthID adjusts these probability scores to generate a watermark. It's not noticeable
to the human eye, and doesn't affect the quality of the output."

## Detection
- In-product: upload the file to the Gemini app and ask whether it was "created or altered by
  Google AI." Gemini checks for a SynthID watermark and reports.
- **SynthID Detector** portal: a verification portal where you "upload an image, video or audio
  file." Google is "currently collaborating with journalists and media professionals to test the
  portal."

## Coverage
Embedded across Gemini (images, video, text), Imagen, Veo, Lyria (music/audio), and NotebookLM
audio overviews.

## Key implication for a photography workflow
Because SynthID is a **pixel-domain** watermark applied at generation time, stripping EXIF/XMP/
IPTC metadata (e.g. with exiftool -all=) does NOT remove it. Metadata stripping removes only the
C2PA manifest and EXIF, not SynthID.

## Not stated on this page
- No pixel-level algorithm detail, no confidence-score thresholds published.
- No mention of C2PA on this page (C2PA is covered in Google's Gemini Apps help + Vertex AI
  "Content Credentials" docs).
