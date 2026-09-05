# Research archive for brand-voice-guardian

Stages 2 and 3 of the Queen Bee forge pipeline for this skill.

## What is here

```
research/
├── README.md                                    this file
├── distilled-ai-detection-and-stylometry.md     stage 3, every claim cited to a raw file
└── raw/                                         stage 2, one file per source
```

**14 sources archived on 2026-08-17.** Every file in `raw/` carries a title, URL,
publication date, fetch date, and source type in its header, plus a "Claims this source
supports" block and a "Limits of this source" block. The distillation cites raw files by
filename in brackets.

## Source mix

| Type | Count | Sources |
|---|---|---|
| academic, peer-reviewed | 6 | Kobak et al. (Science Advances 2025), Reinhart et al. (PNAS 2025), Liang et al. (Patterns 2023), Weber-Wulff et al. (IJEI 2023), Sadasivan et al. (TMLR), Stamatatos (JASIST 2009) |
| academic preprint, not peer reviewed | 1 | Freeburg, arXiv 2603.27006 |
| official-docs, regulator | 1 | European Commission, AI Act Article 50 FAQ |
| official-docs, platform or vendor first-party | 2 | Amazon KDP AI content guidelines, OpenAI classifier retirement notice |
| community, independent measurement, code published | 1 | Keck, ecology abstracts em dash analysis |
| community, professional practice | 2 | Evans (Cell Mentor), Gladish (Science Editor) |
| vendor-blog | 1 | Turnitin, own false positive rates |

Six peer-reviewed sources against one vendor blog. That ratio is deliberate. This domain
has an unusually large marketing layer, split between detector vendors selling detection
and humanizer vendors selling evasion, and both have an obvious interest in overstating
what is measurable. The one vendor page kept is kept because it reports an error rate
against the vendor's own interest.

## Research window

Default window was the last 6 months, roughly 2026-02 to 2026-08. **Most of this archive
falls outside it**, and that is a finding about the domain rather than a shortcut. The
foundational measurements were made in 2023 to 2025 and have not been repeated.

| Source | Date | Why kept outside the window |
|---|---|---|
| Stamatatos, authorship attribution survey | 2009 | The canonical statement of which textual features carry authorial signal. Nothing recent restates the feature taxonomy with this authority, and the question predates and is independent of LLMs. |
| Evans, preserving author voice | 2015 | Contains the single most useful restraint rule located in the entire sweep. Copyediting practice on this point has not changed. |
| Liang et al., detector bias | 2023 | The definitive false-positive study. No replication on the current detector generation was located. |
| Weber-Wulff et al., 14-tool evaluation | 2023 | The broadest head-to-head detector evaluation located. No successor found. |
| OpenAI classifier retirement | 2023 | A first-party vendor withdrawal notice. It cannot be superseded; it either happened or it did not. |
| Turnitin false positive rates | 2023 | The only vendor publishing its own sentence-level error rate. |
| Sadasivan et al. | 2023, revised 2025 | The theoretical ceiling argument. Revised into the window. |
| Kobak et al. | published 2025 | The largest-scale lexical measurement located. |
| Reinhart et al. | published 2025 | The only corpus-comparative grammatical study located. |
| Keck, em dash in ecology | 2025-07 | One of very few actual measurements of the most-cited tell. |
| Gladish, Science Editor | 2025-08 | The most recent professional treatment of voice versus house style. |

In the window: the Freeburg preprint (2026-03), the European Commission Article 50 FAQ
(current guidance, obligations applying 2026-08-02), and the Amazon KDP policy page
(current, undated).

## Honest read on evidence quality

The long version is section 0 and section 9 of the distillation. Short version:

- **The linguistic signature of LLM text is well established.** Two peer-reviewed
  population-scale studies, one lexical over 15 million documents, one grammatical over
  two purpose-built parallel corpora. Both report specific, countable features with
  measured rates.
- **Per-document detection is well established as unreliable.** A 14-tool peer-reviewed
  evaluation, a seven-detector bias study, a theoretical ceiling result, and the vendor
  best positioned to solve it withdrawing its own product. These agree with each other and
  nothing retrieved disputes them.
- **The tells everyone talks about are the least evidenced ones.** Sentence-length
  uniformity, triadic lists, symmetrical paragraphs, tidy conclusions, hedging density.
  None of these has a measured study in this archive. Every source located for them was
  vendor marketing and was excluded. The skill labels those rules as authored craft.
- **Everything is measured on published and academic registers.** Nothing measures the
  short social and email registers this skill mostly reviews.

## Named gaps

The full list is section 9 of the distillation, ten items. The four that most limit what
the skill can claim:

1. **No study measures AI tells in short-form social writing**, which is the register the
   skill sees most.
2. **No measured study of burstiness, sentence-length variance, triadic lists,
   symmetrical structure, or the tidy-conclusion habit was located.** These are the most
   widely repeated tells and the least evidenced. All of them are authored craft in this
   skill and are labeled that way in the catalog.
3. **Detector evaluations are from 2023.** The direction is not in dispute in anything
   retrieved. The specific percentages are dated and are cited with their year attached.
4. **Nothing addresses correcting a third party's draft into someone else's voice.** The
   editing literature runs the opposite direction, an editor serving an author's voice.
   The teammate-draft case in this skill is authored reasoning.

## Retrieval failures worth recording

- `https://www.cell.com/patterns/fulltext/S2666-3899(23)00130-7`, the journal of record
  for the Liang detector-bias study, returned HTTP 403. The arXiv version (2304.02819)
  was read instead and carries the full numbers. Both URLs are in the raw file.
- `https://www.pnas.org/doi/10.1073/pnas.2422455122`, the journal of record for Reinhart
  et al., returned HTTP 403. The arXiv preprint (2410.16107v1) was read instead. The raw
  file states which version was actually read.
- The WebSearch budget for the session was exhausted before a first-party social platform
  text-labeling policy (Meta, LinkedIn, or YouTube) could be retrieved. Only the EU
  regulator and Amazon KDP represent the policy layer. Named as a gap rather than filled
  from training data.
- Searches for measured evidence on burstiness and perplexity returned only detector
  vendors and humanizer products across every result. Nothing was archived from that
  search. This is gap 2 above.

## Conflicts recorded rather than smoothed

Two, both kept in both directions:

1. **Turnitin false positive rate.** An independent 14-tool evaluation measured 0% on its
   test corpus. Turnitin itself publishes around 4% at sentence level. Different levels,
   different corpora, not strictly contradictory, and neither validates the other. The
   skill uses the higher figure, because it operates at span level and because
   underestimating a false positive rate is the failure mode that harms a user.
2. **Em dash as a tell.** One measurement finds em dash frequency more than doubling in a
   scientific corpus with no other punctuation mark behaving similarly. Another finds the
   human baseline range completely containing the LLM range across 12 models. Both are
   true. The resolution the skill adopts: the em dash is a real population-level shift and
   a worthless individual-document discriminator, and it is enforced as a VOICE rule
   against the user's own documented habit rather than as a detection rule.

## Deliberate non-duplication with the voice creator skills

`littlebird-voice-creator`, `facebook-voice-creator` and `combined-voice-creator` own the
construction of a personal voice profile from a real corpus. **This sweep did not re-run
any of that.** This archive covers what a machine-written draft looks like and what
detection can and cannot do. Where this skill needs a voice profile, it reads the user's
installed voice skill rather than shipping a thinner copy of one.
