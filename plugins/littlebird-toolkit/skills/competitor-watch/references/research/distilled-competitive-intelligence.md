# Distilled: competitive intelligence practice

Written from a fresh read of the 17 files in `raw/`. Every claim below ends in a bracketed
citation to the raw file it came from. Nothing here comes from training data. Where the
archive is thin or the sources disagree, that is stated rather than smoothed.

---

## 1. The intelligence cycle, and what it is supposed to produce

| Stage | Content | Source |
|---|---|---|
| Collect | Product intelligence (features, changes, reviews), pricing intelligence (costs, tiers, hidden fees), positioning intelligence (messaging, targeting, claims) | [raw/ci--method--northr-ci-framework.md] |
| Analyze | What changed and why it matters, where strengths and weaknesses sit, what patterns emerge from sales conversations | [raw/ci--method--northr-ci-framework.md] |
| Distribute | Battle cards, competitive alerts, win-loss debriefs | [raw/ci--method--northr-ci-framework.md] |
| Act | Use before, during, and after calls to handle objections | [raw/ci--method--northr-ci-framework.md] |

The strategic-foresight tradition runs the same shape with different names: information
gathering (scanning plus monitoring), diagnosis (analysis, clustering, prioritization),
response [raw/ci--weak-signals--wikipedia-sews.md]. Horizon scanning adds an explicit
objectives-definition step before collection and an explicit
prioritize-cluster-share step before action [raw/ci--new-entrants--qmarkets-horizon-scanning.md].

**The failure point is between collect and analyze.** "Collection without analysis reverts
the analyst to the role of a librarian" [raw/ci--adoption--pma-why-ci-programs-fail.md].
A digest that lists what happened without saying what changed is a librarian's output.

---

## 2. Where competitive intelligence actually comes from

The archive splits sources cleanly into internal and external.

**Internal:** stakeholder interviews, internal messaging platforms, win-loss interviews,
CRM data and deal notes, call recordings [raw/ci--sources--klue-internal-external-sources.md].
Add CRM deal notes in unstructured form, call recordings, internal Slack and Teams
messages, and customer feedback and churn surveys
[raw/ci--sources--sifthub-untapped-internal.md].

**External:** PR and news, web content and social media, product/packaging/pricing,
personnel and hiring, customers and review websites
[raw/ci--sources--klue-internal-external-sources.md].

### 2.1 The internal half is the acknowledged blind spot

"Before you spend a dime on external consultants or expensive scraping tools, look inside
your own building." Organizations hold "terabytes of proprietary competitive data" that
stays "trapped in silos" [raw/ci--sources--sifthub-untapped-internal.md].

The stated distinction matters for this skill's design: public sources represent
**controlled** information, while field intelligence, explicitly described as "rumors,
screenshots, and emails" shared in internal channels, provides **unfiltered** market
reality [raw/ci--sources--sifthub-untapped-internal.md].

The recommended capture mechanism in that source is a manual one: "Create a dedicated
#competitive-intel channel. Encourage 'scouts', reps, CSMs, and support staff to dump
rumors, screenshots, and emails there" [raw/ci--sources--sifthub-untapped-internal.md].
Note what this requires: a human noticing, deciding it matters, and posting it. Every
sighting that nobody bothered to post does not exist.

### 2.2 Buyer-sourced beats seller-sourced beats public

Win-loss analysis exists because the three information layers are not equally true:

| Layer | Content | Source |
|---|---|---|
| Visible | Public marketing messages and feature comparisons, what everyone sees | [raw/ci--method--corporatevisions-win-loss.md] |
| Shadow | "positioning shifts, unofficial narratives, and real-time tactical adjustments" during actual deals | [raw/ci--method--corporatevisions-win-loss.md] |
| Strategic | Deeper patterns showing where competitors consistently win or lose | [raw/ci--method--corporatevisions-win-loss.md] |

Sellers explaining their own losses are unreliable: they "default to the usual suspects:
pricing was too high, features were missing, or that old classic, 'the decision was made
before we got there'" [raw/ci--method--corporatevisions-win-loss.md]. From analysis of
6,000 plus B2B deals, only 25 percent of enterprise deals are truly competitive, and
"competitors aren't winning with better features or lower prices, they're winning by
preventing true competition from emerging in the first place"
[raw/ci--method--corporatevisions-win-loss.md].

