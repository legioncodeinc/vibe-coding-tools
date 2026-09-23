# Distilled: content repurposing and multi-format adaptation

Stage 3 of the forge pipeline for `content-repurposer`. Written from a fresh read of the 13
files in `raw/`. Every claim below ends in a bracketed citation to the raw file it came
from. Nothing here comes from training data.

---

## 0. Read this first: this domain is mostly unsourced marketing

The single most important thing to know before using anything below.

Content repurposing is a service that many companies sell. The literature about it is
almost entirely produced by those companies. The result is a body of confident, round,
memorable numbers with nothing behind them.

The worked example: one widely circulated article states that repurposed content "can save
you up to 60% of your content creation budget", "can help you reach 80% more of your
audience", and "receives 92% more traffic than original content". Two of the three name an
organization. **None names a study, a report title, a year, a sample, or a method, and none
links to a source document** [raw/repurpose--evidence-quality--docswrite-stats-2024.md].
There is no document to go and read. The claims are unfalsifiable as stated.

### The evidence quality table

| Layer | Quality | What is actually in this archive |
|---|---|---|
| Whether varying the ARGUMENT beats varying the PACKAGING | **Strong for its scope.** One controlled experiment, peer-reviewed, but from 1990 and about print advertising. | Schumann, Petty and Clemons 1990 [raw/repurpose--variation--schumann-petty-clemons-jcr-1990.md] |
| Posting cadence on LinkedIn | **Moderate.** One large vendor dataset with a stated within-account statistical method. | Buffer, 2M+ posts [raw/repurpose--cadence--buffer-linkedin-frequency-2025.md] |
| Per-platform character ceilings | **Moderate.** A scheduling tool's API-enforced numbers, plus one instrumented LinkedIn dataset. No first-party platform documentation obtained. | [raw/repurpose--platform-limits--buffer-help-center-2026.md] [raw/repurpose--platform-limits--authoredup-linkedin-2026.md] |
| Truncation and fold behavior | **Moderate for LinkedIn and email, weak elsewhere.** | [raw/repurpose--platform-limits--authoredup-linkedin-2026.md] [raw/repurpose--email--knak-preview-text-2026.md] |
| X ranking mechanics and link handling | **Weak.** Second-hand reading of a published repository that was not independently retrieved. | [raw/repurpose--platform-mechanics--posteverywhere-x-algorithm-2026.md] |
| Carousel specifications | **Weak.** Vendor restatement, no platform citation. Instagram is third-hand via tech press. | [raw/repurpose--carousel--oktopost-linkedin-pdf-2026.md] [raw/repurpose--carousel--carouselpost-instagram-20-slides-2026.md] |
| Repurposing craft and workflow | **Craft convention.** Trade press plus vendors, no data anywhere. | [raw/repurpose--craft--cmi-remix-recycle-2025.md] [raw/repurpose--craft--socialbee-repurposing-strategy-2026.md] [raw/repurpose--craft--easycontent-without-repeating-2025.md] |
| **Whether repurposed content outperforms originals** | **None. Zero evidence found.** | Named gap, section 8 |

**The operating rule that falls out of this table: quarantine every engagement statistic.**
This skill states no percentage lift, no traffic multiple, and no reach claim about
repurposing in any deliverable. It states format constraints, which are checkable, and craft
judgments, which it labels as craft. Where a source's number is used at all, it is
attributed to who claimed it and carries the note that it is uncontrolled.

---

## 1. The craft problem, and the one piece of real evidence about it

### The failure mode has a name in the advertising literature: wearout

"Wearout" is the established term for reduced engagement caused by overly repetitive
messaging, and "repetition variation" is the established name for the family of remedies
[raw/repurpose--variation--wikipedia-repetition-variation.md]. This is not a coinage
invented for this skill.

### Two kinds of variation, and only one of them works on an engaged reader

This is the most load-bearing finding in the archive.

| Term | Definition, verbatim from the source |
|---|---|
| **Cosmetic variation** | "certain nonsubstantive features of the ads are altered while the basic product message is kept the same". Color, graphics, fonts, layout. |
| **Substantive variation** | "a change in message content (i.e., arguments, attributes)" while cosmetic characteristics stay constant. |

[raw/repurpose--variation--schumann-petty-clemons-jcr-1990.md]

Two experiments, 294 and 200 undergraduate subjects plus controls, 2x2x2 factorial designs
crossing message relevance, variation type, and repetition count.

- **Cosmetic variation helped under LOW relevance.** "Subjects who were exposed to the
  varied ad campaign liked the product and advertising significantly more", under low
  product relevance and moderate repetition [same].
