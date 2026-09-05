# People Search OSINT: The Analyst's Guide to Identity Resolution

- **URL:** https://usersearch.com/resources/intel-hub/blog/people-search-osint-guide/
- **Publisher:** UserSearch (people-search tooling vendor)
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog
- **Note on quotes:** dashes inside quoted passages normalized to spaced hyphens.

## The ambiguity problem

"A search for 'David Smith' in London will return thousands of results, each representing a different life." The stated goal of the methodology is moving from probabilistic matches to confirmed identity by triangulation.

## Identifier strength ranking

| Tier | Identifiers | Reason |
|---|---|---|
| Strongest, effectively unique | Email address, date of birth, phone number | "there is only one john.doe@example.com" |
| Medium, filtering | Middle name or initial, professional credentials, historical addresses | A middle name "reduces the search pool by 95%" |
| Weakest, non-unique | Full name alone, approximate age range, generic location | Collides freely |

## Disambiguation techniques

1. **Document trail mining.** CVs, resumes, and business filings carry full legal names beside unique identifiers.
2. **Middle name extraction.** LinkedIn URL slugs, corporate registers, and wishlists expose full names that profiles hide.
3. **Family mapping.** Obituaries and genealogy records confirm relationships and dates.
4. **Address history chaining.** "People move in predictable ways." Timeline overlap analysis establishes continuity.
5. **Spouse and cohabitant mapping** when the subject has a thin footprint.

## Confidence scoring

The article frames verification as a **triad** correlation: "This correlation (Name + DOB + Email Handle) is a strong 'triad' of verification." Additional layers named: facial matching across platforms, username-to-civil-record pivoting, and multi-source corroboration of employment and relationships.

## Synthetic identity and impersonation

"A real person has a messy, interconnected trail of old addresses and family members. A synthetic identity usually pops into existence yesterday." Depth and interconnection of history is the tell.

## The cost of getting it wrong

"Investigating the wrong 'Sarah Jones' can lead to disastrous legal consequences, wasted resources, or harassment of an innocent party."

## The overarching principle

"the goal of People Search OSINT is not just to find an address, but to confirm it is the right address for the right person."

## Relevance to a person dossier

The identifier tiering transfers directly and is what makes disambiguation a real step rather than a disclaimer. Littlebird capture supplies exactly the strong-tier selectors this source ranks highest (email addresses in threads, profile URLs on screen, phone numbers in contact records) without requiring any external people-search product. Techniques 3, 4, and 5 are rejected for this skill: family mapping, home address chaining, and cohabitant mapping are family circumstance and precise home location, both excluded categories. The synthetic-identity heuristic is retained in inverted form: for a business dossier, a footprint that begins abruptly is a confidence penalty and an open question, not an accusation.
