# Quote formatting

The trimming rules, the bank schema, the ranking method, and the artifact shapes.

## The first rule

**Never edit a quote into something better.** Light trimming for length is acceptable and is
defined precisely below. Rewriting is fabrication, and it is also an FTC problem: endorsements
must reflect the honest opinion of the endorser and cannot convey an implied representation that
would be deceptive if the advertiser made it directly
(`research/distilled-testimonial-practice.md`, section 4). The FTC's own summary of the Reviews
Rule lists AI-generated fake reviews among the prohibited categories
(`research/distilled-testimonial-practice.md`, section 8), and a model that improves a customer's
phrasing is generating text and attributing it to a named human.

The FTC's FAQ treats a marketer's misleading alteration of a real review as the marketer's problem
and as a reportable complaint to the FTC, a consumer protection office, or the BBB
(`research/distilled-testimonial-practice.md`, section 8).

## The clarity-versus-meaning line

The organizing distinction, and the only one any source in the archive supplies: **clarity edits**
are acceptable, **meaning edits** are not. The principle as stated: edit for clarity, not for
persuasion (`research/distilled-testimonial-practice.md`, section 8).

| Clarity edits, acceptable | Meaning edits, prohibited |
|---|---|
| Removing filler words: "um", "like", "you know" | Changing the core claim or outcome |
| Tightening a rambling sentence | Upgrading an adjective, "somewhat" to "dramatically" |
| Cutting an off-topic tangent | Removing a timeframe, condition or qualifier |
| Captions matching the spoken words | Splicing separate answers to create implied causation |
| Minor reordering where meaning is unchanged | Altering numbers or results |
| | Framing a personal experience as a universal guarantee |

(`research/distilled-testimonial-practice.md`, section 8.)

Why qualifiers are load-bearing: "'It worked after we changed our process' is different than 'It
worked'". Removing the condition lets the reader fill the blank with the best possible outcome
(`research/distilled-testimonial-practice.md`, section 8). That is how a truthful trim becomes a
false impression.

## The trimming rules, stated precisely

**These are house standards, not legal requirements.** No source in the archive defines an
ellipsis convention, addresses bracketed insertions, or addresses combining quotes
(`research/distilled-testimonial-practice.md`, section 12). They are built on top of the
clarity-versus-meaning line and are labeled as house standards wherever they appear in output.

### Permitted

1. **Cut from the front.** Remove leading material up to a sentence boundary. Mark with a leading
   ellipsis only if the remaining text starts mid-sentence. If it starts at a sentence boundary, no
   mark is needed.
2. **Cut from the back.** Remove trailing material from a sentence boundary. Mark with a trailing
   ellipsis only if the text now stops mid-sentence.
3. **Cut from the middle.** Remove a complete, self-contained span and mark it with a bracketed
   ellipsis: `[...]`. Bracketed, so the reader can tell an editorial cut from the speaker's own
   trailing off.
4. **Remove disfluencies.** "um", "uh", "like" used as filler, "you know", stammered repetitions,
   false starts. No mark. This applies to transcript and voice material, not to written messages,
   where a written "like" is usually a real word.
5. **Fix a typo that is unambiguously a typo** in written material: a transposed letter, a missing
   space, an obvious autocorrect failure. Silently. Do not fix grammar, do not fix a word choice,
   do not fix a sentence fragment. People write in fragments and the fragment is theirs.
6. **Capitalize the first letter of the trimmed quote and add a terminal period** where the trim
   left it without one. No mark.

### Prohibited, absolutely

1. **No word may be added.** No bracketed clarifications, no `[the product]` substitutions, no
   `[our team]`. If the quote needs a bracket to make sense, it needs surrounding context in the
   page instead, written in the user's own voice and clearly outside the quotation marks.
2. **No word may be substituted.** Not a synonym, not a stronger verb, not a company name in place
   of a pronoun.
3. **No two spans said at different times may be joined**, even by the same person, even about the
   same subject, even with an ellipsis between them. A quote is one continuous utterance in one
   context. Two utterances are two quotes with two dates.
4. **No cut may remove a qualifier, a condition, a timeframe, or a hedge** that bears on the
   claim. "It worked, once we got our own data in order" cannot become "It worked".
