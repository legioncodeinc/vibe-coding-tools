# Software documentation: the practitioners' perspective

- **Title:** Software Documentation: The Practitioners' Perspective (ICSE 2020)
- **URL:** https://homepages.dcc.ufmg.br/~figueiredo/disciplinas/papers/icse20aghajani.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (peer reviewed, International Conference on Software
  Engineering 2020, Aghajani et al.)

## Study design

- 146 practitioners across two surveys. Survey I: 78 respondents on documentation issues.
  Survey II: 68 respondents on which documentation types help which task.
- 125 respondents from ABB, 21 from online forums.
- Roles: 55 developers, 26 architects, 19 technical leads, 11 testers, 35 other.
- Experience: 88 respondents with more than 10 years.
- Method: two Qualtrics surveys of roughly 15 minutes. Survey I used a condensed taxonomy
  of 51 issues, itself distilled from an original 162-issue taxonomy, in three categories.
  Participants marked which issues they considered important, then which they hit often.
  Survey II asked them to rate documentation types across 15 engineering tasks.

## Headline findings, with the reported percentages

**Information content, what is documented:**

| Issue | Percent flagging it |
|---|---|
| Installation, deployment and release documentation | 68 |
| Missing user documentation | 65 |
| Faulty tutorial | 65 |

**Information content, how it is written:**

| Issue | Percent flagging it |
|---|---|
| Clarity | 88 |
| Accessibility and findability | 65 |

**Up to dateness:**

| Issue | Percent flagging it |
|---|---|
| Missing documentation for a new feature or component | 69 |
| Code and documentation inconsistency | 59 |

The paper's own summary of that row: the lack of documentation for a new feature or
component was not only considered important by most participants, it was also the most
recurring issue.

**Process and tooling:** lack of time to write documentation, 65 percent.

**Correctness:** erroneous code examples 59 percent, inappropriate installation
instructions 63 percent.

## Which artifacts practitioners valued, by task

Code comments were rated essential for debugging (100 percent agreement) and for program
comprehension (80 percent). Contribution guidelines supported testing (64 percent) and
architecture design (45 percent). User manuals helped debugging, via screenshots and
descriptions of expected behavior.

## What this supports and what it does not

Supports: clarity outranks completeness as a felt problem (88 versus 68), so a shorter pack
that is unambiguous beats a longer one that is thorough. Supports: staleness is real and
its dominant form is not "an old page went wrong", it is "the new thing was never written
down at all", which is exactly what a refresh check should look for first.

Does not support: any claim about documentation written for machine consumption. This study
predates that question and says nothing about it.
