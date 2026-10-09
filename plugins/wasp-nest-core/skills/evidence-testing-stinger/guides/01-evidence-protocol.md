# The evidence protocol

Grounded in `../references/research/distilled.md`, which cites the archived
sources in `../references/research/raw/`.

## The artifact contract

Every evidence run produces three artifacts in the task folder:

| Artifact | What it is |
|---|---|
| `evidence.mp4` (or `screenshots/` set) | the raw proof: the recorded live session, or the headless capture sequence |
| `report.md` | human-readable results: what was tested, each assertion with result, revision, environment |
| `manifest.json` | machine-readable index: artifact paths, revision, branch, environment, assertion list with timestamps |

Any recorder that honors this contract is acceptable. There is no blessed
binary in this skill; the contract is the skill.

## The annotation protocol

While testing, record three annotation types:

- `setup`: the starting context (logged in, on page X, seed data loaded).
- `test_start`: at each named test's beginning, phrased as a testable
  statement ("It should execute the tool directly when permission is
  always").
- `assertion`: after each check, with result `passed`, `failed`, or
  `untested` plus a reason.

Rules:

- One assertion per meaningful state change. Consolidate.
- Keep messages under 80 characters, high signal.
- The timestamp records when you asserted, not that it was true. Look at the
  screen, then choose the result.
- Precondition assertions establish starting state.
- `untested` with a reason is the only honest way to end a test you could
  not run.

## Revision stamping

Before the first action, capture and stamp into both report and manifest:

```bash
git rev-parse HEAD
git branch --show-current
```

plus the deployment URL when the target is not local. Evidence without a
revision is an anecdote.

## Posting

When a PR exists: post the video (or screenshot table) and report summary to
the PR, and link them from the tracker issue. `gh pr view` then append; never
overwrite an existing body. When no PR exists, deliver artifact paths to the
requester.

## Honest-use rules

- A synthetic pattern generator output is a toolchain smoke test, never UI
  evidence.
- A recording of the agent's own live driving is the gold standard; a
  headless scripted sequence is full evidence, clearly labeled headless.
- Never narrate an assertion the video or capture does not show.
