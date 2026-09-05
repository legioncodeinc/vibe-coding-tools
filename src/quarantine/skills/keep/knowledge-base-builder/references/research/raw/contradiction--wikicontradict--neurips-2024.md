# WikiContradict: models do not surface contradictions on their own

- **Title:** WikiContradict: A Benchmark for Evaluating LLMs on Real-World Knowledge
  Conflicts from Wikipedia
- **URL:** https://proceedings.neurips.cc/paper_files/paper/2024/file/c63819755591ea972f8570beffca6b1b-Paper-Datasets_and_Benchmarks_Track.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (peer reviewed, NeurIPS 2024 Datasets and Benchmarks track)

## How the benchmark was built

253 human-annotated instances drawn from Wikipedia articles that editors had themselves
tagged as inconsistent. Roughly 1,200 articles carrying "inconsistent", "self-contradictory",
or "contradict-other" tags were collected, then passed through passage extraction,
contradiction classification, and question generation, and validated down to 253 high
quality instances.

The annotation records four dimensions: semantic type (date, number, location and similar),
modality (prose versus tables and infoboxes), origin (same article or different articles),
and reasoning type (explicit contradiction versus implicit, where inference is needed to see
the conflict).

## What is tested

Not "does the model pick the right answer". The question is whether a model, given two
retrieved passages from the same trusted source that contradict each other, will produce an
answer that reflects the conflict at all. Quoted framing: whether models can "provide a
complete perspective on conflicts from the retrieved documents."

Five prompt templates were used, including one that explicitly instructs the model to attend
to conflicts.

## Results

Quoted: "When provided with two passages containing contradictory facts, all models struggle
to generate answers that accurately reflect the conflicting nature of the context."

Correct-response rates under prompt template 5, the one that explicitly instructs the model
to consider contradictions:

| Model | Correct |
|---|---|
| Llama-3-70b-instruct | 43.8 percent |
| Mistral-7b-instruct | 20.8 percent |
| GPT-4 | 10.4 percent |

Llama-3-70b-instruct rose from 10.4 percent to 43.8 percent once the prompt explicitly told
it to look for contradictions, and that gain landed mostly on the explicit cases.

Every model except Flan-ul2 scored higher on explicit contradictions than on implicit ones,
where the conflict has to be inferred.

Human evaluation covered 1,200 samples across 5 models, with inter-annotator agreement
between Cohen kappa 0.58 and 0.88 depending on the prompt variant.

## Why this is the load-bearing citation for a contradiction register

It establishes three things directly.

1. A model handed conflicting source material will usually produce a confident single
   answer rather than flagging the conflict.
2. Telling it to look for conflicts helps a lot, which means detection has to be an explicit
   named step, not a hoped-for side effect.
3. Even when told, the best measured rate here was under 50 percent, so detection cannot be
   left to the model that is also writing the document. It needs a separate pass and a
   human resolution gate.