- **Substantive variation helped under HIGH relevance.** Subjects who saw substantively
  varied ads "and were motivated to process them" "rated the product and advertising
  campaign significantly higher" [same].

### The inference this skill is built on, labeled as an inference

A person who follows one operator on LinkedIn AND Facebook AND their email list is, by
construction, the motivated high-relevance case. They chose to hear from this person more
than once.

For that reader, the archive's one controlled experiment points at substantive variation,
meaning a change in the ARGUMENT, and finds the cosmetic case, meaning the same argument in
new packaging, carries under low relevance instead
[raw/repurpose--variation--schumann-petty-clemons-jcr-1990.md].

**This is an inference, not a measured finding about social media.** The study is from 1990,
uses lab subjects, tests print and broadcast advertising, and measures product attitude
across 3 to 8 exposures inside a session [same]. The mechanism transfers plausibly. The
effect sizes transfer not at all. Every use of it in this skill is stated as reasoning, not
as proof.

### The craft literature stops one step short of this

Trade press names the copy-paste failure and prescribes a per-format hook rewrite. Quoted
practitioners: "Change the packaging, not the message" (Ashley Baker), "Different formats
need their own hook" (Pam Didner), and "Each format needs its own hook. Don't just copy and
paste... Spend time crafting the right opening for each channel"
[raw/repurpose--craft--cmi-remix-recycle-2025.md].

**Read that against the experiment. "Change the packaging, not the message" is cosmetic
variation, stated as the recommendation.** The best trade-press advice in the archive
prescribes exactly the strategy the one controlled study assigns to the low-attention case.

The closest the craft literature gets to the angle argument is Andrew Davis's reframing of
the operating question from "Where else can we publish this?" to "How does this idea
transform on different platforms?" [same]. It is one sentence and it is not developed into
a method.

The one source in the sweep whose whole subject is repurposing without repeating offers a
three-item taxonomy: "a pain point angle", "a question angle", "a story angle"
[raw/repurpose--craft--easycontent-without-repeating-2025.md]. All three are OPENING
devices. Pain point, question and story are three doors into the same room. The reader
arrives at the same claim three times.

**Named gap: no source in this archive supplies a taxonomy of angles that changes the claim
being made.** The taxonomy in `../angle-taxonomy.md` is authored, extended from the
cosmetic-versus-substantive distinction, and the skill says so wherever it is used.

### A related failure mode named in practice: dilution

Cutting one source into too many pieces is named as a distinct failure:
"idea dilution", where breaking content into too many fragments weakens each piece
[raw/repurpose--craft--socialbee-repurposing-strategy-2026.md]. This is the argument for
capping a pack at 5 to 7 short pieces rather than maximizing count. It is practitioner
observation with no data behind it.

### Three words that are not synonyms

| Term | Definition as given |
|---|---|
| **Repurposing** | Converting to new formats for specific goals |
| **Resharing** | Reusing exact content at different times |
| **Cross-posting** | Publishing identical content across platforms |

[raw/repurpose--craft--socialbee-repurposing-strategy-2026.md]

A pack of five near-identical posts on five surfaces is cross-posting with a repurposing
label on it.

---

## 2. Format constraints: the ceiling is not the limit

Every surface in this archive has two numbers, and the smaller one governs the draft.

### Ceilings

| Surface | Ceiling | Source |
|---|---|---|
| X, free | 280 | [raw/repurpose--platform-limits--buffer-help-center-2026.md] |
| X, paid | 25,000 stated for "Basic, Premium and Premium +" | [same] |
| LinkedIn post | 3,000 | [same], corroborated by [raw/repurpose--platform-limits--authoredup-linkedin-2026.md] |
| LinkedIn first comment | 1,250 | [both] |
| Facebook post and reel caption | 5,000 | [raw/repurpose--platform-limits--buffer-help-center-2026.md] |
| Instagram post and reel caption | 2,200 | [same] |
| Instagram story caption | 120 | [same] |
| Threads post | 500 | [same] |
| Bluesky | 300 | [same] |
| TikTok | 2,200 | [same] |
| YouTube Shorts description | 5,000 | [same] |

**Conflict, unresolved.** Buffer states 25,000 for all paid X tiers
[raw/repurpose--platform-limits--buffer-help-center-2026.md]. The X mechanics source states
4,000 for Premium and 25,000 for Premium+
[raw/repurpose--platform-mechanics--posteverywhere-x-algorithm-2026.md]. **Preference:
neither.** The tiering is the kind of detail that changes with pricing changes, and both
sources are second-hand. Verify against the user's own account before sizing an X draft.

