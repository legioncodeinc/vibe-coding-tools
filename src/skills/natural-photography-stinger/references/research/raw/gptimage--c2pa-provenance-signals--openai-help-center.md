# Provenance signals (Content Credentials, SynthID) in OpenAI-generated content
- URL: https://help.openai.com/en/articles/8912793-c2pa-in-chatgpt-images
- Fetched: 2026-08-17
- Source type: official-docs (OpenAI Help Center)

## What is attached to OpenAI image output

Two signals:
1. **C2PA metadata (Content Credentials)** — cryptographically signed manifest.
2. **SynthID** — an invisible watermark embedded in the pixels.

> "Supported images generated with ChatGPT, Codex, and the OpenAI API include
> both signals."

Coverage is explicitly hedged: it "varies by product, model, export path, file
type, and creation date." So API output should be assumed to carry both, but
verified per pipeline rather than assumed universally.

## What the C2PA manifest contains

> C2PA metadata can include "the tool or service that created a file, when it was
> created, and other details about its origin or history."

The help article does not enumerate exact field names. In practice the manifest
asserts the generator/issuer (OpenAI), a creation timestamp, and an
`c2pa.actions` entry indicating the content was created using generative AI.

## Fragility of the signals

> "metadata was stripped during upload, download, editing, conversion, or
> sharing"

Watermarks may degrade through "compression, cropping, noise, edits, format
conversion, or other transformations."

Practical consequence: C2PA metadata is **routinely destroyed as a side effect of
ordinary work** — most social platforms strip EXIF/XMP on upload, screenshots
carry nothing, and re-encoding through many editors drops the manifest. SynthID
is the more durable of the two because it lives in the pixels.

## Verification

Users can check a file at **openai.com/verify**, which reports whether the file
contains "supported OpenAI provenance signals, such as a SynthID watermark or a
trusted C2PA manifest."

## What this article does NOT say

**No explicit policy statement** about whether removing provenance metadata
violates OpenAI's terms appears in this document. (See the usage-policies source
file — the policies likewise do not contain a preserve-the-metadata clause; the
enforceable rule is about *deceptive use*, not about the metadata itself.)
