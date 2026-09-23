# Distilled: development activity logging and changelog practice

Stage 3 of the forge pipeline. Written from a fresh read of `raw/`. Every claim below ends
in a bracketed citation to the raw file it came from. If a statement here has no citation,
it is a design decision by this skill and says so.

---

## 1. The two changelog specifications, and where they disagree

There is no single uncontested changelog standard. Two published specs cover the same
ground and disagree on specifics.

| | Keep a Changelog 1.1.0 | Common Changelog |
|---|---|---|
| Current version | 1.1.0 [raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md] | unversioned, self-described as a stricter subset of Keep a Changelog [raw/devlog--changelog-spec--common-changelog.md] |
| Categories | 6: Added, Changed, Deprecated, Removed, Fixed, Security [raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md] | 4: Changed, Added, Removed, Fixed, in that fixed order. Drops Deprecated and Security [raw/devlog--changelog-spec--common-changelog.md] |
| Unreleased section | Required at the top, for two stated reasons: showing users what is coming, and making release cutting cheap [raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md] | Removed. Called "an unproductive workflow" [raw/devlog--changelog-spec--common-changelog.md] |
| Date format | ISO 8601, YYYY-MM-DD, because regional formats are ambiguous [raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md] | ISO 8601, YYYY-MM-DD [raw/devlog--changelog-spec--common-changelog.md] |
| Entry voice | not specified in what was retrieved | imperative mood, present-tense verb first, each entry self-describing without its category heading [raw/devlog--changelog-spec--common-changelog.md] |
| References | not specified in what was retrieved | mandatory: entries must reference commits, should reference tickets or PRs [raw/devlog--changelog-spec--common-changelog.md] |

**The conflict, stated plainly.** Common Changelog drops `Deprecated`, but Semantic
Versioning's own FAQ requires that a deprecation be shipped in a minor release and
documented before the functionality is removed in a major one, precisely so users can
migrate [raw/devlog--versioning--semver-2-0-0.md]. Keep a Changelog names ignoring
deprecations as a bad practice for the same reason
[raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md].

**Which this skill prefers, and why.** Keep a Changelog 1.1.0, as the default emitted
format. Three reasons. It is the format the user asked for. Its six categories cover
security and deprecation, both of which SemVer treats as consequential
[raw/devlog--versioning--semver-2-0-0.md]. And its `Unreleased` section is the correct
destination for a day of work that has not been released yet, which is the normal case for
a daily reconstruction [raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md].

**What this skill takes from Common Changelog anyway.** Its writing rules are stricter and
better, and nothing in Keep a Changelog contradicts them: imperative present-tense verb
first, each entry readable without its heading, references attached
[raw/devlog--changelog-spec--common-changelog.md]. Adopt those inside the Keep a Changelog
shape.

---

## 2. Commit convention, and the exact mapping to a changelog

Conventional Commits 1.0.0 defines the grammar
[raw/devlog--commit-convention--conventional-commits-1-0-0.md]:

```
type[optional scope]: description

[optional body]

[optional footer(s)]
```

Only two types are defined by the spec itself: `feat` and `fix`
[raw/devlog--commit-convention--conventional-commits-1-0-0.md]. The wider set (`build`,
`chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`) comes from the Angular
convention and is permitted but not specified
[raw/devlog--commit-convention--conventional-commits-1-0-0.md].

Version consequences [raw/devlog--commit-convention--conventional-commits-1-0-0.md,
raw/devlog--versioning--semver-2-0-0.md]:

| Commit | SemVer | SemVer definition |
|---|---|---|
| `fix:` | PATCH | "when you make backward compatible bug fixes" |
| `feat:` | MINOR | "when you add functionality in a backward compatible manner" |
| `feat!:` or `BREAKING CHANGE:` footer | MAJOR | "when you make incompatible API changes" |

A breaking change is signalled either by `!` before the colon or by an uppercase
`BREAKING CHANGE:` footer [raw/devlog--commit-convention--conventional-commits-1-0-0.md].
Scope, when present, "MUST consist of a noun describing a section of the codebase
surrounded by parenthesis" [raw/devlog--commit-convention--conventional-commits-1-0-0.md].

The **type to changelog heading** mapping this skill uses:

| Conventional type | Keep a Changelog heading |
|---|---|
| `feat` | Added |
| `fix` | Fixed |
| `refactor`, `perf`, `style`, and a `feat` that alters existing behaviour | Changed |
| a removal, however typed | Removed |
| a deprecation, however typed | Deprecated |
| anything with a security consequence | Security |
| `chore`, `ci`, `build`, `test`, `docs` with no user-visible effect | no changelog entry at all |

