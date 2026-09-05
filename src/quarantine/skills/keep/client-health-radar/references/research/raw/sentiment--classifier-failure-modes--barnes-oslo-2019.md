# Sentiment analysis is not solved! Assessing and probing sentiment classification

- **Title:** Sentiment analysis is not solved! Assessing and probing sentiment classification (Jeremy Barnes, Lilja Ovrelid, Erik Velldal, University of Oslo). arXiv:1906.05887v1, 13 June 2019. Published at the BlackboxNLP workshop, ACL.
- **URL:** https://arxiv.org/abs/1906.05887
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed workshop paper, arXiv preprint)

## Why this source matters for client-health-radar

This is the paper that enumerates, with counts, exactly which linguistic phenomena break
sentiment classifiers. Several of them are the normal register of a professional client call:
understatement, modality, comparatives, idiom, and irony. It is the evidence for designing
around sentiment scoring rather than on top of it.

## Extracted claims

Setup: four models (BERT, ELMo, BiLSTM, bag-of-words SVM) on six English sentence-level
sentiment datasets. The authors collected the 836 sentences that every model got wrong and
annotated them for 18 linguistic and paralinguistic phenomena.

**Baseline accuracy of state of the art models on ordinary sentiment data (Table 2):**

| Dataset | BOW | BiLSTM | ELMo | BERT |
|---|---|---|---|---|
| MPQA | 40.9 | 48.7 | 61.0 | 62.3 |
| OpeNER | 69.7 | 71.5 | 82.1 | 84.2 |
| SemEval | 62.3 | 58.0 | 71.9 | 75.1 |
| SST | 50.9 | 37.5 | 51.3 | 53.0 |
| Tackstrom | 46.0 | 45.0 | 53.1 | 60.2 |
| Thelwall | 53.5 | 52.0 | 59.1 | 63.9 |

The paper notes: "The error rates range between 8.3 on OpeNER and 20.5 on SST, indicating
that there are differences in difficulty of datasets due to domain and annotation
characteristics."

**Error categories by frequency (Table 5), five most frequent in bold in the original:**

| Category | Errors |
|---|---|
| incorrect gold label | 277 |
| no sentiment | 214 |
| mixed | 185 |
| non-standard spelling | 180 |
| desirable element | 144 |
| idioms | 132 |
| strong | 122 |
| negation | 97 |
| world knowledge | 81 |
| amplifier | 79 |
| comparative | 68 |
| sarcasm/irony | 58 |
| shifter | 50 |
| emoji | 46 |
| modality | 38 |
| morphology | 31 |
| reducer | 13 |

- **Negative sentiment is the hard class.** "the strong negative is the most difficult and
  least common class, while positive is the easiest to classify." Error distribution: strong
  negative 106, negative 299, neutral 303, positive 296, strong positive 109, against a gold
  distribution of strong negative 294, negative 1742, neutral 2249, positive 2402, strong
  positive 475.
- **A third of the errors are annotation disagreement, not model failure.** "A more
  problematic situation is found among nearly 20% of the examples (34), where the annotator
  found the original label to be completely incorrect." And 277 sentences carried the
  "incorrect label" annotation.
- **Mixed sentiment in a single utterance is a structural problem, not a tuning problem.**
  "while most of the examples are in the 'mixed' category (45%), the other 55% are annotated
  as having mostly positive or negative sentiment. This is a confusing situation for both
  annotators and sentiment classifiers, and a direct product of performing sentence-level
  classification rather than aspect-level. Nearly a third of the errors contain 'but' clauses."
- **Modality defeats every model tested.** The section on modality opens: "None of the
  state-of-the-art sentiment [classifiers]". The annotation guideline example for modality is
  "I would have loved the room if it been bigger."
- **Shifters flip polarity quietly.** "Shifters (50 errors), such as 'abandon', 'lessen', or
  'reject' are less common within the dataset, but normally move positive polarity words
  towards a more negative sentiment. The most common shifter is the word 'miss'."
- **World knowledge and irony are entangled.** "irony is often defined as 'violating
  expectations', which presupposes that we possess a world knowledge containing expectations
  of a situation."
- **More training data does not fix the hard categories.** Fine-tuning BERT on 155,019
  phrase-level annotations instead of 8,544 sentences raised SST accuracy from 53.0 to 55.1,
  and: "results improve greatly on the sentences which contain the labels negation, world
  knowledge, amplified, emoji, and reduced, while performing worse on irony, shifters and
  equally on morphology."
- Stated conclusion: "modern neural methods still fail on many examples of these phenomena"
  and the authors urge probing classifiers qualitatively "rather than rely only on
  quantitative scores, which often obscure the plentiful challenges that still exist."

## Direct implication for the skill

The failure list maps almost one to one onto how an unhappy but professional client actually
talks. "I would have loved to see this last week" is modality. "It is fine, I suppose" is a
reducer plus mixed. "We are still waiting on the thing we asked for in June" carries no
sentiment lexicon at all and is the strongest signal in the transcript. A skill that ranks
clients by a sentiment score is ranking them by the exact axis these models are worst on.