5. **No cut may remove a negative or a reservation** that changes the balance of the statement. A
   quote that says "the first month was rough but the last quarter has been the best we have had"
   cannot become the second half alone.
6. **No cut may change what a number refers to.** If the number stays, its scope, unit and
   timeframe stay with it.
7. **No reordering that changes causation, sequence, or emphasis.** In practice the skill does not
   reorder at all, because the archived permission for "minor reordering" is too easy to abuse and
   too hard to audit.
8. **No translation.** A quote said in another language is banked in that language with a
   translation clearly labeled as a translation, attributed to whoever made it.

### The verbatim record

The bank always stores the **untrimmed original alongside the trimmed version**. Both. Always.
The archived practice guidance recommends archiving raw files and transcripts
(`research/distilled-testimonial-practice.md`, section 8), and here it also gives the user a way
to check any trim the skill made.

Where a quote appears in the bank as trimmed, the entry shows a character count for both and the
specific rule number above that authorized each cut. A trim with no rule number attached is a
defect.

### Length targets, and why they are targets

- **Pull quote:** roughly 8 to 20 words. One idea.
- **Standard testimonial:** roughly 25 to 60 words. A problem, a change, and a feeling or result.
- **Case study quote:** anything up to a paragraph. Length is not the constraint.

If a quote cannot reach the target under the rules above, **it does not fit that slot**. It does
not get trimmed harder. Publish it long, use it somewhere else, or use a different quote.

## The bank schema

One row per quote. These columns, in this order.

| Column | Content |
|---|---|
| `id` | Stable slug: `speaker-slug--YYYY-MM-DD--nn` |
| `quote` | The verbatim text, trimmed per the rules, in quotation marks |
| `quote_original` | The untrimmed text as captured |
| `trim_rules_applied` | The rule numbers, or `none` |
| `speaker` | Full name as they use it |
| `role` | Title, or `unverified` or `omitted`. Never a guess |
| `company` | Employer or business |
| `date_said` | The event date, not the collection date |
| `source` | Channel and platform: "Google review", "WhatsApp DM", "client QBR call" |
| `receipt` | The `evidence-standards.md` receipt string |
| `tier` | `public`, `private`, or `confidential` |
| `permission_status` | `not needed`, `courtesy pending`, `requested DATE`, `granted DATE`, `declined DATE`, `do not ask` |
| `permission_record` | Their exact words granting it, plus channel and date. Empty until granted |
| `results_claim` | `no`, or the flag from `ftc-compliance.md` |
| `material_connection` | `none observed`, or the relationship and what would need disclosing |
| `confidence` | High, Medium, Low, per `attribution-verification.md` |
| `staleness` | `current`, or `stale, said N months ago` with what may have changed |
| `objection_answered` | Which buyer objection this quote answers, if any |
| `strength` | The score from the next section |
| `notes` | Anything a human needs before using it |

## Ranking quotes by strength

The archive supports a small number of testable signals. Score each present signal at 1 point.
The bank sorts by this total. It is a sorting aid, not a truth claim.

| Signal | Basis |
|---|---|
| Contains an explicit recommendation rather than only satisfaction | For infrequently purchased items, recommendations are more persuasive than repurchase intentions. Professional services are infrequent purchases, which is an **inference** and is labeled as one wherever it drives output (`research/distilled-testimonial-practice.md`, section 9) |
| Passes the brochure test: no sentence in it could appear in the user's own marketing copy | (`research/distilled-testimonial-practice.md`, section 9) |
| Contains concrete imagery rather than abstraction | (`research/distilled-testimonial-practice.md`, section 9) |
| Uses a before-and-after phrasing rather than a bare percentage | Single unreplicated practitioner preference, recorded as such (`research/distilled-testimonial-practice.md`, section 11) |
| Names a specific objection the buyer would have had | (`research/distilled-testimonial-practice.md`, section 9) |
| Speaker's context is specific: role, company size, industry | (`research/distilled-testimonial-practice.md`, section 9) |
| Public tier, so it can be linked back to a checkable external source | Users trust external sources more than company-sponsored content (`research/distilled-testimonial-practice.md`, section 9) |

