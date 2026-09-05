# California AI Transparency Act — SB 942 as amended by AB 853

- URL: https://aicomplianceatlas.com/law/california-sb-942 and https://calmatters.digitaldemocracy.org/bills/ca_202520260ab853
- Fetched: 2026-08-17
- Source type: legal

> Accessibility note: `leginfo.legislature.ca.gov` (the official California bill text site) is
> **disallowed by robots.txt** and could not be fetched. Section numbers and dates below come
> from compliance trackers and CalMatters Digital Democracy. Verify verbatim statutory text
> against leginfo directly before relying on it legally.

## Instruments

- **SB 942 (2024)** — California AI Transparency Act. Codified at **Business and Professions
  Code Chapter 25, Sections 22757 et seq.**
- **AB 853 (2025)** — amending act. **Chaptered 13 October 2025, Chapter 674, Statutes of 2025.**
  Delayed SB 942's operative date and added new categories of duty-holder.

## Effective dates — phased

| Date | Who | What |
|---|---|---|
| ~~1 January 2026~~ | covered providers | Original SB 942 operative date — **superseded/delayed by AB 853** |
| **2 August 2026** | **Covered providers (GenAI developers)** | **IN FORCE as of this research date** — detection tool, manifest + latent disclosure |
| **1 January 2027** | Large online platforms | Detect, surface, and not strip provenance data |
| **1 January 2027** | GenAI system hosting platforms | May not knowingly host non-compliant GenAI systems |
| **1 January 2028** | Capture device manufacturers | Latent disclosure option in cameras/phones |

Notable coincidence: **2 August 2026** is the same day EU AI Act Article 50 became applicable.

## Covered provider

"An entity that creates, codes, or otherwise produces a generative AI system" that:

1. has **over 1,000,000 monthly visitors or users**, AND
2. is publicly accessible within California.

(Pending **SB 1000** would remove the user-count threshold — **not enacted** as of this date.)

## Core obligations — in force 2 August 2026

**Free AI detection tool.** Covered providers must "maintain a free AI detection tool allowing
users to assess whether image, video, or audio content was created or altered" by their system,
and output any embedded provenance data found.

**Manifest disclosure.** Providers must offer a **visible** label option on AI-generated or
AI-altered image, video, and audio content.

**Latent disclosure.** Providers must apply **embedded provenance data** to AI-generated or
AI-altered image, video, and audio content — required "when technically feasible and
reasonable." This is the metadata/watermark-level disclosure.

## AB 853 additions

**Large online platforms — from 1 January 2027:**
- Must detect whether "provenance data that is compliant with widely adopted specifications
  adopted by an established standards-setting body" is embedded in distributed content
  (this is the hook that pulls in **C2PA**).
- Must allow users to inspect available provenance information.
- **Must not knowingly strip compliant provenance data or digital signatures from content.**
  This directly targets the current platform behaviour of stripping all metadata on upload.

**Capture device manufacturers — from 1 January 2028:**
- Must offer users the **option** to include latent disclosures in photos, video, and audio.
- Applies to devices "first produced for sale in California on or after January 1, 2028" —
  cameras, smartphones, voice recorders.
- Note this is an *option to include*, and the sources differ on whether default-on embedding
  is required; one summary states latent disclosures embedded "by default" for such devices.
  **Not fully confirmed** — check statutory text.

**GenAI system hosting platforms — from 1 January 2027:**
- May not "knowingly make available a GenAI system that does not place the required
  disclosures."

## Penalties

**$5,000 civil penalty per violation.** "Each day that a covered provider ... is in violation is
deemed a discrete violation" — exposure compounds daily.

## AB 3211 (2023–2024) — DID NOT PASS

**California Digital Content Provenance Standards** (Wicks). Would have added Chapter 41
(commencing with Section 22949.90) to Division 8 of the Business and Professions Code. It
proposed far broader mandates including provenance metadata on capture devices and watermarking
of generative output.

**Status: DIED.** Last action **31 August 2024 — "Ordered to inactive file at the request of
Senator Gonzalez."** It was never enacted. AB 3211 is frequently cited in commentary as if it
were law; **it is not**. The operative California provenance regime is SB 942 as amended by
AB 853.

## Bottom line for a photographer

- None of these laws impose any obligation on an individual photographer to add metadata to a
  real photograph.
- The duty-holders are large GenAI developers, hosting platforms, large online platforms, and
  (from 2028) device manufacturers.
- The relevant practical consequence is the **2027 platform anti-stripping duty**: large online
  platforms will be required to stop destroying provenance metadata, which improves the odds
  that deliberately-written metadata survives publication.
