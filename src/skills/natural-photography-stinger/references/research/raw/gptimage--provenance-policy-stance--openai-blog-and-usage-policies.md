# OpenAI's provenance stance: "Advancing content provenance" + Usage Policies
- URL: https://openai.com/index/advancing-content-provenance/
- URL: https://openai.com/policies/usage-policies/
- Fetched: 2026-08-17
- Source type: vendor-blog + official-docs

Two primary sources combined because the question — "what is OpenAI's stance on
removing provenance metadata?" — is answered by their *juxtaposition*.

---

## 1. openai.com/index/advancing-content-provenance/ (vendor-blog)

Announcement dated **May 19, 2026**; updated **July 31, 2026** (audio).

Three components announced: "Content Credentials, SynthID, and a verification
tool to help people identify and trust AI-generated media."

**C2PA:** OpenAI is "a C2PA Conforming Generator Product" and has added Content
Credentials to images since 2024. The metadata uses "cryptographic signatures to
help information about a piece of media securely travel with the content itself."

**SynthID:** partnership with Google adding an "invisible watermarking layer that
complements C2PA metadata-based approaches" to images from **ChatGPT, Codex, and
the OpenAI API**. Extended to supported audio on July 31, 2026.

**Verification tool:** public tool to check whether a file "contains provenance
signals, including Content Credentials and SynthID."

**Explicit acknowledgement that stripping happens:**

> "If no metadata or watermark is detected, for example, the tool will not make a
> definitive conclusion about whether the image was generated with OpenAI tools
> since provenance signals can in some cases be stripped."

**No statement in this blog post says that stripping metadata violates policy.**
The framing is technical/limitational, not prohibitive.

---

## 2. openai.com/policies/usage-policies/ (official-docs)

Relevant clauses located:

> "use of someone's likeness, including their photorealistic image or voice,
> without their consent in ways that could confuse authenticity"

> "deceit, fraud, scams, spam, or impersonation"

**Notable absence:** the usage policies do **not** contain any clause about
watermarks, C2PA, Content Credentials, provenance metadata, or an obligation to
preserve technical indicators of AI generation. There is no "do not remove the
watermark" rule.

---

## Synthesis (the honest answer)

- OpenAI **embeds** C2PA + SynthID and **encourages** their retention, but the
  enforceable prohibition in the usage policies is aimed at **deceptive
  outcomes** — impersonation, non-consensual photorealistic likeness, confusing
  authenticity — **not** at the mechanical act of stripping metadata.
- Therefore: re-encoding a photorealistic render (which incidentally drops the
  C2PA manifest) is not itself a named policy violation, but using the resulting
  image to pass off a real person's likeness or to deceive is squarely
  prohibited. SynthID survives most re-encodes regardless.
- Jurisdictional caveat worth carrying into any skill built on this: several
  regimes (EU AI Act Article 50 transparency obligations, California and Chinese
  synthetic-media labeling rules) impose **statutory** disclosure duties that are
  stricter than OpenAI's own terms. Vendor policy is the floor, not the ceiling.