**Numbers are deliberately not a strength signal.** A case study with no metrics can work
(`research/distilled-testimonial-practice.md`, section 9), and a number is the thing that pulls a
quote into the results sub-bank with all its disclosure requirements. Numbers are recorded, not
rewarded.

**Never show this score without the quote.** A score without the words is exactly the kind of
number that gets acted on without reading, and this bank is small enough that the user can read
every row.

## The artifacts

### `testimonial-bank.md`

The persistent file. Survives runs. Structure:

1. **Header:** date built, window covered, number of queries run, the not-legal-advice line
2. **Coverage:** which sources were swept and what each returned
3. **Usable now:** public tier plus granted private tier, sorted by strength
4. **Awaiting permission:** private tier, with request status per row
5. **Results sub-bank:** every results quote regardless of tier, each with its flag, held separate
6. **Confidential, do not use:** listed with speaker and date and a one-line reason, **without the
   quote text**, so the user knows the material exists without the file carrying it
7. **Unverified:** failed one of the five attribution questions, with the resolving action
8. **Declined and revoked:** so nothing re-proposes them
9. **Gap report:** relationships with no captured praise
10. **Method:** the queries run, the window, the tools used

Section 6 carrying no quote text is deliberate. Raw capture does not ship
(`evidence-standards.md`, rule 7), and a confidential quote written into a persistent file is a
confidential quote that will eventually be pasted somewhere.

### `permission-requests-YYYY-MM-DD.md`

Drafted requests, held for approval. Every draft marked at the top:
`HELD FOR APPROVAL. NOT SENT.` One request per person, not per quote, where someone has several.

### The results sub-bank, in detail

Separate because a quote containing a specific claimed outcome is the most valuable and the most
legally loaded thing in the bank. Every row carries, in addition to the standard schema:

- The claim, isolated and stated plainly
- Which of the three flags from `ftc-compliance.md` applies
- What the user would need in order to move it up a flag
- The exact disclosure language the user would need to run alongside it, if the flag is
  NEEDS EXPECTED-RESULTS DISCLOSURE, drafted with a blank where the generally expected performance
  figure goes, **because the skill does not know that figure and must not invent it**

Never suggest that a "results not typical" disclaimer solves anything. The Guides address that
exact wording and say such disclaimers are unlikely to be effective
(`research/distilled-testimonial-practice.md`, section 5).

## Formats for where quotes end up

Only produced when the user asks. The bank is the deliverable; formatting is a follow-on.

**Landing page pull quote.** Quote, name, role, company, and a link back to the public source
where the tier permits it. Linking back is what the credibility evidence favors, since users trust
external checkable sources over company-sponsored content
(`research/distilled-testimonial-practice.md`, section 9).

**Case study.** The eight-section structure: title naming the customer and headlining the result;
narrative introduction; two or three sentence TLDR; before and after table; challenge in the
customer's own language; solution; results leading with the primary metric then quotes; future plus
a single call to action (`research/distilled-testimonial-practice.md`, section 10).

Craft rules from the same source: use the customer's actual words at roughly one quote every two
or three paragraphs; let the customer be the protagonist; set expectations upfront on timeline,
stakeholders and approval; send the draft to the customer champion before their legal or PR team
sees it. Do not write like a press release; do not tour features instead of outcomes; do not try to
cover every persona in one study; **do not invent percentages and do not skip the results section
when metrics are unavailable** (`research/distilled-testimonial-practice.md`, section 10).

That last rule is the one a language model is most likely to break. A case study assembled from
this bank uses only numbers that appear verbatim in a banked quote or that the user supplied
directly, and says "no metric captured" where there is none.

**A warning worth passing to the user.** A wall of uniformly polished praise on an owned page
reads as company-sponsored content, which is the category users reported trusting least
(`research/distilled-testimonial-practice.md`, section 9). Fewer quotes, kept rough, with links
out, beats twenty smooth ones. That evidence is from 2016 and its age is disclosed wherever it is
used.

## Nothing is published

The bank is an internal artifact. Permission requests are drafts. No quote goes onto a page, into
a deck, into an email, or into any third-party system without the user approving the actual final
text (`evidence-standards.md`, rule 6). Approving the bank is not approving a publication.
