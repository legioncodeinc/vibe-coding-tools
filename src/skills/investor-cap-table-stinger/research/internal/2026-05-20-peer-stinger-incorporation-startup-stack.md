---
source_url: .cursor/skills/incorporation-startup-stack-stinger/SKILL.md
retrieved_on: 2026-05-20
source_type: internal-peer-stinger
authority: high
relevance: medium
topic: meta
stinger: investor-cap-table-stinger
---

# Peer Stinger Cross-Reference: incorporation-startup-stack-stinger

## Summary
The incorporation-startup-stack-stinger is the upstream peer for investor-cap-table-stinger. It covers: entity-type decision (Delaware C-Corp vs LLC), formation platform selection (Stripe Atlas, Clerky, Doola, Firstbase), EIN acquisition, startup banking (Mercury, Brex, Relay), bookkeeping setup (Pilot, Bench - NOTE: Bench shut down December 27, 2024 and was reacquired, operational status must be verified), and the founder paperwork minimum including the 83(b) election (30-day hard deadline). The handoff between the two stingers is at first equity grant: incorporation-startup-stack-stinger handles everything before the cap table exists; investor-cap-table-stinger picks up from first equity grant.

## Key facts for handoff boundary
- 83(b) election: "30 calendar day hard deadline. No exceptions. IRS Form 15620 now enables electronic filing (available July 2025)."
- Bench shutdown: "Bench shut down December 27, 2024 and was reacquired. Current operational status must be verified before recommending."
- Mercury international risk: "Mercury executed mass account closures for sanctioned-country passport holders in August 2024."
- Correct formation order from peer stinger: "Entity formation → Stock purchase + vesting agreements → IP assignment (PIIA/CIIA) → 83(b) election within 30 calendar days → Banking setup → Bookkeeping setup"

## Annotations for stinger-forge
- The investor-cap-table-stinger does NOT need to cover the 83(b) election in depth - it should cross-link to incorporation-startup-stack-stinger's guides/05-founder-paperwork.md.
- The formation order from the peer stinger establishes that founder stock purchase + vesting agreements come immediately after entity formation - this is where investor-cap-table-stinger picks up.
- The Bench shutdown warning is relevant context: if a founder's bookkeeping is broken, their financial statements for the data room may be incomplete. A cross-reference in guides/07-data-room-checklist.md to verify bookkeeping provider status before preparing data room is worth including.
- The peer stinger explicitly excludes "cap-table management (Carta/Pulley), fundraising mechanics (SAFEs, priced rounds)" from its scope - confirming the clean handoff boundary.
