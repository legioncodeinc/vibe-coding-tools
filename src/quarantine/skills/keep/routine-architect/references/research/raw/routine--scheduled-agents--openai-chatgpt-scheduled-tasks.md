# Scheduled Tasks in ChatGPT

- **URL:** https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt
- **Fetched:** 2026-08-17
- **Published:** article shown as updated 2 days before fetch, so approximately 2026-08-15
- **Source type:** official-docs (OpenAI Help Center)
- **Why archived:** Documented behavior of a competing scheduled-agent feature. Establishes
  that scarce task slots, minimum intervals, and auto-pause on inactivity are common
  product patterns rather than Littlebird quirks, which is what makes the slot-scarcity
  argument in this skill generalizable.

## Creation

Tasks are created from the Scheduled page in the sidebar, or by asking in conversation
(example given: "Let me know when my package gets delivered"). Confirmation cards show the
task details and its run times.

## Active task limits, by tier

Quoted: "Go users can have up to 3 active tasks, Plus users up to 5, Business and Edu users
up to 10, and Pro and Enterprise users up to 15."

Slots are plan-limited, and the limit is low enough that adding a task is a real tradeoff.

## Supported

- Recurring and one-time tasks.
- Monitoring tasks that check for changes and notify only on meaningful updates. The
  product ships change-detection as a first-class task type.
- Integration with connected apps such as Gmail.
- Compatibility with ChatGPT Health and Finances.

## Not supported

- Voice chats and GPTs cannot be used with tasks.
- No webhook support.
- Tasks created within a project cannot access that project's files.

## Execution frequency

Quoted: "Tasks cannot run more than once per hour."

## Auto-pause

Tasks may auto-pause after periods of inactivity.

## Notifications

Customizable in Settings; delivered across platforms once mobile permission is granted.
Desktop notifications require browser permission.

## Gap

The documentation does not state whether a task can create another task, and gives no
guidance on how to write a task prompt. Both are gaps for this archive, not answers.
