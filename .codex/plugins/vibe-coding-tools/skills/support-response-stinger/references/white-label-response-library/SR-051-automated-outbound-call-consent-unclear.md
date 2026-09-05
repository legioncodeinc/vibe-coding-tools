# SR-051: Consent for automated outbound informational calls is unclear

## Use when

Use this response when a customer wants to place automated informational calls based on an existing relationship, but the documented consent path or legal authority is not established.

## Required evidence

- Business identity and applicable jurisdiction
- Caller and recipient relationship
- Proposed call purpose, automation method, and voice type
- Exact prior consent language and capture record
- Proposed timing, frequency, and opt-out handling
- Automation steps preserved in a non-calling state

## Customer-facing email

**Subject:** {ticket_id}: Consent review needed before automated informational calls

Hi {customer_first_name},

I understand you want to place automated informational calls to people with an existing relationship to the business. We have not confirmed that the prior relationship or consent record authorizes the proposed call, voice type, timing, or frequency.

Please keep the automation in a non-calling state while we review:

1. The business, applicable jurisdiction, and caller-to-recipient relationship.
2. The call purpose, automation method, and voice type.
3. The exact prior consent language, how and when it was captured, and the record that supports it.
4. The proposed timing, frequency, and opt-out handling.

Please redact unrelated customer details. Do not send passwords, verification codes, access tokens, or full customer exports.

{agency} will send this evidence to our compliance or legal authority for a decision. Until that review is complete, we will not claim that an existing relationship supplies consent or activate the calls. I will update you after that authority completes the review.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `UNRESOLVED`. This template does not provide legal advice.
- Preserve the automation in a non-calling state.
- Escalate to the agency's compliance or legal authority after the minimum evidence is complete.
- Do not infer consent from an existing relationship or place a call while authority remains unresolved.
- Readiness is `DRAFT_WITH_GAPS` until the case identity, evidence, owner, and authority are verified.
