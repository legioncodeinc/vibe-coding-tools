# Distilled: content mining and repurposing craft

Stage 3 of the forge pipeline for `said-it-already`. Written from a fresh read of the 14
files in `raw/`. Every claim below ends in a bracketed citation to the raw file it came
from. Nothing here comes from training data.

---

## 0. Read this first: how much of this domain is actually evidenced

Be blunt about it, because the skill's credibility depends on not repeating vendor
numbers as fact.

| Layer | Evidence quality | What is in this archive |
|---|---|---|
| How speech differs from writing | **Strong.** Peer-reviewed corpus linguistics and psycholinguistics with published frequency counts. | Biber 2012, Bortfeld et al. 2001 [raw/saidit--spoken-vs-written--biber-register-2012.md] [raw/saidit--spoken-vs-written--bortfeld-disfluency-2001.md] |
| Why stories persuade | **Strong.** Multiple meta-analyses summarized in a current review. | Green and Appel 2024 [raw/saidit--storytelling--green-appel-transportation-2024.md] |
| Why surprise and curiosity drive attention | **Moderate.** Real primary psychology, but reached through a vendor article that layers an invented framework on top and admits it. | Itti and Baldi 2009, Loewenstein 1994, Kang et al. 2009, Lang 2000, all cited in [raw/saidit--hooks--truefuture-hook-science-2026.md] |
| What makes an opening work | **Craft consensus, not research.** Practitioner interviews and taxonomies from professional journalism bodies. Converges across traditions, which is worth something. | [raw/saidit--hooks--gijn-openings-2019.md] [raw/saidit--hooks--opennotebook-ledes-2015.md] |
| Business story structure | **Craft convention.** Widely used, provenance unclear. | [raw/saidit--storytelling--slideworks-scr-2023.md] |
| Repurposing workflow and moment taxonomies | **Vendor practice.** Two vendors converge independently, which raises confidence in the taxonomy while leaving the outcome claims unverified. | [raw/saidit--repurposing--contentallies-podcast-2026.md] [raw/saidit--repurposing--repurposeyourcontent-webinar-2026.md] |
| Content bank and calendar design | **Vendor and experiential.** Both sources state they are unsourced. | [raw/saidit--content-bank--attentionclaw-swipe-file-2026.md] [raw/saidit--content-bank--lilachbullock-calendar-2026.md] |
| **Platform engagement numbers** | **Weakest layer in the archive. Mostly unsourced vendor marketing.** | One vendor states format engagement rates of 6.10%, 4.90%, and 3.20% with no study, sample, or method attached [raw/saidit--repurposing--repurposeyourcontent-webinar-2026.md]. The only first-party platform source found is a corporate announcement with no numbers [raw/saidit--platform--linkedin-feed-announcement-2026.md] |
| Confidentiality exposure in meeting content | **Strong for its scope.** Law firm publication citing case law and statute. | Mayer Brown 2026 [raw/saidit--confidentiality--mayerbrown-ai-notetakers-2026.md] |

**The operating rule that falls out of this table:** the skill states platform claims as
claims, attributed to who claimed them, and never as "the algorithm rewards X". The craft
guidance is used as craft guidance. Only the linguistics, the narrative psychology, and
the attention findings are treated as evidence.

---

## 1. Spoken register and written register are different systems

This is the central technical finding behind the whole skill.

**Not a tidiness difference, a structural one.** Of the 133 four-word lexical bundles
occurring above 20 times per million words, only four overlapped between conversation and
academic prose, roughly a 3% overlap
[raw/saidit--spoken-vs-written--biber-register-2012.md]. Conversation runs on "I don't
know if", "do you want to". Written prose runs on "on the other hand", "in the case of"
[same].

**The structural opposition.** Spoken registers cluster verbs, finite dependent clauses,
pronouns, and adverbials. Written registers cluster nouns, attributive adjectives, and
prepositional phrases [raw/saidit--spoken-vs-written--biber-register-2012.md]. Passive
verbs run roughly 2,000 per million words in conversation against roughly 18,000 in
academic writing [same]. Conversation drops the that-complementizer, written prose keeps
it [same].

