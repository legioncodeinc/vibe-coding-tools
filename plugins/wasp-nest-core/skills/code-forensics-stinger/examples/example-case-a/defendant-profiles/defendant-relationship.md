# Defendant Profile — The ADA ↔ DevPipe Relationship

## Origin

Robert Hartwell (ADA) originally subcontracted the Example Booking Co. build to **Initial Build Vendor** in late 2021. The Initial Build Vendor build failed or produced sub-par output by 2023.

Hartwell did NOT refund the client. Instead, he introduced the client to a former Initial Build Vendor developer, **Sameer Khan**, who had since left Initial Build Vendor and formed Offshore Build Group LLC. The client was directed to pay Offshore Build directly for a rebuild starting November 2023.

This pattern — agency takes premium contract, subcontracts to offshore vendor, the build fails, agency pivots to "the next subcontractor" without refunding the client — is the heart of every case involving these parties.

## Current relationship structure

```
                ┌──────────────────────┐
                │      THE CLIENT      │
                │ (Example Booking Co.,   │
                │  Pioneer AMS, etc.)     │
                └──────────┬───────────┘
                           │
              Pays $1,800/mo + one-time
                           │
                ┌──────────▼───────────┐
                │       ADA           │
                │  (Robert Hartwell, US)     │
                │  - Hosting           │
                │  - Virtual Asst      │  
                │  - Social Media      │
                │  - "Account Mgmt"    │
                └──────────────────────┘
                           
              Pays $4-6k/mo + one-time
                           │
                ┌──────────▼───────────┐
                │   DEVPIPE / OFFSHORE BUILD  │
                │  (Sameer Khan,    │
                │   Pakistan-operated, │
                │   US-registered)     │
                │  - Software build    │
                │  - Maintenance       │
                │  - Bug fixes         │
                └──────────────────────┘
```

The KEY insight: the client pays TWO vendors simultaneously, but ADA has NO ongoing operational role in the software side. ADA continues to bill for marketing/hosting/VA while Offshore Build handles software. The two are nominally independent commercial relationships from the client's perspective, but they were ORIGINATED by Robert Hartwell's referral.

## Why this matters legally

The legal posture depends on whether you view ADA and DevPipe as separate or as joint actors:

### Separate-party theory (easier to plead)
- ADA is liable for the agency-services side (hosting double-bill, VA non-delivery, marketing non-performance, maintenance negligence on the WordPress site)
- DevPipe is liable for the software side (defective product, maintenance fraud, failure to apply security patches)
- Each party is sued under its own contract, with its own damages

### Joint-and-several theory (harder to plead, larger damages)
- ADA and DevPipe are co-conspirators in a scheme to extract money from the client
- ADA pretends to be a US agency while knowingly using offshore labor at premium rates
- Offshore Build knowingly accepts work that ADA misrepresented as US-quality
- The "subcontract pivot" pattern across multiple clients (if proven) is a fraudulent scheme

The separate-party theory is the safer pleading. The joint-and-several theory has higher damages potential but requires showing knowing collaboration. For an initial Demand Letter, plead separately and reserve the right to pursue joint claims.

## The referral mechanism

How does ADA keep getting paid for marketing/hosting/VA when Offshore Build is handling the actual product?

1. **Client inertia.** The client signed up with ADA originally. ADA has the credit-card-on-file authorization. Monthly auto-charges continue.
2. **Bundling rationalization.** ADA frames the recurring fees as "we keep your marketing alive while Offshore Build builds." This sounds reasonable in isolation.
3. **Lack of clear delineation.** The client may not know which vendor is responsible for what. A bug in the application could plausibly be Offshore Build's, but a slow page load could plausibly be ADA's (hosting). The ambiguity benefits both vendors.
4. **The Account Manager layer.** Helen Brooks at ADA sends quarterly Account Reports, calls the client, sets up meetings. This creates the appearance of an active vendor relationship even when no engineering work is happening.

## Communications between ADA and DevPipe (subpoena targets)

In litigation, the email/Slack archives BETWEEN Robert Hartwell and Sameer Khan are gold:
- Did Hartwell tell Offshore Build that the client was paying premium rates?
- Did Hartwell take a referral fee from Offshore Build for directing the client?
- Did Hartwell and Offshore Build discuss the client's complaints about maintenance fees?
- Did Hartwell tell Offshore Build about the original Initial Build Vendor failure?

Request these in discovery. They likely exist on Slack, WhatsApp, or email between the two.

## How the relationship was disclosed (or not) to the client

The client (Sarah Bennett in Example Booking Co.) reports:
- The original ADA proposal made NO mention of offshore subcontracting
- Initial Build Vendor was not introduced until the project was already underway
- Offshore Build was introduced as "a developer who can fix this" — not as Tom's longtime partner
- The client believed (reasonably) that ADA was a US-engineering operation

If Pioneer AMS has a similar story (offshore arrangement not disclosed at contract signing, etc.), that's deceptive trade practices under Ohio CSPA — potentially treble damages plus attorney's fees.

## How to question this relationship in discovery

Sample interrogatories:
1. Identify every project on which ADA has used Offshore Build Group LLC or DevPipe LLC as a subcontractor since January 2020.
2. Produce all contracts, MSAs, or letters of engagement between ADA and Offshore Build/DevPipe.
3. Identify all payments ADA has made to Offshore Build/DevPipe, by date and project.
4. Identify all clients to whom ADA has directed direct payment to Offshore Build/DevPipe (rather than payment through ADA).
5. Produce all internal ADA discussions of the offshore arrangement, including but not limited to Slack, Teams, email, and Helen Brooks's quarterly review notes.

## Cross-claim potential

If both ADA and DevPipe are sued, each may cross-claim against the other:
- ADA may argue Offshore Build's defective work is the source of all damages and seek indemnification
- DevPipe may argue ADA misrepresented the engagement scope and demand payment for the work performed

This cross-claim dynamic is leverage for the client: both vendors have reason to settle separately rather than fight a unified defense. Settle with whichever is more collectible first (typically ADA, since it's in-jurisdiction and has US assets), then negotiate from the ADA settlement against DevPipe.
