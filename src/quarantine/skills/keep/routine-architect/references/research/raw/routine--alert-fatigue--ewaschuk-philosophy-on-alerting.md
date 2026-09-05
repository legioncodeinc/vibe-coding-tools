# My Philosophy on Alerting (Rob Ewaschuk)

- **URL:** https://gist.github.com/msgodf/86a3fc7fcd3ce663ff37
  (original: https://docs.google.com/document/d/199PqyG3UsyXlwieHaqbGiWVa8eMWi8zzAn0YfcApr8Q/edit)
- **Fetched:** 2026-08-17
- **Source type:** community (practitioner document by a Google Site Reliability Engineer;
  the basis for the monitoring chapter of the Google SRE book)
- **Why archived:** The operations field's canonical statement of what an alert has to earn
  before it is allowed to interrupt a person. Older than the 12-month default window and
  used deliberately: it is foundational rather than current, and it is still the reference
  practitioners cite. Every rule here translates one-to-one onto a recurring routine report.

## What a page has to be

Quoted: "Pages should be urgent, important, actionable, and real."

## The three foundational rules

1. **Urgency and frequency.** "Every time my pager goes off, I should be able to react with
   a sense of urgency. I can only do this a few times a day before I get fatigued."
2. **Actionability.** "Every page should be actionable; simply noting 'this paged again' is
   not an action."
3. **Intelligence required.** "Every page should require intelligence to deal with: no
   robotic, scriptable responses."

## The five questions to ask before writing an alerting rule

- Does it detect an urgent, actionable condition that users can see now or imminently?
- Will you ever legitimately ignore this rule knowing it is benign?
- Is it identifying a situation definitely hurting users, with edge cases filtered out?
- Can you take urgent action in response?
- Are other people getting paged simultaneously who might fix it instead?

## Symptoms versus causes

Symptom-based monitoring is preferred: monitor what users experience rather than the
infrastructure cause. "Alert on the symptom: the 500, the Oops!, the whitebox metric."
Reason given: "You're going to have to catch the symptom anyway", and alerting on both
creates redundant, complicated tuning.

## Managing noise

- "Err on the side of removing noisy alerts, over-monitoring is a harder problem to solve
  than under-monitoring."
- Accuracy threshold quoted: "Alerts that are less than 50% accurate are broken; even those
  that are false positives 10% of the time merit more consideration."

## Sub-critical alerts

For things that need a timely response but not an interruption: use tickets, daily reports,
or email, but only with a clear accountability system attached. An unowned daily report is
not a control.
