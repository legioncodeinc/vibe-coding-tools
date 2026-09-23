---
ai_description: |
  Stable shared interface agreements live here as CTR-<###>-<kebab-slug>.md.
  The contract-writing-wasp-drone owns their content and revision history.
  library-wasp-drone links accepted revisions from affected PRDs.
  Draft records do not clear shared implementation work for parallel execution.
human_description: |
  Accepted engineering and product interface agreements shared by PRDs.
  Each record names the provider, consumers, exact behavior, approval, and checks.
---

# Contracts

One contract record describes one observable boundary shared by independent work. Use `CTR-<###>-<slug>.md` and the next unused number. Accepted terms stay immutable; changed terms get a new CTR number with bidirectional supersession links. Records remain here when PRDs move between lifecycle folders. PRDs pin an accepted revision under `## Contract dependencies`.

The contract-writing Drone authors and revises records. The Library Drone owns PRD links and lifecycle moves. Legal agreements belong elsewhere.