**Pronoun density.** "I" and "you" are among the most frequent words in spoken corpora and
considerably less frequent in written ones
[raw/saidit--spoken-vs-written--biber-register-2012.md].

**Disfluency is the normal texture of speech, not a defect.** Measured at 5.97
disfluencies per 100 words across conditions, with a stated general figure of about 6% of
words in spontaneous speech [raw/saidit--spoken-vs-written--bortfeld-disfluency-2001.md].
Counted categories were repeats, restarts, and fillers [same].

**The two findings that matter most for seed selection.** Speakers doing the explaining
were markedly more disfluent than speakers receiving: 7.00 versus 4.93 per 100 words
[raw/saidit--spoken-vs-written--bortfeld-disfluency-2001.md]. And harder, more abstract
material produced more disfluency than familiar material: 6.37 versus 5.55 [same].
**Consequence: the best seeds are the messiest verbatim.** The teaching explanation and
the moment where someone works out something hard out loud are exactly the passages that
read worst if pasted.

**The editorial line between cleanup and rewriting.** Established transcript practice
draws it explicitly. Fix: spelling, stumble repeats ("I, I, I went" becomes "I went"),
run-on chains, paragraph breaks at topic shifts. Leave: dialect and nonstandard grammar,
word choice, self-corrections and hedges
[raw/saidit--spoken-vs-written--gotranscript-editing-2026.md]. Emphasis repetition ("very,
very cold") stays; stumble repetition goes [same]. Swapping "scared" for "concerned"
changes emotional weight and is out of bounds [same].

**Both vendor sources independently name the transcript dump as the number one failure.**
One insists the output must be "editorial content", not a transcript
[raw/saidit--repurposing--contentallies-podcast-2026.md]; the other builds its whole method
around extraction and reformatting rather than pasting
[raw/saidit--repurposing--repurposeyourcontent-webinar-2026.md].

---

## 2. Moment taxonomies converge across independent sources

Three sources from unrelated traditions list what to look for in spoken material, and the
lists overlap heavily.

| Source | Moment types named |
|---|---|
| B2B podcast agency [raw/saidit--repurposing--contentallies-podcast-2026.md] | strong claims or counterintuitive insights; data points and statistics; visible guest reactions; process explanations and frameworks; moments listeners replay |
| Webinar repurposing vendor [raw/saidit--repurposing--repurposeyourcontent-webinar-2026.md] | expert soundbites; surprising statistics; strong opinions or industry takes; memorable quotes; customer questions |
| Swipe file system [raw/saidit--content-bank--attentionclaw-swipe-file-2026.md] | hook types: mistake, result, confession, checklist, contrarian claim, question, comparison |

**Convergent set:** strong opinion, number or result, explanation of a process, and a
memorable specific line. Two of the three name contrarian or counterintuitive material
separately from ordinary opinion. None of the three name the objection-handling moment or
the analogy, which are additions this skill makes on craft grounds rather than on source
evidence, and which are labeled as such in the guides.

**Working method.** Work from a timestamped transcript rather than re-listening: "the
timestamped transcript is your map" [raw/saidit--repurposing--contentallies-podcast-2026.md].

**Volume claims are vendor claims.** 15 assets per episode for a one to two person team,
30 to 50 for mid-market [raw/saidit--repurposing--contentallies-podcast-2026.md]. Roughly
28 pieces from one 60-minute webinar
[raw/saidit--repurposing--repurposeyourcontent-webinar-2026.md]. Neither is measured.

---

## 3. The opening carries the piece, and there is a finite set of moves

**Two jobs.** A first line must "offer a promise and establish tension" (David Quammen, in
[raw/saidit--hooks--opennotebook-ledes-2015.md]). It must also pay that promise off: "It's
got to deliver on what you promise. It should shine like a flashlight down through the
piece" (John McPhee, same source).

**Seven named opening types** from professional journalism: start with a person, with
action, in place, with a detail, with a question, with a problem, with revelation
[raw/saidit--hooks--gijn-openings-2019.md]. Every cited example leads with a named person,
a number, or a physical detail [same].

**The revelation versus narrative trade-off is explicit.** "Revelation-based openings
guarantee readers receive main points but risk superficial engagement. Narrative
techniques encourage deeper reading but risk reader abandonment if the payoff delays too
long" [raw/saidit--hooks--gijn-openings-2019.md].

**Named failure modes.** Cliche detail openings [raw/saidit--hooks--gijn-openings-2019.md].
Telling words like "tragic, staggering, or amazing" instead of showing (Karen Schrock
Simring, [raw/saidit--hooks--opennotebook-ledes-2015.md]). Unfulfilled implicit promises,
which "creates frustration" [raw/saidit--hooks--gijn-openings-2019.md].

**Convergence from a completely different direction.** A B2B podcast agency arrives at the
same rule for clips: "Lead with the strongest or most provocative line. Never open with a
context-setting intro" [raw/saidit--repurposing--contentallies-podcast-2026.md]. Journalism
craft and B2B video marketing agree, which is unusual and worth weighting.

**The underlying psychology, as far as it is evidenced.** Surprising locations attract
gaze: 72% of gaze shifts went toward locations more surprising than average (Itti and
Baldi 2009, cited in [raw/saidit--hooks--truefuture-hook-science-2026.md]). Curiosity
arises from an information gap between what you know and what you want to know
(Loewenstein 1994, same). Processing capacity is limited (Lang 2000, same). **But the hook
formula built on top of these is explicitly labeled by its own author as "a planning
model, not a validated scientific equation"** [same].

**Platform timing claims do not transfer.** The three-second and six-second numbers come
from TikTok ADVERTISING guidance [raw/saidit--hooks--truefuture-hook-science-2026.md].
They are about video ads, they are self-interested, and applying them to a text post is
unsupported.

**One structural constraint on text posts is real and simple.** The first line has to earn
the "...see more" click [raw/saidit--repurposing--repurposeyourcontent-webinar-2026.md].

---

## 4. Story structure: what the evidence supports and what it does not

**Narrative persuasion is measured.** Transportation is "an experiential state of immersion
in which all mental processes are concentrated on the events occurring in the narrative"
(Green and Brock 2000, quoted in
[raw/saidit--storytelling--green-appel-transportation-2024.md]). A meta-analysis of 76
articles found that more-transported individuals "show more narrative-consistent affect,
beliefs, attitudes, and behaviors across a range of topics" (Van Laer et al. 2014, same).
A second meta-analysis found narratives "more effective than non-narratives at creating
change over time" (Oschatz and Marker 2020, same).

**Do not oversell it.** A health-narrative meta-analysis found "narratives had a small
effect on persuasion" (Shen et al. 2015, in
[raw/saidit--storytelling--green-appel-transportation-2024.md]).

