# deal-pipeline-reconstructor

Rebuilds the pipeline that only exists in your head into a stage-by-stage board, where every placement shows the evidence that put it there.

## What it does

You sell. You do not maintain a CRM. It is empty, or it holds four deals from March and one of them closed.

The activity is there anyway: the DM asking if you have capacity, Tuesday's discovery call, the quote you pasted into WhatsApp, the calendar hold with a half-familiar name. This skill assembles it into the board you never built: each deal at a stage, days silent, a ranked going-cold list, one next action each.

Two things beat keeping it by hand. Last touch measures the most recent contact with the buyer, not the last time you typed something, which is all a CRM's last-modified date records. And every stage carries its evidence, the reading it rejected, and what would change it.

## When to use it

- You have lost track of who you quoted and when.
- You want to know which deals are dying before they are dead.

Just ask for it. Trigger phrases include "what deals do I have open", "rebuild my pipeline", "my CRM is empty", "which deals went cold" and "who hasn't replied to my proposal".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Pipeline watcher | Weekly, Monday 08:00 | New signals, movement, deals going quiet, upcoming calls. Never asserts a stage. |
| On demand | When you ask | The full board, the confirmation gate, the ranking. |

Run the watcher if you have more than two live deals. Its value is memory: it reads its own past reports, so a deal silent three weeks running gets escalated instead of listed again, and the board inherits a movement history no single retrieval can rebuild. The skill sets it up: it shows you the prompt, you approve.

## What you get

`pipeline-board-YYYY-MM-DD.md`, plus a CSV if you ask. Stages run Lead, Qualified, Proposal, Negotiation, Closing, Won, Lost, each with a deal count, the sum of known amounts, and how many are unknown.

Per deal: the opportunity, contacts observed as "at least 2", first and last touch, days silent against the threshold in force, the stage reasoning, the next action, the evidence trail. Then the going-cold list ranked by severity, ambiguous placements and merges with both readings, and every excluded name with its reason.

## What it needs

- The Littlebird MCP on a Power or Pro plan.
- Five answers up front: what you sell, typical deal size and cycle, the window, deals you already know about, and where to write the file.
- Names as seeds. Each gets looked up directly, and a seed the sweep misses is a finding about what your capture cannot see.

## Limits worth knowing

**No win probability, no weighted pipeline value, no conversion rates.** Both inputs would be guessed here, and multiplying two guesses gives you a number that looks like revenue and is not. Amounts stay unknown rather than becoming zero.

**Ambiguity resolves down a stage.** A deal shown at Negotiation that is really at Lead makes you stop selling to someone nobody sold to. One stage low costs a correction, so that is the error it takes.

**Merges bias toward not merging.** A bad merge is invisible in the output; a duplicate takes five seconds to fix. Anything below a strong match becomes a question, not a silent join.

**"No contact observed" is about the capture, not proof no contact happened.** You may have called from a phone Littlebird never saw.

**The board is internal.** It holds candid notes about people who have not replied. Nothing here contacts a prospect.

## Related skills

- [lead-harvester](../lead-harvester/README.md), which runs upstream.
- [pre-call-prep](../pre-call-prep/README.md), for one deal before a call.
- [client-health-radar](../client-health-radar/README.md), which picks up after a win.
- [invoice-chaser](../invoice-chaser/README.md), when a deal is won but unpaid.

## Under the hood

`SKILL.md` holds the nine steps and the watcher prompt. Guides: `references/deal-identity-and-dedupe.md`, `references/stage-inference.md`, `references/recency-and-going-cold.md`, `references/board-output-and-export.md`, `references/evidence-standards.md`.

`references/research/` archives 17 primary sources. Every domain claim traces to one, including the forecasting literature behind the refused probability.
