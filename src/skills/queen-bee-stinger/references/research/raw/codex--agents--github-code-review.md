# Codex code review in GitHub | OpenAI Developers / ChatGPT Learn
- URL: https://developers.openai.com/codex/integrations/github
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

Use Codex code review to get another high-signal review pass on GitHub pull requests. Codex reviews the pull request diff, follows your repository guidance, and posts a standard GitHub code review focused on serious issues.

## Before you start

Make sure you have:

- Codex cloud set up for the repository you want to review.
- Access to Codex code review settings.
- An `AGENTS.md` file if you want Codex to follow repository-specific review guidance.

## Set up Codex code review

1. Set up Codex cloud.
2. Go to Codex settings.
3. Turn on Code review for your repository.

## Request a Codex review

1. In a pull request comment, mention `@codex review`.
2. Wait for Codex to react (👀) and post a review.

Codex posts a review on the pull request, just like a teammate would. In GitHub, Codex flags only P0 and P1 issues so review comments stay focused on high-priority risks.

## Enable automatic reviews

Turn on Automatic reviews in Codex settings to have Codex review every new pull request without needing an `@codex review` comment.

## Customize what Codex reviews

Codex searches your repository for `AGENTS.md` files and follows the applicable code review rules. Add a `## Code Review Rules` section to the file closest to the code the rules govern. Use `###` headings to group related checks when helpful.

Example (experiment-reporting service, keeping post-exposure behavior from changing a comparison cohort):

```md
## Code Review Rules

### Experiment cohorts

- Do not filter treatment comparisons on post-exposure behavior, including conversion or retention.
  Safe path: build cohorts from assignment or exposure; report conversion as an outcome.
```

Put repository-wide rules in the root `AGENTS.md` and service-specific rules in a nested file, such as `services/experiment_reporting/AGENTS.md`. Codex applies the root and more-specific guidance that covers each changed file, so unrelated changes don't have to carry service-specific context.

Start with two or three concise rules that encode checks reviewers often explain:

- Focus on consequential, repository-specific behavior. Describe the compatibility constraint, data boundary, or unsafe side effect to flag and why it matters.
- State the safe path or exception. Give Codex enough context to distinguish a real issue from expected behavior.
- Keep rules scoped and durable. Prefer outcomes over function names that can change, and place guidance near the code it governs.
- Leave mechanical checks in CI. Keep formatting, lint, and other deterministic checks out of review rules.

Open a representative pull request and request a review with `@codex review`. Refine the rules based on findings/feedback, and narrow or remove guidance that produces noise.

Code review rules guide Codex; they don't replace tests, branch protections, or required approvals.

For a one-off focus, add it to your pull request comment: `@codex review for security regressions`

## Act on review findings

After Codex posts a review, leave another comment to have it fix issues in the same PR:

```md
@codex fix the P1 issue
```

Codex starts a cloud chat with the pull request as context and can push a fix back to the branch when it has permission to do so.

## Give Codex other tasks

Mentioning `@codex` with anything other than `review` starts a cloud chat using the PR as context:

```md
@codex fix the CI failures
```

## Troubleshoot code review

If Codex doesn't react or post a review:

- Confirm Code review is turned on for the repository in Codex settings.
- Confirm the pull request belongs to a repository with Codex cloud set up.
- Use the exact trigger `@codex review` in a pull request comment.
- For automatic reviews, check Automatic reviews is on and the pull request event matches your review trigger settings.