**What raises transportation, each usable as a drafting rule.**

| Driver | Drafting consequence |
|---|---|
| Vivid mental imagery, per the Transportation-Imagery Model | Keep the concrete physical detail the speaker actually used |
| Character identification | Keep a person in the story, named or role-named |
| Emotional content and emotional shifts across the piece | Keep the moment the feeling changed |
| Narrativity, meaning real story structure | Impose sequence on a rambling spoken account |
| Perceived realism, which is psychological not factual | Internal consistency matters more than completeness |

All from [raw/saidit--storytelling--green-appel-transportation-2024.md].

**What lowers it.** Scrambled order: "the random re-arrangement of story parts decreased
transportation" (Appel et al. 2015, same source). Realism violations (same). And the one
that matters most for AI-assisted drafting: **affective resistance.** Participants who
perceived narrative ads as "cheesy or oversentimental" experienced lower transportation
(Appel 2022, same). **Inflating a plain spoken line into dramatic prose measurably
backfires.**

**A three-beat business structure to hang a client story on.** Situation is a "fact-based
description of the current situation"; Complication is "the reason the situation requires
action"; Resolution is "what we need to do to resolve this complication"
[raw/saidit--storytelling--slideworks-scr-2023.md]. Keep situation and complication "as
clear and short as possible" because "your audience is more interested in solutions"
[same]. A resolution-first reorder is valid when the audience already agrees [same].
**Provenance gap: this archive cannot establish who created SCR.** Two sources describe it
and neither attributes it to an originator [same].

