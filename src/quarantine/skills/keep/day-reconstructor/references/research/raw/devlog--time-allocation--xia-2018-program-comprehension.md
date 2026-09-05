# Measuring Program Comprehension: A Large-Scale Field Study with Professionals

Xia, Bao, Lo, Xing, Hassan, Li. IEEE Transactions on Software Engineering, 2018.

- **URL:** https://soarsmu.github.io/papers/2018/Xia2018ProgramComprehension.pdf
- **Also at:** https://ieeexplore.ieee.org/document/7997917/ (paywalled),
  https://dl.acm.org/doi/10.1109/TSE.2017.2734091
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed, IEEE TSE)
- **Why archived:** This is the empirical basis for the coverage note. If most of a session
  is comprehension rather than editing, then a reconstruction that only reports files
  changed is reporting a minority of the session, and the skill has to say so with a number
  rather than a hedge.

## Study design

- **Participants:** 78 professional developers.
- **Projects:** 7.
- **Data volume:** 3,148 working hours in total, roughly a two-week monitoring period per
  developer.
- **Instrument:** an extended version of the ActivitySpace framework, monitoring
  human-computer interaction across applications on Windows, not just inside the IDE. It
  covered IDEs, web browsers, and document editors.
- **Method:** low-level mouse and keyboard events captured with millisecond precision and
  segmented into activity sequences ("sprees") using a one-second reaction-time threshold,
  then automatically classified into activity categories.
- **Not self-report.** Classification was automatic. A validation check against two
  developers' own manual labelling of their activity showed a difference of less than
  0.23 percent between the tool's categorization and the developers' own.

## Headline result: the activity split

| Activity | Share of monitored time |
|---|---|
| Comprehension | 57.62% |
| Navigation | 23.96% |
| Others | 13.40% |
| Editing | 5.02% |

Comprehension is roughly 58 percent of monitored working time. Editing, meaning actually
changing code, is about 5 percent.

Across the seven projects, the comprehension share ranged from **51.80% to 64.05%**, so the
result is not driven by one outlier team.

## Where comprehension happened

Share of total time spent on comprehension, split by application class:

| Application class | Share of total time |
|---|---|
| Web browsers | 27.26% |
| IDEs | 19.95% |
| Document editors | 10.38% |

More comprehension time happened in a browser than in the IDE. That is a direct statement
that a large part of a developer's day is spent reading things that are not their own
repository.

## Seniority effect

Senior developers, defined as more than 5 years of experience, spent a significantly lower
share of time on comprehension than junior developers, defined as under 3 years:
approximately 50 percent versus approximately 65 percent.

## Note on retrieval fidelity

Fetched through a summarizing reader against the authors' hosted PDF. The percentage table
is attributed by the reader to Table 5 of the paper and the application split to Table 7.
The seniority figures are reported as approximate by the reader and are recorded as
approximate here.
