# Measuring developer activity: what the research says

DX (getdx.com) blog.

- **URL:** https://getdx.com/blog/measuring-developer-activity/
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (developer-productivity vendor, citing named researchers)
- **Why archived:** It states the case against treating commit and line counts as a
  representation of a developer's work, quoting named researchers. This is the evidence
  behind the skill's rule that a reconciliation against git converts inference into
  observation for file-level claims only, and never becomes the measure of the session.

## What commit-based activity misses

Quoting Google researcher Ciera Jaspan: "Developers engage in a variety of other
development tasks beyond just writing code, including providing guidance and reviewing code
for other developers, designing systems and features, and managing releases."

Quoting Collin Green and Ciera Jaspan: "lines of code per minute will not tell you which
software developers are the best software developers."

## Named pitfalls of counting commits or lines

- **Gaming and defensive behaviour.** "Developers are concerned about how any measurement
  could be misinterpreted, particularly by managers who do not have technical knowledge
  about inherent caveats."
- **Perverse incentives.** Quoting Nicole Forsgren: "Rewarding developers for lines of code
  leads to bloated software that incurs higher maintenance costs."
- **Morale and attrition.** Tracking individual performance is described as capable of
  bringing down overall productivity and driving attrition.
- **Confounding.** Activity counts are shaped by external factors. More commits can reflect
  worse systems or longer hours rather than more delivered value.

## What this means for this skill

The skill produces a personal record for the person who did the work, not a management
metric. That distinction has to be stated in the artifact itself, because the same document
read by a manager becomes exactly the individual activity metric this source warns about.

The article does not address combining logged system data with self-report, which is the
method this skill actually uses. That is a gap in this source.

## Note on retrieval fidelity

Fetched through a summarizing reader. Quoted strings are reported as verbatim and are
attributed by the article to the named researchers, not to the vendor. Vendor blog with a
commercial interest in a competing measurement approach, so its framing is interested. The
quotations from named researchers are the usable part.
