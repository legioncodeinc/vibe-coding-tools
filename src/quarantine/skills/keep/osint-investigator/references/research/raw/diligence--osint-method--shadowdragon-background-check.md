# How to Conduct an OSINT Background Check (2026 Guide)

- **URL:** https://shadowdragon.io/resources/how-to-conduct-an-osint-background-check/
- **Publisher:** ShadowDragon (OSINT tooling vendor)
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog
- **Note on quotes:** dashes inside quoted passages normalized to spaced hyphens.

## The ten-step workflow

1. **Define scope and legal basis** before any searching.
2. **Capture known identifiers**: name, aliases, DOB, addresses, emails, phones, employers, claimed credentials.
3. **Verify identity through public records**: business registrations, property, courts.
4. **Search legal and regulatory records**: courts, sanctions, PEP lists, licensing boards.
5. **Confirm business affiliations**: OpenCorporates, Secretary of State filings, SEC documents, government contracting sites.
6. **Investigate digital traces**: quoted-name searches across engines, LinkedIn, social platforms, reverse image search.
7. **Look for breach information** to surface hidden accounts and aliases.
8. **Run adverse media checks**, prioritizing reputable outlets over anonymous posts.
9. **Cross-reference and corroborate**: verify material findings with at least two independent sources.
10. **Document and report**: timestamped screenshots with intact URLs, conclusions tied back to the original scope.

## Identity baseline

Gather "any and all identifiers that you know about the subject" before searching. This is what minimizes false positives when pivoting across platforms.

## Corroboration standard

"One source shouldn't be sufficient for something to end up in your report." Every material finding needs "at least two independent sources". A LinkedIn position gains credibility when corroborated in press releases or filings.

Quoted from Justin Seitz, OSINT trainer: "The strongest background checks are the ones an analyst can defend line by line. Every conclusion gets a primary source, a timestamp, and a corroborating second source."

## Named error modes

- **Name collisions and false positives.** "Records can be misattributed to your subject, there are plenty of identical-name collisions, and people-search sites commonly produce false flags."
- **Stale data.** "Some platforms show stale, cached data. Others run in near real-time. Timestamp your findings when you find them."
- **Privacy masking.** Subjects using privacy tools may present superficial profiles that obscure rather than reveal.

## Legal and ethical boundaries

Frameworks named: FCRA (employment screening), GDPR (EU and UK subjects), CCPA (California residents), GLBA (financial purposes).

Prohibited regardless of medium: "Pretending to be someone else (pretexting), hacking accounts, or discriminating against a subject on a protected characteristic is against the law, regardless of whether you do it in person or online."

And the scope warning: "Collecting information outside of your defined scope/lawful basis is the fastest way to open yourself up to legal liability."

## Relevance to a person dossier

Steps 1, 9, and 10 are the skeleton the skill adopts: scope first, corroborate materially, document so every line is defensible. Steps 4 and 7 are deliberately NOT adopted. Court and sanctions records are legal history, breach dumps are compromised credential data, and both sit outside a business-relationship brief under the evidence standards' sensitive-category exclusion. That divergence is a design decision, not an oversight, and the skill states it.
