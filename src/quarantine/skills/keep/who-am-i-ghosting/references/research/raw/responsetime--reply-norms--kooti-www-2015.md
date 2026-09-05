# Evolution of Conversations in the Age of Email Overload

- **Title:** Evolution of Conversations in the Age of Email Overload
- **Authors:** Farshad Kooti, Luca Maria Aiello, Mihajlo Grbovic, Kristina Lerman, Amin Mantrach
- **Venue:** Proceedings of the 24th International Conference on World Wide Web (WWW 2015),
  Yahoo Labs. arXiv preprint 1504.00704.
- **URL:** https://arxiv.org/abs/1504.00704v1 and https://arxiv.org/pdf/1504.00704
- **Fetched:** 2026-08-17
- **Source type:** academic (peer reviewed conference, very large observational dataset)
- **Window note:** 2015, outside the default six month window. Retained because it is the
  largest published measurement of email reply latency and nothing in the recent sweep
  supersedes it. Recent material on the same question is vendor content marketing.

## Dataset

"more than 2 million users exchanging 16 billion emails over several months."

## Reply time

| Measure | Value |
|---|---|
| Most likely reply time | 2 minutes |
| Median reply time | 47 minutes |
| Mean reply time | 1157 minutes |
| Standard deviation | 19,730 |
| Share of replies within one day | "more than 90% happen within a day of receiving the message" |
| Half of replies | "half of the replies are within 47 minutes" |

### Median reply time by age

"13 minutes for teens, 16 minutes for young adults (20 to 35 years old), 24 minutes for
adults (36 to 50 years old), and 47 minutes for mature users (51 and older)"

### Median reply time by other cuts

| Cut | Value |
|---|---|
| Men | 24 minutes |
| Women | 28 minutes |
| Phone | 28 minutes |
| Tablet | 57 minutes |
| Desktop | 62 minutes |
| With attachment | 56 minutes |
| Without attachment | 32 minutes |

Weekday replies are substantially faster than weekend replies. "Messages received during
the night get slower replies than those received during working hours."

## Reply length

| Measure | Value |
|---|---|
| Most likely reply length | 5 words |
| Median reply length | 43 words |
| Mean reply length | 153 words |
| Standard deviation | 419 |
| Share over 100 words | "30% of emails are longer than 100 words" |

Median reply length by age: teens 17 words, young adults 21, adults 31, mature users 40.
By device: phone 20 words, tablet 27, desktop 60.

## Reply rate and the effect of load

- Users initially reply to "about only a third of the messages in their inbox."
- At low load, replies cover "about 25% of all emails received in a day."
- At a load of roughly 100 emails per day, users reply to "less than 5% of emails."
- "Reply time decreases rapidly as information load increases." Under load people reply
  faster and shorter, to fewer messages.
- "length of replies also decreases as email load grows."
- Teens experience "little overload, replying to a constant fraction of emails." Older
  users degrade progressively.

## Thread structure

| Measure | Value |
|---|---|
| Threads that are one message and one reply | "more than 30% of threads have only one step" |
| Emails per thread, mean / median | 3.76 / 2 |
| Threads per conversation, mean / median | 13.94 / 9 |
| Thread duration, mean / median | 53.2 hours / 3.5 hours |
| Threads lasting longer than one day | 22% |

## Prediction results

Reply time 58.8% accuracy (67.1% relative improvement over baseline). Reply length 71.8%
accuracy (113.7% relative improvement). Predicting the last email in a thread 65.9%
accuracy (30.2% relative improvement).

## Why this source matters here

It supplies the base rate that makes "days cold" interpretable. If more than 90 percent
of all replies happen inside a day and the median is 47 minutes, then a thread silent for
three weeks is far outside the norm and the norm-violation argument does not need to be
asserted from intuition. It also caps draft length: a 43 word median reply is what normal
looks like.