**Design consequence:** a competitor named by a prospect or client in a live conversation
outranks the same competitor's own press release as evidence of what is happening in the
market. That ordering is supported directly by the visible-versus-shadow layer split
[raw/ci--method--corporatevisions-win-loss.md] and by the placement of sales calls as the
first-listed method for finding new competitors
[raw/ci--new-entrants--contify-detect-new-competitors.md].

### 2.3 Internal claims need verification

Field intelligence is not self-certifying: "You cannot just take your stakeholder's word
as gospel. Make sure you verify what gets shared in the channel"
[raw/ci--sources--klue-internal-external-sources.md]. Analysis should rest on information
"triangulated from multiple sources, including open-source, subscription, syndicated, and
primary" [raw/ci--ethics--pragmatic-institute-guardrails.md].

---

## 3. What existing competitive intelligence tooling monitors

Every tool in the surveyed landscape monitors a supplied set of external sources
[raw/ci--tooling--contify-tool-landscape.md]:

| Monitoring surface | Tools named |
|---|---|
| News feeds, company websites, regulatory portals, website change detection | Contify, Crayon, WatchMyCompetitor, Kompyte |
| Search engines, ads, backlinks, SEO | SEMRush, SpyFu, SimilarWeb |
| Filings, transcripts, expert calls, broker research | AlphaSense |
| Aggregation from systems the company already owns (370 plus integrations) | Wide Narrow |
| Field intelligence plus global news | Valona Intelligence |
| Open web news, blogs, forums | Google Alerts (free) |

All citations in the table above: [raw/ci--tooling--contify-tool-landscape.md].

Two structural facts follow, both grounded in that file:

1. **The unit of configuration is a name or URL the user already knows to enter.** Crayon
   prices per competitor tracked, and WatchMyCompetitor's cost rises per competitor
   tracked [raw/ci--tooling--contify-tool-landscape.md]. A monitoring model that charges
   per tracked name is structurally incapable of surfacing a name nobody has entered.
2. **Only two of eleven descriptions include internal or field intelligence** (Wide
   Narrow, Valona), and both require the organization to deliberately populate that data;
   Wide Narrow's stated limitation is that it "requires significant data population
   effort" [raw/ci--tooling--contify-tool-landscape.md].

**Noise is a named, unsolved problem in this category.** Google Alerts produces "hundreds
of alerts" and "unrelated information"; WatchMyCompetitor produces "incorrect tagging"
and "irrelevant alerts"; multiple platforms have feature sets overwhelming enough to
limit usability [raw/ci--tooling--contify-tool-landscape.md]. Over-reliance on tools
without human analysis is one of the four named causes of CI program failure
[raw/ci--adoption--pma-why-ci-programs-fail.md].

---

## 4. Cadence: what the evidence supports

| Activity | Recommended cadence | Source |
|---|---|---|
| Competitor news and update monitoring | Weekly scans | [raw/ci--method--northr-ci-framework.md] |
| Pricing verification | Before every competitive deal | [raw/ci--method--northr-ci-framework.md] |
| Battle card refresh | Quarterly, or on significant change | [raw/ci--method--northr-ci-framework.md] |
| Win-loss debrief sharing | Weekly | [raw/ci--method--northr-ci-framework.md] |
| Horizon scanning | Ongoing, with quarterly reviews | [raw/ci--new-entrants--qmarkets-horizon-scanning.md] |
| New competitor identification | Continuous, "not a one-time exercise", no interval given | [raw/ci--new-entrants--contify-detect-new-competitors.md] |

The strongest quantitative support for a weekly beat is vendor-surveyed: 56 percent of
teams share intelligence weekly, daily, or in real time; teams sharing weekly or faster
report 79 percent revenue impact versus 41 percent for monthly or slower; 83 percent
report revenue impact when updating deliverables weekly or faster
[raw/ci--adoption--crayon-state-of-ci-2026.md].

