# Termination Notice — Template

Formalizes the contract termination for cause. Can be sent concurrently with the Findings Notice or after the Demand Letter expires.

## Header

```
Re: FORMAL NOTICE OF TERMINATION FOR CAUSE — Effective {EFFECTIVE_DATE}
    Reference: {CONTRACT_REFERENCE}
```

## Body Structure

### Section I — Effective Date and Scope of Termination

- Effective date (typically the date the relationship ended in practice)
- Scope: explicitly enumerate every service line being terminated
- For ADA: original proposal + monthly recurring services (hosting, VA, social media, GSuite) + any subcontracting arrangements
- For DevPipe: MSA + Platinum Maintenance + all discrete projects + any successor agreements

### Section II — Cause for Termination

Numbered list of material breaches sufficient to support termination for cause:
- For ADA: billing for services not rendered (VA), double-billing (hosting), failure to perform contracted maintenance, failure to deliver software within timeline
- For DevPipe: defective product, web shell, hardcoded credentials, public S3 ACLs, billing fraud, failure to apply security patches

### Section III — Effect of Termination

Effective {EFFECTIVE_DATE}:
1. All authorizations to charge client payment methods are revoked
2. All authorizations to access client systems are revoked
3. Defendant directed to immediately remove all personnel admin access
4. Client materials must be returned or destroyed (with written certification) within 30 days
5. For DevPipe only: complete git repository must be transferred unaltered

### Section IV — Notice-Period Provisions Are Inapplicable (ADA only)

ADA's TOS contains a 30-day-notice requirement for subscription cancellation. This provision is INAPPLICABLE to termination for cause based on material breach. Explicitly preempt this defense.

### Section V — Continuing Obligations

Notwithstanding termination:
- Confidentiality
- Record preservation (litigation hold)
- Return/destruction of client materials
- Representations, warranties, indemnification under the original agreement
- For DevPipe only: data protection under applicable state law (Maryland, Ohio)

### Section VI — Effect on Damages Claims

Termination is WITHOUT PREJUDICE to any damages claims. Claims are preserved.

## Signature + Reservation of Rights

Same as demand letter.

## Source-Code Custody (DevPipe Termination Notice — IMPORTANT)

The DevPipe Termination Notice should include Section IV specifically on source-code custody:
- Source code is work-for-hire under the MSA
- Complete git repository must be transferred without alteration
- Client has preserved a zipped copy as of termination date
- Any subsequent alteration is sanctionable + spoliation
