# Google Generative AI Prohibited Use Policy + Gemini API Additional Terms — provenance language
- URL: https://policies.google.com/terms/generative-ai/use-policy
- URL: https://policies.google.com/terms/generative-ai
- URL: https://ai.google.dev/gemini-api/terms
- Fetched: 2026-08-17
- Source type: official-docs

## THE OPERATIVE CLAUSE (VERBATIM)
From the Generative AI Prohibited Use Policy, section "Misinformation, misrepresentation, or
misleading activities" — "Do not perform or facilitate the following activities":

> "Misrepresenting the provenance of generated content by claiming it was created solely by a
> human, in order to deceive"

Adjacent bullet in the same section (verbatim):

> "Impersonating an individual (living or dead) without explicit disclosure, in order to deceive"

Google's stated exception for the section: exceptions may be permitted for educational,
documentary, scientific, or artistic purposes where public benefits outweigh harms.

## OTHER RELEVANT VERBATIM CLAUSES
Prohibited Use Policy, "Do not compromise the security of others' or Google's services":
> "Circumvention of abuse protections or safety filters -- for example, manipulating the model to
> contravene our policies."

Generative AI Additional Terms of Service — Use restrictions:
> "You may not use the Services to develop machine learning models or related technology."
> "you must comply with our Prohibited Use Policy, which provides additional details about
> appropriate conduct when using the Services."

Gemini API Additional Terms:
> "You may not use the Services to develop models that compete with the Services (e.g., Gemini API
> or Google AI Studio). You also may not attempt to reverse engineer, extract or replicate any
> component of the Services, including the underlying data or models (e.g., parameter weights)."
> "You may not attempt to bypass these protective measures or use content that violates the API
> Terms or these Additional Terms."

## IMPORTANT NEGATIVE FINDING
As of 2026-08-17 I could find **no clause in any of Google's public generative-AI terms
(Prohibited Use Policy, Generative AI Additional ToS, Gemini API Additional Terms) that
explicitly prohibits removing, stripping, obscuring, or altering the SynthID watermark, C2PA
Content Credentials, or EXIF/XMP metadata.** There is no "you shall not remove our watermark"
sentence to quote.

The enforceable hooks are therefore:
1. The provenance-misrepresentation bullet above (intent-based: removing markers *in order to
   deceive* by passing the output off as human-made is the prohibited act).
2. The anti-circumvention bullet ("Circumvention of abuse protections or safety filters"), whose
   plain reading targets safety filters rather than watermarks.
3. Google's own framing (Aug 2026): the *visible* watermark is now optional, but "invisible
   SynthID watermarks and C2PA metadata are still being used for transparency" — i.e. Google
   treats SynthID as non-optional infrastructure rather than as a contractual obligation on the
   user.

Practical guidance for a skill/pipeline: do not attempt SynthID removal (it is designed to
survive re-encoding anyway); routine EXIF stripping for privacy is not itself a policy breach,
but presenting the result as a human-shot photograph in order to deceive is squarely prohibited.
Use IPTC `digitalSourceType` = `trainedAlgorithmicMedia` to positively disclose instead.
