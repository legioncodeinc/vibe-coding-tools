# Bored Mondays and Focused Afternoons: The Rhythm of Attention and Online Activity in the Workplace

- **Title:** Bored Mondays and Focused Afternoons: The Rhythm of Attention and Online Activity in the Workplace. Gloria Mark, Shamsi Iqbal, Mary Czerwinski, Paul Johns. Proceedings of ACM CHI 2014.
- **URL:** https://ics.uci.edu/~gmark/Home_page/Publications_files/Focus%20_1.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed conference paper)

## Why this source matters for focus-forensics

Two things. It is the published evidence that attentional state has a reproducible
rhythm across the hours of the day and the days of the week, which is what makes
hour-of-day comparison a defensible unit of analysis. And it contains the single most
important limitation statement in this whole archive: even with full continuous OS-level
window logging, the researchers could not tell from the log how engaged the user was with
the window in front of them. They needed to interrupt the user and ask.

## Method, quoted

- "Thirty-two people (17 females, 15 males) participated."
- "five days, Monday through Friday" yielding "160 person-days, or 1,509 hours of data
  collection."
- Logging: "custom-built software that captured all activity in the Windows 7.0 Operating
  System."
- Experience sampling: "a hybrid interval-contingent and event-contingent sampling
  approach", triggered on leaving email or Facebook after uninterrupted use, or on login.
  "2,809 experience sampling probes" were collected, averaging "17.56 probe responses per
  day" per participant.
- Constructs: focus and boredom were built from engagement and challenge ratings. "We
  normalized all responses" and "chose to exclude the mid-range values and just use the
  top and bottom thirds." Focus is the top third of both engagement and challenge; bored
  is the bottom third of both.

## Findings, quoted

- Hour of day: "People are most focused in their work mid-afternoon, with a peak at 2-3
  p.m."
- Day of week: "Participants report most in the Focus quadrant on Mondays but also they
  report most being Bored on Mondays." And "about double the incidence of reports in the
  Bored quadrant on Monday (27.8%) compared to Friday (13.3%)."
- Application correlates: "Users spent significantly less time on Email while reporting
  Bored compared to Focused." For Facebook, users "spent significantly less time on FB in
  the Focus state, compared to both the Bored and the Rote states." Internet surfing and
  window switching correlated with boredom.

## The limitation statement, quoted

"it could not be known how engaged a user was with a window in active use" without the
experience sampling method. And: "Capturing what email was being read or any other
application interaction was not collected due to privacy and technical limitations."

## Direct implication for the skill

1. **Hour of day is a real axis and it is not flat.** Comparing a user's Tuesday 10am to
   their Tuesday 3pm is comparing like with like across a dimension the literature says
   varies systematically. That is what makes fragmentation-by-hour worth reporting even
   when the absolute counts inside each hour are not trustworthy.
2. **The user's own rhythm is the only valid reference.** This study's peak was mid
   afternoon in one sample of thirty-two people in one company. It is not a target and the
   skill never tells a user their peak should be at 2pm.
3. **The hardest constraint in the skill comes from this paper.** A full OS-level window
   log could not establish engagement. Littlebird has strictly less than that: it has
   periodic images of what was on the screen, with no guarantee that the visible window was
   the focused one, no keyboard or mouse activity, and no way to know whether the user was
   at the machine. If continuous logging cannot see engagement, snapshots certainly cannot,
   and any output phrased as "you were focused" or "you were distracted" is unsupported.
   The skill reports what appeared and how it changed. Engagement is the user's to supply.
