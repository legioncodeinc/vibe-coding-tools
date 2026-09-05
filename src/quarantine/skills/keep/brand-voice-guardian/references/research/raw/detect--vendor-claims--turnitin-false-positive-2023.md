# Understanding the false positive rate for sentences of our AI writing detection capability

- **Title:** Understanding the false positive rate for sentences of our AI writing
  detection capability
- **Author:** Annie Chechitelli, Chief Product Officer, Turnitin
- **Publisher:** Turnitin (vendor blog)
- **Published:** 14 June 2023
- **URL:** https://www.turnitin.com/blog/understanding-the-false-positive-rate-for-sentences-of-our-ai-writing-detection-capability
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (first-party, commercially interested, archived
  deliberately as the strongest form of a vendor's OWN caveat)

## Why this source matters here

Detector marketing is the least trustworthy category in this archive and is weighted
lowest by design. This one page is archived anyway, because a vendor stating its own
error rate against interest is usable, and because the gap between its
document-level and sentence-level numbers is exactly the gap a markup pass lives in.

## Findings

### The two false positive rates

| Level | Stated false positive rate |
|---|---|
| Document level, for documents scored at 20% or more AI writing | **less than 1%** |
| **Sentence level** | **around 4%** |

The sentence-level rate is roughly four times the document-level rate. This is the number
that matters for any tool that highlights individual spans, because a per-span flag
inherits the per-span error rate, not the per-document one.

### The threshold

Turnitin applies a threshold of 20% or more AI writing at the document level before the
document-level figure applies.

### Turnitin's own caveats

The vendor advises treating highlighted sentences as areas of interest, notes that a
small percentage of the time the model gets it wrong, and says to use the information to
initiate a conversation rather than to draw a conclusion. It also advises engaging with
the student where there is doubt about authenticity, and analyzing any result alongside
institutional policy.

## Claims this source supports

1. Turnitin states a sentence-level false positive rate of **around 4%**, against a
   document-level rate of under 1%.
2. Span-level highlighting is roughly four times more error-prone than document-level
   scoring, by the vendor's own figures.
3. The vendor itself says the output should start a conversation rather than settle a
   question.

## Limits of this source for our purpose

- Vendor blog. No published methodology, no sample description, no external replication.
  Weighted as a vendor claim.
- The Weber-Wulff evaluation in this archive measured a 0% false positive rate for
  Turnitin on its test set, and other independent evaluations report higher. The vendor
  figure and the independent figures are not reconcilable from what was retrieved, and
  this archive does not attempt to reconcile them.
- 2023. Product has changed.

## Conflict recorded

`detect--tool-accuracy--weber-wulff-ijei-2023.md` reports Turnitin at a 0% false
positive rate on its test corpus. This page reports around 4% at sentence level on
Turnitin's own testing. These are different measurements (document versus sentence,
different corpora) and are not necessarily contradictory, but neither can be used to
validate the other. Both readings are kept.