---

## 5. Content bank design

**A bank is a mechanics library, not a copy folder.** "A swipe file should teach you how an
asset works. It should not become a folder of posts to copy"
[raw/saidit--content-bank--attentionclaw-swipe-file-2026.md].

**Typed metadata per entry, at least three axes** [same]:

| Field | Values named by the source |
|---|---|
| Hook type | mistake, result, confession, checklist, contrarian claim, question, comparison |
| Structure pattern | step-by-step, before/after, teardown, myth-versus-truth, FAQ, case story |
| Proof method | example, screenshot, quote, source, personal experience, data, demonstration |
| Audience problem | the specific pain, stated narrowly |
| Format | which surface it suits |
| CTA type | comment, save, click, download, watch, reply, buy |

**Over-engineering is a named failure.** "A folder with 400 posts tagged across 15
dimensions is also useless, too much friction to maintain" [same]. Keep the field set
small and fixed.

**There is an explicit ethical review step** between draft and publication in this system's
own workflow [same]. That is where a confidentiality screen belongs.

**The input system comes before the calendar.** An independent practitioner puts building
an input system ahead of building the calendar, and fills it by capturing "three things
clients asked that week... Three voice notes, ninety seconds each"
[raw/saidit--content-bank--lilachbullock-calendar-2026.md]. **This is the strongest
independent support for this skill's premise: the scarce resource is real raw material,
not scheduling.**

**Reported effect of having an input system.** The same practitioner reports batching yield
rising from four or five usable pieces per hour to "ten to twelve pieces of usable
content" per hour once the input system matured [same]. Unsourced and experiential, but it
is the only working-volume figure in the archive, and it is the basis for this skill's 10
to 15 seed target being described as a starting point rather than a benchmark.

**Horizon.** Plan in 90-day blocks, because "most detailed 12-month calendars are abandoned
within the first quarter anyway" [same]. Three to four content pillars, set annually,
revisited quarterly [same].

---

## 6. Platform behavior: treat almost all of it as claims

**The only first-party source found.** LinkedIn's newsroom says it is deploying
"Generative Recommenders, augmented with large language models (LLMs)", showing more of
"posts that offer genuine insight, actionable ideas, and thoughtful perspectives" and less
of "repetitive, low-substance posts and engagement bait, such as 'comment to agree'
prompts", and acting against "comment automation, engagement pods, and unauthorized
third-party tools" [raw/saidit--platform--linkedin-feed-announcement-2026.md]. No numbers,
no ranking features [same].

**Three usable consequences, all framed as what LinkedIn says.**

1. Repetition is explicitly named as demoted [same]. This is the archive's support for a
   hard de-duplication rule, since the same strong opinion genuinely does recur across many
   calls.
2. Engagement-bait openers are named as suppressed [same]. Do not draft "comment YES if
   you agree" hooks.
3. Ranking is described as understanding what a post is about [same], which weakens the
   case for structural gaming tactics relative to substance.

**Named retrieval gap.** LinkedIn's engineering blog post on feed dwell time is blocked by
robots.txt and could not be fetched, so this archive contains **no first-party technical
description of feed ranking features** [same].

**The vendor layer, recorded as a negative finding.** One vendor states document carousels
at 6.10%, native video at 4.90%, and text posts at 3.20% average engagement, with no
study, sample, or methodology given anywhere in the piece
[raw/saidit--repurposing--repurposeyourcontent-webinar-2026.md]. Other uncited claims in
the same piece: "73% of B2B marketers say webinars are their top lead source" and
repurposing brands "publish 5x more consistently" [same]. A second vendor mixes properly
attributed external data (Edison Research, eMarketer, SEMrush) with internal case-study
numbers that have no external verification
[raw/saidit--repurposing--contentallies-podcast-2026.md].

