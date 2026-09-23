# Choosing a model for a Drone

The model choice follows the work. A task that needs deep architecture reasoning, broad context, or difficult debugging should not be assigned solely by lowest cost. A narrow extraction or formatting job does not need the most expensive option by default.

The canonical [model comparison matrix](../../model-comparison-matrix.md) records the current routing rubric. The [Smoke It command](../../commands/smoke-it.md) requires a one-line model justification beside each Drone in its wave plan. Read the matrix at dispatch time because model availability, capabilities, and prices can change.

| Task signal | What matters most |
| --- | --- |
| Several interacting boundaries or ambiguous requirements | Reasoning depth and context handling |
| Bounded implementation with clear acceptance criteria | Code quality and tool use |
| Repetitive classification or formatting | Speed and cost, with sample-based verification |
| Sensitive or irreversible external action | Verification and human authority, regardless of model |

Choosing a stronger model does not grant broader permission. Each Drone still owns a bounded task, reads its Stinger, and returns evidence for independent review. When the same task is rerun after failure, change the brief or the relevant conditions rather than assuming a model swap alone resolves the cause.
