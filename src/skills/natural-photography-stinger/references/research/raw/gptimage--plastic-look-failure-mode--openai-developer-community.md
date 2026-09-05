# Request: Improve high-frequency textures and micro-details to avoid plastic look
- URL: https://community.openai.com/t/request-improve-high-frequency-textures-and-micro-details-to-avoid-plastic-look/1379351
- Fetched: 2026-08-17
- Source type: community (OpenAI Developer Community, with OpenAI staff reply)

The most direct primary-source documentation of the "AI look" failure mode,
filed the day before gpt-image-2 launched and answered by OpenAI staff.

## The report (user "Puppis", April 20, 2026)

Failure modes named, verbatim:

- an **"over-processed"** or **"plastic"** look in ChatGPT image generation
- micro-details missing or **"overly smoothed"** on surfaces
- specifically absent: **"skin pores, fabric fibers, weathered stone, organic
  noise"**
- an **"uncanny valley of smoothness"** that prevents professional use

Context: a professional creator working at 6,000 × 4,000 px, comparing
unfavourably against Midjourney's texture rendering.

Requested remedies:
1. increase high-frequency detail to avoid the **"denoised"** effect
2. add a **"'Style Raw' Mode"** that bypasses heavy AI-polish
3. generative upscaling that **"hallucinate[s] finer textures"** rather than
   stretching pixels
4. better **"preservation of tactile qualities across different prompts"**

## OpenAI staff response (Smith, April 21, 2026)

Acknowledged that the issue stems from models balancing **"denoising, coherence,
and detail"**, which **"smooth[s] out high-frequency texture."** Confirmed this
is genuine advanced-user feedback and committed to capturing it as product
feedback.

## Why this matters for photorealism prompting

This is an **official acknowledgement of the mechanism** behind the AI look: the
denoising/coherence objective actively suppresses high-frequency texture. It is
not a prompt-comprehension failure — it is a bias in the generation process.

Consequences for prompt design:
- Micro-texture must be **named as subject matter** ("visible pores", "fine
  vellus hair", "fabric slub", "dust on the lens barrel"), because it will not
  survive by default.
- No "Style Raw" / no-polish switch exists in the API. There is **no parameter**
  that turns off smoothing — only `quality`, and quality raises polish, not
  grit.
- Upscaling an OpenAI output does not add texture; it stretches an already-
  denoised image. Texture has to be won at generation time or added in post.

**No workarounds were reported in the thread.** No follow-up from OpenAI
confirming a fix.
