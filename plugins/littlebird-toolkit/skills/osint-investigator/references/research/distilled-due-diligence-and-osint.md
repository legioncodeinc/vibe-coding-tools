# Distilled: due diligence practice and OSINT verification for individual business briefs

Written from a fresh read of the 13 files in `raw/`, fetched 2026-08-17. Every claim below
ends in a bracketed citation to the raw file it came from. Nothing here is authored from
training data. Where the archive is thin or the sources disagree, that is stated rather
than smoothed.

Sweep window note: the process and regulatory sources are recent (Neotas updated May 2026,
Ballard Spahr commentary December 2025, ShadowDragon 2026 guide). The methodology sources
are deliberately older than 12 months because they are the standing reference texts of
their fields: the Admiralty scale dates to NATO AJP-2.1 and its critiques run 1968 to 2019,
the Verification Handbook is the standard journalism training text, and FCRA is statute.
Recency is not the correct quality axis for those, and substituting a fresher secondary
blog post would be a downgrade.

---

## 1. What professional practice calls this artifact

| Category | Definition | Where a person dossier sits |
|---|---|---|
| Management / Individual Due Diligence (IDD) | Investigation of key individuals and directors | This is the bucket. It is a named, standard diligence type, not an improvised activity [raw/diligence--process--neotas-dd-types-2026.md] |
| Third-party due diligence | Broader assessment across the value chain | Supplies the process skeleton and the file contents [raw/diligence--process--diligent-third-party.md] |
| Enhanced due diligence (EDD) | Deeper investigation, triggered by PEP status, high-risk jurisdiction, unclear economic rationale, or opaque beneficial ownership | Explicitly NOT what this skill does. Triggers are regulatory and the data is licensed [raw/diligence--process--neotas-dd-types-2026.md] |

**Risk-based tiering is the governing principle.** Diligence intensity varies by relationship
type because "some vendors may introduce more risk than others"; running maximum depth on
everything is a process defect rather than thoroughness
[raw/diligence--process--diligent-third-party.md]. This is the practice-side authority for
purpose binding.

**What a diligence file contains**, per the standard framework: self-reported information,
screening results, media research, **verification records comparing independent
investigation against the counterparty's own claims**, and site or local intelligence at
the enhanced tier [raw/diligence--process--diligent-third-party.md].

**The canonical red flag is a discrepancy**, phrased in the source as "discrepancies
between self-reported and independently verified information"
[raw/diligence--process--diligent-third-party.md]. This is the professional warrant for a
Reconciliation section: surfacing a gap between statement and record is an expected
diligence output, not an adversarial move.

**Documentation is part of the deliverable.** "Keep extensive records of any information or
documentation you gather. This will help prove your regulatory compliance and validate your
decisions" [raw/diligence--process--diligent-third-party.md]. Independently, from the
investor-diligence side: "Clear records of what was examined protect investors'
reputations" [raw/diligence--claims--founder-fraud-ballard-spahr.md]. Two independent
sources agree, so a coverage disclosure naming what was searched and found empty belongs in
the artifact.

---

## 2. Source grading: the two-axis model and why it must be locally defined

### The scale as published

