# An Empirical Study of Obsolete Answers on Stack Overflow

- **URL:** https://arxiv.org/abs/1903.12282 (full text:
  https://petertsehsun.github.io/papers/obsolete_SO_tse2019.pdf)
- **Fetched:** 2026-08-17
- **Source type:** academic (IEEE Transactions on Software Engineering, presented ICSE 2020
  Journal First track)
- **Why archived:** The strongest evidence in this archive for the staleness problem, with
  real numbers. A personal knowledge base of fixes is structurally the same artifact as a
  Stack Overflow answer: written once against a specific version, consulted much later,
  with nothing in the record that tells the reader it went bad.

## Abstract, as fetched

"Stack Overflow accumulates an enormous amount of software engineering knowledge. However,
as time passes, certain knowledge in answers may become obsolete. Such obsolete answers, if
not identified or documented clearly, may mislead answer seekers and cause unexpected
problems (e.g., using an out-dated security protocol). In this paper, we investigate how the
knowledge in answers becomes obsolete and identify the characteristics of such obsolete
answers."

## Dataset

- **52,177 answer threads** examined
- **58,201 comments** mentioning obsolescence
- Spanning **12,629 tags**
- Heuristic-based detection method reported at **75% accuracy**
- Separately: **11.9%** of 5.5 million links inside Stack Overflow answers were
  inaccessible

## Headline percentages

| Finding | Value |
|---|---|
| Obsolete answers observed as obsolete within 24 hours of posting, meaning they were probably already obsolete when first posted | **58.4%** |
| Obsolete answers that were ever actually updated after being flagged | **20.5%** |
| Cases where a new answer was added instead | **6.3%** |

## Timing

| Metric | Average |
|---|---|
| Time for users to react after an obsolescence observation | **118 days** |
| Time to update an obsolete answer | **119 days** |
| Time to add a replacement answer | **128 days** |

## Who notices the obsolescence

| Observer | Share |
|---|---|
| Outsider, never previously involved in the thread | **38.2%** |
| The original answerer | **24.3%** |
| The question asker | **20.5%** |

**78.6%** of observations included supporting evidence.

## Why answers go obsolete

| Cause | Share |
|---|---|
| Third-party libraries | 31.7% |
| Programming languages | 30.9% |
| Obsolete references and dead links | 15.5% |
| Tools | 12.9% |
| Mobile operating systems | 11.4% |
| Non-mobile operating systems | 2.1% |
| Protocols | 1.0% |

## Tags most prone to obsolescence

node.js (0.36%), ajax (0.34%), android (0.32%), objective-c (0.32%).

## Recommendations from the authors

For the platform: incentive systems for community maintenance, automated obsolescence
detection, dead-link detection, and generated version tags for frameworks.

For users: **include version and time information when answering**, and read the comments
for obsolescence indicators, especially in web and mobile tags.
