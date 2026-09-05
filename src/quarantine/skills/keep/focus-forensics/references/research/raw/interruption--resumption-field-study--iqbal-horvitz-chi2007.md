# Disruption and Recovery of Computing Tasks: Field Study, Analysis, and Directions

- **Title:** Disruption and Recovery of Computing Tasks: Field Study, Analysis, and Directions. Shamsi T. Iqbal, Eric Horvitz. Proceedings of ACM CHI 2007.
- **URL:** http://erichorvitz.com/CHI_2007_Iqbal_Horvitz.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed conference paper)

## Why this source matters for focus-forensics

It is the closest published analogue to what this skill is trying to do, and it shows the
gap. Iqbal and Horvitz had a continuous event stream: every window open and close, every
switch, keyboard and mouse activity, alert arrivals, and window occlusion percentages.
Littlebird has none of that. Reading this paper is how you calibrate how much less a
periodic snapshot stream can say.

## Method, quoted

- "27 people at our organization, whose job descriptions ranged from program manager,
  administrator, and researcher to software developer."
- "2,267 hours of activity data over a period of 2 weeks, resulting in 974 sessions
  (M(session length)=2h, 17m, S.D= 410.37 m)."
- Instrument: a tool logging "the name, size, and location of all windows on a computing
  system, noting the opening and closing of windows. The system also logs user activities,
  including when users are actively engaged with the software, keyboard and mouse
  activity, and switches among windows as well as actions of saving, cutting, and pasting."
  It "also logs alerts from email and IM systems."
- Privacy handling: "window titles were truncated, and only a subset of keyboard events
  were recorded".

## Definitions, quoted

- Diversion phase: "the time between the switch from the primary task to respond to the
  alert and the return to the primary task".
- Resumption phase: "the user finishes interactions with interrupting and peripheral
  applications and seeks to a return of conceptual context".
- Resumption threshold: "users to resume a suspended task if they had spent more than 15
  seconds on the suspended application".

## Quantitative findings, quoted

| Finding | Value as printed |
|---|---|
| Alert rate | "an average of 4.28 email (S.D.=5.56) alerts and 3.21 IM (S.D.=4.31) alerts, with an overall average rate of 3.74/hour" |
| Time to return to a suspended application, email | "9 minutes and 33 seconds (S.D.=13m, 15s)" |
| Time to return, IM | "8 minutes (S.D.=11m, 32s) on average" |
| Resumption phase, email, immediate response | "16 minutes and 33 seconds (S.D.=27m, 20s)" |
| Resumption phase, email, delayed response | "15 minutes and 50 seconds (S.D.=25m, 5s)" |
| Resumption phase, IM, immediate response | "10 minutes and 58 seconds (S.D.=14m, 16s)" |
| Resumption phase, IM, delayed response | "12 minutes and 2 seconds (S.D.=14m, 58s)" |
| Immediate email responses | "40.8% (2344/5747) of the email alerts, users responded immediately (under 15s)" |
| Immediate IM responses | "71.01% (3186/4487) of the IM alerts resulted in an immediate response" |
| Windows left suspended | "on average 3 (S.D.=1.92) task windows suspended" |
| Long diversions | "27% of the alerts resulted in users being diverted from these prior active windows for more than 2 hours into the resumption phase" |

Task switch rates per minute, by phase, as printed:

| Phase | Email | IM |
|---|---|---|
| Pre-interruption | 0.84 (0.6) | 0.84 (0.6) |
| Diversion | 1.33 (1.95) | 1.42 (2.36) |
| Resumption | 2.34 (2.71) | 2.56 (2.82) |

Two structural findings:

- Occlusion matters: "suspended application windows that were less than 25% visible
  because of obscuration by other windows took significantly longer to return to as
  compared to application windows that were more than 75% visible (t(20)=3.131, p under
  0.005)".
- Short pre-interruption engagement predicts abandonment: "if users spent less than 5
  minutes on a task before suspension, they had a 10% probability of not resuming the task
  within 2 hours".

## Limitation the authors state

The paper does not claim clean task boundaries from window logs. It notes that "it is
difficult to identify exactly when the resumption phase may begin" and uses heuristics to
approximate the boundary. That is the honest position of researchers with a full
continuous event log.

## Direct implication for the skill

Three implications.

1. The switch rate rises during and after a diversion, by a factor of roughly two to three
   in this data. That is why a burst of rapid switching is a legitimate structural
   signature to flag, independent of any duration claim.
2. Resumption values in this study land between 8 and 17 minutes depending on which phase
   is measured, with standard deviations larger than the means in every row. The band is
   wide and the definition of what is being measured moves the number more than the
   population does.
3. If researchers with a continuous event log describe the task boundary as difficult to
   identify and reach for heuristics, then a skill working from periodic screen snapshots
   with no window focus data, no keyboard activity and no occlusion data cannot claim to
   identify it at all. It can identify observations, and gaps between observations.