**Media eats characters.** Attached images consume part of the character allowance on X and
LinkedIn [raw/repurpose--platform-limits--buffer-help-center-2026.md]. A draft sized against
text alone can still fail at post time.

### Folds, which are the real constraint

| Surface | Visible before truncation | Source |
|---|---|---|
| LinkedIn feed post, mobile | approximately 140 characters | [raw/repurpose--platform-limits--authoredup-linkedin-2026.md] |
| LinkedIn feed post, desktop | approximately 210 characters | [same] |
| LinkedIn About section | approximately 300 characters | [same] |
| LinkedIn headline in search | approximately 60 to 70 characters | [same] |
| Email preview text, practical target | 40 to 90 characters, "key message in the first 40" | [raw/repurpose--email--knak-preview-text-2026.md] |

LinkedIn's ceiling is 3,000 and its mobile fold is around 140
[raw/repurpose--platform-limits--authoredup-linkedin-2026.md]. **The ceiling is 21 times the
fold.** Writing to the ceiling and ignoring the fold is the standard way a repurposed post
fails.

No fold figures were located in this sweep for Facebook, Instagram, or X. **Named gap.**

### Email is the strangest surface and the most constrained

Email has no fixed limit. It has a **reader-configurable** one. What displays "ranges from
zero to about five lines of text, roughly 278 characters at the top end, depending on the
client and how the reader has configured their inbox"
[raw/repurpose--email--knak-preview-text-2026.md].

Per-client behavior as stated [same]:

| Client | Behavior |
|---|---|
| Gmail | Subject and preview text share ONE line of inbox space |
| Apple Mail on iPhone | Preview length is a reader setting, up to five lines |
| Outlook desktop | One to three lines |
| Outlook on the web | Three lines |

Two consequences. A long Gmail subject line eats the preview text entirely. And preview text
is a separately authored field, not a truncation of the body, so an email derivative that
does not specify its preview text has left its most constrained surface unwritten.

### Link handling differs enough to change the draft

On X: "The open-sourced code shows 30-50% reach reduction for external links", and
separately, attributed to a Buffer analysis rather than to the code, "Since March 2025, link
posts from free accounts have zero median engagement"
[raw/repurpose--platform-mechanics--posteverywhere-x-algorithm-2026.md]. Both claims are
second-hand: the repository was not independently retrieved in this sweep.

No equivalent link-handling evidence was found for LinkedIn, Facebook, or Instagram in this
sweep. **Named gap.** Do not assert that any other platform penalizes links.

### Ranking signals on X, insofar as they are knowable

Weights attributed to the published ranking code, reported as confirmed in both the 2023
release and the January 2026 xAI release
[raw/repurpose--platform-mechanics--posteverywhere-x-algorithm-2026.md]:

| Signal | Weight |
|---|---|
| Reply engaged by the author | +75 |
| Reply | +13.5 |
| Bookmark | +10.0 |
| Dwell time, 2 minutes or more | +10.0 |
| Retweet | +1.0 |
| Like | +0.5 |

If accurate, a reply is worth roughly 27 likes and a bookmark 20. That is a structural
argument for a thread that earns a genuine reply over one that earns a like. Note that the
same source's format claims (text beats video by 30%, long-form now favored over threads)
carry no attribution at all [same], and are not used.

### Carousels

**LinkedIn document posts** [raw/repurpose--carousel--oktopost-linkedin-pdf-2026.md]: PDF,
PPTX, DOC and DOCX accepted with PDF recommended for consistent rendering. Maximum 100 MB
and 300 pages. Recommended 5 to 15 slides. Portrait 1080 x 1350 at 4:5, square 1080 x 1080,
landscape 1920 x 1080. Minimum 300 DPI. 50 px safe margin.

Copy guidance from the same source: maximum 60 words per slide, minimum 24 pt body font, no
more than 6 to 8 lines per slide, one key point per slide, cover slide carries a bold claim
or a data point, CTA slide restates the takeaway with a single call to action.

**At 60 words across 5 to 15 slides a carousel is a 300 to 900 word artifact.** That is a
hard planning budget.

**Instagram carousels** reportedly expanded from 10 to 20 slides with individual per-slide
captions, rolled out 2026-06-19
[raw/repurpose--carousel--carouselpost-instagram-20-slides-2026.md]. **This is third-hand.**
The publisher cites Engadget and a Pop Base post on X, not Meta. The official Instagram help
page for carousels was fetched directly and returned only page metadata with no body
content. **Named gap: this archive contains no first-party Meta source for any Instagram
behavior.**