**Caveat carried forward, not dropped:** that survey's page does not state sample size or
methodology, and it is published by a CI vendor whose product sells the weekly habit
[raw/ci--adoption--crayon-state-of-ci-2026.md]. The direction is corroborated by an
independent vendor recommending weekly monitoring
[raw/ci--method--northr-ci-framework.md], but the specific percentages should not be
quoted to a user as measured fact.

---

## 5. Weak signals: the theory behind new-entrant detection

### 5.1 Definitions

- Ansoff (1975): weak signals are "bribes of information" corresponding to an early, vague
  knowledge state; unstructured, fragmented, incomplete data in "the hazy area at the edge
  of an organization's vision" [raw/ci--weak-signals--dpublication-interpretation.md].
- Godet: "a factor of change hardly perceptible at present, but which will constitute a
  strong trend in the future" [raw/ci--weak-signals--dpublication-interpretation.md].
- Hiltunen (2008): a weak signal has three dimensions, signal, question, and
  interpretation, and interpretation is inherently subjective and tied to the observer's
  context [raw/ci--weak-signals--dpublication-interpretation.md].

### 5.2 Ansoff's states of knowledge

Three successive phases: early stage (only the conviction that a rupture-marked event is
beginning), intermediate phases (progressive enrichment through successive information
waves), final stage (enough information to plan a strategic response). Each phase carries
increasingly specific response options, starting with low-impact preparatory actions
[raw/ci--weak-signals--dpublication-interpretation.md].

**This is the argument for velocity over volume.** A signal moving from phase one to phase
two, meaning more independent information waves arriving about the same subject, is the
observable event. Steady-state knowledge is not
[raw/ci--weak-signals--dpublication-interpretation.md].

### 5.3 Ansoff's three filters

| Filter | Function | Failure mode it names |
|---|---|---|
| Observation | Collects and selects environmental information | You never saw it |
| Cognitive | Assesses value and relevance | You saw it and dismissed it |
| Power | Transmits knowledge to decision makers | You saw it, valued it, and it never reached anyone who could act |

All three: [raw/ci--weak-signals--dpublication-interpretation.md].

### 5.4 Signal versus noise: honestly unsolved

Noise is "the background mass of parasitic signs and irrelevant facts pointing in
inconsistent directions". And directly: "It is difficult to distinguish between noise and
weak signals since there is no practical formula for distinguishing and assessing
intuition" [raw/ci--weak-signals--dpublication-interpretation.md].

Hiltunen's alternative is a subjective expert-reaction test: does it make colleagues
laugh, do they deny it will happen, does it stimulate thinking, is it previously unheard,
is it taboo [raw/ci--weak-signals--dpublication-interpretation.md]. Hiltunen also splits
weakness into early warnings (low number, low visibility, for example a new invention) and
first symptoms (numerous, visible, hard to interpret, for example behavioral changes)
[raw/ci--weak-signals--dpublication-interpretation.md].

**Named gap.** No source in this archive supplies a numeric threshold for how many
independent mentions convert an observation into a signal. The academic source states
plainly that no practical formula exists
[raw/ci--weak-signals--dpublication-interpretation.md]; the vendor sources score by
"impact, timing, and strategic relevance" without defining the scale
[raw/ci--new-entrants--qmarkets-horizon-scanning.md]. Any counting threshold this skill
uses is a working convention, not a researched constant, and must be labeled as such.

### 5.5 Why organizations miss weak signals

- Blind spots: internal expert assessments significantly underestimate impact and
  uncertainty compared with external experts (Meissner, Brands, Wulf, 2017)
  [raw/ci--weak-signals--dpublication-interpretation.md]. Blindspot analysis is named as a
  required component of an early warning cycle
  [raw/ci--weak-signals--wikipedia-sews.md].
- Suppression of outliers: requesting expert advice inside an organization suppresses
  "radical people" who might offer outside-paradigm perspectives
  [raw/ci--weak-signals--dpublication-interpretation.md].
- Retrospective bias: people retroactively "want to see warnings" in past events
  [raw/ci--weak-signals--dpublication-interpretation.md].
- Structural tension: organizations reduce uncertainty internally, while peripheral
  weak-signal detection should "shake the stability of these patterns"
  [raw/ci--weak-signals--dpublication-interpretation.md].