---

## 7. Confidentiality: the strongest-sourced risk in this domain

**The one-sentence version of the risk.** AI notetakers "transform conversations that would
otherwise fade from memory into searchable, reusable records capable of circulating well
beyond their original context"
[raw/saidit--confidentiality--mayerbrown-ai-notetakers-2026.md]. Publishing a line from a
call is a context transfer, and the original context does not travel with it.

**Named categories that carry legal exposure**, from a tiered meeting classification model
recommended by counsel [same]:

- Legal advice and privileged discussion
- HR investigations
- Trade secrets
- ADA accommodation and interactive-process discussions, which "may capture protected
  medical information that employers are required to maintain as confidential"
- Performance management and discipline

**Privilege can be waived.** Citing United States v. Heppner (2026), a court declined to
extend privilege to materials prepared using consumer AI platforms because the user "could
have had no 'reasonable expectation of confidentiality'" [same].

**Consent law is not uniform.** US federal law is one-party consent, but California,
Florida, Illinois, Pennsylvania, and Washington require all-party consent; the recommended
approach is jurisdiction mapping and "applying the strictest consent standard" [same].

**Transcription accuracy is uneven across speakers**, and relying on inaccurate transcripts
in consequential decisions raises Title VII disparate-impact concerns [same]. This is an
independent, legally framed argument for this skill's attribution rule: **a transcript is
not reliable enough to prove who said something.**

**Access limitation is standard.** "Limit access to the privileged output of an AI
notetaker, as broad access beyond need-to-know personnel can undermine claims of
confidentiality" [same]. Publishing is the maximum possible expansion of access.

**Scope note.** This source is about organizational governance, not personal publishing,
and it is not legal advice. The skill uses it to build a detection list, not to give legal
opinions.

---

## 8. Named gaps in this archive

State these rather than padding around them.

1. **No first-party technical description of any feed ranking algorithm.** LinkedIn's
   engineering blog is robots-blocked
   [raw/saidit--platform--linkedin-feed-announcement-2026.md]. Every remaining
   platform-behavior source is vendor content.
2. **No sourced engagement data by post format.** The only format-level numbers found are
   uncited [raw/saidit--repurposing--repurposeyourcontent-webinar-2026.md].
3. **No evidence on optimal posting cadence or bank size.** The one working figure is a
   single practitioner's unsourced report
   [raw/saidit--content-bank--lilachbullock-calendar-2026.md].
4. **No source measures whether repurposed spoken content outperforms written-from-scratch
   content.** Every repurposing source assumes the value and sells the service. This is the
   most important missing study in the domain.
5. **SCR provenance is unresolved** [raw/saidit--storytelling--slideworks-scr-2023.md].
6. **No source addresses the multi-speaker attribution problem** this skill is built
   around. The closest thing is the legal observation that transcripts are unevenly
   accurate across speakers [raw/saidit--confidentiality--mayerbrown-ai-notetakers-2026.md].
   The attribution rules in this skill are therefore built from the repo's own evidence
   standards plus that one legal observation, and are labeled as such.
7. **No source names the objection-handled moment or the analogy as extractable seed
   types.** Both are additions this skill makes on craft grounds. They are marked as
   unsourced in `references/seed-types-and-extraction.md`.
8. **Research window.** Six of the twelve sources fall outside the default 6-month window:
   Biber (2012), Bortfeld et al. (2001), Green and Appel (2024), GIJN (2019), The Open
   Notebook (2015), Slideworks (2023). Each says so in its own header. They are the
   academic and craft layer, which is stable literature rather than news. Every source in
   the fast-moving layer (platform behavior, repurposing practice, content banks, legal
   exposure) is from 2026.
