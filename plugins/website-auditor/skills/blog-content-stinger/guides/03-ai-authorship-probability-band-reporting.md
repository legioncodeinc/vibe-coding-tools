# 03. AI-authorship: probability band, never a verdict

This is the binding, non-negotiable conduct rule for this Stinger. Read this guide before writing the AI-authorship section of a single post's finding, every time, not just the first time. PRD-018 is explicit: AI-authorship findings are reported ONLY as a probability band with the stated detection method and its documented error rate, e.g. "moderate probability (55-70%) of AI involvement, method X, false-positive rate Y%," never as "this post was AI-written." AC-3 backs this with a static check: any output phrased as a flat verdict is rejected outright, regardless of how confident the underlying signal felt.

## Why this rule exists, grounded in this Stinger's own research

This is not an arbitrary house style. It is the direct, sourced consequence of what this Stinger's own research archive found about AI-content detection:

1. **No detector is a broad, reliable classifier.** The arXiv benchmark paper's central finding is that existing detectors "often only perform well for specific notions [of AI-generated text] but not as broad detectors," and that existing AITD (AI-text-detection) datasets and benchmarks are "commonly under-specified, making findings on different datasets incompatible." [raw/arxiv-org-html-2606-04906v1.md] A flat verdict implies a reliability the research does not support for any detector, on any dataset.

2. **The best-documented detectors in this archive top out around 61-69% accuracy, on an adjacent domain.** The Springer study's two commercial detectors, Turnitin and Originality, scored 0.61 and 0.69 overall accuracy respectively on a 192-text balanced dataset of EFL student writing, professional human text, AI text, and hybrid text. [raw/link-springer-com-article-10-1007-s40979-026-00213-1.md] That is roughly a 31-39% misclassification rate on the study's OWN dataset, measured on academic-integrity content, not blog or marketing content. Presenting a verdict from a method this uncertain, in a domain the method was never validated against, is precisely the overconfidence this rule exists to prevent.

3. **Human raters are not meaningfully better.** Instructors in one cited study correctly identified ChatGPT-generated work only 70% of the time; a semi-randomized study of medical-student essays found 70% overall human accuracy (72% medical experts, 65% humanities experts). [raw/link-springer-com-article-10-1007-s40979-026-00213-1.md] There is no human-judgment fallback that licenses more confidence than the detectors themselves warrant.

4. **Hybrid, human-AI co-authored text is the realistic case, and it is the hardest one for everyone.** Both detectors in the Springer study "performed poorly on Hybrid texts," and the arXiv paper's entire dataset contribution exists because "existing AITD datasets do not represent natural human-AI co-creation," with authorship "specific to each token" rather than cleanly attributable to one party. [raw/arxiv-org-html-2606-04906v1.md] [raw/link-springer-com-article-10-1007-s40979-026-00213-1.md] Most real blog content that involves any AI assistance at all is drafted, edited, or outlined with a mix of human and AI input, not authored end-to-end by one or the other. A binary verdict actively misrepresents this.

5. **There is a documented fairness risk.** The Springer study found "a borderline trend toward higher accuracy" for Originality on professionally written text versus EFL student writing, and cites other research reporting "documented biases against non-native writers" in AI-detector accuracy generally. [raw/link-springer-com-article-10-1007-s40979-026-00213-1.md] A confident verdict on a specific post risks encoding that bias into a customer-facing report without ever surfacing it.

## What "method" and "error rate" actually mean in a finding

Every probability band must be accompanied, in the same sentence or table row, by:

- **Method.** Name the specific detector or heuristic actually used this run. If a commercial detector was run, name it (e.g. "Originality"). If no automated detector was available this run and the estimate is a manual stylistic-marker read, say that plainly, "manual stylistic-marker read, no automated detector run this pass" is a valid method statement, an unstated method is not.
- **Error rate.** Cite the accuracy/error figure this Stinger's research actually documents for that method, with its source and the domain it was measured in. The only concrete figures in this archive are the Springer study's 0.69 (Originality) and 0.61 (Turnitin) overall accuracy on its own 192-text EFL-academic-writing dataset [raw/link-springer-com-article-10-1007-s40979-026-00213-1.md]. Report those as roughly 31% and 39% misclassification respectively ON THAT STUDY'S DATASET, and say explicitly that neither source measured detection accuracy on blog or marketing content, so the figure is evidence from an adjacent domain, not a direct measurement of this post's detection accuracy.
- If neither commercial detector was actually run this pass, do not cite their accuracy figures as if they applied to whatever method was used instead. Cite them only when they are the method actually used, otherwise state that no detector-specific error rate exists in this archive for the method used, and say so.

## Phrasing that passes the AC-3 static check

Use a template close to this:

> "{Low/moderate/high} probability ({X}-{Y}%) of AI involvement in this post. Method: {named detector or heuristic}. Error rate: {stated figure, source, and domain caveat}."

Example, grounded in this archive:

> "Moderate probability (45-60%) of AI involvement. Method: manual stylistic-marker read (no commercial detector run this pass); calibrated against Originality's published 0.69 accuracy on a 192-text EFL-academic-writing study [raw/link-springer-com-article-10-1007-s40979-026-00213-1.md], which is an adjacent domain, not blog content, so this band should be read as a rough estimate, not a validated measurement."

## Phrasing that fails, and must never appear in this Drone's output

- "This post was AI-written."
- "This post is human-written, no AI involvement detected."
- "AI-generated" or "human-generated" used as a label without a band, method, and error rate attached.
- A percentage with no band, method, or error rate ("87% AI" alone is a disguised verdict, not a band).
- Any claim implying certainty above what this archive's own accuracy figures support, given neither source in this archive exceeds roughly 70% accuracy at best, on an adjacent domain.

## Hybrid authorship gets named, not flattened

Per finding 5 above, default toward acknowledging partial/mixed authorship as the likely case rather than framing every post as either fully AI or fully human. "Likely partial AI involvement (editing or outlining assistance), moderate confidence" is a more honest and better-grounded statement than forcing a binary read the research itself says detectors and humans both struggle with.

## Where this gets checked

`references/templates/post-finding-template.md`'s AI-authorship section is the enforced shape: probability band, method, error rate, and basis, as four distinct fields. If a draft finding does not fill in all four with real content (not "N/A" used to dodge the requirement), it has not met PRD-018 AC-3 and should not go into the report as written.