- Weak signals are distinct from wild cards, which are "discrete phenomena that cannot be
  recognized in advance" and have no precursors. Only weak signals are detectable in
  advance [raw/ci--weak-signals--dpublication-interpretation.md].

Foundational attribution: environmental scanning methodology to Aguilar (1967), weak
signals and strategic issue management to Ansoff (1975, 1980), organizational blindspots
in a competitive intelligence context to Gilad (1998, 2003)
[raw/ci--weak-signals--wikipedia-sews.md].

---

## 6. Finding names you do not already track

Eight methods, in the order the source lists them: sales calls, analyst reports, industry
events and conferences, social media, press releases and news, customer reviews, patent
and trademark filings, non-English sources
[raw/ci--new-entrants--contify-detect-new-competitors.md].

Entry signals: unfamiliar competitor names mentioned in sales conversations, funding
announcements, executive or leadership changes, product launch announcements, management
transitions, customer preference shifts
[raw/ci--new-entrants--contify-detect-new-competitors.md].

Two points worth carrying into design:

1. **Sales calls are listed first**, ahead of every public monitoring source, for the
   specific job of finding names you do not already track
   [raw/ci--new-entrants--contify-detect-new-competitors.md].
2. **Tiering is Tier 1 primary and Tier 2 secondary or emerging, based on deal impact**
   [raw/ci--new-entrants--contify-detect-new-competitors.md]. Horizon scanning treats
   startup activity and venture funding as core weak-signal inputs and looks "further out"
   than environmental scanning [raw/ci--new-entrants--qmarkets-horizon-scanning.md].

Scale context: 70 percent of teams track 30 or fewer competitors, and the largest group
tracks 11 to 30 [raw/ci--adoption--crayon-state-of-ci-2026.md]. A watchlist is a small,
curated object, not an ever-growing list.

---

## 7. Ethics and legality

### 7.1 The SCIP code, verbatim provisions

Seven commitments: elevate the profession; "comply with all applicable laws, domestic and
international"; "accurately disclose all relevant information, including one's identity
and organization, prior to all interviews"; avoid conflicts of interest; provide honest
and realistic recommendations and conclusions; promote the code within one's company, with
third-party contractors, and within the profession; adhere to company policies, objectives
and guidelines [raw/ci--ethics--scip-code-of-ethics.md].

Scope statement: "The Code is not a corporate policy; it contains guidelines by which
companies and practitioners can set their own standards along the ethical spectrum"
[raw/ci--ethics--scip-code-of-ethics.md]. SCIP can revoke membership for direct violation
[raw/ci--ethics--scip-code-of-ethics.md].

### 7.2 The legal floor

- Economic Espionage Act of 1996, 18 U.S.C. sections 1831 to 1839, criminalizing trade
  secret theft via bribery, hacking, or misappropriation
  [raw/ci--ethics--citools-legal-framework-cases.md].
- Uniform Trade Secrets Act, antitrust regulation (competitors may not discuss market
  division or pricing), fraud statutes covering misrepresentation of identity or purpose,
  and local law on trespass and theft [raw/ci--ethics--pragmatic-institute-guardrails.md].
- Telephone Records and Privacy Protection Act of 2006, which made pretexting for phone
  records a federal felony after the HP case
  [raw/ci--ethics--citools-legal-framework-cases.md].
- The operative distinction: public-domain information triggers no liability; stolen trade
  secrets trigger criminal exposure [raw/ci--ethics--citools-legal-framework-cases.md].

### 7.3 Legitimate versus prohibited, consolidated

| Legitimate | Prohibited |
|---|---|
| Competitor websites, pricing pages, job postings; regulatory filings, patents, earnings calls; product teardowns of purchased items; review platforms, news, conference talks [raw/ci--ethics--citools-legal-framework-cases.md] | Hacking or credential reuse; misrepresenting identity, employer, or purpose; theft of documents, prototypes, or trade secrets; paying insiders for confidential information; unlawful conversation recording [raw/ci--ethics--citools-legal-framework-cases.md] |
| Trade shows and conferences with full disclosure of identity and employer [raw/ci--ethics--citools-legal-framework-cases.md] | Pretending to be a customer at trade shows [raw/ci--ethics--pragmatic-institute-guardrails.md] |
| Internal company sources: field and support employees contributing insight [raw/ci--ethics--pragmatic-institute-guardrails.md] | Pressuring employees hired from a competitor to disclose information covered by a prior NDA [raw/ci--ethics--pragmatic-institute-guardrails.md] |
| Public databases, industry reports, online platforms, transparent market research [raw/ci--ethics--kompyte-too-far-cases.md] | Using current or former employees to obtain trade secrets; purchasing stolen confidential information [raw/ci--ethics--kompyte-too-far-cases.md] |