The first two rows are the published mapping, restated in the reference generator's docs
[raw/devlog--tooling--git-cliff-docs.md]. The rest is this skill's mapping, built by
matching the Conventional Commits type list
[raw/devlog--commit-convention--conventional-commits-1-0-0.md] against the Keep a Changelog
category definitions [raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md]. The last row
follows from Keep a Changelog's own statement that a changelog is for humans and that
documentation and merge traffic is noise
[raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md].

**Both specs agree on one thing and it is the important one:** a changelog is not a
`git log` dump. Keep a Changelog names commit log diffs as a bad practice because of merge
commits, unclear titles, and documentation traffic
[raw/devlog--changelog-spec--keep-a-changelog-1-1-0.md]. Common Changelog is blunter:
"Using `git log` as a changelog is a bad idea: it's full of noise"
[raw/devlog--changelog-spec--common-changelog.md].

---

## 3. What a commit-driven generator covers, and what it cannot

git-cliff "can generate changelog files from the Git history by utilizing conventional
commits as well as regex-powered custom parsers"
[raw/devlog--tooling--git-cliff-docs.md]. Its coverage is exactly the set of commits.

The retrieved documentation carries no limitations section about non-conventional commits
or about work that never reached a commit [raw/devlog--tooling--git-cliff-docs.md]. That is
a documented absence, not evidence there is no limit.

**The structural boundary this skill sits on.** A commit-driven generator reports what
landed. It cannot report an investigation that ended in a one-line fix, an approach that
was tried and abandoned, or a decision made in a terminal or a chat that never became a
commit message [raw/devlog--tooling--git-cliff-docs.md]. That omitted set is what this
skill reconstructs. Conversely, everything the generator does report is observed from the
repository and needs no inference at all, which is why reconciling against git is worth
doing whenever a repo is reachable.

---

## 4. How much of a session is not code changes

This is the empirical basis for the coverage note, and it is the strongest evidence in the
archive.

**Automated measurement, 78 professional developers, 7 projects, 3,148 monitored working
hours, roughly two weeks each, instrumented across IDEs, browsers, and document editors,
classified automatically rather than by self-report**
[raw/devlog--time-allocation--xia-2018-program-comprehension.md]:

| Activity | Share of monitored time |
|---|---|
| Comprehension | 57.62% |
| Navigation | 23.96% |
| Others | 13.40% |
| **Editing** | **5.02%** |

Editing code was about **5 percent** of monitored working time. Comprehension was about
**58 percent**, ranging 51.80% to 64.05% across the seven projects, so it is not one
outlier team [raw/devlog--time-allocation--xia-2018-program-comprehension.md].

Comprehension happened more in the browser than in the IDE: 27.26% of total time in web
browsers against 19.95% in IDEs
[raw/devlog--time-allocation--xia-2018-program-comprehension.md]. A large part of a
developer's day is spent reading things that are not their own repository.

Junior developers spent a higher share on comprehension than seniors, roughly 65% against
roughly 50% [raw/devlog--time-allocation--xia-2018-program-comprehension.md].

**The independence of this measurement matters.** Classification was automatic, and a
validation check against two developers' own manual labelling showed a difference of less
than 0.23 percent [raw/devlog--time-allocation--xia-2018-program-comprehension.md]. So this
is not a recall estimate.

**Second, larger, self-reported study**, 5,928 usable responses from professional
developers, average workday 9.08 hours
[raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md]:

| Activity | Share | Minutes |
|---|---|---|
| Meetings | 15% | 85 |
| Coding | 15% | 84 |
| Bugfixing | 14% | 74 |
| Email | 10% | 53 |
| Testing | 8% | 41 |
| Breaks | 8% | 44 |
| Helping others | 5% | 26 |
| Learning | 3% | 17 |
| Administrative | 2% | 12 |

**These two studies do not contradict each other, and the difference is instructive.** The
5.02% figure is *editing keystrokes*, measured by instrumentation
[raw/devlog--time-allocation--xia-2018-program-comprehension.md]. The 15% figure is
*coding* as a self-reported activity category, which bundles the comprehension that happens
inside a coding task [raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md]. The
honest reading of both together: even by generous self-report, code work is a minority of a
workday, and by instrumented measurement, actual editing is a small single-digit
percentage.

**Implication for this skill, stated as a design decision.** A reconstruction that reports
only files changed is reporting on the smallest slice of the session. The reading, the
searching, the investigating, and the deciding are the majority of it, and they are exactly
what a commit-driven tool omits [raw/devlog--tooling--git-cliff-docs.md]. That is the whole
argument for the problems-solved and decisions sections carrying more weight than the file
list.

---

## 5. Fragmentation: how long a developer stays on one thing

