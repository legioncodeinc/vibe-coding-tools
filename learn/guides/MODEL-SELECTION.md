# Model Selection

Choosing a model is like choosing a vehicle. A bicycle, car, and moving truck can all travel down a road, but they have different speed, cost, and capacity. The biggest model is not automatically the best choice.

## Start with the job

Ask:

1. How difficult is the reasoning?
2. How much context must the model read?
3. Will it edit important code or only classify text?
4. How quickly must it respond?
5. What is the cost limit?
6. Does the provider and region meet policy?
7. What evidence will prove the result?

## Use a scorecard

Give each requirement a weight, score each candidate using the same evidence, and show the calculation. Keep price assumptions explicit, including input, cached input, output, batch discounts, and expected volume.

Do not mix old benchmark data with a new model name. Do not present estimated quality as measured fact. Revalidate availability and pricing at least quarterly and before a high-cost commitment.

## Two matrices

- [Canonical model comparison](../../src/model-comparison-matrix.md) covers current harness choices and pricing assumptions.
- [Worked selection example](../../src/skills/ai-tools-platform-stinger/examples/model-selection-matrix.md) shows how a fictional SaaS team turns requirements into a decision.

The canonical matrix is guidance, not a permanent winner list. Provider catalogs, prices, and access change.
