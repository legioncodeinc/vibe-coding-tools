# Characterizing and Predicting Email Deferral Behavior

- **Title:** Characterizing and Predicting Email Deferral Behavior
- **Venue:** Proceedings of the Twelfth ACM International Conference on Web Search and
  Data Mining (WSDM 2019). ACM DL: https://dl.acm.org/doi/10.1145/3289600.3291028.
  arXiv 1901.04375. Microsoft Research publication page:
  https://www.microsoft.com/en-us/research/publication/characterizing-and-predicting-email-deferral-behaviour/
- **URL:** https://www.microsoft.com/en-us/research/wp-content/uploads/2018/11/Characterizing_and_Predicting_Email_Deferral_Behavior.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (peer reviewed conference, industrial log study plus
  interviews)
- **Window note:** 2019, outside the default window. Retained as the only located
  large-scale measurement of deliberate reply postponement, which is the behavior that
  produces the backlog this skill surfaces.

## Method and scale

Qualitative interviews combined with log analysis of "forty thousand anonymized users of
a popular commercial email client" over two weeks, 6 to 19 May 2018, producing "about 3
million actions."

## Prevalence of deferral

| Measure | Value |
|---|---|
| Active users who defer at least one message per day | 16% |
| Share of all messages that get deferred | 3% |
| Triage sessions containing a deferral | at least 12% |

## Reply behavior in the same logs

- "around 10% of all messages receive a Reply, a ReplyAll or a Forward action; 26% of
  these actions are taken at a later time."
- The paper cites prior work finding people "defer responding to 37% of messages that need
  a reply."

## What predicts deferral

| Feature | Deferred | Not deferred |
|---|---|---|
| Mean recipient count | 3.9 | 7.0 |
| Action-request signal | 0.075 | 0.034 |
| Sent by a human rather than a system | 0.849 | 0.744 |

Workload effect: deferral probability rises from roughly 3 percent to roughly 14 percent
as the count of unhandled messages grows.

Deferral is enacted through Flag and MarkAsUnread, which are "more likely to be observed
for Deferred messages than Non-Deferred ones."

## Why this source matters here

The profile of a deferred message is the profile of a ghosting candidate, and it is
measured rather than assumed: few recipients, an explicit action request, a human sender.
That is three of the skill's gate conditions confirmed against 3 million logged actions.
The 37 percent deferral figure for messages that need a reply also sets expectations for
volume: the backlog is real and large, which is precisely why the output has to be capped
rather than complete.

The Flag and MarkAsUnread finding is the reason the skill sweeps snapshots of inbox and
notification screens. Deferral leaves a visible artifact on screen.