Automated logging of 20 professional developers over 2 to 3 work weeks each, with
perceived-productivity self-reports every 90 minutes
[raw/devlog--fragmentation--meyer-2017-work-life-of-developers.md]:

- Developers stayed in an individual activity for only **0.3 to 2.0 minutes** before
  switching [raw/devlog--fragmentation--meyer-2017-work-life-of-developers.md].
- Development activities (coding, testing, debugging) were about 30% of time; email 15%;
  work-related browsing 11%; meetings 10%; non-work browsing 6%
  [raw/devlog--fragmentation--meyer-2017-work-life-of-developers.md].

The larger self-report study puts the average **longest uninterrupted coding stretch at
47.3 minutes**, with an average of 4.66 interruptions a day
[raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md].

**Design consequence.** A raw activity timeline at the granularity the capture supports is
not a readable log, because the underlying behaviour switches every few minutes
[raw/devlog--fragmentation--meyer-2017-work-life-of-developers.md]. A useful reconstruction
groups fragments into work threads by topic, not by window focus. That grouping decision is
this skill's, evidenced by the fragmentation finding rather than prescribed by any source.

**Individual variation, relevant to a nocturnal user.** Productivity patterns varied
substantially between people, with three dominant patterns: morning-productive,
afternoon-productive, and midday-dip
[raw/devlog--fragmentation--meyer-2017-work-life-of-developers.md]. There is no single
correct productive window, so a tool that assumes one assumes wrong for a large share of
users.

---

## 6. Self-report against observation

The archive supports a qualified claim here and not a strong one. Stating the limit
explicitly rather than overselling it.

**What is supported:**

- The largest workday study in the archive is self-report only, with no automated tracking
  [raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md].
- Its authors chose the *previous* workday deliberately, because "the longer the interval
  between the time of the event and the time of the interview... the less likely that a
  person will remember it" [raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md].
- They supplied external cues on purpose, telling respondents to use "email clients,
  calendars, task lists, diaries etc. as 'cues'" to improve recall
  [raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md].
- They name specific biases: preceding-day well-being carrying over, responder personality
  skew, stereotype threat, and framing effects from question order
  [raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md].
- Their validation is convergent, not direct: results "replicate comparable findings...
  from previous work that applied differing methods (e.g. observations, tracking)", with no
  within-study comparison of self-report against logs
  [raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md].
- Separately, developers asked for tool support to retrospect on their work, wanting "a
  large variety of different metrics to retrospect about work", which implies they do not
  carry an accurate unaided picture
  [raw/devlog--self-monitoring--meyer-2017-cscw-design-recommendations.md].

**What is NOT supported by this archive:** any claim of the form "developers misremember N
percent of their day" [raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md,
named gap]. Do not write one.

**The usable conclusion.** Recall degrades with elapsed time, and the published remedy is
to shorten the interval and supply cues
[raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md]. This skill is a cue
supplier operating at the shortest possible interval, which is the same intervention the
researchers applied, automated. That is the honest framing of its value, and it is a
stronger claim than the unsupported one.

---

## 7. Journalling practice, and why it is abandoned

Two practitioner accounts, one vendor editorial and one long-running personal blog.

**What a journal contains, per the Stack Overflow account**: daily goals and recaps,
problem definitions and implementation plans, uncertainties and hypotheses, attempted
solutions and outcomes, ideas and questions, emotional reactions, and retrospectives
[raw/devlog--journal-practice--stackoverflow-developer-journal.md].

**Per the practitioner account**: tasks worked on and what was specifically done,
conversations with other developers and topics covered, "Problems I ran into, and
(hopefully) how I solved them", where work was left off, next-day priorities, and useful
code snippets [raw/devlog--journal-practice--erikson-daily-work-journal.md].

**Both independently center the debugging record.** The Stack Overflow instruction when
stuck is "jot down everything you tried so far", and on resolution "jot down the solution
or logic that got you there"
[raw/devlog--journal-practice--stackoverflow-developer-journal.md]. The practitioner
account records "Problems I ran into, and (hopefully) how I solved them" and reports
actually retrieving those entries later: "There's been several times I dug back into my
notes and found the solution I'd written down the last time"
[raw/devlog--journal-practice--erikson-daily-work-journal.md]. That is the archive's
strongest evidence for weighting the problems-solved section highest.

**Why the habit fails.** One failure mode is named directly: "Don't fall into the trap of
setting up a system for hours only to abandon it once you start going, like buying the
nicest journal only to realize you don't want to write regularly"
[raw/devlog--journal-practice--stackoverflow-developer-journal.md]. The enemy is setup cost
and the recurring writing burden, not disagreement about the value.

