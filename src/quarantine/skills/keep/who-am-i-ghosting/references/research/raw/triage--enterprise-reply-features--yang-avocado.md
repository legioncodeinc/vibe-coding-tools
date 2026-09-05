# Characterizing and Predicting Enterprise Email Reply Behavior

- **Title:** Characterizing and Predicting Enterprise Email Reply Behavior
- **Authors:** Liu Yang and co-authors (University of Massachusetts CIIR with Microsoft
  Research)
- **URL:** https://ciir-publications.cs.umass.edu/getpdf.php?id=1270
- **Fetched:** 2026-08-17
- **Source type:** academic (information retrieval conference paper, log study on a public
  research corpus)
- **Window note:** Outside the default six month window. Retained for the base rates,
  which no recent source supplies.

## Dataset

The Avocado research email collection, "938, 035 emails from 279 accounts," from a
defunct IT company.

## Base rates

| Measure | Value |
|---|---|
| Emails receiving no reply | "92.30% of emails are negative" |
| Implied reply rate | roughly 7.7% |
| Emails sent to more than one recipient besides the sender | "52.99% of emails are non-dyadic emails" |

## Predictive features reported as most important

1. Content properties, with email subject length ranked the single most important feature
   for reply action prediction.
2. Historical interaction between the two parties. The paper's `HistIndiv` and `HistPair`
   features "showed strong predictive power."
3. Number of recipients, listed in the top ten.
4. Internal versus external address features.
5. Temporal factors, which dominated reply time prediction rather than reply likelihood.
6. Message length, subject and body.

## What this source does not contain

The fetched text did not report figures for question marks in the body, for the To versus
CC distinction, or a reply time distribution. Do not cite this file for those.

## Why this source matters here

Two things. First, non-reply is the overwhelming default: 92.3 percent of enterprise
emails never get a reply. A skill that treats every unanswered message as a debt would be
flagging the ordinary operation of email. Second, prior interaction history between the
specific pair is among the strongest predictors of a reply happening at all, which is
independent support for weighting relationship history in the ranking model rather than
treating all senders alike.

Also relevant: 52.99 percent of email is non-dyadic. Roughly half of all traffic is group
traffic, and group traffic is where false positives come from.
