# How to write a great agents.md

- **Title:** How to write a great agents.md: Lessons from over 2,500 repositories
- **URL:** https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (GitHub engineering blog; author Matt Nigh, Program Manager
  Director at GitHub)

## Claimed basis

More than 2,500 public repositories containing an `agents.md` file, analyzed for what
distinguishes the effective ones.

## The five practices it reports

1. **Put executable commands in an early section**, with flags and options, not just tool
   names.
2. **Code examples beat prose.** Quoted: "One real code snippet showing your style beats
   three paragraphs describing it."
3. **State explicit boundaries.** Quoted: "Tell AI what it should never touch (e.g.,
   secrets, vendor directories, production configs)."
4. **Be specific about the stack.** Named versions, for example React 18 with TypeScript,
   Vite, and Tailwind CSS, rather than a vague reference.
5. **Six coverage areas** put a file in the top tier: commands, testing, project structure,
   code style, git workflow, and boundaries.

Suggested structure: YAML frontmatter with name and description, a persona section, project
knowledge (stack and file structure), tools and commands, standards with code examples, and
three-tier boundaries (always, ask first, never).

## Evidence audit, and it matters

Despite the headline sample of 2,500 repositories, the article publishes **no quantitative
result**. No median file length, no section frequency distribution, no comparison between
tiers, no measure of agent success against file characteristics. The "top tier" classification
is asserted without stating the criterion.

So this is a large-sample qualitative observation reported as a list of opinions. It is
better grounded than the pure assertion genre because someone did look at a corpus. It is
not a measurement, and it should not be cited as one.

## What transfers

Explicit boundaries and version-specific naming are the two items with the clearest
mechanism and the clearest analogue in a project knowledge pack: say which version of a
thing the project actually uses, and say plainly what is out of scope.