Source reliability, A through F: A completely reliable ("consistently and over time has
provided verifiable data"), B usually reliable, C fairly reliable, D not usually reliable,
E unreliable ("potentially compromised/deceptive sources with a history of making false
claims"), F reliability cannot be judged (new or unverified, no history)
[raw/diligence--source-grading--sans-admiralty.md].

Information credibility, 1 through 6: 1 credible and verified (multiple independent trusted
sources confirm), 2 probably true (consistent with what is known, no independent
verification), 3 possibly true (requires further investigation), 4 doubtful (plausible,
unconfirmed), 5 improbable (contradicts what is known), 6 truth cannot be judged
[raw/diligence--source-grading--sans-admiralty.md].

The design rule: "Source reliability and information credibility must be evaluated
separately to avoid bias", and the named common mistake is assuming a reliable source
automatically means credible information [raw/diligence--source-grading--sans-admiralty.md].

### The critique, which is substantial and must not be ignored

| Problem | Evidence | Citation |
|---|---|---|
| The axes are not used independently | Baker et al. 1968 found 87% of ratings fall on the diagonal (A1, B2, C3) | [raw/diligence--source-grading--blockint-admiralty-critique.md] |
| The credibility axis conflates two things | It mixes consistency with prior knowledge and intrinsic plausibility; the reliability axis is unidimensional | [raw/diligence--source-grading--blockint-admiralty-critique.md] |
| Cross-axis ordering is undefined | Besombes and Revault d'Alonnes 2008: it is not defined whether B3 or C2 is more probable | [raw/diligence--source-grading--blockint-admiralty-critique.md] |
| Grade boundaries are read inconsistently | Irwin and Mandel 2019: no numeric anchor separates "completely reliable" from "usually reliable", producing miscommunication across NATO states | [raw/diligence--source-grading--blockint-admiralty-critique.md] |
| Key terms are undefined | "Authenticity", "competency", "trustworthiness" are never operationalized | [raw/diligence--source-grading--blockint-admiralty-critique.md] |
| Reliability is treated as context-free | The scale treats it as a fixed property of a source and does not separate subjective human sources from objective sensors | [raw/diligence--source-grading--blockint-admiralty-critique.md] |

### Conflict, stated and resolved

The SANS source presents the scale as directly usable; the Blockint source assembles four
decades of evidence that it is applied inconsistently and that its central independence
claim fails empirically
[raw/diligence--source-grading--sans-admiralty.md vs raw/diligence--source-grading--blockint-admiralty-critique.md].

**Preferred reading:** keep the two-axis structure, discard the published letter grades as a
shipping format. The structure is genuinely valuable because "where did this come from" and
"does it hold up" are different questions, which is the whole point of the design
[raw/diligence--source-grading--sans-admiralty.md]. The letter grades are not, because they
have no shared referent between the writer and the reader
[raw/diligence--source-grading--blockint-admiralty-critique.md]. The adaptation: define both
axes locally, in concrete terms naming the actual evidence types in play, and require each
axis to be justified in its own sentence so that diagonal collapse is visible to a reader
rather than hidden inside a compound code.

---

## 3. Corroboration: independence, not headcount

The two-source rule as stated in OSINT practice: "One source shouldn't be sufficient for
something to end up in your report", and every material finding needs "at least two
independent sources" [raw/diligence--osint-method--shadowdragon-background-check.md]. The
per-line form, quoted from trainer Justin Seitz: "Every conclusion gets a primary source, a
timestamp, and a corroborating second source"
[raw/diligence--osint-method--shadowdragon-background-check.md].

**The limit of that rule is documented and is the more important finding.** The Verification
Handbook's worked case: twelve members of a team gave consistent accounts of a past event,
and the accounts were consistent AND wrong, shaped by shared emotion and legend. The
reporter did not question the consistency and learned "almost by accident that they were
exaggerated". Documentary evidence contradicted the collective memory
[raw/diligence--corroboration--verification-handbook.md].

The handbook's two questions are the operational form: "How do you know that?" followed by
**"How else do you know that?"**, with the second encoding verification as multilayered
[raw/diligence--corroboration--verification-handbook.md]. Its three success factors name
source **variety** explicitly, alongside reliability and honesty
[raw/diligence--corroboration--verification-handbook.md]. And authoritative sources get
questioned hardest, illustrated by a governor announcing twelve miners rescued when one had
survived [raw/diligence--corroboration--verification-handbook.md].

**Synthesis for a person dossier.** Counting sources is the wrong test. A subject's LinkedIn
headline, conference bio, email signature, and spoken self-introduction all originate from
the subject, so four agreeing artifacts constitute one source
[raw/diligence--corroboration--verification-handbook.md]. Corroboration requires a second
ORIGIN, not a second surface. The stated core principle: "Our job is not to parrot sources
and the material they provide, but to challenge them, triangulate what they provide with
other credible sources and verify what is true"
[raw/diligence--corroboration--verification-handbook.md].

---

## 4. Identity resolution: the step that precedes everything

**The problem.** "A search for 'David Smith' in London will return thousands of results, each
representing a different life" [raw/diligence--identity-resolution--usersearch-people-search.md].

**The cost of failure.** "Investigating the wrong 'Sarah Jones' can lead to disastrous legal
consequences, wasted resources, or harassment of an innocent party"
[raw/diligence--identity-resolution--usersearch-people-search.md].

**Identifier strength tiering:**

| Tier | Identifiers | Citation |
|---|---|---|
| Strong, effectively unique | Email address ("there is only one john.doe@example.com"), date of birth, phone number | [raw/diligence--identity-resolution--usersearch-people-search.md] |
| Medium, filtering | Middle name or initial (cited as reducing the search pool by 95%), professional credentials, historical addresses | [raw/diligence--identity-resolution--usersearch-people-search.md] |
| Weak, non-unique | Full name alone, approximate age, generic location | [raw/diligence--identity-resolution--usersearch-people-search.md] |

**The triad standard:** "This correlation (Name + DOB + Email Handle) is a strong 'triad' of
verification" [raw/diligence--identity-resolution--usersearch-people-search.md]. The stated
goal is "not just to find an address, but to confirm it is the right address for the right
person" [raw/diligence--identity-resolution--usersearch-people-search.md].

**Baseline first.** Gather "any and all identifiers that you know about the subject" before
searching, because that is what minimizes false positives when pivoting across platforms
[raw/diligence--osint-method--shadowdragon-background-check.md].

**Three named error modes:**

1. **Name collision.** "Records can be misattributed to your subject, there are plenty of
   identical-name collisions, and people-search sites commonly produce false flags"
   [raw/diligence--osint-method--shadowdragon-background-check.md].
2. **Stale data.** "Some platforms show stale, cached data. Others run in near real-time.
   Timestamp your findings when you find them"
   [raw/diligence--osint-method--shadowdragon-background-check.md].
3. **Impersonation and synthetic identity.** "A real person has a messy, interconnected trail
   of old addresses and family members. A synthetic identity usually pops into existence
   yesterday" [raw/diligence--identity-resolution--usersearch-people-search.md]. Privacy
   masking is a related but distinct case: subjects using privacy tools may present
   superficial profiles that obscure rather than reveal
   [raw/diligence--osint-method--shadowdragon-background-check.md], so thinness is
   ambiguous between deliberate privacy and recent fabrication.

**Gap in the archive.** Both identity-resolution sources are vendor blogs from people-search
tooling companies with a commercial interest in presenting resolution as tractable
[raw/diligence--identity-resolution--usersearch-people-search.md,
raw/diligence--osint-method--shadowdragon-background-check.md]. The archive contains no
academic treatment of record-linkage error rates and no published false-positive statistics.
The identifier tiering is intuitive and internally consistent but is not empirically
validated by anything in this archive. Treat it as a sound heuristic ordering, not as
measured discriminative power.

---

## 5. Claim taxonomy: what people inflate, and how it is checked

The regulator's taxonomy of misrepresented credentials
[raw/diligence--claims--sec-false-credentials.md]:

| Claim type | Pattern |
|---|---|
| Educational | Fabricated degrees or attendance (cited: claimed Harvard and Nyack College degrees while never enrolled) |
| Honors | Nonexistent awards, such as a fictitious "Top 25 Rising Business Star" attributed to a major publication |
| Professional titles | Certifications such as Certified Financial Planner claimed without being held |
| Experience | Overstated years in an industry, past investment success, or trading record |
| Media | Television appearances, social media, and press materials used to manufacture legitimacy |

Standing guidance: "Independently verify claims with reliable sources", and be
"particularly skeptical if you do not receive direct and specific answers"
[raw/diligence--claims--sec-false-credentials.md].

The founder-side patterns run parallel: "inflated metrics or customer data",
"misrepresentations to lenders or acquirers", and "hidden weaknesses in financial or
operational systems", with the cited case fabricating millions of customer records in a
$175 million fraud [raw/diligence--claims--founder-fraud-ballard-spahr.md].

Four red flags, all of which are **claim shapes rather than person judgments**: suspicious
metrics ("explosive customer growth, unheard-of conversion rates, or suspiciously high
revenue per user"); resistance to transparency ("founders who resist sharing raw data - or
who provide overly polished reports - may be managing perception"); weak controls; and
conviction resting on personality rather than data
[raw/diligence--claims--founder-fraud-ballard-spahr.md]. The expected posture is "a baseline
of skepticism, especially in transactions involving rapid growth, unconventional business
models or unusually charismatic founders"
[raw/diligence--claims--founder-fraud-ballard-spahr.md].

Verification method: probe source data, requesting "logs, bank statements, and operational
records, not just slide decks" [raw/diligence--claims--founder-fraud-ballard-spahr.md]. Note
that this is a request made TO the counterparty, which is why unresolved claims convert into
questions to ask rather than into findings.

**Implication for the media claim type.** Because press placement is itself a named
legitimacy-manufacturing technique [raw/diligence--claims--sec-false-credentials.md], press
coverage is reported as coverage and checked for whether the outlet is independent or the
piece is placed. An appearance is not corroboration.

---

## 6. Legal and ethical boundaries

### FCRA: what it covers and what it does not

A consumer report is a communication by a consumer reporting agency "bearing on a consumer's
credit worthiness, credit standing, credit capacity, character, general reputation, personal
characteristics, or mode of living", used as a factor in eligibility for "employment,
credit, insurance, housing, or other purposes"
[raw/diligence--legal--ftc-fcra-screening.md]. A firm meets the CRA definition "regardless of
how they self-identify" [raw/diligence--legal--ftc-fcra-screening.md].

The CFPB uses the word "dossier" directly and hangs coverage on a third party that
"assembled" or "evaluated" consumer information **specifically to furnish reports to
employers** [raw/diligence--legal--cfpb-circular-2024-06.md]. "Employment purposes" means
evaluating a consumer "for employment, promotion, reassignment or retention as an employee",
covering both initial and ongoing employment decisions
[raw/diligence--legal--cfpb-circular-2024-06.md]. The circular reaches software providers and
algorithmic scoring, and holds that the transactions-or-experiences exception does not cover
reports containing information beyond the report-maker's own dealings with the consumer
[raw/diligence--legal--cfpb-circular-2024-06.md].

The vendor position: non-FCRA checks cover "due diligence in business transactions, fraud
investigations and regulatory compliance, business-to-business lending and credit
extensions, third-party/vendor screening and monitoring", and "any check that is solely on a
business is a non-FCRA background check"
[raw/diligence--legal--fcra-vs-nonfcra-businessscreen.md]. Named misuse risks include
misclassification liability specifically for **independent contractor vetting**
[raw/diligence--legal--fcra-vs-nonfcra-businessscreen.md].

**Conflict, stated and resolved.** The vendor asserts a clean business-vetting carve-out
[raw/diligence--legal--fcra-vs-nonfcra-businessscreen.md]. Neither regulator source publishes
an affirmative business-diligence exemption; both define coverage by purpose plus
third-party furnishing [raw/diligence--legal--ftc-fcra-screening.md,
raw/diligence--legal--cfpb-circular-2024-06.md]. The vendor has a commercial interest in a
tidy binary. **Preferred reading:** the direction is right, the carve-out is not a safe
harbor. A user assembling a brief about a counterparty for their own reading is not thereby
a CRA under either regulator's definition. The same artifact about a job candidate, or one
handed to an employer, is inside the employment-purpose trigger
[raw/diligence--legal--cfpb-circular-2024-06.md]. The contractor case is the live edge and
the vendor itself flags it [raw/diligence--legal--fcra-vs-nonfcra-businessscreen.md]. This is
why the purpose gate must be explicit and must refuse employment screening rather than
quietly serve it. **Not legal advice, and the archive contains no case law.**

### GDPR: the three-part test as a scope discipline

Purpose test: a genuine, specific, lawful interest, where "vague justifications like
'improving our services' or 'business development' will not hold up"; commercial purposes
qualify after the October 2024 CJEU ruling
[raw/diligence--legal--gdpr-legitimate-interest.md]. Necessity test: "necessary" does not
mean "useful" or "more efficient", and less intrusive alternatives must be considered and
rejected first [raw/diligence--legal--gdpr-legitimate-interest.md]. Balancing test: weigh
against the individual's rights, accounting for "the nature of the personal data" and "the
potential consequences of the processing"
[raw/diligence--legal--gdpr-legitimate-interest.md].

Data minimisation rides on the necessity limb, with the worked example that processing ten
years of data where two suffice "fails the necessity test"
[raw/diligence--legal--gdpr-legitimate-interest.md].

Special category data is out of scope entirely: "Sensitive data categories are also outside
the scope", covering health, racial or ethnic origin, political opinions, and biometric
data, which require explicit consent or an Article 9 exception that legitimate interest
cannot substitute for [raw/diligence--legal--gdpr-legitimate-interest.md].

**This is the direct authority against a "find everything" mode.** Breadth that is merely
useful rather than necessary to the stated purpose fails the necessity limb
[raw/diligence--legal--gdpr-legitimate-interest.md].

### Conduct boundaries

Prohibited regardless of medium: "Pretending to be someone else (pretexting), hacking
accounts, or discriminating against a subject on a protected characteristic is against the
law, regardless of whether you do it in person or online"
[raw/diligence--osint-method--shadowdragon-background-check.md]. And the scope warning:
"Collecting information outside of your defined scope/lawful basis is the fastest way to
open yourself up to legal liability"
[raw/diligence--osint-method--shadowdragon-background-check.md].

### Where standard OSINT practice is deliberately NOT followed

The ten-step OSINT workflow includes court and sanctions records (step 4) and breach-dump
cross-referencing (step 7) [raw/diligence--osint-method--shadowdragon-background-check.md].
EDD adds source-of-wealth investigation and PEP screening
[raw/diligence--process--neotas-dd-types-2026.md]. Identity resolution practice adds family
mapping, address-history chaining, and cohabitant mapping
[raw/diligence--identity-resolution--usersearch-people-search.md].

All of these are excluded from a business-relationship brief. Court records are legal
history, source of wealth is financial detail, family and cohabitant mapping is family
circumstance, and address chaining is precise home location. Each falls in a category the
FCRA definition itself gestures at when it names "character, general reputation, personal
characteristics, or mode of living" as the sensitive zone
[raw/diligence--legal--ftc-fcra-screening.md], and the special-category exclusion covers the
protected-characteristic subset absolutely
[raw/diligence--legal--gdpr-legitimate-interest.md]. Breach data is compromised credential
material with no business-brief use. Sanctions and PEP screening is a regulated function
requiring licensed data and belongs with a real EDD provider
[raw/diligence--process--neotas-dd-types-2026.md].

---

## 7. Named gaps in this archive

1. **No case law.** Every legal point rests on regulator guidance and vendor interpretation.
   The FCRA business-vetting boundary is described, never adjudicated, in these 13 files
   [raw/diligence--legal--ftc-fcra-screening.md,
   raw/diligence--legal--cfpb-circular-2024-06.md,
   raw/diligence--legal--fcra-vs-nonfcra-businessscreen.md].
2. **No empirical identity-resolution error rates.** Both sources are commercially interested
   vendor blogs and neither publishes false-positive measurements
   [raw/diligence--identity-resolution--usersearch-people-search.md,
   raw/diligence--osint-method--shadowdragon-background-check.md].
3. **US and EU only.** The archive covers FCRA, GDPR, and passing mentions of CCPA, GLBA, UK
   Money Laundering Regulations 2017, and the FCA guide
   [raw/diligence--osint-method--shadowdragon-background-check.md,
   raw/diligence--process--neotas-dd-types-2026.md]. No coverage of other jurisdictions.
4. **The Admiralty critique is secondary.** The 1968, 2008, and 2019 findings are read
   through one practitioner summary, not from the papers
   [raw/diligence--source-grading--blockint-admiralty-critique.md]. The 87% diagonal figure
   is credible and directionally decisive but is single-sourced in this archive, which by
   this archive's own corroboration standard makes it a claim rather than a fact
   [raw/diligence--corroboration--verification-handbook.md].
5. **Nothing on the subject's perspective.** No source in the archive addresses notice to the
   subject, subject access requests against a privately held dossier, or retention limits
   for one. The GDPR source covers the controller's assessment duty only
   [raw/diligence--legal--gdpr-legitimate-interest.md].
