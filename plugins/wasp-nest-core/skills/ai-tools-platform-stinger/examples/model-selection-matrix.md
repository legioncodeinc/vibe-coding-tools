# Example: Selecting Models for a SaaS Product

This worked example shows how to choose models with requirements, arithmetic, and evaluations. It does not claim one provider is always best.

Last verified: **2026-08-14**. Prices are list prices from official provider pages and can change. The example excludes caching, batch discounts, premium processing, tool-call fees, and taxes.

## Product context

A team-productivity SaaS product has three AI workloads:

1. A chat assistant that searches workspace data and takes actions.
2. Asynchronous summaries of long PDF documents.
3. High-volume intent classification into eight routes.

## Step 1: Turn wishes into measurable requirements

| Workload | Quality bar | Latency bar | Volume assumption | Typical tokens per call |
| --- | --- | --- | --- | --- |
| Chat assistant | At least 90% task completion on 100 real support questions | p95 under 5 seconds before tool time | 500 calls/day | 3,000 input, 1,000 output |
| Document summary | Human reviewers accept at least 95 of 100 summaries | Complete within 5 minutes | 1,000 documents/day | 100,000 input, 2,000 output |
| Intent classification | At least 97% macro F1 on a labeled holdout set | p95 under 500 ms | 500,000 calls/day | 200 input, 10 output |

These numbers are examples. Replace them with measurements from the actual product.

## Step 2: Pick candidates by work shape

### Chat assistant candidates

Start with balanced agentic models and keep a frontier option for failures.

| Candidate | Why it belongs in the test | Main concern |
| --- | --- | --- |
| `gpt-5.6-terra` | OpenAI positions it as the balance of intelligence and cost, with tool use and long context | Must pass the product's tool-calling eval |
| `claude-sonnet-5` | Anthropic positions it as the speed-intelligence balance for coding and agents | Introductory pricing ends 2026-08-31 |
| `gpt-5.6-sol` | Frontier fallback for the hardest conversations | Higher price |
| `claude-opus-5` | Complex agentic coding and enterprise work | Higher price than Sonnet |

Do not choose from provider benchmarks alone. Run all candidates against the same 100 questions, tools, system prompt, and data snapshot.

### Document-summary candidates

Long input and asynchronous execution make context capacity and input price more important than interactive speed.

| Candidate | Why it belongs in the test | Main concern |
| --- | --- | --- |
| `gemini-3.6-flash` | 1M context and provider positioning for agentic and multimodal work | Validate summary faithfulness on the team's PDFs |
| `gpt-5.6-luna` | 1.05M context with low current list price | A smaller tier may miss subtle document relationships |
| `claude-sonnet-5` | 1M context and strong general production positioning | More expensive for very large daily input volume |

### Intent-classification candidates

Classification is narrow and high volume, so start at the cheapest capable tier.

| Candidate | Why it belongs in the test | Main concern |
| --- | --- | --- |
| `gpt-5.6-luna` | OpenAI's cost-sensitive high-volume tier | Must reach the measured macro-F1 target |
| `gemini-3.5-flash-lite` | Google's fastest and lowest-cost 3.5 tier | Test JSON-schema and label consistency |
| Deterministic classifier | Lowest runtime cost when the categories are stable | May struggle with ambiguous or new intents |

## Step 3: Calculate cost with a visible formula

Monthly token cost is:

```text
(monthly input tokens / 1,000,000 x input price)
+ (monthly output tokens / 1,000,000 x output price)
```

Example for 500 chat calls per day over 30 days:

```text
15,000 calls x 3,000 input tokens = 45,000,000 input tokens
15,000 calls x 1,000 output tokens = 15,000,000 output tokens
```

At the 2026-07-30 GPT-5.6 Terra price of $2 input and $12 output per million tokens:

```text
(45 x $2) + (15 x $12) = $270/month
```

At Claude Sonnet 5's introductory $2 input and $10 output price through 2026-08-31:

```text
(45 x $2) + (15 x $10) = $240/month
```

At Sonnet 5's published standard $3 input and $15 output price after the introductory period:

```text
(45 x $3) + (15 x $15) = $360/month
```

This is only model-token cost. Tool calls, retrieval, embeddings, storage, retries, caching, observability, and engineering time belong in the real budget.

## Step 4: Make a recommendation with gates

| Workload | Initial candidate | Upgrade path | Ship gate |
| --- | --- | --- | --- |
| Chat assistant | Test `gpt-5.6-terra` and `claude-sonnet-5` head to head | `gpt-5.6-sol` or `claude-opus-5` for failed hard cases | At least 90% task completion and no unsafe tool actions |
| Document summary | Test `gpt-5.6-luna` and `gemini-3.6-flash` | `claude-sonnet-5` for documents that fail faithfulness checks | At least 95% reviewer acceptance with citation accuracy measured separately |
| Intent classification | Test a deterministic baseline, then `gpt-5.6-luna` and `gemini-3.5-flash-lite` | A balanced model only for ambiguous cases | At least 97% macro F1 and p95 under 500 ms |

The recommendation is a staged router, not one model for everything. Cheap models handle routine traffic, and stronger models receive only the cases that need them.

## Step 5: Re-evaluate when reality changes

Re-run the evaluation when any of these happens:

- A provider changes a model alias, price, context limit, or retirement date.
- Production quality falls below the acceptance threshold.
- Median prompt size or output size changes by more than 25%.
- Tool failures or retries erase the expected savings.
- A new model reduces completed-task cost by at least 20% on the same evaluation set.

## Sources

- [OpenAI model catalog](https://developers.openai.com/api/docs/models)
- [OpenAI 2026-07-30 price update](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/)
- [Anthropic current model overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Google current Gemini models](https://ai.google.dev/gemini-api/docs/models)
- [Google latest model guidance](https://ai.google.dev/gemini-api/docs/latest-model)