Practical rule: build to 10 slides when first-party verification is not available, because
10 renders correctly under both the old and the reported new behavior.

---

## 3. Openings

Every craft source in the archive converges on the same instruction and none of them
measures it.

- "Each format needs its own hook. Don't just copy and paste... Spend time crafting the
  right opening for each channel" [raw/repurpose--craft--cmi-remix-recycle-2025.md].
- The cover slide of a carousel should carry a bold claim or a data point, not a title
  [raw/repurpose--carousel--oktopost-linkedin-pdf-2026.md].
- Email preview text should carry "the key message in the first 40" characters
  [raw/repurpose--email--knak-preview-text-2026.md].

The mechanical reason is in the fold table in section 2. On LinkedIn mobile the reader sees
roughly 140 characters before deciding
[raw/repurpose--platform-limits--authoredup-linkedin-2026.md]. In Gmail the subject and
preview share one line [raw/repurpose--email--knak-preview-text-2026.md].

**Deliberate non-duplication.** The sibling skill `said-it-already` already carries a
researched opening-craft guide built on journalism-body taxonomies and practitioner
interviews. This archive did not re-run that sweep and this distillation does not restate
it. Point at
`../../../said-it-already/references/research/distilled-content-mining-and-repurposing.md`,
section 3, rather than duplicating a weaker version of it here.

---

## 4. Cadence and sequencing

### The one credible cadence measurement in the archive

Buffer analyzed more than 2 million LinkedIn posts from more than 94,000 accounts, using
z-score analysis of each account's high-frequency weeks against its own baseline plus fixed
effects regression to control for account-level differences
[raw/repurpose--cadence--buffer-linkedin-frequency-2025.md]. The within-account design
removes the most obvious confound, which is comparing large accounts to small ones.

Findings, as stated [same]:

| Posts per week | Reported effect |
|---|---|
| 2 to 5 | plus 1,182 impressions per post, plus 0.23 percentage points engagement |
| 6 to 10 | plus 5,001 impressions per post, plus 0.76 percentage points |
| 11 or more | "nearly 17,000 more impressions per post, 3x more engagements" |

Headline recommendation: "posting 2 to 5 times weekly on LinkedIn is the sweet spot for
improving reach *and* engagement" [same]. On whether frequent posting is penalized, the
answer given is "no": "LinkedIn doesn't 'cap' your reach or punish you for posting often"
[same].

**Two things follow, and the second one matters more.**

1. A weekly pack of 5 to 7 short pieces on one surface sits inside the range this analysis
   calls the sweet spot and exceeds no cap it found.
2. **The argument for restraint in a repurposed pack is a READER argument, not an algorithm
   argument.** This analysis found no frequency penalty [same]. It also did not measure
   whether the high-frequency accounts were repeating themselves [same], so it cannot be
   used in either direction on the repetition question.

**Named gap: no comparable cadence measurement was found for Facebook, X, Instagram, or
email.** Do not transfer the LinkedIn numbers to another surface.

### Sequencing practice

Practice guidance, unsourced [raw/repurpose--craft--socialbee-repurposing-strategy-2026.md]:
collect centrally, select high-value evergreen or proven-performing pieces, extract
standalone components (quotes, statistics, frameworks), organize by content pillar with
dedicated weekly schedules, adapt to each platform's native format, schedule in advance,
target roughly 30% repurposed to 70% new, then analyze and refine. Space repurposed content
across time and vary formats to prevent repetition.

Two observations about this list.

- Selecting for proven or evergreen material BEFORE repurposing is the source-selection
  step, named in practice [same].
- The stated anti-repetition remedy is spacing and format variety [same]. **That is a
  scheduling remedy for what section 1 identifies as an argument problem.** Spacing five
  restatements over two weeks makes the repetition slower, not smaller.

The 30/70 ratio is one practitioner's unsourced convention [same] and is not used as a
target in this skill.

---

## 5. Depth allocation by surface

One source proposes allocating depth rather than duplicating meaning: LinkedIn gets the
essence, blogs get the why and how, newsletters get the story, videos get the emotion
[raw/repurpose--craft--easycontent-without-repeating-2025.md]. Unsourced practitioner
observation, no data.

It is worth keeping as a planning heuristic because it is orthogonal to the angle question.
Angle decides WHAT CLAIM a piece makes. Depth decides how much of the reasoning ships with
it. A pack can vary one and not the other, and varying only depth produces the same problem
as varying only format.

---

## 6. Conflicts recorded rather than smoothed

