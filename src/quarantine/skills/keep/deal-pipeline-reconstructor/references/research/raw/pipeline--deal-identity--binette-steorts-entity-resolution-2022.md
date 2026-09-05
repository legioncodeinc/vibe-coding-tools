# (Almost) All of Entity Resolution (Binette and Steorts)

- **Title:** (Almost) All of Entity Resolution
- **Authors:** Olivier Binette, Rebecca C. Steorts
- **URL:** https://arxiv.org/abs/2008.04443 (published version: Science Advances, DOI
  10.1126/sciadv.abi8021)
- **Fetched:** 2026-08-17
- **Source type:** academic (arXiv preprint of a peer-reviewed review article)
- **Dates:** submitted August 10, 2020; last revised January 17, 2022

## Window note and access limitation

Outside the 6-month window; it is a foundational review and there is no fresher substitute.
The Science Advances published version returned HTTP 403 and was not fetched. The arXiv
abstract page was retrieved. Only the abstract is quoted below, and the abstract page
carried no explicit statement on blocking, uncertainty propagation, or downstream error
propagation, so nothing on those topics is attributed to this source.

## Extracted content, abstract quoted in full

"Whether the goal is to estimate the number of people that live in a congressional
district, to estimate the number of individuals that have died in an armed conflict, or to
disambiguate individual authors using bibliographic data, all these applications have a
common theme - integrating information from multiple sources. Before such questions can be
answered, databases must be cleaned and integrated in a systematic and accurate way,
commonly known as record linkage, de-duplication, or entity resolution. In this article, we
review motivational applications and seminal papers that have led to the growth of this
area. Specifically, we review the foundational work that began in the 1940's and 50's that
have led to modern probabilistic record linkage. We review clustering approaches to entity
resolution, semi- and fully supervised methods, and canonicalization, which are being used
throughout industry and academia in applications such as human rights, official statistics,
medicine, citation networks, among others. Finally, we discuss current research topics of
practical importance."

## Claims this source supports

1. **Merging fragments of a person or organisation across inconsistent sources is a named,
   studied problem with a name: record linkage, de-duplication, or entity resolution.** The
   deal-identity problem this skill faces is an instance of it, and should be treated with
   that discipline's vocabulary rather than improvised.
2. The field's mature methods are explicitly PROBABILISTIC, dating to the foundational work
   of the 1940s and 1950s. A match therefore carries a degree of belief, not a binary
   verdict. A skill that merges records silently is asserting certainty the underlying
   discipline does not grant.
3. CANONICALIZATION, choosing the single representative form of a resolved entity, is named
   as a distinct step from matching. That maps directly onto the board's need to pick one
   display name per deal after merging fragments under inconsistent spellings, and it
   confirms that the display name is a CHOICE that should be shown, not a fact.
4. The reviewed methods span unsupervised clustering through semi-supervised and fully
   supervised approaches. Supervision means labelled examples. A solo operator's pipeline
   supplies none at the start, so a human-confirmation loop is the only available source of
   supervision, which is a direct argument for surfacing uncertain merges to the user.
