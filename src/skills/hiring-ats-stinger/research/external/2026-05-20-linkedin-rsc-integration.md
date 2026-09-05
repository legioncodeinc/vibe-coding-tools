---
source_type: docs
authority: high
relevance: high
topic: LinkedIn Recruiter System Connect ATS integration
url: https://learn.microsoft.com/en-us/linkedin/talent/recruiter-system-connect/recruiter-system-connect?view=li-lts-2026-03
fetched: 2026-05-20
---

# LinkedIn Recruiter System Connect (RSC): ATS Integration Guide (2026)

## Summary

LinkedIn's Recruiter System Connect (RSC) is the official integration protocol between LinkedIn Recruiter and compatible ATS platforms. As of March 2026, the Microsoft Learn documentation represents the canonical technical reference. RSC is not a generic webhook - it is a LinkedIn-managed partner program with specific feature tiers (RSC 1.0 and RSC+) and specific supported ATS partners. Understanding RSC's architecture is essential for guides/05.

**RSC versions (2026):**

*RSC 1.0 (baseline):*
- Candidate rediscovery: see which candidates are already in your ATS with an "In-ATS" indicator in LinkedIn Recruiter
- One-click export: push LinkedIn candidates to ATS with one click, creating a candidate record without leaving LinkedIn
- InMail history retrieval: see LinkedIn InMail activity (sent, received, response) within the ATS
- Filter for / remove past applicants in LinkedIn search

*RSC+ (extended):*
- Sync job requisition stages from ATS to LinkedIn (so stage changes in ATS update LinkedIn)
- Retrieve application evaluations (scorecard data) from ATS into LinkedIn view
- Upload and sync candidate attachments (resumes, cover letters)
- Connected Projects: link LinkedIn hiring projects to ATS job requisitions for unified applicant management across platforms

**What RSC does NOT do:**
- It does not replace sourcing tools like Gem or hireEZ; it is specifically the LinkedIn-to-ATS bridge, not a general sourcing CRM
- It does not provide full bidirectional sync - the integration is primarily LinkedIn → ATS for candidate data
- InMail send functionality depends on the ATS having configured the InMail integration separately

**Supported ATS partners (as of 2026 documentation):**
- Greenhouse, Workable, Lever, Jobvite, Jobylon, and others
- Ashby support: check directly with LinkedIn - not listed in the Microsoft Learn documentation reviewed
- Rippling Recruiting: check directly with LinkedIn - not listed in public documentation

**Unified Search and ATS-Enabled Reporting:**
- Unified Search lets recruiters search candidates across both the ATS candidate pool and LinkedIn in a single interface
- ATS-Enabled Funnel and Source reports combine ATS pipeline data with LinkedIn interaction data for attribution reporting
- Recommended Matches: auto-generated candidate recommendations based on job description text

## Key Quotations / Statistics

- "Recruiter System Connect synchronizes candidate information between LinkedIn Recruiter and your ATS, enabling a seamless workflow across both platforms" (LinkedIn Help)
- RSC+ enables: "Sync job requisition stages to LinkedIn, retrieve application evaluations, upload and sync candidate attachments" (Microsoft Learn, March 2026 view)

## Annotations for stinger-forge

- guides/05 should distinguish RSC clearly from Gem/hireEZ: RSC is the LinkedIn-specific protocol, not a general sourcing tool competitor; Gem and hireEZ work across the full open web plus LinkedIn
- The RSC 1.0 vs RSC+ distinction matters for guides/05: RSC+ features (especially Connected Projects and stage sync) require the ATS vendor to have implemented the extended integration - not all ATS platforms support RSC+ fully
- Ashby's RSC status (not confirmed in public docs) is an open question stinger-forge should flag as requiring verification with the user's ATS vendor
- The ATS-Enabled Reporting section of RSC is directly relevant to guides/03 (D&I reporting) - cross-reference: LinkedIn source attribution can be included in funnel diversity metrics if the ATS and RSC are configured correctly
- GDPR note for guides/05: InMail data synced from LinkedIn to the ATS becomes part of the candidate's data record in the ATS; this must be disclosed in the candidate privacy notice