| Question | Reading A | Reading B | Preference |
|---|---|---|---|
| X paid tier character limit | 25,000 for Basic, Premium and Premium+ [raw/repurpose--platform-limits--buffer-help-center-2026.md] | 4,000 Premium, 25,000 Premium+ [raw/repurpose--platform-mechanics--posteverywhere-x-algorithm-2026.md] | **Neither.** Both second-hand, tiering changes with pricing. Verify against the user's account. |
| Does variation need to change the message | "Change the packaging, not the message" [raw/repurpose--craft--cmi-remix-recycle-2025.md] | Substantive variation, meaning changed arguments, is what carried under high relevance [raw/repurpose--variation--schumann-petty-clemons-jcr-1990.md] | **Prefer the experiment for an engaged audience**, because it is the only controlled test in the archive and its high-relevance condition matches a multi-surface follower. Prefer the trade-press reading for a low-attention audience, which is what the same experiment found. |
| Is high posting frequency penalized | Common practice says space content out [raw/repurpose--craft--socialbee-repurposing-strategy-2026.md] | Measured within-account analysis found no cap or penalty [raw/repurpose--cadence--buffer-linkedin-frequency-2025.md] | **Prefer the measurement on the algorithm question** and keep the practice advice as a reader-experience argument. They are answering different questions and the conflict is only apparent. |
| Instagram carousel slide ceiling | 20 slides with per-slide captions since 2026-06-19 [raw/repurpose--carousel--carouselpost-instagram-20-slides-2026.md] | No first-party confirmation obtained; help page returned no body content [same] | **Unresolved.** Build to 10 unless the user verifies in their own app. |

---

## 7. Named gaps

Stated rather than padded.

1. **No evidence at all on whether repurposed content outperforms, matches, or
   underperforms originals.** Every source that touches the question assumes the answer and
   sells the service [raw/repurpose--evidence-quality--docswrite-stats-2024.md]. This is
   the biggest missing study in the domain.
2. **No first-party platform documentation was obtained for any surface.** Buffer's help
   center is the closest thing to authoritative in the archive and it carries no date
   [raw/repurpose--platform-limits--buffer-help-center-2026.md]. Instagram's official help
   page returned metadata only
   [raw/repurpose--carousel--carouselpost-instagram-20-slides-2026.md].
3. **No sourced taxonomy of angles exists.** The best available is three opening devices
   [raw/repurpose--craft--easycontent-without-repeating-2025.md]. The angle taxonomy in
   this skill, in `../angle-taxonomy.md`, is authored.
4. **No fold or truncation figures for Facebook, Instagram, or X.** Only LinkedIn and email
   were pinned down [raw/repurpose--platform-limits--authoredup-linkedin-2026.md]
   [raw/repurpose--email--knak-preview-text-2026.md].
5. **No cadence measurement outside LinkedIn**
   [raw/repurpose--cadence--buffer-linkedin-frequency-2025.md].
6. **The X ranking repository was not independently retrieved.** Every code-attributed
   claim is one publisher's reading
   [raw/repurpose--platform-mechanics--posteverywhere-x-algorithm-2026.md].
7. **No subject-line length data with a stated method.** Many articles claim to be
   data-backed and name no study; none were archived
   [raw/repurpose--email--knak-preview-text-2026.md].
8. **Guido 2012 on varied marketing stimuli and ad fatigue was not retrieved.** It is known
   only through a tertiary entry and is not cited as a finding anywhere in this skill
   [raw/repurpose--variation--wikipedia-repetition-variation.md].
9. **The one controlled experiment is 36 years old and is about print advertising to
   undergraduates** [raw/repurpose--variation--schumann-petty-clemons-jcr-1990.md]. Nothing
   modern replicates it for social content.

---

## 8. The four things this skill will not say

Direct consequences of the table in section 0.

1. It will not say repurposing saves a percentage of budget, reaches a percentage more
   audience, or gets a multiple of the traffic
   [raw/repurpose--evidence-quality--docswrite-stats-2024.md].
2. It will not say "the algorithm rewards" anything. Where a ranking signal is named it is
   attributed to a published repository as read by one publisher
   [raw/repurpose--platform-mechanics--posteverywhere-x-algorithm-2026.md].
3. It will not present the 27% LinkedIn post-length lift as a reason to write long. It is
   uncontrolled and comes from a company selling long-post tooling
   [raw/repurpose--platform-limits--authoredup-linkedin-2026.md].
4. It will not claim the angle taxonomy is evidence-based. The
   cosmetic-versus-substantive distinction under it is
   [raw/repurpose--variation--schumann-petty-clemons-jcr-1990.md]. The seven angles are
   authored craft.
