# Purpose binding and scope

The first action of this skill, before any retrieval. Nothing gets assembled until the
business purpose is on the record, because the purpose determines what gets assembled.

Domain claims here trace to `research/distilled-due-diligence-and-osint.md`, sections 1, 6,
and 7.

## Why this comes first rather than last

Three independent lines of authority converge on the same rule.

**Practice.** Diligence intensity is set by risk-based tiering, because some relationships
carry more risk than others. Running maximum depth on every subject is a defect in the
process, not thoroughness (distilled section 1).

**Law.** The GDPR necessity test holds that "necessary" does not mean "useful" or "more
efficient", and that less intrusive alternatives must be considered and rejected before a
broader scope is justified. Breadth that is merely useful, rather than necessary to a stated
purpose, fails the test. The purpose test itself rejects vague framings: "business
development" is named as a justification that will not hold up (distilled section 6).

**Liability.** "Collecting information outside of your defined scope/lawful basis is the
fastest way to open yourself up to legal liability" (distilled section 6).

Together these are why there is no "just find everything" mode in this skill. A dossier with
no stated purpose has no principle for deciding what to leave out, and a dossier with no
principle for leaving things out is surveillance.

## The purpose gate

Run `AskUserQuestion` before anything else. Ask two questions in one call.

**Question 1, header "Purpose".** What is this dossier for? Options:

| Option | What it means | What it scopes toward |
|---|---|---|
| Partner diligence | Evaluating someone before a business partnership, joint venture, or equity relationship | Company affiliations, track record of stated commitments, consistency of representations over time |
| Prospect prep | Researching a potential customer or account before outreach | Role, company, observed interests and priorities, prior touchpoints, who else in the account has appeared |
| Negotiation prep | Preparing for a specific negotiation or deal conversation | Stated positions and their dates, prior commitments, what changed between conversations, unresolved asks |
| Claim verification | Checking specific things this person has asserted | The claims themselves, their exact wording and dates, and what independent evidence exists either way |

**Question 2, header "Scope".** What is the time window and depth? Options: "Everything on
record", "Last 12 months", "Last 90 days", "Since a specific date I will name".

Set `multiSelect: false` on both. A dossier with two purposes has no scope.

## The refusal cases

Stop and say why, rather than producing a narrower version.

**Employment screening.** If the stated purpose is evaluating this person for hiring,
promotion, reassignment, or retention as an employee, or if the output will be handed to an
employer for such a decision, stop. The CFPB uses the word "dossier" directly and hangs
FCRA coverage on a third party that assembled or evaluated information specifically to
furnish reports for employment purposes, covering both initial hiring and ongoing employment
decisions (distilled section 6). This skill is not a consumer reporting agency and its
output carries none of the accuracy procedures, disclosure, dispute, or adverse-action
machinery that FCRA requires. Tell the user to use a licensed screening provider.

**Independent contractor vetting.** Flag it and ask before continuing. This is the live edge
case, named as a misclassification trap by the screening-vendor source itself, and neither
the FTC nor the CFPB publishes an affirmative exemption for business vetting (distilled
section 6). Explain the ambiguity, note that the archive backing this skill contains no case
law on the boundary (distilled section 7), and let the user decide with that in front of
them.

**No business purpose.** If the answer is curiosity, a personal relationship, a dispute with
a private individual, or anything with no business relationship behind it, stop. Say the
skill produces business due diligence briefs and requires a business purpose.

**Any purpose whose real object is a protected characteristic.** Stop outright. Discriminating
against a subject on a protected characteristic is unlawful regardless of medium (distilled
section 6).

Say plainly that this is not legal advice, and that the archive behind the skill covers US
and EU frameworks only (distilled section 7).

## Excluded by construction

These categories are omitted even when the capture contains them, and even when they are
directly relevant to what the user is curious about. They are excluded by the shape of the
artifact, not by a judgment call made per item.

| Excluded | Why |
|---|---|
| Health information | Special category data. Legitimate interest cannot cover it (distilled section 6) |
| Financial detail: income, debts, assets, source of wealth | Source-of-wealth investigation is a regulated EDD function, not a business-brief item (distilled sections 1, 6) |
| Legal and criminal history, litigation, court records | Standard OSINT step 4, deliberately not adopted here. Legal history is not a business-relationship fact (distilled section 6) |
| Family circumstances, relatives, marital status, cohabitants | Family and spouse mapping are standard identity-resolution techniques, rejected here (distilled section 6) |
| Protected characteristics: race, ethnicity, religion, political opinion, sexual orientation, union membership, biometrics | Article 9 special category data, absolute exclusion (distilled section 6) |
| Precise home location, address history | Address-history chaining is a standard technique, rejected here (distilled section 6) |
| Breach-dump and compromised credential data | Standard OSINT step 7, deliberately not adopted. Compromised credential material has no business-brief use (distilled section 6) |
| Sanctions and PEP screening | A regulated function requiring licensed data. Say so and point to an EDD provider (distilled section 6) |

If the capture surfaces an excluded item while retrieval is running, drop it. Do not carry
it into working notes, do not mention it as something withheld, do not hint at it. A line
saying "health information was found but omitted" is a disclosure of health information.

The one exception, and it is narrow: a business fact does not become excluded because it
touches a category name. A company's funding round is a company fact, not the subject's
personal financial detail. A publicly filed directorship is a business affiliation, not
legal history. Judge by whether the fact is about the business relationship or about the
person's private circumstances.

## Third parties in the capture

Other people appear around the subject in screenshots, threads, and meetings. The rule is
that they are incidental: include them only where material to the stated purpose, and apply
the same evidence standards and the same exclusions to them (see
`references/evidence-standards.md`, rule 10).

Network analysis is a legitimate EDD component and the Littlebird capture genuinely supports
a narrow form of it, since it shows who appeared around the subject (distilled section 1).
The limit is the purpose. For negotiation prep, the other people on the counterparty's side
of a thread are material. For prospect prep, the other named contacts at the account are
material. A general map of everyone the subject has ever been seen near is not material to
any of the four purposes and does not get built.

## Recording the binding

The purpose and scope answers go at the top of the dossier, verbatim, before any findings.
Every section of the finished artifact has to be defensible as serving that stated purpose.
Documentation of what was examined, and why, is itself part of the diligence artifact
(distilled section 1). A reader who disagrees with a section's inclusion should be able to
see the purpose it was included under and argue with that.

## If the purpose changes mid-run

It does not change mid-run. Finish the dossier under the stated purpose, deliver it, and
start a new run under the new purpose. Retrofitting a purpose onto material already gathered
is the exact scope creep the gate exists to prevent, and it leaves no honest record of what
was searched under which justification.