Categories named as more protected than ordinary public information: pricing data,
salesforce compensation, development and marketing timelines, bundling strategies
[raw/ci--ethics--pragmatic-institute-guardrails.md].

### 7.4 The risk ladder

Five collection approaches in ascending risk order: secondary CI (lowest), internal
company sources (low), external informant network (moderate), trade show and event
intelligence (moderate to high), primary intelligence via direct communication (highest)
[raw/ci--ethics--pragmatic-institute-guardrails.md].

The heuristics offered: "If it feels wrong, it probably is" and "If you don't want your
mother to see it in the news, you probably shouldn't do it"
[raw/ci--ethics--pragmatic-institute-guardrails.md].

### 7.5 Cases, for calibration

| Case | Conduct | Outcome |
|---|---|---|
| Air Canada v. WestJet (2004 to 2006) | Used a former employee's credentials to access a password-protected site | Settled 15.5 million dollars [raw/ci--ethics--citools-legal-framework-cases.md] |
| Volkswagen and GM (1997) | Documents illegally obtained from a departing executive | 100 million dollars [raw/ci--ethics--citools-legal-framework-cases.md] |
| HP (2006) | Pretexting phone carriers for 12 people's records | Settled 14.5 million dollars [raw/ci--ethics--citools-legal-framework-cases.md] |
| Oracle and Microsoft (2000) | Investigators sought trash of Microsoft-aligned groups | Public exposure [raw/ci--ethics--citools-legal-framework-cases.md] |
| Uber and Waymo (2016) | Levandowski downloaded over 14,000 files | 33 counts, 179 million dollars restitution, 18 months prison, later pardoned [raw/ci--ethics--kompyte-too-far-cases.md] |
| Tesla and XPeng | 300,000 files and directories sent to personal iCloud | Settled 2021, undisclosed [raw/ci--ethics--kompyte-too-far-cases.md] |
| Apple and Baidu (2017) | Accessed proprietary self-driving information | Maximum 10 years, 250,000 dollars per count [raw/ci--ethics--kompyte-too-far-cases.md] |

**Pattern across every case in the archive: a person took, accessed, or bought material
they were not entitled to have.** Not one case involves someone drawing a conclusion from
something they legitimately saw
[raw/ci--ethics--citools-legal-framework-cases.md][raw/ci--ethics--kompyte-too-far-cases.md].

### 7.6 Conflict in the archive: bright line versus graded ladder

Aqute argues for eliminating gray areas entirely: "if you find yourself asking whether a
practice is legal, then you probably shouldn't be doing it"
[raw/ci--ethics--aqute-is-ci-ethical.md]. Pragmatic Institute instead publishes a five-rung
risk ladder and tells practitioners how to operate safely on each rung
[raw/ci--ethics--pragmatic-institute-guardrails.md].

**Preferred reading: the graded ladder, with Aqute's rule kept as a tie-breaker.** The
bright-line rule as stated would forbid ordinary market research, since the Aqute source
itself endorses interviewing industry professionals as a "normal and natural part of
trading" [raw/ci--ethics--aqute-is-ci-ethical.md]. A ladder that names risk per method is
more usable, and the SCIP code explicitly pushes residual judgment back to company policy
rather than claiming to resolve every case [raw/ci--ethics--scip-code-of-ethics.md].

### 7.7 Named gap: passive and incidental observation is not covered

**No source in this archive addresses information that arrives without being sought:
material observed during a partner or client screen share, a screenshot someone else
posted, a slide left up in a call, or a competitor's dashboard visible in a demo.**

- The SCIP code's disclosure provision governs interviews, meaning active elicitation
  [raw/ci--ethics--scip-code-of-ethics.md].
