# C2PA Content Credentials vs SynthID — durability and the May 2026 OpenAI/Google alignment
- URL: https://c2paviewer.com/articles/openai-google-c2pa-synthid-2026
- Fetched: 2026-08-17
- Source type: practitioner

## What a C2PA manifest carries
> "who created the file, which tool produced it, when it was created, and what edits were applied."

## C2PA is FRAGILE (verbatim)
> "Take a screenshot of an AI-generated image, save it as a new PNG, and the manifest is gone.
> Re-encode a video through a social platform's transcoder, and the credentials are stripped."

Reason given: "C2PA metadata lives in the file container."

## SynthID is DURABLE (verbatim)
> SynthID "modifies pixel values or audio samples in ways that are imperceptible to human senses
> but detectable by a trained classifier."

> "It survives operations that would destroy a metadata record. Screenshots, resizing, JPEG
> recompression, color grading, and minor crops all leave the watermark intact."

Limitation (verbatim):
> SynthID "can confirm that content came from a SynthID-enabled generator, but it cannot tell you
> who created it, when, what edits were applied."

## 2026 alignment
- **2026-05-19**: OpenAI joined the C2PA steering committee and adopted SynthID.
- Same day / Google I/O 2026: Google announced C2PA and SynthID detection integrated into
  **Google Search and Chrome** (right-click to check an image for AI provenance).

## Bottom line for any pipeline touching Nano Banana Pro output
Running `exiftool -all=` (or any re-save that drops XMP) removes the C2PA manifest but leaves
SynthID intact and detectable. There is no supported way to remove SynthID, and attempting to is
outside Google's policy intent (see the ToS/policy file in this folder).
