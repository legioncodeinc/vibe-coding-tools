# Delving into LLM-assisted writing in biomedical publications through excess vocabulary

- **Title:** Delving into LLM-assisted writing in biomedical publications through excess vocabulary
- **Authors:** Dmitry Kobak, Rita Gonzalez-Marquez, Emoke-Agnes Horvat, Jan Lause
- **Journal:** Science Advances, vol. 11, no. 27, 2 July 2025. DOI 10.1126/sciadv.adt3813
- **Preprint:** arXiv:2406.07016 (first submitted 11 June 2024, v5 read for this archive)
- **URL:** https://arxiv.org/abs/2406.07016 and https://arxiv.org/html/2406.07016v5
- **Also:** https://www.science.org/doi/10.1126/sciadv.adt3813
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed, Science Advances)

## Why this source matters here

This is the strongest measured evidence in the archive that LLM use produces a
detectable LEXICAL signature in real published writing, at population scale, with a
method that does not depend on any commercial detector. It supplies the word list that
an AI-tell catalog can be built on without guessing.

## Method

Analyzed over 15 million biomedical abstracts from 2010 to 2024 indexed by PubMed.

The technique is **excess word analysis**, borrowed from excess-mortality methodology.
Fit each word's frequency trend on pre-2024 data, project the counterfactual 2024
frequency, and measure the gap between projected and observed. Two summary statistics
per word:

- **Frequency ratio `r`**: observed 2024 frequency divided by counterfactual frequency.
  Useful for rare words.
- **Frequency gap `delta`**: observed minus counterfactual, in absolute frequency terms.
  Useful for common words.

## Findings

### The shift is stylistic, not topical

This is the key structural finding, and it is what separates an LLM signature from a
subject-matter fad.

- Covid-era excess words (2020 to 2022) were overwhelmingly **content words**. The paper
  reports **79.2% were nouns** (examples given: coronavirus, remdesivir, lockdown).
- 2024 excess words were overwhelmingly **style words**. Of **379 excess style words in
  2024, 66% were verbs and 14% were adjectives**.

The authors state the impact on scientific writing surpassed the effect of major world
events including the Covid pandemic.

### Named marker words with measured ratios

Highest frequency ratios reported for 2024 style words:

| Word | Frequency ratio r |
|---|---|
| delves | 28.0 |
| underscores | 13.8 |
| showcasing | 10.7 |

For calibration, the paper cites `zika` in 2017 at r = 40.4. A genuine topical shock
produces a ratio of the same order as the 2024 style-word shock, which is why the
part-of-speech split above is the load-bearing evidence rather than the ratio alone.

Common words identified by frequency gap (`delta`):

| Word | Frequency gap delta |
|---|---|
| potential | 0.052 |
| findings | 0.041 |
| crucial | 0.037 |

### The prevalence estimate

Two independent word sets were used to estimate what share of 2024 abstracts were
LLM-processed:

- **Rare-word set**: 291 words with frequency under 0.02. Delta_rare = 0.136.
- **Common-word set**: 10 words, listed in full as `across, additionally,
  comprehensive, crucial, enhancing, exhibited, insights, notably, particularly,
  within`. Delta_common = 0.134.

Combined: Delta = (Delta_common + Delta_rare) / 2 = **0.135**.

The paper frames 13.5% as a **lower bound** on the share of 2024 biomedical abstracts
processed with an LLM, and notes the figure reaches **40% for some subcorpora**.

## Claims this source supports

1. LLM-assisted writing produces a measurable lexical signature in published prose.
2. The signature is concentrated in **style words**, specifically verbs and adjectives,
   not in topic vocabulary. A word-level tell list should therefore weight verbs and
   adjectives, not nouns.
3. Named high-ratio markers with measured ratios: delves, underscores, showcasing.
4. Named common-word markers with measured gaps: potential, findings, crucial, plus the
   ten-word common set (across, additionally, comprehensive, crucial, enhancing,
   exhibited, insights, notably, particularly, within).
5. A single occurrence of any of these words proves nothing. The method is a population
   frequency argument, not a document classifier. The paper never claims to identify an
   individual LLM-assisted abstract.

## Limits of this source for our purpose

- The corpus is biomedical abstracts. Register transfer to a social post, a client
  email, or a comment is an assumption, not a finding.
- The method operates on millions of documents. It cannot be applied to one draft.
  Borrowing the WORD LIST is legitimate; borrowing the CONFIDENCE is not.
- The 2024 measurement predates the model generation in use at the time of writing.
  Marker vocabulary drifts as models change.
