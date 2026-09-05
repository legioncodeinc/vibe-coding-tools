# Ultimate Guide to UTM Naming Conventions and Best Practices (Improvado)

- **Title:** Ultimate Guide to UTM Naming Conventions and Best Practices
- **URL:** https://improvado.io/blog/utm-naming-conventions
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (Improvado, a marketing data platform)

## Extracted content

**The five parameters**

| Parameter | Meaning |
|---|---|
| `utm_source` | "Identifies the origin of your traffic, such as a search engine (google), social platform (facebook, linkedin)" |
| `utm_medium` | "Defines the type of channel or marketing medium. Typical values include cpc, organic, email, social, display, or referral" |
| `utm_campaign` | The specific initiative or promotion |
| `utm_term` | Paid search keywords, optional |
| `utm_content` | Creative variation within a campaign, optional |

**Formatting rules**

- "Always use lowercase for all UTM values" to prevent duplicates.
- "Use hyphens to separate words, not underscores or spaces."
- Example given: `utm_campaign=summer-sale`, not `summer_sale` and not `summer sale`.
- Values should be "descriptive, clear, and concise". Recommended shape:
  `2026-q3-product-launch` rather than a vague code.

**Why consistency matters.** The article states that "roughly 30% of large organizations
invest significant marketing budgets without having a reliable way to track campaign
effectiveness", and attributes the failure modes to data fragmentation, duplicate entries
when parameter case varies, inaccurate ROI measurement, and broken cross-channel analysis.

**Three naming models**

1. Cryptic: encrypted identifiers, security focused, suits large enterprises.
2. Positional: fixed sequential order with delimiters, simple but rigid.
3. Key-value: paired attributes such as `src:google_med:cpc`, described as the most
   scalable and flexible.

**Governance practices recommended**

- A centralized builder with standardized dropdowns.
- Shared documentation of approved values.
- A running campaign log to prevent duplication.
- Review and approval before launch.
- Regular audits for inconsistencies.

## Claims this source supports

1. Casing inconsistency creates duplicate segments. This is the same failure mode as
   GoHighLevel's case-sensitive tags, arriving from a different direction, which makes the
   lowercase-and-hyphen convention a cross-tool default worth adopting.
2. A campaign identifier should encode period and subject, for example
   `2026-q3-product-launch`, so it stays sortable and legible a year later.
3. A shared registry of approved values, and an audit against it, is the standard control.
   For a daily drip skill the registry is the previous run's tag, read back rather than
   re-derived.
4. Positional naming is rigid and key-value naming scales. For a CRM tag, positional is
   still the practical shape because a tag is one string, so the convention has to be
   pinned once.
