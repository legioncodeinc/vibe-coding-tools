# ICANN Expired Registration Recovery Policy (consensus policy text)

- **Title:** Expired Registration Recovery Policy
- **URL:** https://www.icann.org/en/contracted-parties/consensus-policies/expired-registration-recovery-policy/expired-registration-recovery-policy-21-02-2024-en
- **Fetch date:** 2026-08-17
- **Source type:** official-docs (ICANN consensus policy, binding on accredited registrars for gTLDs)
- **Publication date:** page dated 2024-02-21

## Required expiration notices

Registrars must send at least two notices before expiration: one "approximately one month
prior to expiration" and one "approximately one week prior to expiration". The policy notes
clarify that 26 to 35 days and 4 to 10 days prior to expiration are compliant.

Within five days after expiration, the registrar must send at least one further expiration
notice with renewal instructions.

## DNS interruption requirement

The policy requires interruption, not a grace period. For a registration deleted within
eight days of expiration, "the existing DNS resolution path specified by the RAE must be
interrupted" from expiration until deletion. For a later deletion, the interruption must
cover at least the last eight consecutive days before deletion.

Registrars may point interrupted traffic at an expiration notice page carrying renewal
instructions.

## Redemption Grace Period

"30 days immediately following the deletion of a registration, during which time the deleted
registration may be restored."

## Fees

Registrars must make redemption and restore fees "reasonably available". The policy does not
set an amount.

## What the policy does not set

A minimum post-expiration renewal grace period. That length is a registrar business
practice, not an ICANN requirement.

## Notes for the sentinel

Three consequences for the domain and SSL class:

1. The user's registrar is required to email them roughly 30 days out and roughly 7 days
   out. Those two notices are exactly the artifacts a snapshot sweep can find, and their
   timing is predictable enough to reason from.
2. Do not tell a user they have a guaranteed grace period after expiry. ICANN does not
   mandate one. The registrar sets it, and the DNS interruption requirement means the site
   can go dark on the expiry date itself.
3. The Redemption Grace Period runs from **deletion**, not from expiry. Those are different
   dates and conflating them produces a wrong deadline.
