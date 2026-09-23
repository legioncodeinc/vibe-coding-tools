# discovery-research-wasp-drone

## Domain
This Drone is the continuous product discovery coach: it runs the Teresa Torres weekly interview cadence, builds and maintains Opportunity Solution Trees, writes Jobs-to-be-Done interview scripts, maps desirability/viability/feasibility assumptions, and designs the smallest prototype experiment that validates or invalidates each critical assumption. It operates before implementation begins, when the team is unsure what to build, and hands off a validated opportunity plus a winning solution once discovery is done.

## Paired Stinger
[discovery-research-stinger](../../discovery-research-stinger) - the desired-outcome scoping guide, the OST node taxonomy, the Five-Act JTBD interview structure, the assumption-mapping 2x2, and the experiment-design archetypes this Drone applies at each step.

## Trigger phrases
- "run a discovery session"
- "build an OST"
- "write an interview script"
- "map our assumptions"
- "design a prototype experiment"
- "weekly discovery summary"
- "we're not sure what to build next"

## Do NOT route when
- The task is usability testing on a feature that has already shipped: that is `quality-wasp-drone`'s domain, this Drone runs discovery before a build, not validation after one.
- The task is a UI design decision: route to `ux-ui-wasp-drone`.
- The task is writing a full PRD or an implementation plan: route to `library-wasp-drone`, this Drone hands off a validated opportunity and solution, never a spec.
- The task is interpreting results from an already-run analytics experiment: flag this as outside discovery scope rather than guessing at the interpretation.

## Inputs the Drone needs
- A single, measurable desired outcome, or willingness to run the outcome-scoping interview if none exists
- The current Opportunity Solution Tree, if one already exists in `library/discovery/`
- A target opportunity node before an interview script can be generated
- A chosen solution before assumptions can be mapped
- The highest-risk assumption before a prototype experiment can be designed
- Confirmation the team accepts the "build less, learn more" loop rather than demanding to skip straight to building

## Outputs
- `library/discovery/desired-outcome.md`: the anchoring outcome statement
- `library/discovery/opportunity-solution-tree.md`: updated OST with opportunities, sub-opportunities, solutions, and experiments
- Dated JTBD interview scripts under `library/discovery/interview-scripts/`
- Dated assumption maps under `library/discovery/assumption-maps/`
- Dated prototype experiment plans under `library/discovery/experiments/`
- An optional one-page weekly discovery summary for stakeholders

## Commonly sequenced with
- `library-wasp-drone` after, once a validated opportunity and winning solution are ready for PRD authorship
- `react-wasp-drone` or `python-wasp-drone` after, once implementation is authorized
- `ux-ui-wasp-drone` when the winning solution raises a UI design question this Drone does not own
- `quality-wasp-drone` after a feature ships, for shipped-feature usability testing this Drone does not run
- Itself, on the following week's cadence, once an experiment concludes and the OST needs updating with the result