- Every prohibited practice in the consolidated list is an act of taking, accessing, or
  misrepresenting [raw/ci--ethics--citools-legal-framework-cases.md].
- The Kompyte article on CI going too far gives no rule for inadvertent receipt despite
  covering NDAs in passing [raw/ci--ethics--kompyte-too-far-cases.md].

What the archive does supply for constructing a rule by analogy:

1. The prohibitions are about **acquisition conduct**, not about the act of noticing
   [raw/ci--ethics--citools-legal-framework-cases.md][raw/ci--ethics--kompyte-too-far-cases.md].
2. NDAs are treated as binding constraints that survive the change of context, in the case
   of an employee arriving from a competitor
   [raw/ci--ethics--pragmatic-institute-guardrails.md].
3. Certain categories are named as more protected than public information regardless of
   how they were obtained: pricing data, compensation, development and marketing
   timelines, bundling strategies [raw/ci--ethics--pragmatic-institute-guardrails.md].
4. The publication heuristic is a working test: would you want it in the news
   [raw/ci--ethics--pragmatic-institute-guardrails.md].

**Constructed rule, labeled as inference from the four points above rather than as a
sourced fact:** noticing what was legitimately in front of you in the ordinary course of
business is awareness, and it is on the low-risk internal-sources rung
[raw/ci--ethics--pragmatic-institute-guardrails.md]. Deliberately mining another party's
screen for material they did not intend to show you is an acquisition act and belongs with
the prohibited conduct. Anything under NDA or shared in confidence stays out entirely,
by extension of the NDA rule [raw/ci--ethics--pragmatic-institute-guardrails.md].
Anything in the protected categories stays internal and never gets republished
[raw/ci--ethics--pragmatic-institute-guardrails.md].

### 7.8 Liability extends to whoever acts for you

"Your vendor must follow the same laws as your company", and companies stay liable where
vendors are pushed to violate law [raw/ci--ethics--pragmatic-institute-guardrails.md].
"hired private investigators operate under your name, and their illegal activities become
your headlines" [raw/ci--ethics--citools-legal-framework-cases.md]. An automated agent
collecting on the user's behalf is squarely inside that principle.

---

## 8. Why competitive intelligence gets ignored inside organizations

### 8.1 The four failure modes

Cookie-cutter content ignoring individual stakeholder needs; fragmented intelligence never
integrated across sources; poor competitor identification with no infrastructure to track
who competitors actually are; over-reliance on tools without human analysis
[raw/ci--adoption--pma-why-ci-programs-fail.md].

Ownership problem, quoted: "If competitive data is everyone's job, it's no one's job"
[raw/ci--adoption--pma-why-ci-programs-fail.md].

### 8.2 Measured evidence on what makes a deliverable go unread

From 150 plus battlecard audits [raw/ci--adoption--klue-battlecard-mistakes-data.md]:

| Finding | Number |
|---|---|
| Cards including talk tracks | 43 percent |
| Cards providing supporting evidence | 19 percent |
| Highest-retention cards containing both | 100 percent |
| Cards including customer-facing proof points | 35 percent |
| Immature programs collecting field feedback | 3 times less likely |
| Cards including guidance on when and how to deploy | 1.5 times less likely |

All rows: [raw/ci--adoption--klue-battlecard-mistakes-data.md]. The prescription is the
"Know, Say, Show" method: context, talking points, proof
[raw/ci--adoption--klue-battlecard-mistakes-data.md]. Marketing-heavy filler language,
"robust" and "seamless" named explicitly, is a symptom of no field input
[raw/ci--adoption--klue-battlecard-mistakes-data.md].

Baseline stakes: 33 percent of deals are lost directly to competitors and nearly 50
percent of those were winnable [raw/ci--adoption--klue-battlecard-mistakes-data.md].

### 8.3 Named gap on digest fatigue

**No source in this archive measures whether recurring competitive digests get read over
time, or how repetition affects readership.** The nearest supported claims are that
undifferentiated content fails because it ignores what the reader needs
[raw/ci--adoption--pma-why-ci-programs-fail.md], that deliverables lacking action-oriented
content have measurably lower retention
[raw/ci--adoption--klue-battlecard-mistakes-data.md], and that alert volume is a named
usability problem across the tooling category
[raw/ci--tooling--contify-tool-landscape.md]. A design rule that a recurring digest must
report only what is new and what is accelerating is a reasonable extrapolation from those
three, and should be presented as a design choice rather than as a researched finding.