**The cost to beat.** 10 to 15 minutes at the end of each day, in a practice sustained
since 2013 [raw/devlog--journal-practice--erikson-daily-work-journal.md].

**Format that works, per the practitioner.** One folder per month named like
`2020-09 (September)`, one Markdown file per day named like `2020-09-21 (Monday)`
[raw/devlog--journal-practice--erikson-daily-work-journal.md]. Written in a text editor
rather than on paper, for linkability and code pasting
[raw/devlog--journal-practice--stackoverflow-developer-journal.md]. Writing standard kept
deliberately low: "Don't worry about sounding smart or being neat. Nobody's grading you."
[raw/devlog--journal-practice--stackoverflow-developer-journal.md].

**Named benefits worth designing for:** resuming work after a break, recovering a past
solution, and performance review preparation, the last of which is called out as
"*extremely* valuable" [raw/devlog--journal-practice--erikson-daily-work-journal.md]. Note
that these are unmeasured practitioner claims, not findings
[raw/devlog--journal-practice--stackoverflow-developer-journal.md,
raw/devlog--journal-practice--erikson-daily-work-journal.md].

---

## 8. The metric hazard

A record of a developer's activity read by the wrong person becomes an individual
performance metric, and the published warnings about those are sharp.

- "lines of code per minute will not tell you which software developers are the best
  software developers" [raw/devlog--activity-metrics--getdx-measuring-developer-activity.md].
- "Developers engage in a variety of other development tasks beyond just writing code,
  including providing guidance and reviewing code for other developers, designing systems
  and features, and managing releases"
  [raw/devlog--activity-metrics--getdx-measuring-developer-activity.md].
- "Rewarding developers for lines of code leads to bloated software that incurs higher
  maintenance costs" [raw/devlog--activity-metrics--getdx-measuring-developer-activity.md].
- Developers worry about measurement being misread "particularly by managers who do not
  have technical knowledge about inherent caveats"
  [raw/devlog--activity-metrics--getdx-measuring-developer-activity.md].
- Activity counts are confounded: more commits can reflect worse systems or longer hours
  rather than more value [raw/devlog--activity-metrics--getdx-measuring-developer-activity.md].

**Design consequence for this skill.** The artifact is a personal record for the person who
did the work. It must say so in its own header, because the same document read as a
management metric is precisely the thing these sources warn against
[raw/devlog--activity-metrics--getdx-measuring-developer-activity.md]. It should not report
counts that invite that reading (lines changed, commits per hour) as headline figures.

---

## 9. Gaps in this archive

Named, per the contract. These are places where the skill either stays silent or labels its
choice as a design decision rather than researched practice.

1. **No source on defining a work session boundary for a nocturnal or non-standard
   schedule.** The literature assumes a workday. The 2019 study asked about "the previous
   workday" without defining where one ends
   [raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md]. The session-boundary
   rules in `references/session-boundaries.md` are a design decision, supported only
   indirectly by the finding that productive windows vary substantially between individuals
   [raw/devlog--fragmentation--meyer-2017-work-life-of-developers.md].

2. **No quantified self-report versus observation error for developers.** Covered in
   section 6. The archive supports recall degradation and named biases, not an error rate
   [raw/devlog--time-allocation--meyer-2019-today-was-a-good-day.md].

3. **No source on attributing screen content to the user versus to an AI assistant or to
   read-only material.** The entire attribution ruleset in
   `references/activity-attribution.md` is a design decision built on the Littlebird
   capture semantics in `../littlebird-mcp-reference.md` and the attribution guardrail in
   `../evidence-standards.md` rule 4. No archived source covers it. This gap is significant
   and is labelled at the point of use.

4. **No source on extracting a problem-solution pair from an activity trace.** The practice
   sources say to write such records by hand
   [raw/devlog--journal-practice--stackoverflow-developer-journal.md,
   raw/devlog--journal-practice--erikson-daily-work-journal.md]. None describes
   reconstructing one after the fact. The extraction method in
   `references/problem-solved-extraction.md` is a design decision.

5. **git-cliff's Keep a Changelog support is unconfirmed**, and its documentation carries no
   limitations section [raw/devlog--tooling--git-cliff-docs.md]. Do not claim compatibility.

6. **The privacy findings of the CSCW self-monitoring study are not in this archive.** Only
   landing pages were retrievable
   [raw/devlog--self-monitoring--meyer-2017-cscw-design-recommendations.md]. Do not cite it
   for a privacy claim.

7. **The 2017 fragmentation paper's full text was not retrievable.** Three hosts refused
   automated fetch, and the figures come from the first author's own summary page
   [raw/devlog--fragmentation--meyer-2017-work-life-of-developers.md]. Do not cite it for
   anything finer-grained than the numbers recorded there.
