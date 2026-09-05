# Guide 05: Sourcing Tool Integrations

Source: `research/external/2026-05-20-sourcing-tools-gem-hireez.md`, `research/external/2026-05-20-linkedin-rsc-integration.md`

---

## Architecture decision first

Before recommending a sourcing tool integration, ask the user which architecture they want:

**Option A: Sourcing tool as top-of-funnel CRM** (most common)
- Sourcing tool (Gem / hireEZ) discovers and sequences passive candidates
- Candidate responds positively → one-click export to ATS creates candidate record
- ATS owns the pipeline from application forward
- Sourcing tool retains contact/sequence history as the engagement record

**Option B: ATS as the single system of record**
- All candidate data flows into the ATS immediately on first contact
- Sourcing tool is a data source only; no CRM functionality used in the sourcing tool
- Higher data discipline required in the ATS

**Option C: Sourcing tool as full ATS replacement** (Gem-specific, greenfield teams)
- Gem has positioned itself as an all-in-one ATS+CRM+sourcing+analytics platform
- Relevant only for teams without an existing ATS who want to consolidate
- For teams already on Greenhouse or Ashby, Gem is a top-of-funnel tool, not an ATS migration

---

## Gem (2026)

G2 rating: 4.8/5 (236 reviews). Dominant mid-market and enterprise sourcing CRM.

**ATS integrations:** Greenhouse, Ashby, Lever, Workable (native integrations documented). Gem ATS can also push hired candidate data to Rippling HRIS (documented path: name, email, job title, department, work location).

**Integration setup:**
1. Connect Gem to the ATS via the Gem Settings > Integrations panel. Greenhouse and Ashby use OAuth-based connections.
2. Configure the field mapping: ATS job req ID → Gem job, candidate source attribution, custom field alignment.
3. Set the "push to ATS" trigger: manual (recruiter clicks to push a candidate) vs automatic (triggered on candidate responding to outreach).
4. Configure deduplication: Gem's dedup logic needs to know which ATS field is the unique identifier (email is the standard; verify for the user's ATS).

**Critical gotchas:**
- **Deduplication:** Sourced candidates who also apply organically appear as duplicates without dedup configuration. Gem has dedup features; they require ATS-side field configuration to work correctly.
- **Source attribution:** If the field mapping is wrong, "sourced via Gem" becomes "applied organically" in the ATS — this corrupts source-of-hire reporting and D&I funnel data.
- **GDPR consent:** Sourced candidates must receive GDPR-compliant disclosure before their data is stored in the ATS. This is a configuration step (add the disclosure to Gem's outreach sequence), not automatic.

---

## hireEZ (formerly Hiretual, 2026)

G2 rating: 4.6/5 (248 reviews). AI-first platform with strong internal mobility and broader ATS integration coverage.

**ATS integrations:** Claims 50+ ATS integrations. Integration depth varies by partner — verify the specific integration's field coverage for the user's ATS before recommending.

**Differentiator over Gem:** Built-in internal mobility and employee referral features. If the team wants to source from existing employees alongside passive external candidates, hireEZ has a stronger native feature.

**Integration setup:** Similar to Gem. hireEZ uses API keys for most ATS integrations. Field mapping and dedup configuration are required.

**Critical gotchas:** Same as Gem — deduplication and GDPR consent are not automatic. Also: with 50+ claimed integrations, the depth of integration for less common ATS platforms may be limited to basic candidate profile push without full field mapping. Verify before committing.

---

## LinkedIn Recruiter (RSC Integration)

LinkedIn offers two integration tiers for ATS partners:

**RSC 1.0** (legacy): Basic applicant sync and status updates. The ATS shows LinkedIn profile data; status updates flow back to LinkedIn.

**RSC+** (enhanced): Full two-way sync including InMail history, recruiter notes, and richer field mapping. Requires LinkedIn partnership approval; not available to all ATS platforms.

**Confirmed RSC partners (as of 2026):** Greenhouse, Lever, Workable. Lever confirmed RSC 1.0. Greenhouse is a long-standing RSC partner.

**Ashby RSC status:** Not confirmed in LinkedIn's March 2026 partner documentation. Source: `research/research-summary.md` Q1. Verify directly with Ashby before recommending for teams that depend on LinkedIn Recruiter RSC.

**Pinpoint RSC status:** Not confirmed in public documentation. Verify with vendor.

**Integration setup (Greenhouse example):**
1. Enable LinkedIn Recruiter System Connect under Greenhouse Settings > Integrations.
2. Authenticate with LinkedIn Recruiter seats.
3. Configure the sync frequency and the profile data fields to push/pull.
4. Test with a single job req before enabling across all roles.

---

## Critical: Greenhouse Harvest API deprecation

> **If the user's sourcing tool integration with Greenhouse was built on Harvest API v1 or v2:** These versions are deprecated and unavailable after **August 31, 2026**. The integration WILL break on that date. Migrate to Harvest API v3. Source: `research/external/2026-05-20-greenhouse-api-updates.md`

Surface this warning whenever the user mentions Greenhouse + any integration.

---

## Output for sourcing integration requests

1. Ask which architecture (A/B/C above) and which sourcing tool(s) they are using or evaluating.
2. Confirm which ATS they are on.
3. Provide integration setup steps for the specific tool + ATS combination.
4. Flag the three critical gotchas: deduplication, GDPR consent, field mapping.
5. If Greenhouse: flag the Harvest API v3 migration deadline.
6. If LinkedIn RSC: confirm the ATS platform's RSC status before proceeding.
