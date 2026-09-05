# The disruptive effect of knowledge conflict on large language models

- **Title:** What Is Seen Cannot Be Unseen: The Disruptive Effect of Knowledge Conflict on
  Large Language Models (also circulated as "Task Matters: Knowledge Requirements Shape LLM
  Responses to Context-Memory Conflict")
- **URL:** https://arxiv.org/html/2506.06485v1
- **Fetched:** 2026-08-17
- **Source type:** academic (arXiv preprint, not confirmed peer reviewed at fetch time)

## Definition used

Knowledge conflict here is context-memory conflict: supplied context diverges from the
model's parametric beliefs.

## Setup

Three evidence conditions:

- **NC**, no contradiction: context agrees with parametric knowledge.
- **HPC**, high plausibility contradiction: conflicting but realistic.
- **LPC**, low plausibility contradiction: conflicting and implausible.

Five task families were tested (knowledge-free, contextual knowledge, parametric knowledge,
parametric-contextual, and retrieval-augmented) across Mistral-7B, OLMo2-7B, and Qwen2.5-7B.

## Findings

1. **Accuracy falls under conflict.** On contextual knowledge tasks, Mistral-7B scored 65.3
   percent under NC against 43.5 percent under LPC, a drop of 21.8 percentage points.
2. **Consistent ordering NC then HPC then LPC.** Performance degrades as the contradiction
   becomes less plausible. The paper's reading: the model first follows contextual knowledge
   that matches its parametric knowledge.
3. **Instructions do not fix it.** The same ordering held on parametric-knowledge tasks even
   when the model was explicitly told to ignore its internal knowledge.
4. **Plausibility bias in RAG.** With conflicting passages presented at once, accuracy was at
   least 10 percent higher on NC-plus-HPC pairs than on NC-plus-LPC pairs.
5. **Evaluation is harder under conflict.** Human-model agreement reached kappa 0.79 against
   kappa 0.90 between the human annotators themselves.

## Caveats

Preprint. Models tested are all in the 7B class, so the absolute numbers should not be
carried over to frontier models. The direction of the effect is the durable part.

## Consequence for a knowledge pack

A pack that contains an unresolved contradiction does not merely fail to answer the
contradicted question. It degrades performance on the surrounding task, and the model does
not signal that it is degraded. That is the argument for resolving conflicts before the pack
ships rather than annotating them and moving on.