---

## 9. Design conclusions this skill takes from the archive

| Design decision | Grounding |
|---|---|
| Weekly recurring digest, not monthly | Weekly monitoring recommended [raw/ci--method--northr-ci-framework.md]; weekly-or-faster sharing associated with materially higher reported revenue impact, vendor-surveyed [raw/ci--adoption--crayon-state-of-ci-2026.md] |
| Report what is new and what is accelerating, not the standing landscape | Ansoff's phase progression makes movement the observable [raw/ci--weak-signals--dpublication-interpretation.md]; undifferentiated content is a named failure mode [raw/ci--adoption--pma-why-ci-programs-fail.md] |
| Velocity over volume | Signal strength progresses through successive information waves [raw/ci--weak-signals--dpublication-interpretation.md] |
| A competitor named on a client or prospect call is the highest-value sighting | Shadow layer beats visible layer [raw/ci--method--corporatevisions-win-loss.md]; sales calls listed first for finding unknown names [raw/ci--new-entrants--contify-detect-new-competitors.md] |
| Corroboration threshold is a stated convention, not a constant | No practical formula exists to separate signal from noise [raw/ci--weak-signals--dpublication-interpretation.md] |
| Category-shaped, bounded queries rather than unbounded sweeps | Alert volume and irrelevant results are the named failure of broad monitoring [raw/ci--tooling--contify-tool-landscape.md] |
| Watchlist stays small and user-confirmed | 70 percent of teams track 30 or fewer competitors [raw/ci--adoption--crayon-state-of-ci-2026.md]; poor competitor identification is a named failure mode [raw/ci--adoption--pma-why-ci-programs-fail.md] |
| Separate observation from the so-what, and mark inference | Collection without analysis produces a librarian [raw/ci--adoption--pma-why-ci-programs-fail.md]; honest recommendations are a code provision [raw/ci--ethics--scip-code-of-ethics.md] |
| Nothing derived from another person's screen goes outward | Protected categories [raw/ci--ethics--pragmatic-institute-guardrails.md]; publication heuristic [raw/ci--ethics--pragmatic-institute-guardrails.md]; agent acting for you carries your liability [raw/ci--ethics--citools-legal-framework-cases.md] |
| Internal claims get verified before they get acted on | Do not take a stakeholder's word as gospel [raw/ci--sources--klue-internal-external-sources.md]; triangulate across source types [raw/ci--ethics--pragmatic-institute-guardrails.md] |

---

## 10. Gaps in this archive, stated plainly

1. **No numeric signal threshold exists in the literature.** Section 5.4.
2. **No source covers the ethics of incidentally observed material.** Section 7.7. The
   rule this skill uses is constructed by analogy and labeled as such.
3. **No measurement of recurring-digest readership over time.** Section 8.3.
4. **Cadence sources disagree on new-entrant re-scan interval:** weekly monitoring
   [raw/ci--method--northr-ci-framework.md], ongoing with quarterly reviews
   [raw/ci--new-entrants--qmarkets-horizon-scanning.md], continuous with no interval
   [raw/ci--new-entrants--contify-detect-new-competitors.md]. This skill runs new-entrant
   detection weekly against a rolling window and reconciles quarterly, which sits inside
   all three readings rather than picking one.
5. **The quantitative sources are vendor-published.** Crayon, Klue, and Contify all sell
   into this category [raw/ci--adoption--crayon-state-of-ci-2026.md]
   [raw/ci--adoption--klue-battlecard-mistakes-data.md]
   [raw/ci--tooling--contify-tool-landscape.md]. Directional use only. No academic or
   government measurement of small-company CI practice surfaced in this sweep.
6. **Small-company specific practice is thin.** The only direct guidance found is that
   "CI is a habit, not a tool", that one person typically synthesizes while "everyone
   contributes observations", and that free tools suffice to start
   [raw/ci--method--northr-ci-framework.md]. Everything else in the archive is written for
   teams with a dedicated CI function.
